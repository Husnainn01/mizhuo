# System Patterns for Car Dealership Website

## System Architecture
The car dealership website follows a modern Next.js application architecture with a clear separation of concerns:

```
├── src/
│   ├── app/               # Next.js App Router structure
│   │   ├── page.tsx       # Homepage
│   │   ├── cars/          # Car listings and details pages
│   │   ├── admin/         # Admin dashboard routes
│   │   ├── auth/          # Authentication routes
│   │   ├── search/        # Search functionality
│   │   └── api/           # API routes for server operations
│   ├── components/        # Reusable UI components
│   ├── lib/               # Library code, DB connections, etc.
│   ├── models/            # Mongoose models
│   └── utils/             # Utility functions
```

## Key Technical Decisions
1. **Next.js App Router**: Using the newer App Router for improved routing, layouts, and server components.
2. **Server Components**: Leveraging React Server Components for improved performance and SEO.
3. **MongoDB with Mongoose**: For flexible data storage and retrieval.
4. **JWT Authentication**: For secure user sessions and admin access.
5. **TailwindCSS**: For rapid styling and consistent design.

## Design Patterns
1. **Repository Pattern**: Abstracting database operations in dedicated service files.
2. **Component Composition**: Building complex UI from smaller, reusable components.
3. **Server Actions**: Using Next.js server actions for form submissions and data mutations.
4. **Middleware**: For authentication and route protection.
5. **Context API**: For state management across components.

## Component Relationships

### Data Flow
```
Database ⟷ Mongoose Models ⟷ API Routes/Server Actions ⟷ UI Components
```

### Auth Flow
```
Login Form → Auth API → JWT Generation → Cookie Storage → Protected Routes
```

### Content Management Flow
```
Admin UI → Server Actions → Database Updates → Updated UI
```

## API Structure
- `/api/cars`: Car listing operations
- `/api/auth`: Authentication operations
- `/api/users`: User management
- `/api/inquiries`: Customer inquiries

## Data Models
1. **Car**: Stores vehicle information, specifications, and images
2. **User**: Customer and admin user data
3. **Inquiry**: Customer messages and contact requests
4. **Feature**: For featured cars and promotional content 