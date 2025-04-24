import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/EmailTemplate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log('webhook is working', req);

  try {
    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') ?? '';
    const modelName = url.searchParams.get('modelName') ?? '';
    const fileName = url.searchParams.get('fileName') ?? '';

    // To validate the webhook
    const id = req.headers.get('webhook-id') ?? '';
    const timestamp = req.headers.get('webhook-timestamp') ?? '';
    const webhookSignature = req.headers.get('webhook-signature') ?? '';

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();

    const secretBytes = Buffer.from(secret.key.split('_')[1], 'base64');
    const signature = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64');

    const expectedSignatures = webhookSignature
      .split(' ')
      .map(sig => sig.split(',')[1]);
    const isValid = expectedSignatures.some(
      expectedSignature => expectedSignature === signature
    );
    // Always verify if we are a valid webhook otherwise our route will be exposed
    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // get user data
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError || !user) {
      return new NextResponse('User not found!', { status: 401 });
    }

    const userEmail = user.user.email ?? '';
    const userName = user.user.user_metadata.full_name ?? '';

    if (body.status === 'succeeded') {
      // send a successful status email
      await resend.emails.send({
        from: 'AI Headshots <noreply@careersync.ai>',
        to: [userEmail],
        subject: 'Model Training Completed',
        react: EmailTemplate({
          userName,
          message: 'Your model training has been completed!',
        }),
      });

      // update supabase models table with completed metrics
      await supabaseAdmin
        .from('models')
        .update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(':')[1] ?? null,
        })
        .eq('user_id', userId)
        .eq('model_name', modelName);
    } else {
      // handle the failed and canceled status
      await resend.emails.send({
        from: 'AI Headshots <noreply@careersync.ai>',
        to: [userEmail],
        subject: `Model Training ${body.status}`,
        react: EmailTemplate({
          userName,
          message: `Your model training has been ${body.status}!`,
        }),
      });

      // update supabase models table with completed metrics
      await supabaseAdmin
        .from('models')
        .update({
          training_status: body.status,
        })
        .eq('user_id', userId)
        .eq('model_name', modelName);
    }
    // delete the training data from supabase storage
    await supabaseAdmin.storage.from('training-data').remove([`${fileName}`]);

    return new NextResponse('Ok', { status: 200 });
  } catch (error) {
    console.log('webhook processing error', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// since this endpoint is always open do not want unauthorized
// users to be able to access our webhook we must verify it
