import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

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

    const { newUsername } = await request.json();

    if (!newUsername || typeof newUsername !== 'string') {
      return NextResponse.json(
        { error: 'Invalid Request' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: newUsername }
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (currentUser.username === newUsername) {
      return NextResponse.json(
        { error: 'New username must be different from current username' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername }
    });

    return NextResponse.json({
      success: true,
      message: 'Username changed successfully',
      newUsername: newUsername
    });

  } catch (error) {
    console.error('Error changing username:', error);
    return NextResponse.json(
      { error: 'Request Failed' },
      { status: 500 }
    );
  }
}
