'use client';

import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export default function StatsCards() {
  const { tasks, getUpcomingTasks, getCompletedTasks } = useTaskStore();
  
  const upcomingTasks = getUpcomingTasks();
  const completedTasks = getCompletedTasks();
  const overdueTasks = tasks.filter(task => {
    const taskDateTime = parseISO(`${task.dueDate}T${task.dueTime}`);
    return taskDateTime < new Date() && !task.completed;
  });

  // Tarefas desta semana
  const thisWeekTasks = tasks.filter(task => {
    const taskDateTime = parseISO(`${task.dueDate}T${task.dueTime}`);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return isWithinInterval(taskDateTime, { start: weekStart, end: weekEnd });
  });

  // Taxa de conclusão
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const stats = [
    {
      title: 'Total de Tarefas',
      value: tasks.length,
      icon: CheckSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500 bg-opacity-10',
      textColor: 'text-blue-400',
    },
    {
      title: 'Pendentes',
      value: upcomingTasks.length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500 bg-opacity-10',
      textColor: 'text-yellow-400',
    },
    {
      title: 'Concluídas',
      value: completedTasks.length,
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500 bg-opacity-10',
      textColor: 'text-green-400',
    },
    {
      title: 'Vencidas',
      value: overdueTasks.length,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500 bg-opacity-10',
      textColor: 'text-red-400',
    },
    {
      title: 'Esta Semana',
      value: thisWeekTasks.length,
      icon: Calendar,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600 bg-opacity-10',
      textColor: 'text-blue-400',
    },
    {
      title: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'from-blue-700 to-blue-800',
      bgColor: 'bg-blue-700 bg-opacity-10',
      textColor: 'text-blue-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`${stat.bgColor} rounded-xl p-3 lg:p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200`}
        >
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className={`p-1.5 lg:p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className={`text-lg lg:text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
          </div>
          <h3 className="text-xs lg:text-sm font-medium text-gray-300">
            {stat.title}
          </h3>
        </motion.div>
      ))}
    </div>
  );
}
