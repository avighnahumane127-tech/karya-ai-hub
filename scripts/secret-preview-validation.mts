import assert from "node:assert/strict";

import { createEnvironmentTemplate, integrationVariables } from "../src/lib/integration-config.ts";

const template = createEnvironmentTemplate();
const variableKeys = integrationVariables.map((variable) => variable.key);

assert.equal(
  new Set(variableKeys).size,
  variableKeys.length,
  "integration variable keys are unique",
);
assert(
  variableKeys.every((key) => template.includes(`${key}=`)),
  "template contains every variable name",
);
assert(!template.includes("validation-sentinel"), "template contains no test secret value");
assert(
  !template.includes("sk-") || template.includes("OPENAI_API_KEY="),
  "template contains no OpenAI-like value",
);
assert(
  !template.includes("VITE_GROQ_API_KEY"),
  "secret variables are not exposed as VITE_ variables",
);

const secretKeys = integrationVariables
  .filter((variable) => variable.secret)
  .map((variable) => variable.key);
assert(secretKeys.length > 0, "secret catalog is not empty");
assert(
  secretKeys.every((key) => new RegExp(`^${key}=$`, "m").test(template)),
  "secret entries are blank",
);

console.log(
  JSON.stringify(
    {
      passed: 5,
      variableCount: variableKeys.length,
      secretCount: secretKeys.length,
      containsValues: false,
    },
    null,
    2,
  ),
);
