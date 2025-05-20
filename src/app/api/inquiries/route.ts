import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Create carId as ObjectId if provided
    let carId = undefined;
    if (data.carId) {
      try {
        carId = new mongoose.Types.ObjectId(data.carId);
      } catch (error) {
        console.error('Invalid carId format:', error);
        // We'll continue without carId if it's invalid
      }
    }
    
    // Create new inquiry
    const inquiry = new Inquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      carId: carId,
      status: 'new'
    });
    
    // Save to database
    await inquiry.save();
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry._id
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error('Error submitting inquiry:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Server error', message: errorMessage },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all inquiries (for completeness, though admin would typically use this)
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/inquiries: Starting to fetch inquiries');
    
    // Connect to the database
    await connectDB();
    console.log('GET /api/inquiries: Connected to database');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    console.log('GET /api/inquiries: Query params:', { email, status, limit, page, skip });
    
    // Build query
    const query: Record<string, string> = {};
    if (email) query.email = email;
    if (status) query.status = status;
    
    console.log('GET /api/inquiries: Built query:', query);
    
    // Fetch inquiries
    console.log('GET /api/inquiries: About to execute Inquiry.find()');
    
    // Use proper model name for populate
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'carId',
        model: 'CarListing',
        select: 'title make model year'
      })
      .lean();
    
    console.log(`GET /api/inquiries: Found ${inquiries.length} inquiries`);
    
    // Get total count for pagination
    const total = await Inquiry.countDocuments(query);
    console.log(`GET /api/inquiries: Total count: ${total}`);
    
    return NextResponse.json({
      success: true,
      inquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: unknown) {
    console.error('Error fetching inquiries:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: 'Server error', message: errorMessage },
      { status: 500 }
    );
  }
} 