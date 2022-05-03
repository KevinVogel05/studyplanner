export interface Feedback {
  userId: string;
  skipped: boolean;

  learn?: string;
  difficulty?: string;
  time?: string;
  type?: string;
  relevance?: string;
  message?: string;
}
