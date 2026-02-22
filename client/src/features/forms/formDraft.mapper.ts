import type { DraftForm } from "./formDraft.types";
import type { QuestionInput, QuestionOptionInput } from "../../shared/api/generated";
import { QuestionType } from "../../shared/api/generated";

export const mapDraftToCreateFormVariables = (draft: DraftForm): {
  title: string;
  description?: string;
  questions: QuestionInput[];
} => {
  const questions: QuestionInput[] = draft.questions.map((q) => {
    const optionsAllowed =
      q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX;

    const options: QuestionOptionInput[] | undefined = optionsAllowed
      ? q.options.map((o) => ({ id: o.id, label: o.label }))
      : undefined;

    return {
      id: q.id,
      title: q.title,
      type: q.type,
      required: q.required,
      options,
    };
  });

  return {
    title: draft.title,
    description: draft.description.trim() ? draft.description : undefined,
    questions,
  };
};