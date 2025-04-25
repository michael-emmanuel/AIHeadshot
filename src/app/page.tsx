import HeroSection from '@/components/landing-page/HeroSection';
import Navigation from '@/components/landing-page/Navigation';
import { Pricing } from '@/components/landing-page/Pricing';
import { getProducts, getUser } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase), // gets the currently auth users
    getProducts(supabase), // get all the active products with their price
  ]);

  if (user) {
    return redirect('/dashboard');
  }

  return (
    <main className='flex flex-col min-h-screen items-center justify-center'>
      <Navigation />
      <HeroSection />
      <Pricing products={products ?? []} />
    </main>
  );
}
