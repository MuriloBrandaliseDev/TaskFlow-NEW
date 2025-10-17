export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  dueTime: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface User {
  id: string;
  deviceName: string;
  createdAt: string;
}

export interface NotificationSettings {
  enabled: boolean;
  beforeMinutes: number[];
  sound: boolean;
  vibration: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  language: 'pt' | 'en';
  notifications: NotificationSettings;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'event' | 'reminder' | 'deadline';
  location?: string;
  attendees?: string[];
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'task' | 'appointment';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  color: string;
  isCompleted?: boolean;
}
