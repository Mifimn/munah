"use client";

import dynamic from 'next/dynamic';

// Dynamically import the client component and completely disable Server-Side Rendering
const TestPaymentClient = dynamic(() => import('./TestPaymentClient'), {
  ssr: false,
});

export default function TestPaymentPage() {
  return <TestPaymentClient />;
}
