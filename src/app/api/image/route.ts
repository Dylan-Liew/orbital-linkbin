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

    const imageId = nanoid(6);
    const imageData = Buffer.from(await image.arrayBuffer());
    
    await prisma.content.create({
      data: {
        userId: userId,
        type: 'image',
        shortLink: imageId,
        imageContent: {
          create: {
            imageData: imageData
          }
        }
      }
    });
    
    const imageLink = `${process.env.BASE_URL}/s/${imageId}`;
    
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
