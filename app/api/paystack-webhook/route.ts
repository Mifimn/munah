// app/api/paystack-webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// We use the Service Role Key here because this runs on the server, not the browser
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  try {
    // 1. Get the raw body string and the Paystack signature header
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // 2. Cryptographic Security Check
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
      .update(rawBody)
      .digest('hex');

    // If the signature doesn't match, reject it immediately (Hacker protection)
    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // 3. Parse the verified Paystack data
    const event = JSON.parse(rawBody);

    // 4. Handle a Successful Charge
    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      // Tell Supabase to update the order status to "paid"
      // If the frontend already saved it, this just safely confirms it
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('payment_reference', reference);

      if (error) {
        console.error('Webhook DB Error:', error);
      } else {
        console.log(`Webhook securely confirmed payment for: ${reference}`);
      }
    }

    // Always return a 200 OK to Paystack so they know you received the message
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}