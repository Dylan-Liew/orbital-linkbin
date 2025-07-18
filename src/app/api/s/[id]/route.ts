import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const content = await prisma.content.findUnique({
      where: { shortLink: id },
      include: {
        textSnippet: true,
        linkContent: true,
        imageContent: true
      }
    });
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    if (content.expirationTime && content.expirationTime < new Date()) {
      return NextResponse.json(
        { error: 'Content has expired' },
        { status: 410 }
      );
    }

    await prisma.content.update({
      where: { id: content.id },
      data: { viewCount: { increment: 1 } }
    });

    if (content.type === 'image' && content.imageContent) {
      return new NextResponse(content.imageContent.imageData, {
        headers: {
          'Content-Type': 'image/*',
        },
      });
    }

    return NextResponse.json({
      type: content.type,
      data: content.textSnippet?.text || content.linkContent?.longLink,
      createdAt: content.createdAt
    });
    
  } catch (error) {
    console.error('Error retrieving content:', error);
    return NextResponse.json(
      { error: 'Request Failed' },
      { status: 500 }
    );
  }
}
