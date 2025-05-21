# Vercel Deployment Guide

To properly deploy this application to Vercel, follow these instructions:

## Required Environment Variables

Add the following environment variables in the Vercel project settings:

### Essential Variables

- `MONGODB_URI`: Your MongoDB connection string
- `CLOUDINARY_URL`: Your Cloudinary URL (format: `cloudinary://533515579944646:zuF6zmfvm-wWSBMTtRLzAIpem2I@dtuo7mzuo`)
- `JWT_SECRET`: Secret key for JWT token generation

### Alternative Cloudinary Config (if not using CLOUDINARY_URL)

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Email Settings (if using email features)

- `EMAIL_HOST`: SMTP host
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASS`: SMTP password

## Deployment Settings

1. Make sure the build command is set to: `npm run vercel-build`
2. Ensure the framework preset is set to Next.js
3. Set the Node.js version to 18.x or later

## Troubleshooting

If you encounter deployment issues:

1. Check that all required environment variables are set
2. Verify the MongoDB connection string is correct and the database is accessible
3. Make sure the Cloudinary credentials are valid
4. Try clearing the Vercel build cache and redeploying 