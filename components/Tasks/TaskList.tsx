'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTaskStore } from '@/store/taskStore';
import TaskItem from './TaskItem';

interface TaskListProps {
  initialFilter?: 'all' | 'upcoming' | 'completed';
}

export default function TaskList({ initialFilter = 'all' }: TaskListProps) {
  const { tasks, getUpcomingTasks, getCompletedTasks } = useTaskStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>(initialFilter);

  // Atualizar filtro quando initialFilter mudar
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const upcomingTasks = getUpcomingTasks();
  const completedTasks = getCompletedTasks();

  const getFilteredTasks = () => {
    switch (filter) {
      case 'upcoming':
        return upcomingTasks;
      case 'completed':
        return completedTasks;
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const groupTasksByDate = (tasks: typeof filteredTasks) => {
    const groups: { [key: string]: typeof tasks } = {};
    
    tasks.forEach(task => {
      const taskDate = parseISO(`${task.dueDate}T${task.dueTime}`);
      let dateKey: string;
      
      if (isToday(taskDate)) {
        dateKey = 'Hoje';
      } else if (isTomorrow(taskDate)) {
        dateKey = 'Amanhã';
      } else if (isYesterday(taskDate)) {
        dateKey = 'Ontem';
      } else {
        dateKey = format(taskDate, 'dd/MM/yyyy', { locale: ptBR });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    return groups;
  };

  const groupedTasks = groupTasksByDate(filteredTasks);

  const filterButtons = [
    { id: 'all', label: 'Todas', count: tasks.length },
    { id: 'upcoming', label: 'Pendentes', count: upcomingTasks.length },
    { id: 'completed', label: 'Concluídas', count: completedTasks.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
        {filterButtons.map((button) => (
          <motion.button
            key={button.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(button.id)}
            className={`px-3 py-2 lg:px-4 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
              filter === button.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {button.label}
            {button.count > 0 && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                filter === button.id
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-600'
              }`}>
                {button.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-4 lg:space-y-6">
        <AnimatePresence mode="wait">
          {Object.keys(groupedTasks).length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">
                  {filter === 'completed' ? '✅' : filter === 'upcoming' ? '⏰' : '📝'}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'completed' 
                  ? 'Nenhuma tarefa concluída' 
                  : filter === 'upcoming' 
                  ? 'Nenhuma tarefa pendente'
                  : 'Nenhuma tarefa encontrada'
                }
              </h3>
              <p className="text-gray-400">
                {filter === 'completed' 
                  ? 'Complete algumas tarefas para vê-las aqui'
                  : filter === 'upcoming' 
                  ? 'Todas as suas tarefas estão concluídas!'
                  : 'Crie sua primeira tarefa para começar'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {Object.entries(groupedTasks).map(([dateKey, dateTasks], groupIndex) => (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <span>{dateKey}</span>
                    <span className="text-sm text-gray-400">({dateTasks.length})</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <AnimatePresence>
                      {dateTasks.map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
