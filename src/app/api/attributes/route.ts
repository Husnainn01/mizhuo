import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CarAttribute from '@/models/CarAttribute';
import CarListing from '@/models/Car';

// GET: Fetch all attributes for public use, optionally filtered by type
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    // Get filter parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    
    if (type === 'makes') {
      // Fetch unique makes from car listings
      const makes = await CarListing.distinct('make', { offerType: 'In Stock' });
      
      // Sort makes alphabetically
      makes.sort();
      
      return NextResponse.json({
        success: true,
        attributes: makes
      });
    } else if (type === 'models' && searchParams.get('make')) {
      // Fetch models for a specific make
      const make = searchParams.get('make');
      const models = await CarListing.distinct('model', { 
        make: make,
        offerType: 'In Stock'
      });
      
      // Sort models alphabetically
      models.sort();
      
      return NextResponse.json({
        success: true,
        attributes: models
      });
    } else if (type === 'years') {
      // Fetch unique years from car listings
      const years = await CarListing.distinct('year', { offerType: 'In Stock' });
      
      // Sort years in descending order (newest first)
      years.sort((a, b) => b - a);
      
      return NextResponse.json({
        success: true,
        attributes: years
      });
    } else if (type) {
      // Build query for CarAttribute
      const query: any = {
        type: type,
        isActive: true
      };
      
      // Fetch attributes
      const attributes = await CarAttribute.find(query).sort({ name: 1 });
      
      return NextResponse.json({
        success: true,
        attributes: attributes.map(attr => ({
          name: attr.name,
          value: attr.value
        }))
      });
    } else {
      // If no type is specified, return all valid attribute types
      const validTypes = ['transmission', 'fuel', 'body', 'drive', 'feature'];
      
      return NextResponse.json({
        success: true,
        attributeTypes: validTypes
      });
    }
  } catch (error: any) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 