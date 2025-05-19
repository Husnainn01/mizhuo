import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import mongoose from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get inquiry ID from route params
    const id = params.id;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid inquiry ID format' },
        { status: 400 }
      );
    }
    
    // Parse request body to get the new status
    const { status } = await request.json();
    
    // Validate status value
    const validStatuses = ['new', 'read', 'responded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: new, read, responded' },
        { status: 400 }
      );
    }
    
    // Find and update the inquiry
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true } // Return the updated document
    );
    
    // Check if inquiry exists
    if (!updatedInquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Inquiry status updated successfully',
      inquiry: updatedInquiry
    });
    
  } catch (error: any) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 