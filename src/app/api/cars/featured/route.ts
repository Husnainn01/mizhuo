import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CarListing from '@/models/Car';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12');
    const showAll = searchParams.get('showAll') === 'true';
    
    // Build the query
    const query: any = {};
    
    // Only filter by offerType if we're not showing all cars
    if (!showAll) {
      query.offerType = 'In Stock'; // Only show cars that are available
    }
    
    // Query for featured cars
    const featuredCars = await CarListing.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      cars: featuredCars
    });

  } catch (error: any) {
    console.error('Error fetching featured cars:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 