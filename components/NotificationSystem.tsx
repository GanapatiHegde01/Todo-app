'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';

interface NotificationSystemProps {
  tasks: Task[];
}

interface Notification {
  id: string;
  type: 'reminder' | 'overdue' | 'completed';
  title: string;
  message: string;
  task: Task;
  timestamp: Date;
}

export default function NotificationSystem({ tasks }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const newNotifications: Notification[] = [];

      tasks.forEach(task => {
        if (task.completed) return;

        // Check for reminders
        if (task.reminder && task.reminder <= now) {
          const existingReminder = notifications.find(n => 
            n.task.id === task.id && n.type === 'reminder'
          );
          
          if (!existingReminder) {
            newNotifications.push({
              id: `reminder-${task.id}`,
              type: 'reminder',
              title: 'Task Reminder',
              message: `Don't forget: ${task.title}`,
              task,
              timestamp: now
            });
          }
        }

        // Check for overdue tasks
        if (task.dueDate && task.dueDate < now) {
          const existingOverdue = notifications.find(n => 
            n.task.id === task.id && n.type === 'overdue'
          );
          
          if (!existingOverdue) {
            newNotifications.push({
              id: `overdue-${task.id}`,
              type: 'overdue',
              title: 'Task Overdue',
              message: `Task "${task.title}" is overdue`,
              task,
              timestamp: now
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
        
        // Show browser notifications if permission granted
        if (Notification.permission === 'granted') {
          newNotifications.forEach(notification => {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.id
            });
          });
        }
      }
    };

    // Check immediately
    checkNotifications();
    
    // Check every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [tasks, notifications]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return 'ri-notification-line';
      case 'overdue': return 'ri-alarm-warning-line';
      case 'completed': return 'ri-checkbox-circle-line';
      default: return 'ri-information-line';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'text-blue-600 dark:text-blue-400';
      case 'overdue': return 'text-red-600 dark:text-red-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-notification-line"></i>
        </div>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 ${getNotificationColor(notification.type)}`}>
                          <i className={getNotificationIcon(notification.type)}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-close-line"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500">
                  <i className="ri-notification-off-line text-4xl"></i>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}