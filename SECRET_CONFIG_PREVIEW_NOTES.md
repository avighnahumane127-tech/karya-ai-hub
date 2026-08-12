
## Configured-preview test

A temporary isolated server was started with `KARYA_ENABLE_SECRET_PREVIEW=true` and a non-production sentinel value for `GROQ_API_KEY`. Settings rendered **Configured** for Groq and OpenAI only when the corresponding process environment variables were present; the sentinel string was absent from `document.body.innerText` and browser localStorage. The preview returned presence status only and did not call an external provider.

## Mobile layout check

A 390 × 844 mobile screenshot of `/settings` was captured from the isolated preview server. The compact header, Settings content, and bottom navigation fit without horizontal clipping or button overlap. The page is vertically scrollable, so the new secret section remains reachable below the initial viewport.
