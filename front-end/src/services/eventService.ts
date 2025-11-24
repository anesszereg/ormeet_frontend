import api from './api';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'cancelled';
  category: string;
  organizationId: string;
  venueId: string;
  imageUrl?: string;
  capacity?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

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

class EventService {
  async getAllEvents(params?: {
    status?: string;
    category?: string;
    organizerId?: string;
  }) {
    const response = await api.get<Event[]>('/events', { params });
    return response.data;
  }

  async getEventById(id: string) {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  }

  async createEvent(data: CreateEventDto) {
    const response = await api.post<Event>('/events', data);
    return response.data;
  }

  async updateEvent(id: string, data: Partial<CreateEventDto>) {
    const response = await api.patch<Event>(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }

  async publishEvent(id: string) {
    const response = await api.post(`/events/${id}/publish`);
    return response.data;
  }

  async cancelEvent(id: string) {
    const response = await api.post(`/events/${id}/cancel`);
    return response.data;
  }

  async favoriteEvent(id: string) {
    const response = await api.post(`/events/${id}/favorite`);
    return response.data;
  }

  async incrementView(id: string) {
    const response = await api.post(`/events/${id}/view`);
    return response.data;
  }
}

export default new EventService();
