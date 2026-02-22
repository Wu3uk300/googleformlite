import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";

const PORT = 4000;

const start = async (): Promise<void> => {
  const app = express();

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apollo.start();

  app.use(cors());
  app.use(express.json());

  app.use("/graphql", expressMiddleware(apollo));

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
  });
};

start();