import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { GraphQLClient } from "graphql-request";
import type { DocumentNode } from "graphql";

const client = new GraphQLClient("http://localhost:4000/graphql");

export type GraphqlArgs = {
  document: string | DocumentNode;
  variables?: unknown;
};

export type GraphqlError = {
  message: string;
};

const graphqlBaseQuery =
  (): BaseQueryFn<GraphqlArgs, unknown, GraphqlError> =>
  async ({ document, variables }) => {
    try {
      const vars = variables === undefined ? undefined : (variables as Record<string, unknown>);
      const data = await client.request(document, vars);
      return { data };
    } catch (e) {
      const err = e as { message?: string };
      return { error: { message: err.message ?? "Unknown error" } };
    }
  };

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlBaseQuery(),
  tagTypes: ["Forms", "Form", "Responses"],
  endpoints: () => ({}),
});