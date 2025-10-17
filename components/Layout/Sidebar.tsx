'use client';

import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  BarChart3, 
  User,
  X
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { tasks, appointments, user } = useTaskStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Forçar re-renderização quando pathname mudar
  useEffect(() => {
    // Este useEffect força a re-renderização quando a rota muda
  }, [pathname]);

  const menuItems = [
    { id: 'all', label: 'Todas as Tarefas', icon: CheckSquare, count: isHydrated ? tasks.length : 0, href: '/' },
    { id: 'calendar', label: 'Calendário', icon: Calendar, count: 0, href: '/calendar' },
  ];

  // Determinar qual item está ativo baseado na rota
  const getActiveTab = () => {
    // Debug: log do pathname atual
    console.log('Current pathname:', pathname);
    
    if (pathname === '/calendar') {
      console.log('Returning calendar as active');
      return 'calendar';
    }
    
    console.log('Returning all as active');
    return 'all';
  };

  const currentActiveTab = getActiveTab();
  
  // Debug: log do tab ativo
  console.log('Current active tab:', currentActiveTab);

  // Função para navegação suave
  const handleNavigation = (href: string) => {
    if (onClose) onClose(); // Fechar sidebar no mobile
    
    // Marcar como navegação interna para evitar loading
    sessionStorage.setItem('taskflow-navigation', 'true');
    router.push(href);
  };

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700 flex flex-col w-80 fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Task Flow</h1>
              <p className="text-sm text-gray-400">Gerenciador de Tarefas</p>
            </div>
          </motion.div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-3 bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user.deviceName}</p>
                <p className="text-xs text-gray-400">Usuário local</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <button
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  currentActiveTab === item.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentActiveTab === item.id
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </nav>

      {/* Estatísticas */}
      <div className="p-4 border-t border-gray-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 mb-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">Resumo</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Tarefas hoje:</span>
              <span className="text-white font-medium">
                {isHydrated ? tasks.filter(task => {
                  const today = new Date().toISOString().split('T')[0];
                  return task.dueDate === today;
                }).length : 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Compromissos:</span>
              <span className="text-white font-medium">
                {isHydrated ? appointments.length : 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Concluídas:</span>
              <span className="text-green-400 font-medium">
                {isHydrated ? tasks.filter(task => task.completed).length : 0}
              </span>
            </div>
            
            <div className="pt-2 border-t border-gray-600">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Taxa de conclusão:</span>
                <span className="text-blue-400 font-medium">
                  {isHydrated && tasks.length > 0 
                    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
