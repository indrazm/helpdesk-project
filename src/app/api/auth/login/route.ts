import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/utils/prisma';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const data = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const payload = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });
    const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' });

    cookies().set('accessToken', accessToken);
    cookies().set('refreshToken', refreshToken, { httpOnly: true });

    return NextResponse.json({ data: payload });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
