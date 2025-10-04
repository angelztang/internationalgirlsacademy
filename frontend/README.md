This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Frontend-Backend Integration

This application uses a **backend API** for authentication that internally leverages **Supabase Auth**. The frontend communicates with the backend via a centralized API client.

### Authentication System

**Architecture:**
- Frontend → Backend API → Supabase Auth
- Backend handles all authentication logic
- Frontend uses type-safe API client (`/src/lib/api.ts`)

**Key Components:**

1. **API Client Layer** (`/src/lib/api.ts`)
   - Centralized API communication
   - Type-safe interfaces for all requests/responses
   - Built-in error handling
   - Endpoints: `register()`, `login()`, `getCurrentUser()`

2. **Login Page** (`/src/app/login.tsx`)
   - Calls backend `/api/v1/users/login`
   - Validates user_type matches selected tab (student/volunteer/admin)
   - Returns full user profile and access token

3. **Signup Page** (`/src/app/signup.tsx`)
   - Calls backend `/api/v1/users/register`
   - Student and Volunteer registration
   - Auto-login after successful registration

### Environment Setup

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

See `.env.local.example` for reference.

## Getting Started

### Prerequisites
- Backend server running on `http://localhost:8000`
- Supabase project configured with authentication enabled

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Testing Authentication Flow

1. **Start the backend server:**
   ```bash
   cd ../backend
   uvicorn app.main:app --reload
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Test Signup:**
   - Navigate to `http://localhost:3000/signup`
   - Register as a student or volunteer
   - Upon success, you'll be redirected to the appropriate dashboard

4. **Test Login:**
   - Navigate to `http://localhost:3000/login`
   - Login with your registered credentials
   - Ensure you select the correct user type tab

## API Endpoints Used

- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/me` - Get current user profile (with JWT token)

All authentication is handled by the backend, which uses Supabase Auth internally for password hashing, JWT generation, and session management.
