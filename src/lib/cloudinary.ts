import { v2 as cloudinary } from 'cloudinary';

// Add a console log to help debug environment variables
console.log('Cloudinary environment check:', { 
  hasUrl: !!process.env.CLOUDINARY_URL,
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  env: process.env.NODE_ENV
});

// Configure Cloudinary - try using CLOUDINARY_URL first, then fall back to individual params
if (process.env.CLOUDINARY_URL) {
  // Let Cloudinary use the URL format (cloudinary://api_key:api_secret@cloud_name)
  // This is automatically handled by the SDK when CLOUDINARY_URL is present
  console.log('Using CLOUDINARY_URL for configuration');
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Fall back to individual params
  console.log('Using individual Cloudinary parameters');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true
  });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ Missing Cloudinary configuration in production environment');
}

/**
 * Upload an image to Cloudinary
 * @param file The file to upload (base64 encoded string or URL)
 * @param folder The folder to upload to
 * @returns The uploaded image URL
 */
export const uploadImage = async (file: string, folder = 'home/car-images'): Promise<string> => {
  try {
    console.log('Attempting to upload to Cloudinary with config:', { 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'from_url', 
      folder
    });
    
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto', width: 2000, crop: 'limit' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param files Array of files to upload (base64 encoded strings or URLs)
 * @param folder The folder to upload to
 * @returns Array of uploaded image URLs
 */
export const uploadMultipleImages = async (files: string[], folder = 'home/car-images'): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Cloudinary batch upload error:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns Success status
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export default cloudinary; 