import { Task } from './task.interface';
export interface Course {
  courseId: string;
  courseName: string;
  ownerId: string;
  ownerName: string;
  description?: string;
  link: string;
  subscribers: string[]; //TODO implement it/not opt ----- instead of subCount
  subCount: number;
  docId?: string;
}
