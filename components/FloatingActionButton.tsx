'use client';

import { useState } from 'react';

interface FloatingActionButtonProps {
  onAddTask: () => void;
  onVoiceInput: () => void;
}

export default function FloatingActionButton({ onAddTask, onVoiceInput }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: 'ri-add-line',
      label: 'Add Task',
      onClick: () => {
        onAddTask();
        setIsOpen(false);
      },
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: 'ri-mic-line',
      label: 'Voice Input',
      onClick: () => {
        onVoiceInput();
        setIsOpen(false);
      },
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action buttons */}
      <div className={`mb-4 space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        {actions.map((action, index) => (
          <div key={index} className="flex items-center justify-end">
            <span className="mr-3 px-2 py-1 bg-gray-900 text-white text-sm rounded-md shadow-lg whitespace-nowrap">
              {action.label}
            </span>
            <button
              onClick={action.onClick}
              className={`w-12 h-12 rounded-full text-white shadow-lg transition-all duration-200 cursor-pointer ${action.color}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <i className={`${action.icon} text-xl`}></i>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 cursor-pointer ${isOpen ? 'rotate-45' : ''}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <i className="ri-add-line text-2xl"></i>
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}