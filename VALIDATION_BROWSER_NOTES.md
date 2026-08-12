# Browser validation notes

## 2026-08-12 local interface pass

The local Work Input page at `/add` rendered its empty state, grouped source controls, and honest backend disclaimer correctly. The **Analyze work** action was disabled until context was added. After context was added, the request-understanding dialog required explicit field confirmation; no request details were fabricated.

A browser-local Work package was created at `/work/work-1786536167692` with user-confirmed fields. The detail view rendered all ten tabs, the readiness warning, requirements/evidence summaries, retention controls, and sensitive-text scan control. At the desktop browser width used for this check, no overlapping action buttons were observed. The tab row uses horizontal overflow to retain access to all tabs rather than collapsing or overlapping them.

The Templates page rendered its system templates, empty personal-template state, and explicit notice that no active Work was available before a Work existed. The browser-local Work created above can be used for subsequent rendered-workflow and refresh checks.

## Narrow-screen responsive capture

Headless Chromium screenshots at **390 × 844** were captured for `/add` and `/templates` in `validation-artifacts/`. The mobile shell used a compact header and bottom navigation. On `/add`, the upload, paste, URL, and email/message controls wrapped cleanly within the input card; no clipping, overlap, or inaccessible action was observed. On `/templates`, the work selector empty state and template cards retained readable text and usable buttons with no overlap. No mobile-layout defect was found in these sampled pages.

## Public landing routes

The `/product` and `/how-it-works` routes both rendered successfully with the Karya AI logo, public navigation, footer legal links, and no client-side error state. Desktop screenshots showed no header or hero-content overlap. The Product page's capability examples are product explanatory content; they should not be interpreted as a claim that those external integrations are live in the local build.

The `/use-cases` and `/verification` public routes also rendered successfully with complete public navigation, logo, and footer. No visible error state or desktop layout overlap was observed. This completes the required sampled checks for `/product`, `/how-it-works`, `/use-cases`, and `/verification`.

## Branding and provenance check

The declared favicon link resolved to `/favicon.png`; the asset returned HTTP 200. The public logo image loaded successfully. In the browser-created Work, the Requirements tab visibly rendered the required **FOUND IN SOURCE** provenance badge next to the requirement source. The desktop tab row remained accessible via intentional horizontal scrolling, with no overlap observed.

## Rendered template safety

With the browser-created Work selected, applying the built-in Research template displayed: **“Added 3 checks; retained 0 existing requirements without changes. No matching requirement conflicts detected.”** This confirms the UI exposes additive application behavior and explicit conflict-review status rather than silently overwriting requirements.

## Browser refresh persistence

After applying the Research template, navigation back to the Work detail retained four requirements. Browser local storage reported the Work record present with `requirementCount: 4` and `templateId: "research"`. This confirms browser-local state persistence across navigation. A true logout/session-separation test remains an external authentication integration requirement because no authentication backend is connected.
