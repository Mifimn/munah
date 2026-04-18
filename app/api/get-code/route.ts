import { NextResponse } from 'next/server';

export async function GET() {
  const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;

  if (!SHIPBUBBLE_KEY) {
    return NextResponse.json({ error: "Missing API Key" });
  }

  try {
    const response = await fetch("https://api.shipbubble.com/v1/shipping/address", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" });
  }
}