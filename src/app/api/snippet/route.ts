import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as number;

    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 100000) {
      return NextResponse.json(
        { error: 'Text is too long' }, 
        { status: 413 });
    }
    
    const snippetId = nanoid(6);
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.content.create({
      data: {
        userId: userId,
        type: 'text',
        shortLink: snippetId,
        expirationTime: expirationTime,
        textSnippet: {
          create: {
            text: text
          }
        }
      }
    });
    
    const shareLink = `${process.env.BASE_URL}/s/${snippetId}`;
    
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
