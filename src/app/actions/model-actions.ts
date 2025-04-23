'use server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// Use signed URLs to keep photos in bucket private, the return URL will contain a token
// token will allow us to upload photos to supabase from the client side
// This way we wont have to expose our Supabase env variables
export async function getPresignedStorageUrl(filePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: urlData, error } = await supabaseAdmin.storage
    .from('training-data')
    .createSignedUploadUrl(`${user?.id}/${new Date().getTime()}_${filePath}`);

  return {
    signedUrl: urlData?.signedUrl || '',
    error: error?.message || null,
  };
}
