
export enum Subject {
  ALGEBRA = 'Алгебра',
  HISTORY = 'История',
  RUSSIAN = 'Русский язык',
  IMPORTANT = 'Разговоры о важном',
  CS = 'Информатика',
  ENGLISH_SPEC = 'Английский язык',
  OTHER = 'Другое',
}

export interface Task {
  id: string;
  title: string;
  subject: Subject;
  dueDate: string;
  completed: boolean;
  notes?: string;
  reminderTime?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ScheduleEntry {
  time: string;
  subject: string;
  room?: string;
}

export interface WeeklySchedule {
  [key: string]: ScheduleEntry[];
}

export interface UserProfile {
  grade: string;
  goals: string[];
  name: string;
}

export type View = 'dashboard' | 'planner' | 'tutor' | 'focus' | 'schedule' | 'tips' | 'profile';
