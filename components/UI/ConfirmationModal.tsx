'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmationModalProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
          iconBg: 'bg-red-500 bg-opacity-20'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          iconBg: 'bg-yellow-500 bg-opacity-20'
        };
      case 'info':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-blue-500" />,
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          iconBg: 'bg-blue-500 bg-opacity-20'
        };
      default:
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
          iconBg: 'bg-red-500 bg-opacity-20'
        };
    }
  };

  const styles = getTypeStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

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
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                  {styles.icon}
                </div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Message */}
            <div className="mb-8">
              <p className="text-gray-300 leading-relaxed">{message}</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${styles.confirmButton}`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
