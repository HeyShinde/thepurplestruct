import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') || req.headers.get('x-revalidate-secret');
  if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
    // eslint-disable-next-line no-console
    console.error('[REVALIDATE] Invalid revalidation secret');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  let slug = null;
  try {
    const body = await req.json();
    slug = typeof body?.slug === 'string' ? body.slug : body?.slug?.current;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[REVALIDATE] Failed to parse JSON body', err);
  }

  try {
    revalidatePath('/blog');
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    // eslint-disable-next-line no-console
    console.log(`[REVALIDATE] Revalidated: /blog${slug ? ` and /blog/${slug}` : ''}`);

    return NextResponse.json({ revalidated: true, now: Date.now(), slug });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[REVALIDATE] Revalidation failed', err);
    return NextResponse.json(
        {
          message: 'Error revalidating',
          error: (err as Error).message,
          stack: process.env.NODE_ENV === 'development' ? (err as Error).stack : undefined
        },
        { status: 500 }
    );
  }
}
