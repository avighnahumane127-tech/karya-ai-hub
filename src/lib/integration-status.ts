import { createServerFn } from "@tanstack/react-start";

import { integrationVariables, type IntegrationVariable } from "@/lib/integration-config";

export type IntegrationVariableStatus = Pick<
  IntegrationVariable,
  "key" | "label" | "category" | "description" | "secret" | "requiredFor"
> & {
  configured: boolean | null;
};

export type IntegrationEnvironmentPreview = {
  runtime: "server" | "unavailable";
  previewEnabled: boolean;
  variables: IntegrationVariableStatus[];
};

/**
 * Returns only configuration metadata and presence flags. Secret values never leave the server.
 * The explicit opt-in prevents a production deployment from accidentally exposing even presence
 * information to the browser.
 */
export const getIntegrationEnvironmentPreview = createServerFn({ method: "GET" }).handler(
  (): IntegrationEnvironmentPreview => {
    const previewEnabled = process.env["KARYA_ENABLE_SECRET_PREVIEW"] === "true";
    return {
      runtime: "server",
      previewEnabled,
      variables: integrationVariables.map((variable) => ({
        ...variable,
        configured: previewEnabled ? Boolean(process.env[variable.key]) : null,
      })),
    };
  },
);
