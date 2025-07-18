import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    const contents = await prisma.content.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        shortLink: true,
        expirationTime: true,
        createdAt: true,
        viewCount: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      shares: contents 
    });
  
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Request Failed'},
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request' }, 
        { status: 400 }
      );
    }

    const deleteResult = await prisma.content.deleteMany({
      where: {
        userId,
        id: { in: ids }
      }
    });

    return NextResponse.json(
      { success: true, deleted: deleteResult.count }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Request Failed'},
      { status: 500 }
    );
  }
}
