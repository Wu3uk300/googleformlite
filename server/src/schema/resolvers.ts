import { GraphQLScalarType, Kind } from "graphql";
import type { Answer, Form, FormResponse, Question, QuestionOption } from "@app/shared";
import { QuestionType } from "@app/shared";

import { db } from "../store/inMemoryStore";
import { makeId } from "../utils/id";

type QuestionInput = {
  id?: string;
  title: string;
  type: QuestionType;
  options?: Array<{ id?: string; label: string }>;
  required?: boolean;
};

type AnswerInput = {
  questionId: string;
  value: string | string[];
};

const AnswerValueScalar = new GraphQLScalarType({
  name: "AnswerValue",
  description: "string or string[]",
  serialize(value: unknown): string | string[] {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value as string[];
    throw new Error("AnswerValue must be string or string[]");
  },
  parseValue(value: unknown): string | string[] {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value as string[];
    throw new Error("AnswerValue must be string or string[]");
  },
  parseLiteral(ast): string | string[] {
    if (ast.kind === Kind.STRING) return ast.value;
    if (ast.kind === Kind.LIST) {
      if (ast.values.every((v) => v.kind === Kind.STRING)) {
        return ast.values.map((v) => (v.kind === Kind.STRING ? v.value : ""));
      }
    }
    throw new Error("AnswerValue literal must be string or [string]");
  },
});

const normalizeQuestions = (inputs: QuestionInput[] | undefined): Question[] => {
  if (!inputs || inputs.length === 0) return [];

  return inputs.map((q) => {
    const base: Question = {
      id: q.id ?? makeId(),
      title: q.title,
      type: q.type,
      required: q.required ?? false,
    };

    const needsOptions =
      q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX;

    if (!needsOptions) return base;

    const opts: QuestionOption[] = (q.options ?? []).map((o) => ({
      id: o.id ?? makeId(),
      label: o.label,
    }));

    return { ...base, options: opts };
  });
};

const validateAnswers = (form: Form, answers: Answer[]): void => {
  const questionsById = new Map(form.questions.map((q) => [q.id, q]));

  for (const ans of answers) {
    const q = questionsById.get(ans.questionId);
    if (!q) throw new Error(`Unknown questionId: ${ans.questionId}`);

    if (q.type === QuestionType.CHECKBOX) {
      if (!Array.isArray(ans.value)) throw new Error(`Question ${q.id} expects string[]`);
    } else {
      if (Array.isArray(ans.value)) throw new Error(`Question ${q.id} expects string`);
    }
  }

  for (const q of form.questions) {
    if (!q.required) continue;

    const a = answers.find((x) => x.questionId === q.id);
    if (!a) throw new Error(`Required question not answered: ${q.title}`);

    if (typeof a.value === "string" && a.value.trim() === "") {
      throw new Error(`Required question is empty: ${q.title}`);
    }
    if (Array.isArray(a.value) && a.value.length === 0) {
      throw new Error(`Required checkbox is empty: ${q.title}`);
    }
  }
};

export const resolvers = {
  AnswerValue: AnswerValueScalar,

  Query: {
    forms(): Form[] {
      return db.forms;
    },
    form(_: unknown, args: { id: string }): Form | null {
      return db.forms.find((f) => f.id === args.id) ?? null;
    },
    responses(_: unknown, args: { formId: string }): FormResponse[] {
      return db.responses.filter((r) => r.formId === args.formId);
    },
  },

  Mutation: {
    createForm(
      _: unknown,
      args: { title: string; description?: string; questions?: QuestionInput[] }
    ): Form {
      const form: Form = {
        id: makeId(),
        title: args.title,
        description: args.description,
        questions: normalizeQuestions(args.questions),
        createdAt: new Date().toISOString(),
      };

      db.forms.push(form);
      return form;
    },

    submitResponse(
      _: unknown,
      args: { formId: string; answers: AnswerInput[] }
    ): FormResponse {
      const form = db.forms.find((f) => f.id === args.formId);
      if (!form) throw new Error("Form not found");

      const answers: Answer[] = args.answers.map((a) => ({
        questionId: a.questionId,
        value: a.value,
      }));

      validateAnswers(form, answers);

      const response: FormResponse = {
        id: makeId(),
        formId: args.formId,
        answers,
        submittedAt: new Date().toISOString(),
      };

      db.responses.push(response);
      return response;
    },

    deleteForm(_: unknown, args: { id: string }): boolean {
      const index = db.forms.findIndex((f) => f.id === args.id);
      if (index === -1) throw new Error("Form not found");

      db.forms.splice(index, 1);
      db.responses = db.responses.filter((r) => r.formId !== args.id);
      return true;
    },
  },
};