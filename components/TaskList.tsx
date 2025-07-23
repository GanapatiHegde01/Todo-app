'use client';

import { useState, useMemo } from 'react';
import { Task, FilterType } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ 
  tasks, 
  currentFilter, 
  onFilterChange, 
  onToggleTask, 
  onEditTask, 
  onDeleteTask 
}: TaskListProps) {
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (currentFilter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && task.dueDate < now
        );
        break;
      case 'today':
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && 
          task.dueDate >= today && task.dueDate < tomorrow
        );
        break;
      case 'upcoming':
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && task.dueDate >= tomorrow
        );
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? a.dueDate.getTime() : Infinity;
          bValue = b.dueDate ? b.dueDate.getTime() : Infinity;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'created':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tasks, currentFilter, searchTerm, sortBy, sortOrder]);

  const filterOptions = [
    { value: 'all', label: 'All Tasks', count: tasks.length },
    { value: 'pending', label: 'Pending', count: tasks.filter(t => !t.completed).length },
    { value: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length },
    { value: 'overdue', label: 'Overdue', count: tasks.filter(t => !t.completed && t.dueDate && t.dueDate < new Date()).length },
    { value: 'today', label: 'Due Today', count: tasks.filter(t => {
      const today = new Date();
      const taskDate = t.dueDate;
      return !t.completed && taskDate && taskDate.toDateString() === today.toDateString();
    }).length },
    { value: 'upcoming', label: 'Upcoming', count: tasks.filter(t => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return !t.completed && t.dueDate && t.dueDate >= tomorrow;
    }).length },
  ];

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Task Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage all your tasks efficiently
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400"></i>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Search tasks..."
                />
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Sort by:</span>
                <button
                  onClick={() => handleSortChange('dueDate')}
                  className={`px-3 py-1 rounded-md text-sm cursor-pointer whitespace-nowrap ${
                    sortBy === 'dueDate' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Due Date
                  {sortBy === 'dueDate' && (
                    <i className={`ml-1 ${sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('priority')}
                  className={`px-3 py-1 rounded-md text-sm cursor-pointer whitespace-nowrap ${
                    sortBy === 'priority' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Priority
                  {sortBy === 'priority' && (
                    <i className={`ml-1 ${sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('created')}
                  className={`px-3 py-1 rounded-md text-sm cursor-pointer whitespace-nowrap ${
                    sortBy === 'created' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Created
                  {sortBy === 'created' && (
                    <i className={`ml-1 ${sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value as FilterType)}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                  currentFilter === option.value
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
                <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentFilter === 'all' ? 'All Tasks' : 
                 filterOptions.find(f => f.value === currentFilter)?.label || 'Tasks'}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
                  <i className="ri-task-line text-6xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first task to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}