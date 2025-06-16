import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text snippet is required' },
        { status: 400 }
      );
    }

    if (text.length > 100000) {
      return NextResponse.json(
        { error: 'Text is too long' }, 
        { status: 413 });
    }
    
    const snippetId = "xxx";
    const shareLink = `https://sample/s/${snippetId}`;
    
    return NextResponse.json({
      success: true,
      link: shareLink
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Request Failed' },
      { status: 500 }
    );
  }
}
