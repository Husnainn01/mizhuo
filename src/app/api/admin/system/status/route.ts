import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get Cloudinary credentials from environment variables
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    
    if (!cloudinaryUrl) {
      console.error('Missing CLOUDINARY_URL environment variable');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Cloudinary credentials'
        },
        { status: 500 }
      );
    }
    
    // Parse cloudinary URL to extract credentials
    // Format: cloudinary://api_key:api_secret@cloud_name
    const regex = /cloudinary:\/\/([^:]+):([^@]+)@(.+)/;
    const match = cloudinaryUrl.match(regex);
    
    if (!match || match.length < 4) {
      console.error('Invalid CLOUDINARY_URL format');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid Cloudinary URL format'
        },
        { status: 500 }
      );
    }
    
    const apiKey = match[1];
    const apiSecret = match[2];
    const cloudName = match[3];
    
    console.log(`Using Cloudinary credentials - Cloud: ${cloudName}, Key: ${apiKey.substring(0, 3)}...`);
    
    // Create Basic Authentication credentials
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    // Fetch usage data from Cloudinary API
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary API error:', errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch Cloudinary usage data',
          details: errorText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Format the data for our frontend
    const formattedData = {
      storage: {
        used: data.storage.usage,
        total: data.storage.limit,
        usedPercentage: data.storage.limit > 0 ? Math.round((data.storage.usage / data.storage.limit) * 100) : 0,
        usedFormatted: formatBytes(data.storage.usage),
        totalFormatted: formatBytes(data.storage.limit)
      },
      transformations: {
        used: data.transformations.usage,
        total: data.transformations.limit,
        usedPercentage: data.transformations.limit > 0 ? Math.round((data.transformations.usage / data.transformations.limit) * 100) : 0
      },
      bandwidth: {
        used: data.bandwidth.usage,
        total: data.bandwidth.limit,
        usedPercentage: data.bandwidth.limit > 0 ? Math.round((data.bandwidth.usage / data.bandwidth.limit) * 100) : 0,
        usedFormatted: formatBytes(data.bandwidth.usage),
        totalFormatted: formatBytes(data.bandwidth.limit)
      },
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: formattedData
    });
    
  } catch (error: any) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to format bytes into human-readable format
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
} 