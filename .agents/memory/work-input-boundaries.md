---
name: Work Input backend boundary
description: Product boundary for source collection, processing states, and analysis behavior in the imported Karya AI project.
---

Work Input may collect and group user-provided sources locally, but it must not claim that files were uploaded, extracted, analyzed, or source-backed until those backend capabilities exist.

**Why:** The imported project has no connected persistence or analysis service, and the product brief explicitly prohibits fabricated files, processing states, findings, or source references.

**How to apply:** Use explicit “not yet supported” or “analysis has not run” states, preserve the actual user-provided metadata, and add backend integrations as separate work rather than silently simulating them.