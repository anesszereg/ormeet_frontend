export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const APP_NAME = 'Ormeet';

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAILS: '/events/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  MY_TICKETS: '/my-tickets',
  MY_ORDERS: '/my-orders',
  CHECKOUT: '/checkout',
  ORGANIZER_DASHBOARD: '/organizer/dashboard',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_CREATE: '/organizer/create',
  ADMIN_DASHBOARD: '/admin/dashboard',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
} as const;

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
} as const;
