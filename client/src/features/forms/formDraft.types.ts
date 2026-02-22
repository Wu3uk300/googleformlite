import type { QuestionType } from "../../shared/api/generated";

export type DraftOption = {
  id: string;
  label: string;
};

export type DraftQuestion = {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: DraftOption[]; 
};

export type DraftForm = {
  title: string;
  description: string;
  questions: DraftQuestion[];
};