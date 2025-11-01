import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Forward the request to the backend API
    const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}