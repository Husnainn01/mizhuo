import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CarListing from '@/models/Car';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Get car ID from the URL parameter
    const carId = params.id;
    
    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body to get isFeatured value
    const data = await request.json();
    const { isFeatured } = data;

    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'isFeatured must be a boolean value' },
        { status: 400 }
      );
    }

    // Find and update the car
    const car = await CarListing.findById(carId);
    
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // Update the featured status
    car.isFeatured = isFeatured;
    await car.save();

    return NextResponse.json({
      success: true,
      message: `Car ${isFeatured ? 'added to' : 'removed from'} featured listings`,
      isFeatured: car.isFeatured
    });

  } catch (error: any) {
    console.error('Error toggling featured status:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 