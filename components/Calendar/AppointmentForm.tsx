'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, Repeat, Type } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/task';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onSave: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingAppointment?: Appointment | null;
}

export default function AppointmentForm({ isOpen, onClose, selectedDate, onSave, editingAppointment }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    startTime: '',
    endTime: '',
    type: 'meeting' as 'meeting' | 'call' | 'event' | 'reminder' | 'deadline',
    location: '',
    attendees: '',
    isRecurring: false,
    recurringPattern: 'weekly' as 'daily' | 'weekly' | 'monthly',
    color: '#3b82f6',
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description,
        date: editingAppointment.date,
        startTime: editingAppointment.startTime,
        endTime: editingAppointment.endTime,
        type: editingAppointment.type,
        location: editingAppointment.location || '',
        attendees: editingAppointment.attendees?.join(', ') || '',
        isRecurring: editingAppointment.isRecurring,
        recurringPattern: editingAppointment.recurringPattern || 'weekly',
        color: editingAppointment.color,
      });
    } else {
      // Resetar formulário para novo compromisso
      setFormData({
        title: '',
        description: '',
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        startTime: '',
        endTime: '',
        type: 'meeting',
        location: '',
        attendees: '',
        isRecurring: false,
        recurringPattern: 'weekly',
        color: '#3b82f6',
      });
    }
  }, [editingAppointment, selectedDate]);

  const appointmentTypes = [
    { value: 'meeting', label: 'Reunião', icon: '👥', color: '#3b82f6' },
    { value: 'call', label: 'Ligação', icon: '📞', color: '#10b981' },
    { value: 'event', label: 'Evento', icon: '🎉', color: '#f59e0b' },
    { value: 'reminder', label: 'Lembrete', icon: '⏰', color: '#8b5cf6' },
    { value: 'deadline', label: 'Prazo', icon: '📅', color: '#ef4444' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date || !formData.startTime) {
      return;
    }

    const appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || formData.startTime,
      type: formData.type,
      location: formData.location.trim() || undefined,
      attendees: formData.attendees ? formData.attendees.split(',').map(a => a.trim()) : undefined,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined,
      color: appointmentTypes.find(t => t.value === formData.type)?.color || '#3b82f6',
    };

    onSave(appointment);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      startTime: '',
      endTime: '',
      type: 'meeting',
      location: '',
      attendees: '',
      isRecurring: false,
      recurringPattern: 'weekly',
      color: '#3b82f6',
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedType = appointmentTypes.find(t => t.value === formData.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedType?.color }}
                >
                  <span className="text-lg">{selectedType?.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingAppointment ? 'Editar Compromisso' : 'Novo Compromisso'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Agendar compromisso'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Reunião com cliente"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Detalhes do compromisso (opcional)"
                  rows={3}
                />
              </div>

              {/* Data e horários */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Início *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fim
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de compromisso */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Compromisso
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {appointmentTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-xs text-gray-300">{type.label}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Localização
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Sala de reuniões, Online, Endereço"
                  />
                </div>
              </div>

              {/* Participantes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Participantes
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => handleInputChange('attendees', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: joao@email.com, maria@email.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Separe os emails por vírgula
                </p>
              </div>

              {/* Recorrência */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Repeat className="w-5 h-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-300">
                    Compromisso recorrente
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                    className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                  />
                </div>

                {formData.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Repetir
                    </label>
                    <select
                      value={formData.recurringPattern}
                      onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="monthly">Mensalmente</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Agendar
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
