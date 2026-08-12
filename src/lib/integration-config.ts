export type IntegrationVariable = {
  key: string;
  label: string;
  category: "AI" | "Database" | "Storage" | "Messaging" | "Authentication" | "Application";
  description: string;
  secret: boolean;
  requiredFor: string;
};

/**
 * Names only: values must never be placed in client-side source, localStorage, or VITE_* variables.
 * The server-only status function reports presence without returning any secret value.
 */
export const integrationVariables: IntegrationVariable[] = [
  {
    key: "GROQ_API_KEY",
    label: "Groq API key",
    category: "AI",
    description: "Server-side key for Groq model requests.",
    secret: true,
    requiredFor: "Groq-powered analysis",
  },
  {
    key: "OPENAI_API_KEY",
    label: "OpenAI API key",
    category: "AI",
    description: "Server-side key for OpenAI-compatible model requests.",
    secret: true,
    requiredFor: "OpenAI-powered analysis",
  },
  {
    key: "SUPABASE_URL",
    label: "Supabase project URL",
    category: "Database",
    description: "Server-side project endpoint for shared persistence.",
    secret: false,
    requiredFor: "Supabase database and authentication",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    label: "Supabase service-role key",
    category: "Database",
    description: "Privileged server-only key; never expose it to the browser.",
    secret: true,
    requiredFor: "Server-side Supabase operations",
  },
  {
    key: "S3_ENDPOINT",
    label: "Object-storage endpoint",
    category: "Storage",
    description: "S3-compatible endpoint for server-managed file storage.",
    secret: false,
    requiredFor: "External file storage",
  },
  {
    key: "S3_ACCESS_KEY_ID",
    label: "Object-storage access key",
    category: "Storage",
    description: "Server-side access identifier for the S3-compatible bucket.",
    secret: true,
    requiredFor: "External file storage",
  },
  {
    key: "S3_SECRET_ACCESS_KEY",
    label: "Object-storage secret key",
    category: "Storage",
    description: "Server-only secret for the S3-compatible bucket.",
    secret: true,
    requiredFor: "External file storage",
  },
  {
    key: "EMAIL_PROVIDER_API_KEY",
    label: "Email provider API key",
    category: "Messaging",
    description: "Server-side key for transactional email delivery.",
    secret: true,
    requiredFor: "Email notifications and message delivery",
  },
  {
    key: "OAUTH_CLIENT_ID",
    label: "OAuth client ID",
    category: "Authentication",
    description: "Application identifier for the selected OAuth provider.",
    secret: false,
    requiredFor: "OAuth sign-in",
  },
  {
    key: "OAUTH_CLIENT_SECRET",
    label: "OAuth client secret",
    category: "Authentication",
    description: "Server-only credential for the selected OAuth provider.",
    secret: true,
    requiredFor: "OAuth sign-in",
  },
  {
    key: "KARYA_PUBLIC_APP_URL",
    label: "Public application URL",
    category: "Application",
    description: "Canonical URL used for callbacks and share-link generation.",
    secret: false,
    requiredFor: "Production callbacks and public links",
  },
];

export const integrationCategories = [
  "AI",
  "Database",
  "Storage",
  "Messaging",
  "Authentication",
  "Application",
] as const;

export function createEnvironmentTemplate() {
  return [
    "# Copy to .env.local for local server configuration.",
    "# Never commit .env.local and never use the VITE_ prefix for secrets.",
    "# Values are intentionally blank in this tracked template.",
    "",
    ...integrationCategories.flatMap((category) => [
      `# ${category}`,
      ...integrationVariables
        .filter((variable) => variable.category === category)
        .map((variable) => `${variable.key}=`),
      "",
    ]),
    "# Set true only for a local developer preview of configured/not-configured state.",
    "KARYA_ENABLE_SECRET_PREVIEW=false",
  ].join("\n");
}
