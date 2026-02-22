import { QuestionType } from "../../shared/api/generated";
import type { DraftForm, DraftQuestion, DraftOption } from "./formDraft.types";

const id = (): string => crypto.randomUUID();

export const createEmptyDraftForm = (): DraftForm => ({
  title: "",
  description: "",
  questions: [],
});

export const createDraftQuestion = (type: QuestionType): DraftQuestion => ({
  id: id(),
  title: "Новый вопрос",
  type,
  required: false,
  options: type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.CHECKBOX
    ? [createDraftOption(), createDraftOption()]
    : [],
});

export const createDraftOption = (): DraftOption => ({
  id: id(),
  label: "Вариант",
});