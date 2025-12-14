# Authentication Integration Documentation

## Overview

The front-end authentication system has been fully integrated with the backend API. This document outlines the implementation, features, and usage.

---

## 🎯 Features Implemented

### ✅ Core Authentication
- **Email/Phone Login** - Login with email or phone number + password
- **Registration** - Create new account with email, phone (optional), and password
- **Logout** - Clear session and redirect to login
- **Protected Routes** - Automatic redirect to login for unauthenticated users

### ✅ Password Management
- **Forgot Password** - Request password reset link via email
- **Reset Password** - Reset password using token from email
- **Password Validation** - Minimum 6 characters required

### ✅ Email Verification
- **Verify Email** - Verify email address using token from email
- **Resend Verification** - Request new verification email
- **Auto-redirect** - After verification, redirect to dashboard

### ✅ Advanced Features (Backend Ready)
- **Passwordless Login** - Login with 6-digit verification code
- **Phone Verification** - Verify phone number with SMS code
- **Multi-role Support** - Attendee, Organizer, Admin roles
- **Remember Me** - Persistent login sessions

---

## 📁 File Structure

```
front-end/src/
├── context/
│   └── AuthContext.tsx          # Global auth state management
├── services/
│   ├── api.ts                   # Axios instance with interceptors
│   └── authService.ts           # Auth API calls
├── components/
│   └── ProtectedRoute.tsx       # Route guard component
├── pages/
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   ├── ForgotPassword.tsx       # Request password reset
│   ├── ResetPassword.tsx        # Reset password with token
│   ├── VerifyEmail.tsx          # Email verification page
│   └── App.tsx                  # Main routing configuration
└── hooks/
    └── useAuth.ts               # Legacy hook (replaced by AuthContext)
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `front-end` directory:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
```

---

## 🚀 Usage

### 1. AuthContext Provider

The `AuthProvider` is already wrapped around the app in `main.tsx`:

```tsx
import { AuthProvider } from './context/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>
```

### 2. Using Auth in Components

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Protected Routes

Wrap routes that require authentication:

```tsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

With role-based access:

```tsx
<ProtectedRoute requiredRole="organizer">
  <OrganizerDashboard />
</ProtectedRoute>
```

With email verification requirement:

```tsx
<ProtectedRoute requireEmailVerification={true}>
  <VerifiedOnlyPage />
</ProtectedRoute>
```

---

## 📡 API Endpoints Used

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/phone + password
- `POST /auth/login-with-code` - Passwordless login with code

### Email Verification
- `POST /auth/verify-email` - Verify email with token
- `POST /auth/resend-verification` - Resend verification email

### Password Reset
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Verification Codes
- `POST /auth/send-verification-code` - Send 6-digit code
- `POST /auth/verify-code` - Verify code

---

## 🔐 Security Features

### JWT Token Management
- Tokens stored in `localStorage`
- Automatically included in API requests via interceptor
- Auto-logout on 401 Unauthorized responses

### Request Interceptor
```typescript
// Automatically adds JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor
```typescript
// Handles 401 errors and auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📝 Data Transfer Objects (DTOs)

### RegisterDto
```typescript
{
  name: string;
  email: string;
  password: string;
  phone?: string;
  roles?: ('attendee' | 'organizer' | 'admin')[];
  interestedEventCategories?: string[];
  hostingEventTypes?: string[];
}
```

### LoginDto
```typescript
{
  email?: string;
  phone?: string;
  password: string;
}
```

### User Object
```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  emailVerified: boolean;
  phoneVerified?: boolean;
  interestedEventCategories?: string[];
  hostingEventTypes?: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎨 UI/UX Features

### Loading States
- Spinner during authentication requests
- Disabled buttons during loading
- Loading text feedback

### Error Handling
- User-friendly error messages
- Red error banners
- Console logging for debugging

### Success States
- Success modals/banners
- Auto-redirect after success
- Confirmation messages

---

## 🧪 Testing the Integration

### 1. Start Backend Server
```bash
cd backend
npm run start:dev
```

### 2. Start Frontend Server
```bash
cd front-end
npm run dev
```

### 3. Test Registration Flow
1. Navigate to `http://localhost:5173/register`
2. Fill in registration form
3. Submit and check for success message
4. Check email for verification link

### 4. Test Login Flow
1. Navigate to `http://localhost:5173/login`
2. Enter credentials
3. Should redirect to dashboard on success
4. Check localStorage for token and user data

### 5. Test Protected Routes
1. Try accessing `/dashboard-attendee` without login
2. Should redirect to `/login`
3. Login and try again
4. Should access dashboard successfully

### 6. Test Password Reset
1. Navigate to `/forgot-password`
2. Enter email
3. Check email for reset link
4. Click link to reset password
5. Enter new password and submit

---

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, ensure backend has CORS enabled:
```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

### 401 Errors
- Check if backend is running
- Verify API base URL in `.env`
- Check if token is being sent in headers
- Verify token hasn't expired

### Registration Fails
- Check password length (min 6 characters)
- Verify email format
- Check backend logs for errors
- Ensure database is running

---

## 📚 Additional Resources

### Backend API Documentation
- Swagger UI: `http://localhost:3000/api`
- All endpoints documented with examples

### State Management
- Uses React Context API for global auth state
- No external state management library needed

### Future Enhancements
- [ ] Social OAuth (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] Remember me functionality
- [ ] Account deletion
- [ ] Profile editing

---

## 🎉 Summary

The authentication system is now fully integrated with:
- ✅ Complete login/register flows
- ✅ Password reset functionality
- ✅ Email verification
- ✅ Protected routes
- ✅ Global auth state management
- ✅ Error handling
- ✅ Loading states
- ✅ JWT token management

All authentication features from the backend are now accessible from the frontend!
