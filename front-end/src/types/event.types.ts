export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  organizationId: string;
  venueId: string;
  imageUrl?: string;
  capacity?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
} as const;

export type EventStatusType = typeof EventStatus[keyof typeof EventStatus];

export interface CreateEventDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  organizationId: string;
  venueId: string;
  capacity?: number;
  imageUrl?: string;
}

export interface EventFilters {
  status?: string;
  category?: string;
  organizerId?: string;
  search?: string;
}
