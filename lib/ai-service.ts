'use client';

import { Task, AIResponse } from './types';

export class AIService {
  static parseNaturalLanguage(input: string): Partial<Task> {
    const now = new Date();
    const task: Partial<Task> = {
      title: input,
      category: 'general',
      priority: 'medium',
      tags: [],
    };

    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('high priority') || lowerInput.includes('urgent') || lowerInput.includes('asap')) {
      task.priority = 'high';
    } else if (lowerInput.includes('low priority') || lowerInput.includes('when possible')) {
      task.priority = 'low';
    }

    const timeRegex = /(\d{1,2}):(\d{2})(?:\s*(am|pm))?/i;
    const dateRegex = /(today|tomorrow|next week|(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2}))/i;
    
    const timeMatch = input.match(timeRegex);
    const dateMatch = input.match(dateRegex);

    if (dateMatch) {
      const dateStr = dateMatch[1];
      let dueDate = new Date();
      
      if (dateStr === 'today') {
        dueDate = new Date();
      } else if (dateStr === 'tomorrow') {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1);
      } else if (dateStr === 'next week') {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
      } else {
        dueDate = new Date(dateStr);
      }

      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3];

        if (ampm && ampm.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
        } else if (ampm && ampm.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }

        dueDate.setHours(hours, minutes, 0, 0);
      }

      task.dueDate = dueDate;
    }

    if (lowerInput.includes('meeting') || lowerInput.includes('call')) {
      task.category = 'meetings';
    } else if (lowerInput.includes('buy') || lowerInput.includes('purchase') || lowerInput.includes('shop')) {
      task.category = 'shopping';
    } else if (lowerInput.includes('work') || lowerInput.includes('project')) {
      task.category = 'work';
    } else if (lowerInput.includes('personal') || lowerInput.includes('home')) {
      task.category = 'personal';
    }

    const cleanTitle = input
      .replace(/\s*(today|tomorrow|next week|at \d{1,2}:\d{2}(?:\s*(?:am|pm))?|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\s*/gi, '')
      .replace(/\s*(high priority|low priority|urgent|asap|when possible)\s*/gi, '')
      .trim();

    if (cleanTitle) {
      task.title = cleanTitle;
    }

    return task;
  }

  static suggestOptimalScheduling(tasks: Task[]): AIResponse {
    const now = new Date();
    const pendingTasks = tasks.filter(task => !task.completed);
    const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
    const overdueTasks = pendingTasks.filter(task => task.dueDate && task.dueDate < now);

    if (overdueTasks.length > 0) {
      return {
        suggestion: `You have ${overdueTasks.length} overdue task(s). Consider prioritizing these first.`,
        scheduling: {
          suggestedTime: now,
          reason: 'Overdue tasks should be completed immediately'
        }
      };
    }

    if (highPriorityTasks.length > 0) {
      return {
        suggestion: `Focus on ${highPriorityTasks.length} high priority task(s) first.`,
        scheduling: {
          suggestedTime: now,
          reason: 'High priority tasks require immediate attention'
        }
      };
    }

    const todayTasks = pendingTasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date();
      return task.dueDate.toDateString() === today.toDateString();
    });

    if (todayTasks.length > 0) {
      return {
        suggestion: `You have ${todayTasks.length} task(s) due today. Plan your day accordingly.`,
        scheduling: {
          suggestedTime: now,
          reason: 'Tasks due today should be completed soon'
        }
      };
    }

    return {
      suggestion: 'Great job! You\'re on top of your tasks. Consider planning ahead for upcoming deadlines.',
      scheduling: {
        suggestedTime: now,
        reason: 'Maintain current productivity'
      }
    };
  }

  static generateSmartReminder(task: Task): string {
    const now = new Date();
    const dueDate = task.dueDate;

    if (!dueDate) {
      return 'No due date set for this task.';
    }

    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

    if (hoursDiff <= 0) {
      return 'This task is overdue!';
    } else if (hoursDiff <= 1) {
      return 'This task is due within the next hour.';
    } else if (hoursDiff <= 24) {
      return `This task is due in ${hoursDiff} hours.`;
    } else {
      const daysDiff = Math.floor(hoursDiff / 24);
      return `This task is due in ${daysDiff} day(s).`;
    }
  }

  static generateDailySummary(tasks: Task[]): string {
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => !t.completed && t.dueDate && t.dueDate < new Date()).length,
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    let summary = `Daily Summary:\n`;
    summary += `• Total tasks: ${stats.total}\n`;
    summary += `• Completed: ${stats.completed}\n`;
    summary += `• Pending: ${stats.pending}\n`;
    summary += `• Overdue: ${stats.overdue}\n`;
    summary += `• Completion rate: ${completionRate}%\n`;

    if (stats.overdue > 0) {
      summary += `\n⚠️ You have ${stats.overdue} overdue task(s). Consider prioritizing these.`;
    } else if (completionRate >= 80) {
      summary += `\n🎉 Great job! You're doing excellent work.`;
    } else if (completionRate >= 60) {
      summary += `\n👍 Good progress! Keep it up.`;
    } else {
      summary += `\n💪 You can do better! Focus on completing more tasks.`;
    }

    return summary;
  }
}