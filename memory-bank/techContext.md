# Technical Context for Car Dealership Website

## Technologies Used

### Frontend
- **Next.js**: React framework with SSR, SSG, and API routes
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and submission
- **Next Auth**: Authentication solution (optional alternative to custom JWT)

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Git**: Version control
- **npm**: Package management

## Development Setup
1. **Prerequisites**:
   - Node.js (LTS version)
   - npm or yarn
   - MongoDB Atlas account or local MongoDB instance

2. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Installation**:
   ```bash
   npm install
   npm run dev
   ```

## Technical Constraints
1. **Performance Targets**:
   - First Contentful Paint: < 1.5s
   - Time to Interactive: < 3s
   - Lighthouse Score: > 90

2. **Browser Support**:
   - Modern browsers (Chrome, Firefox, Safari, Edge)
   - IE not supported

3. **Accessibility**:
   - WCAG 2.1 AA compliance

4. **SEO Requirements**:
   - Server-side rendering for core pages
   - Structured data for car listings
   - Optimized meta tags

## Dependencies
- **Core Dependencies**:
  - next
  - react
  - react-dom
  - typescript
  - tailwindcss
  - mongodb
  - mongoose
  - jsonwebtoken
  - bcryptjs

- **Development Dependencies**:
  - @types/node
  - @types/react
  - @types/react-dom
  - @types/jsonwebtoken
  - @types/bcryptjs
  - eslint
  - eslint-config-next

## Deployment Strategy
- **Platform**: Vercel (recommended for Next.js)
- **CI/CD**: GitHub integration with Vercel
- **Database**: MongoDB Atlas cloud database
- **Monitoring**: Vercel Analytics and custom logging 