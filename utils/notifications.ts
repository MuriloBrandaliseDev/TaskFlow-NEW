import { Task } from '@/types/task';

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async checkPermission(): Promise<void> {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  public async scheduleTaskNotification(task: Task): Promise<void> {
    if (!await this.requestPermission()) {
      return;
    }

    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    const now = new Date();
    const timeUntilDue = dueDateTime.getTime() - now.getTime();

    if (timeUntilDue <= 0) {
      return;
    }

    // Notificação 5 minutos antes
    setTimeout(() => {
      this.showNotification(
        '⏰ Tarefa próxima!',
        `${task.name} vence em 5 minutos`,
        task.id
      );
    }, timeUntilDue - 5 * 60 * 1000);

    // Notificação 15 minutos antes
    setTimeout(() => {
      this.showNotification(
        '📋 Lembrete de tarefa',
        `${task.name} vence em 15 minutos`,
        task.id
      );
    }, timeUntilDue - 15 * 60 * 1000);

    // Notificação 30 minutos antes
    setTimeout(() => {
      this.showNotification(
        '🔔 Tarefa agendada',
        `${task.name} vence em 30 minutos`,
        task.id
      );
    }, timeUntilDue - 30 * 60 * 1000);

    // Notificação no momento exato
    setTimeout(() => {
      this.showNotification(
        '🚨 Tarefa vencida!',
        `${task.name} está vencida agora!`,
        task.id
      );
    }, timeUntilDue);
  }

  private showNotification(title: string, body: string, tag: string): void {
    if (this.permission !== 'granted') {
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag,
      requireInteraction: true,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  }

  public async scheduleAllTaskNotifications(tasks: Task[]): Promise<void> {
    const upcomingTasks = tasks.filter(task => {
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
      return dueDateTime > new Date() && !task.completed;
    });

    for (const task of upcomingTasks) {
      await this.scheduleTaskNotification(task);
    }
  }

  public clearAllNotifications(): void {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }
  }
}

export const notificationService = NotificationService.getInstance();
