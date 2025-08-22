import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test environment variables
    const contractAddress = process.env.NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS;
    const networkId = process.env.NEXT_PUBLIC_NETWORK_ID;
    
    return NextResponse.json({
      status: 'success',
      message: 'Backend is working',
      contractAddress,
      networkId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Backend error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
