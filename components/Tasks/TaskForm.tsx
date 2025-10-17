'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Clock, Tag, FileText } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/task';
import { notificationService } from '@/utils/notifications';

interface TaskFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function TaskForm({ isOpen: externalIsOpen, onClose }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const isFormOpen = externalIsOpen !== undefined ? externalIsOpen : isOpen;
  const closeForm = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
  });

  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.dueDate || !formData.dueTime) {
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      priority: formData.priority,
      category: formData.category.trim() || 'Geral',
      completed: false,
    };

    addTask(newTask);
    
    // Agendar notificações para a nova tarefa
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await notificationService.scheduleTaskNotification(taskWithId);

    // Reset form
    setFormData({
      name: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      category: '',
    });
    
    closeForm();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mb-8">
      <AnimatePresence>
        {!isFormOpen ? (
          // Só mostrar o botão se não há controle externo
          externalIsOpen === undefined && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-3 lg:px-6 lg:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Tarefa</span>
            </motion.button>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white">Criar Nova Tarefa</h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Tarefa *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o nome da tarefa"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2.5 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Descreva a tarefa (opcional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Vencimento *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Horário *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => handleInputChange('dueTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-2.5 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Trabalho, Pessoal"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Criar Tarefa
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeForm}
                  className="px-4 py-2.5 lg:px-6 lg:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
