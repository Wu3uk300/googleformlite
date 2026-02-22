import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type QuestionOption {
    id: ID!
    label: String!
  }

  type Question {
    id: ID!
    title: String!
    type: QuestionType!
    options: [QuestionOption!]
    required: Boolean
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
    createdAt: String!
  }

  scalar AnswerValue

  type Answer {
    questionId: ID!
    value: AnswerValue!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
    submittedAt: String!
  }

  input QuestionOptionInput {
    id: ID
    label: String!
  }

  input QuestionInput {
    id: ID
    title: String!
    type: QuestionType!
    options: [QuestionOptionInput!]
    required: Boolean
  }

  input AnswerInput {
    questionId: ID!
    value: AnswerValue!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput!]): Form!
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }
`;