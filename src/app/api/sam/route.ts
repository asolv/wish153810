import { NextRequest, NextResponse } from 'next/server';

// SAM.gov API Proxy Route
// Prevents CORS issues and hides API key from client
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = process.env.SAM_API_KEY || searchParams.get('api_key');

  if (!apiKey) {
    return NextResponse.json({ error: 'API key required. Set SAM_API_KEY environment variable.' }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('limit', searchParams.get('limit') || '10');
  params.set('offset', searchParams.get('offset') || '0');

  const keyword = searchParams.get('keyword');
  const noticeType = searchParams.get('noticeType');
  const naicsCode = searchParams.get('naicsCode');
  const postedFrom = searchParams.get('postedFrom');
  const postedTo = searchParams.get('postedTo');
  const active = searchParams.get('active');

  if (keyword) params.set('keyword', keyword);
  if (noticeType) params.set('noticeType', noticeType);
  if (naicsCode) params.set('naicsCode', naicsCode);
  if (postedFrom) params.set('postedFrom', postedFrom);
  if (postedTo) params.set('postedTo', postedTo);
  if (active) params.set('active', active);

  try {
    const res = await fetch(
      `https://api.sam.gov/opportunities/v2/search?${params.toString()}`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }, // Cache 1 hour
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `SAM.gov API error: ${res.status}`, details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to SAM.gov API', details: String(error) },
      { status: 500 }
    );
  }
}
