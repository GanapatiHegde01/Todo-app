
'use client';

import { useState, useEffect } from 'react';
import { Task, ViewMode, Theme } from '@/lib/types';
import { taskStore } from '@/lib/store';
import { AIService } from '@/lib/ai-service';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import TaskList from '@/components/TaskList';
import CalendarView from '@/components/CalendarView';
import TaskForm from '@/components/TaskForm';
import FloatingActionButton from '@/components/FloatingActionButton';
import NotificationSystem from '@/components/NotificationSystem';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [theme, setTheme] = useState<Theme>('light');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentFilter, setCurrentFilter] = useState(taskStore.getCurrentFilter());
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const unsubscribe = taskStore.subscribe(() => {
      setTasks(taskStore.getTasks());
      setViewMode(taskStore.getViewMode());
      setTheme(taskStore.getTheme());
      setCurrentFilter(taskStore.getCurrentFilter());
    });

    // Initial load
    setTasks(taskStore.getTasks());
    setViewMode(taskStore.getViewMode());
    setTheme(taskStore.getTheme());
    setCurrentFilter(taskStore.getCurrentFilter());

    return unsubscribe;
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    taskStore.addTask(taskData);
    setShowTaskForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      taskStore.updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowTaskForm(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    taskStore.deleteTask(id);
  };

  const handleToggleTask = (id: string) => {
    taskStore.toggleTask(id);
  };

  const handleViewChange = (mode: ViewMode) => {
    taskStore.setViewMode(mode);
  };

  const handleThemeToggle = () => {
    taskStore.setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleFilterChange = (filter: any) => {
    taskStore.setCurrentFilter(filter);
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const parsedTask = AIService.parseNaturalLanguage(transcript);
      
      const newTask = {
        title: parsedTask.title || transcript,
        description: '',
        priority: parsedTask.priority || 'medium',
        category: parsedTask.category || 'general',
        dueDate: parsedTask.dueDate,
        reminder: undefined,
        tags: parsedTask.tags || [],
        completed: false,
      };

      taskStore.addTask(newTask);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stats = taskStore.getTaskStats();
  const filteredTasks = taskStore.getFilteredTasks();

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            stats={stats}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'list':
        return (
          <TaskList
            tasks={filteredTasks}
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        currentView={viewMode}
        theme={theme}
        onViewChange={handleViewChange}
        onThemeToggle={handleThemeToggle}
      />

      <main className="relative">
        {renderCurrentView()}
      </main>

      <FloatingActionButton
        onAddTask={() => setShowTaskForm(true)}
        onVoiceInput={handleVoiceInput}
      />

      <div className="fixed top-4 right-4 z-50">
        <NotificationSystem tasks={tasks} />
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          initialTask={editingTask || undefined}
          isEditing={!!editingTask}
        />
      )}

      {isListening && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400">
              <i className="ri-mic-fill text-6xl animate-pulse"></i>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Listening...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Speak your task naturally
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
