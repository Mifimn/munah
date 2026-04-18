import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We are hitting the live authentication endpoint
    const response = await fetch("https://api.fezdelivery.co/v1/user/authenticate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: "G-SUdW-qXXJ", // The ID from your email!
        password: "Mifimn@0807" // ⚠️ CHANGE THIS TO HER ACTUAL PASSWORD!
      })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
