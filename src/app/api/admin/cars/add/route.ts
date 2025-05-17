import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CarListing from '@/models/Car';
import { uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const data = await request.json();
    console.log('Car listing data received:', data);

    // Validate required fields
    const requiredFields = ['title', 'make', 'model', 'year', 'price'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Track if we had image upload issues for the response
    let imageUploadWarning = null;

    // Upload images to Cloudinary if base64 strings are provided
    if (data.imageFiles && data.imageFiles.length > 0) {
      console.log(`Uploading ${data.imageFiles.length} images to Cloudinary...`);
      try {
        // Upload to the specified folder in Cloudinary
        const imageUrls = await uploadMultipleImages(data.imageFiles, 'home/car-images');
        
        // Add the image URLs to the data
        data.images = imageUrls;
        
        // Handle main image selection using the provided index
        const mainImageIndex = data.mainImageIndex || 0;
        
        // Set the main image to the one at the specified index
        if (imageUrls.length > 0 && mainImageIndex < imageUrls.length) {
          data.image = imageUrls[mainImageIndex];
          console.log(`Setting main image to index ${mainImageIndex}: ${data.image}`);
        } else if (imageUrls.length > 0) {
          // Fallback to first image if index is out of range
          data.image = imageUrls[0];
          console.log(`Invalid main image index ${mainImageIndex}, falling back to first image`);
        }
        
        console.log('Images uploaded successfully');
      } catch (error) {
        console.error('Image upload error:', error);
        // Instead of returning an error, we'll continue but add a warning
        imageUploadWarning = 'Failed to upload images. The listing will be created without images.';
        
        // Ensure we don't keep the large base64 data in the database
        data.images = [];
        data.image = '';
      }
    }
    
    // Always remove the base64 data and temporary fields to avoid storing them in the database
    delete data.imageFiles;
    delete data.mainImageIndex;

    // Create the car listing
    const carListing = new CarListing(data);
    await carListing.save();

    console.log('Car listing created successfully:', carListing._id);

    return NextResponse.json({
      success: true,
      message: 'Car listing created successfully',
      carId: carListing._id,
      warning: imageUploadWarning
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating car listing:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 