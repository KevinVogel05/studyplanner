import { Feedback } from './feedback.interface';

export interface Task {
  docId?: string;
  courseId: string;
  title: string;
  description: string;
  priority: string;
  date: Date;
  active: boolean;
  completed: string[];
  feedback: Feedback[];
}
