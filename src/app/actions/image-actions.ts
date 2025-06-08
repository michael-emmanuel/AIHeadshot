/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Database } from '@datatypes.types';
import { z } from 'zod';
import { ImageGenerationFormSchema } from '@/components/image-generation/Configurations';
import Replicate from 'replicate';
import { createClient } from '@/lib/supabase/server';
import { imageMeta } from 'image-meta';
import { randomUUID } from 'crypto';
import { getCredits } from './credit-actions';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function generateImageAction(
  input: z.infer<typeof ImageGenerationFormSchema>
): Promise<ImageResponse> {
  if (!process.env.REPLICATE_API_TOKEN) {
    return {
      error: 'The replicate api token is not set!',
      success: false,
      data: null,
    };
  }

  const { data: credits } = await getCredits();
  if (!credits?.image_generation_count || credits.image_generation_count <= 0) {
    return {
      error: 'No credits available',
      success: false,
      data: null,
    };
  }

  const modelInput = input.model.startsWith('michael-emmanuel/')
    ? {
        model: 'dev',
        prompt: input.prompt,
        lora_scale: 1,
        guidance: input.guidance,
        num_outputs: input.num_outputs,
        aspect_ratio: input.aspect_ratio,
        output_format: input.output_format,
        output_quality: input.output_quality,
        prompt_strength: 0.8,
        num_inference_steps: input.num_inference_steps,
        extra_lora_scale: 0,
      }
    : {
        prompt: input.prompt,
        go_fast: true,
        guidance: input.guidance,
        megapixels: '1',
        num_outputs: input.num_outputs,
        aspect_ratio: input.aspect_ratio,
        output_format: input.output_format,
        output_quality: input.output_quality,
        prompt_strength: 0.8,
        num_inference_steps: input.num_inference_steps,
      };

  try {
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input: modelInput,
    });
    return {
      error: null,
      success: true,
      data: output,
    };
  } catch (error: any) {
    return {
      error: error.message || 'Failed to generate image',
      success: false,
      data: null,
    };
  }
}

export async function imgUrlToBlob(url: string) {
  const response = fetch(url);
  const blob = (await response).blob();
  return (await blob).arrayBuffer();
}

// how to extend URL with database types
type storeImageInput = {
  url: string;
} & Database['public']['Tables']['generated_images']['Insert'];

export async function storeImages(data: storeImageInput[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if user authorized
  if (!user) {
    return {
      error: 'Unauthorized',
      success: false,
      data: null,
    };
  }

  const uploadResults = [];

  // we must convert image to a blob in order to store img with no time restriction bc
  // as of now supabase only store image(non blob converted) for 2 hours

  // loop through data grab array buffer
  for (const img of data) {
    const arrayBuffer = await imgUrlToBlob(img.url);
    const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer));

    // create filename
    const fileName = `image_${randomUUID()}.${type}`;
    const filePath = `${user.id}/${fileName}`;

    // upload image to storage bucket named "generated-image"
    const { error: storageError } = await supabase.storage
      .from('generated-images')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${type}`, // image/png or image/jpg
        cacheControl: '3600', // 1 hr cache
        upsert: false, // if same file uploaded(same file name), ignore
      });
    // if error, store error message, continue loop to upload images
    if (storageError) {
      uploadResults.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      });
      continue;
    }

    const { data: dbData, error: dbError } = await supabase
      .from('generated_images')
      .insert([
        {
          // DB Table is named "generated_image"
          user_id: user.id,
          model: img.model,
          prompt: img.prompt,
          aspect_ratio: img.aspect_ratio,
          guidance: img.guidance,
          num_inference_steps: img.num_inference_steps,
          output_format: img.output_format,
          image_name: fileName,
          width,
          height,
        },
      ])
      .select();
    // if no results in uploadResult arr are returned, upload successful
    if (dbError) {
      uploadResults.push({
        fileName,
        error: dbError.message,
        success: !dbError,
        data: dbData || null,
      });
    }
  }

  return {
    error: null,
    success: true,
    data: { results: uploadResults },
  };
}

export async function getImages(limit?: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if user authorized
  if (!user) {
    return {
      error: 'Unauthorized',
      success: false,
      data: null,
    };
  }

  let query = supabase
    .from('generated_images')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return {
      error: error.message || 'Failed to fetch images',
      success: false,
      data: null,
    };
  }
  // generates the url to show the images, since the blobs are stored privately, we generate temp signed URLs that last for 1 hr
  const imagesWithUrls = await Promise.all(
    data.map(
      async (
        image: Database['public']['Tables']['generated_images']['Row']
      ) => {
        const { data } = await supabase.storage
          .from('generated-images')
          .createSignedUrl(`${user.id}/${image.image_name}`, 3600);

        return {
          ...image,
          url: data?.signedUrl,
        };
      }
    )
  );

  return {
    error: null,
    success: true,
    data: imagesWithUrls || null,
  };
}

export async function deleteImage(id: string, imageName: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // check if user authorized
  if (!user) {
    return {
      error: 'Unauthorized',
      success: false,
      data: null,
    };
  }

  const { data, error } = await supabase
    .from('generated_images')
    .delete()
    .eq('id', id);
  if (error) {
    return {
      error: error.message,
      success: false,
      data: null,
    };
  }
  // after deleting row for DB, delete from blob store
  await supabase.storage
    .from('generated-images')
    .remove([`${user.id}/${imageName}`]);

  return {
    error: null,
    success: true,
    data: data,
  };
}
