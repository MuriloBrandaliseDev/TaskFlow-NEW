'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

interface ResponsiveLayoutProps {
  children: ReactNode;
  onNewTaskClick?: () => void;
  onNotificationClick?: () => void;
}

export default function ResponsiveLayout({ children, onNewTaskClick, onNotificationClick }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex">
          <div className="w-80 bg-gray-900 border-r border-gray-700"></div>
          <main className="flex-1 ml-80">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <MobileHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          onNewTaskClick={onNewTaskClick}
          onNotificationClick={onNotificationClick}
        />
        
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="h-full w-80 bg-gray-900 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-20 pb-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <Sidebar />
      <main className="flex-1 ml-80 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
