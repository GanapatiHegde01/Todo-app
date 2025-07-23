'use client';

import { useState } from 'react';
import { taskStore } from '@/lib/store';
import { ViewMode, Theme } from '@/lib/types';

interface HeaderProps {
  currentView: ViewMode;
  theme: Theme;
  onViewChange: (view: ViewMode) => void;
  onThemeToggle: () => void;
}

export default function Header({ currentView, theme, onViewChange, onThemeToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-blue-600">AI</span> Todo
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex space-x-4">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              <i className="ri-dashboard-line mr-2"></i>
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                currentView === 'list'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              <i className="ri-list-check mr-2"></i>
              Tasks
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                currentView === 'calendar'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              <i className="ri-calendar-line mr-2"></i>
              Calendar
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {theme === 'light' ? (
                  <i className="ri-moon-line"></i>
                ) : (
                  <i className="ri-sun-line"></i>
                )}
              </div>
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={isMenuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
                </div>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => {
                  onViewChange('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <i className="ri-dashboard-line mr-2"></i>
                Dashboard
              </button>
              <button
                onClick={() => {
                  onViewChange('list');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left cursor-pointer ${
                  currentView === 'list'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <i className="ri-list-check mr-2"></i>
                Tasks
              </button>
              <button
                onClick={() => {
                  onViewChange('calendar');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left cursor-pointer ${
                  currentView === 'calendar'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <i className="ri-calendar-line mr-2"></i>
                Calendar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}