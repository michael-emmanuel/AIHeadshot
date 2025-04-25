import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { CreditCardIcon, PlusIcon, Wand2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common actions</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Button asChild className='w-full'>
          <Link href='/image-generation'>
            <Wand2Icon className='mr-2 h-4 w-4' />
            Generate Image
          </Link>
        </Button>
        <Button asChild className='w-full' variant={'destructive'}>
          <Link href='/model-training'>
            <PlusIcon className='mr-2 h-4 w-4' />
            Train New Model
          </Link>
        </Button>
        <Button asChild className='w-full' variant={'secondary'}>
          <Link href='/billing'>
            <CreditCardIcon className='mr-2 h-4 w-4' />
            Billing
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
