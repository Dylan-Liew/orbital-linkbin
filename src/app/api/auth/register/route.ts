import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name: _name, email: _email, password: _password, confirmPassword: _confirmPassword} = body;

  return NextResponse.json(
    {
      success: true,
      message: 'Registration successful',
    },
    { status: 201 }
  );
}
