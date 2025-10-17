'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveLayout from '@/components/Layout/ResponsiveLayout';
import CalendarView from '@/components/Calendar/CalendarView';
import AppointmentForm from '@/components/Calendar/AppointmentForm';
import ConfirmationModal from '@/components/UI/ConfirmationModal';
import { Appointment, CalendarEvent } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';

export default function CalendarPage() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useTaskStore();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAppointmentForm(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    // TODO: Implementar modal de detalhes do evento
  };

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, appointmentData);
      setEditingAppointment(null);
    } else {
      addAppointment(appointmentData);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setSelectedDate(new Date(appointment.date));
    setShowAppointmentForm(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointment(appointmentToDelete);
      setAppointmentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setAppointmentToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <ResponsiveLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Calendário
              </h1>
              <p className="text-gray-300">
                Gerencie seus compromissos e visualize suas tarefas
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAppointmentForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200"
            >
              <span>+</span>
              <span>Novo Compromisso</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Calendário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CalendarView
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </motion.div>

        {/* Estatísticas rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Compromissos</h3>
                <p className="text-2xl font-bold text-blue-400">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Este Mês</h3>
                <p className="text-2xl font-bold text-green-400">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    const now = new Date();
                    return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Recorrentes</h3>
                <p className="text-2xl font-bold text-purple-400">
                  {appointments.filter(apt => apt.isRecurring).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulário de compromisso */}
        <AppointmentForm
          isOpen={showAppointmentForm}
          onClose={() => {
            setShowAppointmentForm(false);
            setSelectedDate(undefined);
            setEditingAppointment(null);
          }}
          selectedDate={selectedDate}
          onSave={handleSaveAppointment}
          editingAppointment={editingAppointment}
        />

        {/* Modal de confirmação de exclusão */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Excluir Compromisso"
          message="Tem certeza que deseja excluir este compromisso? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </ResponsiveLayout>
  );
}
