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

    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    const shortId = nanoid(6);
    
    await prisma.content.create({
      data: {
        userId: userId,
        type: 'link',
        shortLink: shortId,
        linkContent: {
          create: {
            longLink: url
          }
        }
      }
    });
    
    const shortLink = `${process.env.BASE_URL}/s/${shortId}`;
    
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
