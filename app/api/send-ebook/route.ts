import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    const data = await resend.emails.send({
      from: 'Natural Cure Apothecary <hello@naturalcureherbalmedicine.com>', 
      to: email,
      subject: 'Welcome to the Archives! Here is your Botanical Guide.',
      html: `
        <div style="font-family: sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="font-family: serif; color: #2C5535;">Welcome, ${name}!</h2>
          <p>Thank you for verifying your email and joining our clinical apothecary.</p>
          <p>As promised, attached is your exclusive guide on the powerful healing properties of Black Seed Oil.</p>
          <br/>
          <p>In health,</p>
          <p><strong>Modina Olagunju & The Natural Cure Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: 'Black-Seed-Oil-Healing-Guide.pdf',
          path: 'https://kseglpabxmyvdmcmcyec.supabase.co/storage/v1/object/public/ebook/Black-Seed-Oil-Healing-Guide.pdf', 
        },
      ],
    });

    // Check if Resend itself returned an error object
    if (data.error) {
      console.error("RESEND ERROR:", data.error);
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API CRASH:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
