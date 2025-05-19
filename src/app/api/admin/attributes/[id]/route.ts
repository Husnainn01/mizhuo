import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CarAttribute from '@/models/CarAttribute';

// GET: Fetch a specific attribute by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Get attribute ID from the URL parameter
    const attributeId = params.id;
    
    if (!attributeId) {
      return NextResponse.json(
        { error: 'Attribute ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Find the attribute
    const attribute = await CarAttribute.findById(attributeId);
    
    if (!attribute) {
      return NextResponse.json(
        { error: 'Attribute not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      attribute
    });
  } catch (error: any) {
    console.error('Error fetching attribute:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an attribute
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Get attribute ID from the URL parameter
    const attributeId = params.id;
    
    if (!attributeId) {
      return NextResponse.json(
        { error: 'Attribute ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'value'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Find the attribute
    const attribute = await CarAttribute.findById(attributeId);
    
    if (!attribute) {
      return NextResponse.json(
        { error: 'Attribute not found' },
        { status: 404 }
      );
    }
    
    // Check if changing value would create a duplicate
    if (data.value !== attribute.value) {
      const existingAttribute = await CarAttribute.findOne({
        type: attribute.type,
        value: data.value,
        _id: { $ne: attributeId }
      });
      
      if (existingAttribute) {
        return NextResponse.json(
          { error: `An attribute of type '${attribute.type}' with value '${data.value}' already exists` },
          { status: 400 }
        );
      }
    }
    
    // Update allowed fields
    const allowedUpdates = ['name', 'value', 'description', 'isActive'];
    allowedUpdates.forEach(field => {
      if (data[field] !== undefined) {
        attribute[field] = data[field];
      }
    });
    
    await attribute.save();
    
    return NextResponse.json({
      success: true,
      message: 'Attribute updated successfully',
      attribute
    });
  } catch (error: any) {
    console.error('Error updating attribute:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete an attribute
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

    // Get attribute ID from the URL parameter
    const attributeId = params.id;
    
    if (!attributeId) {
      return NextResponse.json(
        { error: 'Attribute ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Find and delete the attribute
    const attribute = await CarAttribute.findByIdAndDelete(attributeId);
    
    if (!attribute) {
      return NextResponse.json(
        { error: 'Attribute not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Attribute deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 