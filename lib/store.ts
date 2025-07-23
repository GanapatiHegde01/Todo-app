
'use client';

import { Task, TaskStats, Theme, ViewMode, FilterType } from './types';

class TaskStore {
  private tasks: Task[] = [];
  private theme: Theme = 'light';
  private viewMode: ViewMode = 'dashboard';
  private currentFilter: FilterType = 'all';
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromLocalStorage();
      this.applyTheme();
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
    this.saveToLocalStorage();
    this.applyTheme();
  }

  private applyTheme() {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (this.theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }

  private loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('ai-todo-tasks');
      if (saved) {
        this.tasks = JSON.parse(saved).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          reminder: task.reminder ? new Date(task.reminder) : undefined,
        }));
      }

      const theme = localStorage.getItem('ai-todo-theme') as Theme;
      if (theme) {
        this.theme = theme;
      }

      const viewMode = localStorage.getItem('ai-todo-view') as ViewMode;
      if (viewMode) this.viewMode = viewMode;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('ai-todo-tasks', JSON.stringify(this.tasks));
      localStorage.setItem('ai-todo-theme', this.theme);
      localStorage.setItem('ai-todo-view', this.viewMode);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getFilteredTasks(): Task[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (this.currentFilter) {
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      case 'overdue':
        return this.tasks.filter(task =>
          !task.completed && task.dueDate && task.dueDate < now
        );
      case 'today':
        return this.tasks.filter(task =>
          !task.completed && task.dueDate &&
          task.dueDate >= today && task.dueDate < tomorrow
        );
      case 'upcoming':
        return this.tasks.filter(task =>
          !task.completed && task.dueDate && task.dueDate >= tomorrow
        );
      default:
        return this.tasks;
    }
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    this.notify();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.notify();
    return true;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    this.notify();
    return true;
  }

  toggleTask(id: string): boolean {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return false;

    return this.updateTask(id, { completed: !task.completed });
  }

  getTaskStats(): TaskStats {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      total: this.tasks.length,
      completed: this.tasks.filter(task => task.completed).length,
      pending: this.tasks.filter(task => !task.completed).length,
      overdue: this.tasks.filter(task =>
        !task.completed && task.dueDate && task.dueDate < now
      ).length,
      today: this.tasks.filter(task =>
        !task.completed && task.dueDate &&
        task.dueDate >= today && task.dueDate < tomorrow
      ).length,
      upcoming: this.tasks.filter(task =>
        !task.completed && task.dueDate && task.dueDate >= tomorrow
      ).length,
    };
  }

  getTheme(): Theme {
    return this.theme;
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    this.applyTheme();
    this.notify();
  }

  getViewMode(): ViewMode {
    return this.viewMode;
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    this.notify();
  }

  getCurrentFilter(): FilterType {
    return this.currentFilter;
  }

  setCurrentFilter(filter: FilterType) {
    this.currentFilter = filter;
    this.notify();
  }
}

export const taskStore = new TaskStore();
