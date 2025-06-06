import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, tags, formId } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Determine which tag ID to use based on the source
    let tagId = '8138789'; // default interested:ml tag
    if (tags && tags.length > 0) {
      if (tags.includes('source:ml-contact')) {
        tagId = '8151276';
      } else if (tags.includes('source:ml-footer')) {
        tagId = '8151277';
      }
    }

    let response;
    if (formId) {
      // Use the ConvertKit form subscribe endpoint to trigger incentive email
      response = await fetch(`https://api.kit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.KIT_API_KEY,
          email,
          tags: tagId ? [parseInt(tagId)] : undefined,
        }),
      });
    } else {
      // Fallback to tag subscribe endpoint
      response = await fetch(`https://api.kit.com/v3/tags/${tagId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.KIT_API_KEY,
          email,
        }),
      });
    }

    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response:', await response.text());
      return NextResponse.json(
        { error: 'Invalid response from subscription service' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to subscribe' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Successfully subscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 