import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CarListing from '@/models/Car';
import { deleteImage } from '@/lib/cloudinary';

// DELETE endpoint to remove a car listing
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Connect to database
    await connectDB();

    // Get car ID from params
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      );
    }

    // Find the car listing first to get image URLs
    const carListing = await CarListing.findById(id);
    
    if (!carListing) {
      return NextResponse.json(
        { error: 'Car listing not found' },
        { status: 404 }
      );
    }

    // Track if we had image deletion issues
    let imageDeleteWarning = null;

    // Delete images from Cloudinary if available
    if (carListing.images && carListing.images.length > 0) {
      try {
        // Extract public IDs from image URLs
        const publicIds = carListing.images.map((imageUrl: string) => {
          // Extract the public ID from the Cloudinary URL
          // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
          const urlParts = imageUrl.split('/');
          const filenamePart = urlParts[urlParts.length - 1];
          const publicId = filenamePart.split('.')[0];
          return `home/car-images/${publicId}`;
        });

        // Delete images from Cloudinary
        for (const publicId of publicIds) {
          await deleteImage(publicId);
        }
        
        console.log(`Deleted ${publicIds.length} images from Cloudinary`);
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        imageDeleteWarning = 'Failed to delete some or all images from Cloudinary';
      }
    }

    // Delete the car listing from database
    await CarListing.findByIdAndDelete(id);

    console.log('Car listing deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Car listing deleted successfully',
      warning: imageDeleteWarning
    });

  } catch (error: any) {
    console.error('Error deleting car listing:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch a specific car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectDB();

    // Get car ID from params
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      );
    }

    // Find the car listing
    const carListing = await CarListing.findById(id);
    
    if (!carListing) {
      return NextResponse.json(
        { error: 'Car listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      car: carListing
    });

  } catch (error: any) {
    console.error('Error fetching car listing:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 