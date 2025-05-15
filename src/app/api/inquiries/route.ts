import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, carId } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Create new inquiry
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      carId: carId || null,
      status: 'new'
    });

    return NextResponse.json(
      { success: true, data: inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
} 