import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CarAttribute from '@/models/CarAttribute';

// GET: Fetch all attributes, optionally filtered by type
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Connect to database
    await connectDB();
    
    // Get filter parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    
    // Build query
    const query: any = {};
    if (type) {
      query.type = type;
    }
    
    // Fetch attributes
    const attributes = await CarAttribute.find(query).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      attributes
    });
  } catch (error: any) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new attribute
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
    
    // Validate required fields
    const requiredFields = ['name', 'value', 'type'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate attribute type
    const validTypes = ['transmission', 'fuel', 'body', 'drive', 'feature'];
    if (!validTypes.includes(data.type)) {
      return NextResponse.json(
        { error: `Invalid attribute type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if attribute already exists
    const existingAttribute = await CarAttribute.findOne({
      type: data.type,
      value: data.value
    });
    
    if (existingAttribute) {
      return NextResponse.json(
        { error: `An attribute of type '${data.type}' with value '${data.value}' already exists` },
        { status: 400 }
      );
    }
    
    // Create new attribute
    const attribute = new CarAttribute(data);
    await attribute.save();
    
    return NextResponse.json({
      success: true,
      message: 'Attribute created successfully',
      attribute
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating attribute:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 