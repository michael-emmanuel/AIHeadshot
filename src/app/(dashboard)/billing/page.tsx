import PlanSummary from '@/components/billing/PlanSummary';
import { getProducts, getSubscription, getUser } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

const BillingPage = async () => {
  const supabase = await createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase), // gets the currently auth users
    getProducts(supabase), // get all the active products with their price
    getSubscription(supabase),
  ]);

  if (!user) {
    return redirect('/login');
  }

  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Plans & billing</h1>
        <p className='text-muted-foreground'>
          Manage your subscription and billing information
        </p>
      </div>

      <div className='grid gap-10'>
        <PlanSummary
          subscription={subscription}
          user={user}
          products={products || []}
        />
      </div>
    </section>
  );
};

export default BillingPage;
