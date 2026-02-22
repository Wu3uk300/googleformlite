import { QuestionType } from "./enums";

export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  title: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
};

export type Form = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string; 
};