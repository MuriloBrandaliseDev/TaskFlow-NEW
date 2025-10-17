'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Check, 
  Clock, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Tag,
  Calendar
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  index: number;
}

export default function TaskItem({ task, index }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: task.name,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    category: task.category,
  });
  const { toggleTask, deleteTask, updateTask } = useTaskStore();

  const taskDateTime = parseISO(`${task.dueDate}T${task.dueTime}`);
  const isOverdue = taskDateTime < new Date() && !task.completed;
  const isDueSoon = taskDateTime < new Date(Date.now() + 30 * 60 * 1000) && !task.completed;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400 bg-opacity-10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400 bg-opacity-10';
      case 'low':
        return 'text-green-400 bg-green-400 bg-opacity-10';
      default:
        return 'text-gray-400 bg-gray-400 bg-opacity-10';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleSaveEdit = () => {
    if (!editData.name.trim()) return;
    
    updateTask(task.id, {
      name: editData.name.trim(),
      description: editData.description.trim(),
      dueDate: editData.dueDate,
      dueTime: editData.dueTime,
      priority: editData.priority,
      category: editData.category.trim() || 'Geral',
    });
    
    setIsEditing(false);
    setIsExpanded(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
      category: task.category,
    });
    setIsEditing(false);
    setIsExpanded(false);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-800 rounded-xl border transition-all duration-200 ${
        isOverdue 
          ? 'border-red-500 bg-red-500 bg-opacity-5' 
          : isDueSoon 
          ? 'border-yellow-500 bg-yellow-500 bg-opacity-5'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="p-3 lg:p-4">
        <div className="flex items-start space-x-4">
          {/* Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-500 hover:border-blue-500'
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>

          {/* Conteúdo da tarefa */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-base lg:text-lg font-semibold transition-all duration-200 ${
                  task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-white'
                }`}>
                  {task.name}
                </h3>
                
                {task.description && (
                  <p className={`mt-1 text-sm transition-all duration-200 ${
                    task.completed ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {task.description}
                  </p>
                )}

                {/* Metadados */}
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-2 lg:mt-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(taskDateTime, 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{format(taskDateTime, 'HH:mm', { locale: ptBR })}</span>
                  </div>

                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </div>

                  {task.category && (
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Tag className="w-4 h-4" />
                      <span>{task.category}</span>
                    </div>
                  )}
                </div>

                {/* Alertas */}
                {isOverdue && !task.completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-1 mt-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Tarefa vencida!</span>
                  </motion.div>
                )}

                {isDueSoon && !task.completed && !isOverdue && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-1 mt-2 text-yellow-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Vencendo em breve!</span>
                  </motion.div>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEdit}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700 p-4 bg-gray-900 bg-opacity-50"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">
              Tem certeza que deseja excluir esta tarefa?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Formulário de edição */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700 p-4 bg-gray-900 bg-opacity-50"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome da Tarefa *
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleEditInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o nome da tarefa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={editData.description}
                onChange={(e) => handleEditInputChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Descreva a tarefa (opcional)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => handleEditInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horário *
                </label>
                <input
                  type="time"
                  value={editData.dueTime}
                  onChange={(e) => handleEditInputChange('dueTime', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prioridade
                </label>
                <select
                  value={editData.priority}
                  onChange={(e) => handleEditInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) => handleEditInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Trabalho, Pessoal"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Salvar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
