import { NextResponse } from 'next/server';

export async function GET() {
  const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;

  if (!SHIPBUBBLE_KEY) {
    return NextResponse.json({ error: "Missing API Key" });
  }

  // The exact payload required by the Shipbubble Validate endpoint you found
  const payload = {
    name: "Mifimn Shittu",
    email: "shittumifimn0807@gmail.com",
    phone: "+2348023169274",
    address: "Malete 241104, Kwara, Nigeria" // Keeping it simple for high-accuracy validation
  };

  try {
    const response = await fetch("https://api.shipbubble.com/v1/shipping/address/validate", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
