import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CarListing from '@/models/Car';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const bodyType = searchParams.get('bodyType');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const fuelType = searchParams.get('fuelType');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      offerType: 'In Stock' // Only show available cars
    };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (make) query.make = make;
    
    // Handle multiple models
    const models = searchParams.getAll('model');
    if (models.length > 0) {
      query.model = { $in: models };
    } else if (model) {
      query.model = model;
    }
    
    // Handle multiple body types
    const bodyTypes = searchParams.getAll('bodyType');
    if (bodyTypes.length > 0) {
      query.bodyType = { $in: bodyTypes };
    } else if (bodyType) {
      query.bodyType = bodyType;
    }
    
    // Handle multiple fuel types
    const fuelTypes = searchParams.getAll('fuelType');
    if (fuelTypes.length > 0) {
      query.fuelType = { $in: fuelTypes };
    } else if (fuelType) {
      query.fuelType = fuelType;
    }
    
    // Handle features (array field)
    const features = searchParams.getAll('feature');
    if (features.length > 0) {
      query.carFeature = { $all: features };
    }
    
    if (minYear && maxYear) {
      query.year = { $gte: parseInt(minYear), $lte: parseInt(maxYear) };
    } else if (minYear) {
      query.year = { $gte: parseInt(minYear) };
    } else if (maxYear) {
      query.year = { $lte: parseInt(maxYear) };
    }
    
    if (minPrice && maxPrice) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      query.price = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: parseInt(maxPrice) };
    }

    // Determine sort order
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'price-low':
        sortObj = { price: 1 };
        break;
      case 'price-high':
        sortObj = { price: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Fetch car listings
    const cars = await CarListing.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await CarListing.countDocuments(query);

    return NextResponse.json({
      success: true,
      cars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching car listings:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 