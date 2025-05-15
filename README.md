# AutoElite Car Dealership Website

A modern car dealership website built with Next.js, React, TypeScript, and MongoDB.

## Features

- Browse featured and all available cars
- Detailed car listings with specifications and images
- Advanced search and filtering capabilities
- User authentication and profile management
- Admin dashboard for inventory management
- Responsive design for all device sizes

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/car-dealership.git
cd car-dealership
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Utility libraries and database connection
- `src/models/` - Mongoose models for database schema
- `src/utils/` - Helper functions
- `public/` - Static assets including car images

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NEXT_PUBLIC_API_URL`: Base URL for API requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- MongoDB for the flexible document database
