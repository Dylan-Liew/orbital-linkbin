import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid URL is required' },
        { status: 400 }
      );
    }
    
    const shortId = "xxx";
    const shortLink = `https://sample/s/${shortId}`;
    
    return NextResponse.json({
      success: true,
      link: shortLink
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Request Failed' },
      { status: 500 }
    );
  }
}
