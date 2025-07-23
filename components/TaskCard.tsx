'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { AIService } from '@/lib/ai-service';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'ri-alarm-warning-line';
      case 'medium': return 'ri-time-line';
      case 'low': return 'ri-leaf-line';
      default: return 'ri-circle-line';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return 'ri-briefcase-line';
      case 'personal': return 'ri-user-line';
      case 'meetings': return 'ri-team-line';
      case 'shopping': return 'ri-shopping-cart-line';
      case 'health': return 'ri-heart-line';
      case 'finance': return 'ri-money-dollar-circle-line';
      case 'education': return 'ri-book-line';
      default: return 'ri-folder-line';
    }
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
  const smartReminder = task.dueDate ? AIService.generateSmartReminder(task) : '';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''} ${
      task.priority === 'high' ? 'task-priority-high' : 
      task.priority === 'medium' ? 'task-priority-medium' : 
      task.priority === 'low' ? 'task-priority-low' : ''
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onToggle(task.id)}
              className={`mt-1 w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {task.completed && <i className="ri-check-line text-xs"></i>}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <div className={`w-4 h-4 flex items-center justify-center ${getPriorityColor(task.priority)}`}>
                    <i className={getPriorityIcon(task.priority)}></i>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <i className={getCategoryIcon(task.category)}></i>
                  </div>
                </div>
              </div>

              {task.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {task.dueDate && (
                  <span className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                    <i className="ri-calendar-line"></i>
                    <span>{format(task.dueDate, 'MMM d, yyyy h:mm a')}</span>
                    {isOverdue && <i className="ri-alarm-warning-line"></i>}
                  </span>
                )}
                
                {task.reminder && (
                  <span className="flex items-center space-x-1">
                    <i className="ri-notification-line"></i>
                    <span>{format(task.reminder, 'MMM d, h:mm a')}</span>
                  </span>
                )}

                <span className="flex items-center space-x-1">
                  <i className="ri-folder-line"></i>
                  <span className="capitalize">{task.category}</span>
                </span>
              </div>

              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {smartReminder && task.dueDate && (
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <i className="ri-robot-line mr-1"></i>
                  {smartReminder}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={showDetails ? 'ri-eye-close-line' : 'ri-eye-line'}></i>
              </div>
            </button>
            
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-edit-line"></i>
              </div>
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-delete-bin-line"></i>
              </div>
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(task.createdAt, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Updated:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(task.updatedAt, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full">
              <i className="ri-delete-bin-line text-red-600 dark:text-red-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Delete Task
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}