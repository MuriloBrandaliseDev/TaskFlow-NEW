'use client';

import { motion } from 'framer-motion';
import { User, Shield, Smartphone, Monitor } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';

export default function UserInfo() {
  const { user } = useTaskStore();

  if (!user) return null;

  const getDeviceIcon = () => {
    return user.deviceName.includes('Móvel') ? (
      <Smartphone className="w-4 h-4" />
    ) : (
      <Monitor className="w-4 h-4" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-medium">Usuário Atual</h3>
          <p className="text-xs text-gray-400">Dados isolados por dispositivo</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <span className="text-sm text-gray-300">Dispositivo:</span>
          </div>
          <span className="text-sm text-white font-medium">{user.deviceName}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">ID:</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">{user.id}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Criado em:</span>
          <span className="text-xs text-gray-400">
            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-green-400">Dados seguros e isolados</span>
        </div>
      </div>
    </motion.div>
  );
}
