/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/utils/prisma';

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const payload = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    return NextResponse.json({ data: payload });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
