'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveLayout from '@/components/Layout/ResponsiveLayout';
import TaskList from '@/components/Tasks/TaskList';
import TaskForm from '@/components/Tasks/TaskForm';
import StatsCards from '@/components/Dashboard/StatsCards';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import UserInfo from '@/components/UI/UserInfo';
import { useTaskStore } from '@/store/taskStore';
import { notificationService } from '@/utils/notifications';
import { useSearchParams, useRouter } from 'next/navigation';

export default function HomePage() {
  const { tasks, user, initializeUser, getUpcomingTasks } = useTaskStore();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpcomingAlert, setShowUpcomingAlert] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get('filter');
  const initialFilter = (filterParam === 'upcoming' || filterParam === 'completed') ? filterParam : 'all';

  useEffect(() => {
    setIsHydrated(true);
    
    // Verificar se é uma navegação interna (client-side)
    const isClientNavigation = sessionStorage.getItem('taskflow-navigation') === 'true';
    
    if (isClientNavigation) {
      // Se é navegação interna, não mostrar loading
      setIsLoading(false);
      sessionStorage.removeItem('taskflow-navigation');
    }
    
    // Inicializar usuário se não existir
    if (!user) {
      initializeUser();
    }

    // Solicitar permissão para notificações
    notificationService.requestPermission();

    // Agendar notificações para tarefas existentes
    if (tasks.length > 0) {
      notificationService.scheduleAllTaskNotifications(tasks);
    }
  }, [user, initializeUser, tasks]);

  // Controlar alerta de tarefas próximas
  useEffect(() => {
    if (!isHydrated) return;
    
    const upcomingTasks = getUpcomingTasks();
    
    if (upcomingTasks.length > 0 && !isLoading) {
      // Mostrar alerta
      setShowUpcomingAlert(true);
      
      // Esconder após 2 segundos
      const timer = setTimeout(() => {
        setShowUpcomingAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowUpcomingAlert(false);
    }
  }, [tasks, isLoading, getUpcomingTasks, isHydrated]);

  const upcomingTasks = getUpcomingTasks();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleNotificationClick = () => {
    setShowNotificationModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {!isLoading && (
    <ResponsiveLayout 
      onNewTaskClick={() => setIsTaskFormOpen(true)}
      onNotificationClick={handleNotificationClick}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header com animação de entrada */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: 0.2
          }}
          className="mb-6 lg:mb-8"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 lg:mb-4">
              Bem-vindo ao{' '}
              <span className="gradient-text">Task Flow</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Gerencie suas tarefas de forma inteligente com notificações automáticas
              e uma interface moderna e intuitiva.
            </p>
          </div>
        </motion.div>

          {/* Cards de estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: 'spring',
              stiffness: 80,
              damping: 20,
              delay: 0.4
            }}
            className="mb-6 lg:mb-8"
          >
            <StatsCards />
          </motion.div>

          {/* Informações do usuário */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: 'spring',
              stiffness: 80,
              damping: 20,
              delay: 0.5
            }}
            className="mb-6 lg:mb-8"
          >
            <UserInfo />
          </motion.div>

        {/* Botão Nova Tarefa */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring',
            stiffness: 80,
            damping: 20,
            delay: 0.6
          }}
          className="mb-6 lg:mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTaskFormOpen(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-3 lg:px-6 lg:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all duration-200"
          >
            <span className="text-xl">+</span>
            <span>Nova Tarefa</span>
          </motion.button>
        </motion.div>

        {/* Formulário de nova tarefa */}
        <AnimatePresence>
          {isTaskFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 lg:mb-8"
            >
              <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de tarefas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: 'spring',
              stiffness: 80,
              damping: 20,
              delay: 0.8
            }}
          >
            <TaskList initialFilter={initialFilter} />
          </motion.div>

        {/* Mensagem quando não há tarefas */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: 'spring',
              stiffness: 100,
              damping: 20,
              delay: 1.0
            }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Nenhuma tarefa ainda
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Crie sua primeira tarefa usando o formulário acima e comece a organizar seu dia!
            </p>
          </motion.div>
        )}

        {/* Alerta de tarefas próximas */}
        <AnimatePresence>
          {showUpcomingAlert && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ 
                duration: 0.5, 
                type: 'spring',
                stiffness: 100,
                damping: 20
              }}
              className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-50"
            >
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">⏰</span>
                <span className="font-semibold">Tarefas próximas!</span>
              </div>
              <p className="text-sm">
                Você tem {upcomingTasks.length} tarefa(s) vencendo em breve.
              </p>
            </div>
          </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Notificações */}
        <AnimatePresence>
          {showNotificationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowNotificationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <span>🔔</span>
                    <span>Notificações</span>
                  </h2>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl">×</span>
                  </button>
                </div>

                {upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm mb-4">
                      Você tem {upcomingTasks.length} tarefa(s) vencendo em breve:
                    </p>
                    {upcomingTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500"
                      >
                        <h3 className="text-white font-medium">{task.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Vence em: {new Date(`${task.dueDate}T${task.dueTime}`).toLocaleString('pt-BR')}
                        </p>
                        {task.description && (
                          <p className="text-gray-500 text-xs mt-1">{task.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-white font-medium mb-2">Tudo em dia!</h3>
                    <p className="text-gray-400 text-sm">
                      Não há tarefas vencendo em breve.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveLayout>
      )}
    </>
  );
}
