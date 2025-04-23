import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// provide SITE_URL when hosting app
// npx ngrok http http://localhost:3000
const WEBHOOK_URL =
  process.env.SITE_URL ??
  'https://6c6c-2600-1700-4cb0-2ed0-75ce-fe1b-2d2d-49da.ngrok-free.app'; // only works for local

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('The replicate api token is not set!');
    }

    // Protect route
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const input = {
      fileKey: formData.get('fileKey') as string,
      modelName: formData.get('modelName') as string,
      gender: formData.get('gender') as string,
    };

    if (!input.fileKey || !input.modelName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fileName = input.fileKey.replace('training-data/', '');
    const { data: fileUrl } = await supabaseAdmin.storage
      .from('training-data')
      .createSignedUrl(fileName, 3600); // create signedUrl that expires in 1hr

    if (!fileUrl?.signedUrl) {
      throw new Error('Failed to get the file URL');
    }

    // View available hardware ------------------------
    // const hardware = await replicate.hardware.list();
    // console.log(hardware);

    const modelId = `${user.id}-${Date.now()}-${input.modelName
      .toLowerCase()
      .replaceAll(' ', '-')}`;

    // create model first - create our model using custom id above
    await replicate.models.create('michael-emmanuel', modelId, {
      visibility: 'private',
      hardware: 'gpu-a100-large',
    });

    // start training cppasta from docs
    // Note training takes 20-30 minutes, until then you will not be able to send other requests
    // so it wont be able to send any response (Perhaps using a webhook is a valid workaround?)
    const training = await replicate.trainings.create(
      'ostris',
      'flux-dev-lora-trainer',
      'c6e78d2501e8088876e99ef21e4460d0dc121af7a4b786b9a4c2d75c620e300d',
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: `michael-emmanuel/${modelId}`,
        input: {
          steps: 1200,
          resolution: '1024',
          input_images: fileUrl.signedUrl,
          trigger_word: 'ohwx',
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training`,
        webhook_events_filter: ['completed'], // optional
      }
    );

    console.log(training);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Training error: ', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to start the model training!';

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
