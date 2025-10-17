'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTaskStore } from '@/store/taskStore';
import { Appointment, CalendarEvent, Task } from '@/types/task';
import DayEventsModal from './DayEventsModal';

interface CalendarViewProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
}

export default function CalendarView({ onDateClick, onEventClick, onEditAppointment, onDeleteAppointment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const { tasks, appointments } = useTaskStore();

  // Gerar dias do mês
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Função para obter cor da tarefa baseada na prioridade
  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#3b82f6';
    }
  };

  // Adicionar dias vazios no início para alinhar com os dias da semana
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Combinar tarefas e compromissos em eventos do calendário
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Adicionar tarefas
    tasks.forEach(task => {
      events.push({
        id: task.id,
        title: task.name,
        date: task.dueDate,
        time: task.dueTime,
        type: 'task',
        priority: task.priority,
        category: task.category,
        color: getTaskColor(task.priority),
        isCompleted: task.completed,
      });
    });

    // Adicionar compromissos
    appointments.forEach(appointment => {
      events.push({
        id: appointment.id,
        title: appointment.title,
        date: appointment.date,
        time: appointment.startTime,
        type: 'appointment',
        color: appointment.color,
      });
    });

    return events;
  }, [tasks, appointments]);

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDay(date);
    setShowDayModal(true);
    
    // Também chama a função original se existir
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Header do calendário */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Hoje
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const dayEvents = getEventsForDate(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`
                min-h-[80px] p-1 border border-gray-700 rounded-lg cursor-pointer transition-all duration-200
                ${isCurrentMonth ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-900 opacity-50'}
                ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-500 bg-opacity-10' : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex flex-col h-full">
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                  ${isCurrentDay ? 'text-blue-400 font-bold' : ''}
                `}>
                  {format(day, 'd')}
                </div>

                {/* Eventos do dia */}
                <div className="flex-1 space-y-1">
                  <AnimatePresence>
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: eventIndex * 0.05 }}
                        className={`
                          text-xs p-1 rounded transition-all duration-200 group
                          ${event.type === 'task' 
                            ? event.isCompleted 
                              ? 'bg-gray-600 text-gray-400 line-through' 
                              : 'text-white'
                            : 'text-white'
                          }
                        `}
                        style={{ 
                          backgroundColor: event.color + '20',
                          borderLeft: `3px solid ${event.color}`
                        }}
                      >
                        <div 
                          className="truncate cursor-pointer text-xs font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          {event.title}
                        </div>
                        <div className="text-xs opacity-75 hidden sm:block">{event.time}</div>
                        
                        {/* Botões de ação para compromissos */}
                        {event.type === 'appointment' && onEditAppointment && onDeleteAppointment && (
                          <div className="flex space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const appointment = appointments.find(apt => apt.id === event.id);
                                if (appointment) onEditAppointment(appointment);
                              }}
                              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                              title="Editar compromisso"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAppointment(event.id);
                              }}
                              className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                              title="Excluir compromisso"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Indicador de mais eventos */}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-400 text-center">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-300">Alta prioridade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-300">Média prioridade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-300">Baixa prioridade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-300">Compromissos</span>
          </div>
        </div>
      </div>

      {/* Modal de eventos do dia */}
      <DayEventsModal
        isOpen={showDayModal}
        onClose={() => {
          setShowDayModal(false);
          setSelectedDay(null);
        }}
        date={selectedDay}
        events={selectedDay ? getEventsForDate(selectedDay) : []}
        appointments={appointments}
        tasks={tasks}
        onEditAppointment={onEditAppointment}
        onDeleteAppointment={onDeleteAppointment}
      />
    </div>
  );
}
