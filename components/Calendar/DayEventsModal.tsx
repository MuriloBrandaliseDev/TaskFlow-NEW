'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Users, Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent, Appointment, Task } from '@/types/task';

interface DayEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: CalendarEvent[];
  appointments: Appointment[];
  tasks: Task[];
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
}

export default function DayEventsModal({
  isOpen,
  onClose,
  date,
  events,
  appointments,
  tasks,
  onEditAppointment,
  onDeleteAppointment
}: DayEventsModalProps) {
  if (!date) return null;

  const getEventIcon = (event: CalendarEvent) => {
    if (event.type === 'task') {
      return event.isCompleted ? (
        <CheckSquare className="w-4 h-4 text-green-400" />
      ) : (
        <AlertCircle className="w-4 h-4 text-yellow-400" />
      );
    }
    return <Calendar className="w-4 h-4 text-blue-400" />;
  };

  const getEventDetails = (event: CalendarEvent) => {
    if (event.type === 'task') {
      const task = tasks.find(t => t.id === event.id);
      return {
        description: task?.description || '',
        priority: task?.priority || 'medium',
        category: task?.category || ''
      };
    } else {
      const appointment = appointments.find(a => a.id === event.id);
      return {
        description: appointment?.description || '',
        location: appointment?.location || '',
        attendees: appointment?.attendees || [],
        type: appointment?.type || 'event'
      };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'text-blue-400';
      case 'call': return 'text-green-400';
      case 'event': return 'text-purple-400';
      case 'reminder': return 'text-orange-400';
      case 'deadline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {format(date, 'dd \'de\' MMMM', { locale: ptBR })}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {format(date, 'EEEE', { locale: ptBR })} • {events.length} evento{events.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Nenhum evento</h3>
                  <p className="text-gray-400 text-sm">
                    Nenhum evento agendado para este dia.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((event, index) => {
                      const details = getEventDetails(event);
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-700 rounded-lg p-4 border-l-4"
                          style={{ borderLeftColor: event.color }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getEventIcon(event)}
                                <h3 className={`font-medium ${event.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                                  {event.title}
                                </h3>
                                {event.type === 'task' && details.priority && (
                                  <span className={`text-xs px-2 py-1 rounded-full bg-gray-600 ${getPriorityColor(details.priority)}`}>
                                    {details.priority === 'high' ? 'Alta' : details.priority === 'medium' ? 'Média' : 'Baixa'}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{event.time}</span>
                                </div>
                                
                                {event.type === 'appointment' && details.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{details.location}</span>
                                  </div>
                                )}
                                
                                {event.type === 'appointment' && details.attendees && details.attendees.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-3 h-3" />
                                    <span>{details.attendees.length} participante{details.attendees.length !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                              </div>
                              
                              {details.description && (
                                <p className="text-sm text-gray-300 mb-2">
                                  {details.description}
                                </p>
                              )}
                              
                              {event.type === 'appointment' && details.type && (
                                <span className={`text-xs px-2 py-1 rounded-full bg-gray-600 ${getAppointmentTypeColor(details.type)}`}>
                                  {details.type === 'meeting' ? 'Reunião' : 
                                   details.type === 'call' ? 'Ligação' :
                                   details.type === 'event' ? 'Evento' :
                                   details.type === 'reminder' ? 'Lembrete' : 'Prazo'}
                                </span>
                              )}
                            </div>
                            
                            {/* Botões de ação para compromissos */}
                            {event.type === 'appointment' && onEditAppointment && onDeleteAppointment && (
                              <div className="flex space-x-1 ml-2">
                                <button
                                  onClick={() => {
                                    const appointment = appointments.find(a => a.id === event.id);
                                    if (appointment) onEditAppointment(appointment);
                                  }}
                                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                                  title="Editar"
                                >
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => onDeleteAppointment(event.id)}
                                  className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                                  title="Excluir"
                                >
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
