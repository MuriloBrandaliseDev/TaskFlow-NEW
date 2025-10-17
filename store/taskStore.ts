import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, User, AppSettings, Appointment } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';
import { customStorage } from './persist';

interface TaskStore {
  // State
  tasks: Task[];
  appointments: Appointment[];
  user: User | null;
  settings: AppSettings;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
  
  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // User actions
  initializeUser: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Getters
  getTasksByDate: (date: string) => Task[];
  getUpcomingTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getTasksByPriority: (priority: 'low' | 'medium' | 'high') => Task[];
  getAppointmentsByDate: (date: string) => Appointment[];
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'pt',
  notifications: {
    enabled: true,
    beforeMinutes: [5, 15, 30],
    sound: true,
    vibration: true,
  },
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      appointments: [],
      user: null,
      settings: defaultSettings,

      // Task actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        }));
      },

      // Appointment actions
      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id
              ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
              : appointment
          ),
        }));
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== id),
        }));
      },

      // User actions
      initializeUser: () => {
        // Gerar ID único baseado em características do dispositivo
        const deviceFingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
        const deviceId = btoa(deviceFingerprint).substring(0, 16);
        
        const deviceName = navigator.userAgent.includes('Mobile') 
          ? `Dispositivo Móvel ${deviceId}`
          : `Computador ${deviceId}`;
        
        const user: User = {
          id: deviceId,
          deviceName,
          createdAt: new Date().toISOString(),
        };

        set({ user });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // Getters
      getTasksByDate: (date) => {
        return get().tasks.filter((task) => task.dueDate === date);
      },

      getUpcomingTasks: () => {
        const now = new Date();
        return get().tasks.filter((task) => {
          const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
          return dueDateTime > now && !task.completed;
        });
      },

      getCompletedTasks: () => {
        return get().tasks.filter((task) => task.completed);
      },

      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority);
      },

      getAppointmentsByDate: (date) => {
        return get().appointments.filter((appointment) => appointment.date === date);
      },
    }),
    {
      name: 'task-flow-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        appointments: state.appointments,
        user: state.user,
        settings: state.settings,
      }),
    }
  )
);
