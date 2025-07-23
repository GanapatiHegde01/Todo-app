export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  reminder?: Date;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  suggestion: string;
  parsedTask?: Partial<Task>;
  scheduling?: {
    suggestedTime: Date;
    reason: string;
  };
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  today: number;
  upcoming: number;
}

export type ViewMode = 'dashboard' | 'calendar' | 'list';
export type Theme = 'light' | 'dark';
export type FilterType = 'all' | 'completed' | 'pending' | 'overdue' | 'today' | 'upcoming';