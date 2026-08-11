# Karya AI Hub

WORKREADY — COMPLETE UI/UX DESIGN PROMPT FOR LOVABLE

Create the entire frontend UI/UX for WorkReady.

IMPORTANT: UI ONLY

This task is strictly for creating the frontend interface and visual experience.

Do NOT build:

Backend

Database

Authentication logic

AI APIs

File processing

Real document analysis

Real email integrations

Real Google Drive integrations

Real notifications

Real data persistence

Real AI responses

Payment systems

External integrations

Use realistic mock data and simulated interactions wherever necessary so the interface can be fully demonstrated.

The goal is to create a polished, coherent, production-quality UI prototype.

1. PRODUCT CONCEPT

WorkReady is:

The preflight and verification system for messy work.

A user receives an unclear assignment, client brief, email, PDF, document, folder, or collection of files.

WorkReady helps them understand:

What am I actually being asked to produce?

What information do I need?

What is missing?

What is ambiguous?

What should I do first?

What depends on something else?

What assumptions am I making?

What evidence proves the work is complete?

Is the final result actually ready?

The core workflow is:

INPUT → UNDERSTAND → CHECK → PLAN → EXECUTE → VERIFY → HANDOFF

The central product concept is:

REQUEST → DELIVERABLE → REQUIREMENT → EVIDENCE → VERIFICATION → READY / NOT READY

2. MOST IMPORTANT DESIGN DIRECTION

DO NOT make WorkReady look like a generic SaaS dashboard.

Do NOT create:

Huge sidebar

Dozens of navigation items

Dense tables everywhere

Excessive cards

Dashboard clutter

Too many colors

Giant analytics widgets

Generic AI chatbot styling

Traditional project-management UI

Jira/Trello-style boards

Enterprise software aesthetics

Unnecessary charts

Decorative UI that does not help the workflow

The interface must feel:

Extremely clean

Minimal

Focused

Intelligent

Modern

Calm

Professional

Fast

Easy to understand

Extremely well-spaced

Visually hierarchical

The user should understand the application within 10 seconds.

The interface should feel like a focused AI work tool, not a collection of enterprise features.

3. CORE UX PRINCIPLE

WorkReady has a lot of functionality internally, but the user should NOT see all of it at once.

Use progressive disclosure.

For example:

Do NOT show:

Requirements / Risks / Assumptions / Dependencies / Evidence / Decisions / Scope / Files / Tasks / Questions / Verification

all at the same time.

Instead, show the most important information first.

Example:

BLOCKED

3 things need attention.

Missing client logo

Conflicting deadline

Approval criteria unclear

Fix these issues →

The deeper information should appear when the user clicks into the relevant area.

4. PRIMARY NAVIGATION

Keep the global navigation extremely small.

Use only:

WorkReady logo

Then:

AI Work Chat

My Work

Add Work

Then a subtle divider.

Questions

Handoffs

Then another subtle divider.

Templates

Finally at the bottom:

Settings

Do NOT put Insights in the main navigation.

Insights should be accessible from My Work or the user profile/menu later.

Do NOT create a giant sidebar.

5. SIDEBAR DESIGN

The sidebar should be narrow and visually quiet.

Desktop:

Approximately 220–240px wide.

Use:

Simple line icons

Small labels

Lots of whitespace

No unnecessary badges

No nested navigation trees

The active navigation item should be subtly highlighted.

Do NOT use large colorful blocks.

The sidebar should never dominate the screen.

6. GLOBAL TOP BAR

The top bar should contain only useful controls.

Left:

Current page/work context.

Center or near-center:

Global search.

Placeholder:

Search work, requirements, files...

Right:

Help

Notifications

User avatar

Do not overcrowd the header.

7. PRIMARY SCREEN — AI WORK CHAT

This is the most important screen.

The previous dashboard/home concept is replaced by:

AI Work Chat

This is the front door of WorkReady.

The user should immediately understand:

"I can give WorkReady messy work and ask what I should do."

AI Work Chat initial state

The screen should be extremely clean.

Center the experience.

Large heading:

What are you working on?

Subheading:

Give WorkReady an assignment, brief, document, or messy set of instructions. We'll figure out what needs to happen.

Then a large input area.

Placeholder:

Paste an assignment, brief, email, or instructions...

Below it:

Add files

Buttons:

PDF

DOCX

Image

ZIP

Then small suggested actions:

What can I ask?

Can I start this?

What's missing?

What should I ask?

What should I do first?

Check this before I submit

Prepare a handoff

Do not make these look like generic chatbot prompt cards.

They should be subtle text buttons/chips.

8. AI CHAT INPUT

The composer should be the primary interaction element.

Large but compact.

Features shown visually:

Attach file

Add context

Input field

Send button

The input should support natural language.

Example:

"Can I safely start this assignment?"

The user should feel that WorkReady is an intelligent work assistant, not a chatbot.

9. AI CHAT CONVERSATION

When a conversation begins, use a clean two-column layout.

Main area

AI conversation.

Small contextual panel

Show only the most important state:

Current Work

Supplier Recommendation

Status

Blocked

3 issues

Due

Friday

Do NOT make the contextual panel a giant dashboard.

10. AI RESPONSE DESIGN

AI responses should NOT be giant paragraphs.

Use structured responses.

Example:

This work is blocked

There are 3 issues that should be resolved before you begin.

1. Evaluation criteria are missing

The brief asks you to compare suppliers but does not specify how price, delivery time, and warranty should be weighted.

2. One proposal is missing

Proposal C is referenced but was not uploaded.

3. Deadline conflict

The email says Thursday while the brief says Friday.

Then:

You can still do

Check the proposals already received

Build the comparison structure

Identify missing information

Don't do yet

Finalize the recommendation

Submit the report

Then show small action buttons:

Resolve issues

Generate questions

View requirements

This is the visual language of the product.

11. SOURCE REFERENCES

Whenever the AI makes a factual claim based on uploaded information, visually show its source.

Example:

Deadline: Friday

Small source label:

manager-email.pdf · Page 1

Allow clicking the source.

For AI inferences show:

Inferred

For assumptions:

Assumption

For conflicts:

Conflict

For confirmed information:

Confirmed

Use subtle labels rather than large colored banners.

12. WORK CONTEXT

When a work item is active, show a very small contextual header:

Supplier Recommendation

Blocked · 3 issues · Due Friday

Then actions:

Overview

Requirements

Plan

Questions

Files

Verify

Keep the work navigation compact.

Do NOT expose every internal object.

13. MY WORK

This should NOT look like a project management dashboard.

The purpose is simply:

Show me what needs my attention.

Top:

My Work

Subtext:

Everything you're currently working on.

Then a simple filter:

All · Needs attention · Active · Waiting · Completed

Search.

Work cards

Use large, clean rows rather than dozens of dashboard cards.

Example:

Supplier Recommendation

Compare three supplier proposals and recommend one.

Blocked

3 issues · 2 questions · Due Friday

Website Redesign

Prepare website for client approval.

Waiting

Waiting for final product photos

Management Report

Create quarterly management report.

Ready to start

All required inputs available

Cards should be highly readable.

Do not overload them with metadata.

14. WORK ITEM DETAIL

When a user opens a work item, the UI should transition into a focused workspace.

Header:

Supplier Recommendation

Short description.

Status:

BLOCKED

Then a compact status summary:

3 things need attention before final work can begin.

Actions:

Ask WorkReady

Share

More

15. WORK ITEM NAVIGATION

Inside the work item, use a very small horizontal navigation.

Only:

Overview

Requirements

Plan

Questions

Files

Verify

Handoff

The AI Work Chat should remain available through a persistent Ask WorkReady button or expandable chat panel.

Do NOT make AI Chat one of many visually equal tabs.

It should feel like the intelligence layer sitting above the workspace.

16. OVERVIEW

The Overview should answer:

Where does this work stand?

Top:

Readiness

BLOCKED

Then:

3 issues prevent reliable progress.

Show the three issues as simple rows.

Each row:

Problem

Short explanation.

Action

What the user should do.

What I understand

Show:

You need to compare three supplier proposals and recommend one supplier for management approval by Friday.

Buttons:

Confirm

Edit

This is critical.

The AI should never silently assume that its interpretation is correct.

Next best action

A prominent but simple section:

Next best action

Confirm the supplier evaluation criteria.

Button:

Resolve

Progress

Minimal summary:

Requirements

6 / 9

Questions

2 unresolved

Evidence

5 items

Do NOT turn this into giant circular charts.

17. REQUIREMENTS

This screen should feel like a clean checklist with intelligence.

Title:

Requirements

Subtitle:

What this work must satisfy.

Each requirement is a row.

Example:

Compare all three suppliers

Complete

Include delivery cost

Partial

Provide vendor references

Missing

Submit by Friday

Conflict

Clicking a requirement opens a detail panel.

18. REQUIREMENT DETAIL PANEL

Show:

Requirement

"Include vendor references."

Status

Missing

Why

No vendor references were found in the uploaded materials.

Evidence

None found.

Source

supplier-brief.pdf · Page 2

Action

Request references

Do not open a new page unless necessary.

Use side panels/modals for detail.

This keeps navigation clean.

19. PLAN

The Plan screen should not look like Trello.

It should show a simple sequence.

Example:

1. Confirm evaluation criteria

Blocked

↓

2. Validate proposals

Ready

↓

3. Normalize pricing

Waiting for Proposal C

↓

4. Compare suppliers

Not started

↓

5. Draft recommendation

Not started

↓

6. Management review

Not started

Use dependency indicators.

Highlight:

What can happen now

and

What is blocked

This is much more important than traditional task management.

20. QUESTIONS

Questions should be presented as things that need answers.

Top:

Questions

Then sections:

Must answer

Critical questions.

Waiting for response

Questions already sent.

Resolved

Completed questions.

Each question:

Should delivery time be weighted equally with price?

Small explanation:

The ranking changes depending on the weighting.

Action:

Generate message

Do not create a giant questionnaire interface.

21. FILES

Keep Files extremely simple.

Title:

Files

Then show:

Proposal-A.pdf

Source

Proposal-B.pdf

Source

Proposal-C.pdf

Missing

supplier-comparison-v2.xlsx

Working file

If multiple versions exist:

3 possible final versions found

Click:

Compare versions

Do not make this look like Google Drive.

WorkReady is interested in the meaning and authority of files, not file storage itself.

22. VERIFY

This should be one of the most visually important screens.

Header:

Verify

Subheading:

Does the finished work actually satisfy the original request?

Show:

Final status

NOT READY

Then:

2 requirements are unresolved.

List:

Missing executive summary

Missing

Recommendation does not cite Proposal B

Needs review

All other requirements

Satisfied

Then:

Completion test

Show simple checks.

Do not use an arbitrary AI score as the primary result.

23. HANDOFF

The Handoff screen should feel like a clean summary document.

Header:

Ready to hand off?

Show:

What was requested

Short summary.

What is complete

Short list.

What remains

Short list.

Important decisions

Short list.

Files

Authoritative files.

Risks

Open risks.

Next person should know

Short AI-generated summary.

Button:

Generate handoff

Secondary:

Copy summary

24. ADD WORK

This should be a focused creation flow.

Do NOT create a giant form.

Step 1:

Give us the work

Large drop zone:

Drop files here or paste instructions

Then:

Continue

Step 2:

What kind of work is this?

Simple choices:

Office work

Client work

Research

Report

Presentation

Design

Website

Data

Other

Allow:

I don't know

WorkReady can determine the type automatically.

Step 3:

Here's what I understood

Show the extracted interpretation.

Buttons:

Looks right

Edit

Then move into the work workspace.

25. QUESTIONS GLOBAL SCREEN

Global Questions should be extremely simple.

Purpose:

Show me what is waiting on an answer.

Sections:

Needs my attention

Waiting for others

Resolved

Each question should show:

Question

Related work

Person

Age

Status

No unnecessary analytics.

26. HANDOFFS GLOBAL SCREEN

Show:

Incoming

Work coming to the user.

Outgoing

Work sent to others.

Needs attention

Handoffs with unresolved issues.

Use clean rows.

No complex dashboard.

27. TEMPLATES

Keep Templates simple.

Title:

Templates

Subtitle:

Start common work with the right checks already defined.

Show templates as clean cards:

Research

Report

Presentation

Website

Supplier comparison

Client onboarding

Data analysis

School assignment

Each card should show:

Template name

One-line description

Number of built-in checks

Button:

Use template

28. SETTINGS

Settings should be extremely conventional.

Sections:

Account

Profile

Preferences

Defaults

AI behavior

Assumption and confidence settings

Privacy

File retention and deletion

Notifications

Notification preferences

Do not make Settings visually complicated.

29. GLOBAL SEARCH

Search should be lightweight.

Placeholder:

Search your work...

Results can include:

Work

Requirement

File

Question

Evidence

Results should show the relevant context.

Example:

"Executive summary"

Requirement · Supplier Recommendation

"Executive summary"

Mentioned in report.pdf · Page 4

30. IMPORTANT: DO NOT SHOW EVERYTHING

This is the most important UI rule.

WorkReady may internally track:

Requirements

Deliverables

Tasks

Questions

Risks

Assumptions

Dependencies

Decisions

Evidence

Files

Scope

Changes

Verification

Handoffs

But the UI should NOT expose all of these simultaneously.

The user should see:

WHAT'S WRONG

WHY

WHAT SHOULD I DO

IS IT READY?

Everything else is secondary.

31. VISUAL HIERARCHY

Every screen should have one dominant purpose.

Use this hierarchy:

Page title

↓

One-sentence explanation

↓

Primary status/action

↓

Important information

↓

Secondary information

Do not create equal visual weight for everything.

32. COLOR SYSTEM

Use a restrained neutral interface.

Primary UI:

White / off-white

Very light gray

Dark charcoal text

Subtle borders

Status colors should be used sparingly:

Green

Ready / complete

Amber

Warning / needs attention

Red

Blocked / critical

Blue or neutral accent

Interactive / informational

Do not make the entire application colorful.

33. TYPOGRAPHY

Use a modern highly readable sans-serif.

Prioritize:

Excellent readability

Clear hierarchy

Generous line height

Medium-weight headings

Avoid excessive bold text

Avoid huge marketing-style typography inside the application.

34. SPACING

Use generous whitespace.

The interface should breathe.

Avoid:

Crowded tables

Tiny text

Excessive borders

Too many cards

Excessive dividers

Dense dashboards

35. CARDS

Use cards only when they improve grouping.

Do NOT put every piece of information into a card.

Prefer:

Simple rows

Sections

Side panels

Inline status

Clean lists

Cards should be reserved for important summaries.

36. MODALS AND SIDE PANELS

Use side panels for:

Requirement details

Question details

Evidence details

File details

AI explanations

Use modals only for:

Confirmation

Destructive actions

Important decisions

Avoid opening a new page for every small interaction.

37. RESPONSIVE DESIGN

The UI must work cleanly on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Hide the desktop sidebar.

Use a compact bottom navigation or menu.

Prioritize:

AI Work Chat

My Work

Add Work

Do not simply shrink the desktop UI.

Reorganize it for mobile.

38. EMPTY STATES

Every major screen needs an intelligent empty state.

Example:

My Work:

Nothing here yet.

Add an assignment or brief and WorkReady will turn it into a clear plan.

Button:

Add Work

Questions:

No unresolved questions.

You're not waiting on anyone.

Files:

No files yet.

Add the documents related to this work.

Verify:

Nothing to verify yet.

Upload the finished work when you're ready.

39. DEMO DATA

Use realistic mock data.

Create several example work items:

Supplier Recommendation

Blocked.

Website Redesign

Waiting for client assets.

Quarterly Management Report

Ready to start.

Marketing Presentation

Ready for verification.

Client Onboarding

Needs clarification.

Use these examples throughout the UI so the application feels alive.

Do NOT use:

"John Doe"

"Lorem ipsum"

Fake random numbers

Generic placeholder text

Empty generic dashboard cards

The demo content should reflect actual WorkReady workflows.

40. MICROCOPY

Avoid generic SaaS phrases such as:

"Welcome back!"

"Boost your productivity!"

"Manage everything in one place!"

"Your productivity command center!"

"AI-powered workspace!"

Instead use direct language.

Examples:

What are you working on?

3 things are blocking this work.

You can start these tasks now.

This requirement is still unresolved.

Two files may be authoritative.

The final output is missing one required section.

Ready to submit.

This makes the product feel intelligent and serious.

41. THE AI SHOULD FEEL EMBEDDED, NOT SEPARATE

Do NOT create a giant ChatGPT-style interface that feels disconnected from the rest of the application.

AI Work Chat should be the intelligence layer.

The AI should be able to reference:

Current work

Requirements

Files

Questions

Evidence

Plan

Verification

Handoff

And UI elements should link back to those structured records.

Example:

"I found two conflicting deadlines."

Button:

View conflict

This opens the relevant requirement/details panel.

42. CORE EXPERIENCE TO OPTIMIZE

The entire UI should make this sequence effortless:

1. User gives WorkReady messy instructions.

↓

2. WorkReady explains what it understood.

↓

3. WorkReady identifies missing information.

↓

4. WorkReady tells the user whether they can start.

↓

5. WorkReady shows what to do next.

↓

6. User completes the work.

↓

7. User uploads the final result.

↓

8. WorkReady verifies it against the original request.

↓

9. WorkReady says:

READY TO SUBMIT

or

NOT READY — 2 issues remain

This is the product experience that matters.

43. FINAL UI PHILOSOPHY

The application should feel like:

Notion's cleanliness + Linear's restraint + a modern AI assistant's intelligence

but should NOT copy their interfaces.

The user should never feel:

"There are too many things I can click."

Instead they should feel:

"I know exactly what I need to do next."

The UI should consistently answer:

What is this?

What's wrong?

Why?

What should I do?

Am I ready?

44. FINAL SCREEN MAP

Keep the final application structure approximately:

GLOBAL

AI Work Chat

My Work

Add Work

Questions

Handoffs

Templates

Settings

WORK ITEM

Overview

Requirements

Plan

Questions

Files

Verify

Handoff

With Ask WorkReady always accessible.

45. FINAL INSTRUCTION TO LOVABLE

Create the complete UI based on the above specification.

The most important constraint is:

Do not let the large number of WorkReady features make the interface look large or complicated.

The underlying product can be extremely powerful.

The visible interface should remain extremely simple.

Prioritize:

Clarity > feature visibility

Workflow > navigation

Action > information

Context > decoration

Progressive disclosure > showing everything

AI intelligence > dashboard widgets

The final result should look like a serious, polished product that a real person could understand immediately.

It should NOT look like a template-generated SaaS dashboard.

It should NOT look like an admin panel.

It should NOT look like a project-management platform.

It should feel like a focused AI work-preflight tool whose complexity stays underneath the surface.

Change its name from WorkReady to Karya AI

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/40308111-dcc3-48b1-b15b-347110bc9186).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
