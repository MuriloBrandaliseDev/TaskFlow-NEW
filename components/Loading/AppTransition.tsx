'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AppTransitionProps {
  children: ReactNode;
  isLoading: boolean;
}

export default function AppTransition({ children, isLoading }: AppTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {/* Loading será renderizado aqui */}
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring',
            stiffness: 100,
            damping: 20
          }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
