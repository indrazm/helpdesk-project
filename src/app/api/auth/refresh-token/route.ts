import { NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST() {
  const refreshToken = cookies().get('refreshToken')?.value;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token not found' }, { status: 404 });
  }

  try {
    const payload = verify(refreshToken, refreshTokenSecret);

    const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });

    cookies().set('accessToken', accessToken);

    return NextResponse.json({ data: payload });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
