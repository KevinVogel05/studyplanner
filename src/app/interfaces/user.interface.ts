import { PersonalTask } from './personalTask.interface';
export interface User {
  id: string;
  email: string;
  role: string;
  docId?: string;
  courses: { courseId: string; color: string }[];
  // coursesId?: string[];
}
