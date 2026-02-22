import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "src/shared/api/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-rtk-query"],
      config: {
        importBaseApiFrom: "../shared/api/api",
        exportHooks: true,
        namingConvention: { enumValues: "keep" },
        addTagTypes: true,
        tagTypes: ["Forms", "Form", "Responses"],
      }
    }
  }
};

export default config;