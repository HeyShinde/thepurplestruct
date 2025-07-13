import { NextRequest, NextResponse } from 'next/server';

// Optionally set a secret in your environment variables for security
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  // Optional: Check for a secret token in the query string or header
  const secret = req.nextUrl.searchParams.get('secret') || req.headers.get('x-revalidate-secret');
  if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  let slug = null;
  try {
    const body = await req.json();
    slug = body?.slug;
  } catch {
    // If no JSON body, ignore
  }

  try {
    // Next.js 15 App Router: Use the experimental revalidatePath API
    // See: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    // @ts-expect-error revalidatePath is experimental and not typed yet
    if (typeof revalidatePath === 'function') {
      // @ts-expect-error revalidatePath is experimental and not typed yet
      revalidatePath('/blog');
      if (slug) {
        // @ts-expect-error revalidatePath is experimental and not typed yet
        revalidatePath(`/blog/${slug}`);
      }
      return NextResponse.json({ revalidated: true, now: Date.now(), slug });
    } else {
      // If not available, fallback or error
      return NextResponse.json({ message: 'revalidatePath is not available in this environment.' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 });
  }
} 