import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid Request' },
        { status: 400 }
      );
    }

    const imageId = "xxx";
    const imageLink = `https://sample/s/${imageId}`;
    
    return NextResponse.json({
      success: true,
      link: imageLink,
      filename: image.name
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Request Failed' },
      { status: 500 }
    );
  }
}
