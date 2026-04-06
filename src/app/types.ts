/** 面談の回答記録 */
export type InterviewRecord = {
  id: string;
  date: string;
  nickname: string;
  contact: string;
  answers: { question: string; answer: string }[];
  report?: string;
};
