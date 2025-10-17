'use client';

import { motion } from 'framer-motion';
import { Menu, Plus, Bell } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useState, useEffect } from 'react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  onNewTaskClick?: () => void;
  onNotificationClick?: () => void;
}

export default function MobileHeader({ onMenuClick, onNewTaskClick, onNotificationClick }: MobileHeaderProps) {
  const { tasks, getUpcomingTasks } = useTaskStore();
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const upcomingTasks = getUpcomingTasks();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed top-0 left-0 right-0 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-lg border-b border-gray-700"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <h1 className="text-lg font-bold text-white">Task Flow</h1>
          </motion.div>
        </div>

        <div className="flex items-center space-x-2">
          {isHydrated && upcomingTasks.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <button 
                onClick={onNotificationClick}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-blue-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {upcomingTasks.length}
                </span>
              </button>
            </motion.div>
          )}
          
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onNewTaskClick}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
