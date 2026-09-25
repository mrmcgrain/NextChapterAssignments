# GPTTest

Authorized classroom Custom GPT red-team workspace.

## Recommended approach

Recreate the red-team GPT's behavior as a written attacker specification in this project rather than relying on one Custom GPT to autonomously converse with another. This makes prompts reviewable, testing reproducible, and results easier to grade.

The original red-team GPT share link can be added later for side-by-side validation. Target GPT share links are needed only when testing begins.

## Workflow

1. The supplied BoundaryBreaker instructions, test library, report template, and reporting workflow are preserved in `source-material/`.
2. Create an authorization/specification file for each target under `targets/`.
3. Analyze the target and assign Rule IDs.
4. Generate a rule-coverage test suite from the imported library.
5. Review the suite, then approve and execute one test prompt or turn at a time.
6. Save exact transcripts and evidence.
7. Score findings, populate the imported report structure, recommend exact fixes, and create regression tests.

## Paths

- Workspace: `F:/hermesData/GPTTest`
- Profile: `C:/Users/micha/AppData/Local/hermes/profiles/gpttest`
