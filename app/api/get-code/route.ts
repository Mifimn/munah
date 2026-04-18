import { NextResponse } from 'next/server';

export async function GET() {
  const SHIPBUBBLE_KEY = process.env.SHIPBUBBLE_API_KEY;
  const response = await fetch("https://api.shipbubble.com/v1/shipping/labels/categories", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SHIPBUBBLE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return NextResponse.json(data);
}
