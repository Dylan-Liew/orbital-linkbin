import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email: _email, password: _password } = body;
  return NextResponse.json({ message: 'Login successful' });
}