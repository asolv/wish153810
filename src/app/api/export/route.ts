import { NextRequest, NextResponse } from 'next/server';
import { mockBids } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'bids';

  // In a real implementation, this would query the DB
  // For demo purposes, return JSON that the client converts to Excel
  if (type === 'bids') {
    const data = mockBids.map(bid => ({
      solicitationNumber: bid.solicitationNumber,
      title: bid.title,
      type: bid.type,
      status: bid.status,
      agency: bid.agency,
      naicsCode: bid.naicsCode,
      estimatedValue: bid.estimatedValue || '',
      awardAmount: bid.awardAmount || '',
      awardee: bid.awardee || '',
      postedDate: bid.postedDate,
      responseDeadline: bid.responseDeadline,
      city: bid.placeOfPerformance.city,
      country: bid.placeOfPerformance.country,
      isUsfk: bid.isUsfk,
    }));
    return NextResponse.json({ data, count: data.length });
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}
