import { api } from '../../shared/api/api';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AnswerValue: { input: any; output: any; }
};

export type Answer = {
  __typename?: 'Answer';
  questionId: Scalars['ID']['output'];
  value: Scalars['AnswerValue']['output'];
};

export type AnswerInput = {
  questionId: Scalars['ID']['input'];
  value: Scalars['AnswerValue']['input'];
};

export type Form = {
  __typename?: 'Form';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  questions: Array<Question>;
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createForm: Form;
  submitResponse: Response;
  deleteForm: Scalars['Boolean']['output'];
};


export type MutationCreateFormArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput>>;
  title: Scalars['String']['input'];
};


export type MutationSubmitResponseArgs = {
  answers: Array<AnswerInput>;
  formId: Scalars['ID']['input'];
};

export type MutationDeleteFormArgs = {
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  form?: Maybe<Form>;
  forms: Array<Form>;
  responses: Array<Response>;
};


export type QueryFormArgs = {
  id: Scalars['ID']['input'];
};


export type QueryResponsesArgs = {
  formId: Scalars['ID']['input'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['ID']['output'];
  options?: Maybe<Array<QuestionOption>>;
  required?: Maybe<Scalars['Boolean']['output']>;
  title: Scalars['String']['output'];
  type: QuestionType;
};

export type QuestionInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  options?: InputMaybe<Array<QuestionOptionInput>>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
  type: QuestionType;
};

export type QuestionOption = {
  __typename?: 'QuestionOption';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
};

export type QuestionOptionInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  label: Scalars['String']['input'];
};

export enum QuestionType {
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT'
}

export type Response = {
  __typename?: 'Response';
  answers: Array<Answer>;
  formId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  submittedAt: Scalars['String']['output'];
};

export type GetFormsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFormsQuery = { __typename?: 'Query', forms: Array<{ __typename?: 'Form', id: string, title: string, description?: string | null }> };

export type GetFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFormQuery = { __typename?: 'Query', form?: { __typename?: 'Form', id: string, title: string, description?: string | null, questions: Array<{ __typename?: 'Question', id: string, title: string, type: QuestionType, required?: boolean | null, options?: Array<{ __typename?: 'QuestionOption', id: string, label: string }> | null }> } | null };

export type CreateFormMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput> | QuestionInput>;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm: { __typename?: 'Form', id: string, title: string, description?: string | null, questions: Array<{ __typename?: 'Question', id: string, title: string, type: QuestionType, required?: boolean | null, options?: Array<{ __typename?: 'QuestionOption', id: string, label: string }> | null }> } };

export type GetResponsesQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type GetResponsesQuery = { __typename?: 'Query', responses: Array<{ __typename?: 'Response', id: string, formId: string, submittedAt: string, answers: Array<{ __typename?: 'Answer', questionId: string, value: any }> }> };

export type SubmitResponseMutationVariables = Exact<{
  formId: Scalars['ID']['input'];
  answers: Array<AnswerInput> | AnswerInput;
}>;


export type SubmitResponseMutation = { __typename?: 'Mutation', submitResponse: { __typename?: 'Response', id: string, formId: string, submittedAt: string, answers: Array<{ __typename?: 'Answer', questionId: string, value: any }> } };

export type DeleteFormMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFormMutation = { __typename?: 'Mutation', deleteForm: boolean };


export const GetFormsDocument = `
    query GetForms {
  forms {
    id
    title
    description
  }
}
    `;
export const GetFormDocument = `
    query GetForm($id: ID!) {
  form(id: $id) {
    id
    title
    description
    questions {
      id
      title
      type
      required
      options {
        id
        label
      }
    }
  }
}
    `;
export const CreateFormDocument = `
    mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]) {
  createForm(title: $title, description: $description, questions: $questions) {
    id
    title
    description
    questions {
      id
      title
      type
      required
      options {
        id
        label
      }
    }
  }
}
    `;
export const GetResponsesDocument = `
    query GetResponses($formId: ID!) {
  responses(formId: $formId) {
    id
    formId
    submittedAt
    answers {
      questionId
      value
    }
  }
}
    `;
export const SubmitResponseDocument = `
    mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
  submitResponse(formId: $formId, answers: $answers) {
    id
    formId
    submittedAt
    answers {
      questionId
      value
    }
  }
}
    `;
export const DeleteFormDocument = `
    mutation DeleteForm($id: ID!) {
  deleteForm(id: $id)
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    GetForms: build.query<GetFormsQuery, GetFormsQueryVariables | void>({
      query: (variables) => ({ document: GetFormsDocument, variables }),
      providesTags: () => [{ type: "Forms" }],
    }),
    GetForm: build.query<GetFormQuery, GetFormQueryVariables>({
      query: (variables) => ({ document: GetFormDocument, variables })
    }),
    CreateForm: build.mutation<CreateFormMutation, CreateFormMutationVariables>({
      query: (variables) => ({ document: CreateFormDocument, variables }),
      invalidatesTags: () => [{ type: "Forms" }],
    }),
    GetResponses: build.query<GetResponsesQuery, GetResponsesQueryVariables>({
      query: (variables) => ({ document: GetResponsesDocument, variables }),
      providesTags: (_result, _error, variables) => [
        { type: "Responses", id: variables.formId },
      ],
    }),
    SubmitResponse: build.mutation<SubmitResponseMutation, SubmitResponseMutationVariables>({
      query: (variables) => ({ document: SubmitResponseDocument, variables }),
      invalidatesTags: (_result, _error, variables) => [
        { type: "Responses", id: variables.formId },
      ],
    }),
    DeleteForm: build.mutation<DeleteFormMutation, DeleteFormMutationVariables>({
      query: (variables) => ({ document: DeleteFormDocument, variables }),
      invalidatesTags: () => [{ type: "Forms" }],
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetFormsQuery, useLazyGetFormsQuery, useGetFormQuery, useLazyGetFormQuery, useCreateFormMutation, useGetResponsesQuery, useLazyGetResponsesQuery, useSubmitResponseMutation, useDeleteFormMutation } = injectedRtkApi;

