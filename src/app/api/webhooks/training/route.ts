import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('webhook is working', req);

  try {
    const body = await req.json();
    console.log('webhook is working fine');

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log('webhook processing error', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
