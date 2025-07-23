'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import TaskCard from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function CalendarView({ tasks, onToggleTask, onEditTask, onDeleteTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(task.dueDate, date)
    );
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Calendar View
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your tasks across time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Calendar Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToToday}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer whitespace-nowrap"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-left-s-line"></i>
                      </div>
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-right-s-line"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* Week Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {day}
                      </span>
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {calendarDays.map(day => {
                    const dayTasks = getTasksForDate(day);
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                      <div
                        key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={`bg-white dark:bg-gray-800 p-2 min-h-[100px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            isTodayDate 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {format(day, 'd')}
                          </span>
                          {dayTasks.length > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {dayTasks.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map(task => (
                            <div
                              key={task.id}
                              className={`text-xs p-1 rounded truncate ${
                                task.completed 
                                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 line-through' 
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              }`}
                              title={task.title}
                            >
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                <span className="truncate">{task.title}</span>
                              </div>
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
                {selectedDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <div className="p-6">
                {selectedDate ? (
                  selectedDateTasks.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {selectedDateTasks.map(task => (
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
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500">
                        <i className="ri-calendar-check-line text-4xl"></i>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tasks scheduled for this date
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500">
                      <i className="ri-calendar-line text-4xl"></i>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click on a date to view tasks
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                This Month
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {tasks.filter(task => 
                      task.dueDate && 
                      task.dueDate.getMonth() === currentDate.getMonth() &&
                      task.dueDate.getFullYear() === currentDate.getFullYear()
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {tasks.filter(task => 
                      task.completed &&
                      task.dueDate && 
                      task.dueDate.getMonth() === currentDate.getMonth() &&
                      task.dueDate.getFullYear() === currentDate.getFullYear()
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {tasks.filter(task => 
                      !task.completed &&
                      task.dueDate && 
                      task.dueDate.getMonth() === currentDate.getMonth() &&
                      task.dueDate.getFullYear() === currentDate.getFullYear()
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overdue</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {tasks.filter(task => 
                      !task.completed &&
                      task.dueDate && 
                      task.dueDate < new Date() &&
                      task.dueDate.getMonth() === currentDate.getMonth() &&
                      task.dueDate.getFullYear() === currentDate.getFullYear()
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}