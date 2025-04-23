import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

    console.log(fileUrl);

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
