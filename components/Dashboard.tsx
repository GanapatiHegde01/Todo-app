'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStats } from '@/lib/types';
import { AIService } from '@/lib/ai-service';
import TaskCard from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  stats: TaskStats;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function Dashboard({ tasks, stats, onToggleTask, onEditTask, onDeleteTask }: DashboardProps) {
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [dailySummary, setDailySummary] = useState('');

  useEffect(() => {
    const suggestion = AIService.suggestOptimalScheduling(tasks);
    setAiSuggestion(suggestion.suggestion);
    
    const summary = AIService.generateDailySummary(tasks);
    setDailySummary(summary);
  }, [tasks]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks.filter(task => 
    !task.completed && task.dueDate && 
    task.dueDate >= today && task.dueDate < tomorrow
  );

  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && task.dueDate < now
  );

  const upcomingTasks = tasks.filter(task => 
    !task.completed && task.dueDate && task.dueDate >= tomorrow
  ).slice(0, 5);

  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your tasks today.
          </p>
        </div>

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <i className="ri-robot-line text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                  AI Recommendation
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {aiSuggestion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <i className="ri-task-line text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
                <i className="ri-checkbox-circle-line text-green-600 dark:text-green-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.today}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900 rounded-full">
                <i className="ri-calendar-today-line text-orange-600 dark:text-orange-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full">
                <i className="ri-alarm-warning-line text-red-600 dark:text-red-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-600 dark:text-green-400 font-medium">{stats.completed}</div>
                  <div className="text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.pending}</div>
                  <div className="text-gray-600 dark:text-gray-400">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 dark:text-red-400 font-medium">{stats.overdue}</div>
                  <div className="text-gray-600 dark:text-gray-400">Overdue</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Summary
              </h3>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={showSummary ? 'ri-eye-close-line' : 'ri-eye-line'}></i>
                </div>
              </button>
            </div>
            {showSummary && (
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {dailySummary}
              </div>
            )}
          </div>
        </div>

        {/* Task Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="ri-calendar-today-line mr-2 text-orange-600 dark:text-orange-400"></i>
              Due Today ({todayTasks.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <i className="ri-calendar-check-line text-4xl mb-2"></i>
                  <p>No tasks due today</p>
                </div>
              )}
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="ri-alarm-warning-line mr-2 text-red-600 dark:text-red-400"></i>
              Overdue ({overdueTasks.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {overdueTasks.length > 0 ? (
                overdueTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <i className="ri-checkbox-circle-line text-4xl mb-2"></i>
                  <p>No overdue tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="ri-calendar-line mr-2 text-blue-600 dark:text-blue-400"></i>
              Upcoming
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <i className="ri-calendar-event-line text-4xl mb-2"></i>
                  <p>No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="ri-time-line mr-2 text-purple-600 dark:text-purple-400"></i>
              Recent Tasks
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentTasks.length > 0 ? (
                recentTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <i className="ri-add-circle-line text-4xl mb-2"></i>
                  <p>No recent tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}