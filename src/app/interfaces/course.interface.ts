export interface Course {
  courseId: string;
  courseName: string;
  ownerId: string;
  ownerName: string;
  description?: string;
  link: string;
  subscribers: string[];
  subCount: number;
  docId?: string;
}
