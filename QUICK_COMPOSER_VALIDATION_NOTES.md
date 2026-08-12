# Quick Composer validation notes

The Home Quick Add Work composer now renders its **Attach file** and **Add context** controls inside the composer footer at the bottom-left, with the send control anchored at the bottom-right. The desktop browser check confirmed no overlap between these controls.

Selecting **Add context** opens a functional dialog with the requested placeholder: “Add anything Karya AI should know about this work...”. The dialog offers **Add to Work Package** and is not decorative.

The context dialog saved the entered text into a visible **Additional context** card inside the same composer. The card includes a removal control, and the send control became enabled even before a main prompt was entered, confirming context is a real Work Package input.

The main prompt and saved context were submitted together. The application navigated to `/add`, where a single Work Package displayed **Quick add instructions** as a ready Text source and displayed the exact additional context. The package summary showed one source with context added and presented one analysis action, confirming the unified handoff.

The Attach file control is connected to a native multiple-file input. Its acceptance list covers PDF, DOC/DOCX, TXT/MD, CSV/XLS/XLSX, common images, ZIP, audio, and video extensions, matching the existing Work Input capabilities.

A supported `.txt` fixture was selected through the native multiple-file flow. The composer displayed the selected filename, `Text` type, `91 B` size, and a specific remove control. No upload success was claimed; the UI accurately states that files are selected locally.

The file removal control cleared the selected-file chip immediately. The same supported file could then be re-selected successfully, confirming both removal and native file-change reset behavior.

The final prompt-plus-file submission opened `/add` with exactly **two sources** in one Work Package: the ready Text source for the prompt and the ready File source for `home-composer-validation.txt`. The file name, type, and size remained present, and the package exposes one analysis action. This verifies that attachments are not diverted into an unrelated workflow.

Before the unsupported-file test, the native picker acceptance filter was rechecked and remained limited to the current supported Work Input extensions.

An `.exe` fixture was selected through the browser test path. It was not added to the Work Package, and the composer showed the clear recovery message: `home-composer-unsupported.exe is not a supported file type.`

A 390 × 844 mobile capture confirms the requested layout: **Attach file** and **Add context** appear inside the bottom-left of the composer footer and the send button remains separated at the bottom-right. No control overlap, clipping, or horizontal overflow was observed.

A second end-to-end browser flow was started after the context-persistence correction to confirm that Home context survives final Work creation as source metadata rather than only pre-confirmation UI state.

The persisted-context confirmation flow saved the Q3 pricing instruction into the Home composer and displayed it in the additional-context card before submission.

The corrected flow again reached one Work Input package with the prompt as a Text source and the Q3 pricing instruction as additional context. The next step verifies that this context is retained in the finalized Work record.

The confirmation fields were explicitly supplied by the user during the browser test, and the resulting Work record was created successfully. The Files tab is inspected next to verify that the added context is persisted as a source in the finalized Work state.

The finalized Work Files tab contained **Additional context** as a `Context · Working file` source alongside the prompt source. After re-analysis, both Quick Add text and Additional context were correctly marked **Ready**, not Unsupported. This confirms the added context reaches and persists through the same Work Package pipeline.
