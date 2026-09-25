# Project State

## Objective

Keep NextChapter coursework in one public GitHub repository with a folder for each week.

## Architecture

This is a file archive. `weekOne/` contains the earlier assignment. `weekTwo/` contains GPTTest project documents, test records, evidence, a final presentation, and a source snapshot of the static Project Launch Planner. The planner has its own development repository at `https://github.com/mrmcgrain/NextChapter`; this archive contains a snapshot of commit `a7b57a2c2e692551c34ff23914328bc4f36cd34e`.

## Important Files

- `README.md` and `weekTwo/README.md` index the weekly work.
- `.gitignore` excludes local credentials, installed dependencies, Hermes profile state, the nested planner checkout, and generated presentation drafts.
- `weekTwo/CustomAgent/DataFromTestsAndPrompts/` contains the Week Two project.
- `weekTwo/CustomAgent/DataFromTestsAndPrompts/application-source/` contains the planner source snapshot and provenance.
- `weekTwo/CustomAgent/DataFromTestsAndPrompts/reports/BoundaryTrace-2-minute-presentation-both-evidence.pptx` is the archived presentation.
- `logs/conversation-log.md` records meaningful work; this file records current state.

## Services

- Git remote: `https://github.com/mrmcgrain/NextChapterAssignments.git`, branch `main`. The repository is public.
- No running service or deployment for this repository was verified during this work.

## Environment

- Windows with PowerShell and Git.
- The archived planner is static HTML, CSS, and JavaScript. Node.js was available for syntax checks.

## Decisions

- Keep a self-contained `weekTwo/` folder while preserving the separate planner development repository.
- Preserve the local Hermes profile and credential files on disk; exclude them from Git.
- Exclude `node_modules`, generated drafts, and the nested Git repository pointer.
- Preserve exact test transcripts, including their original whitespace.

## Known Issues

- Historical transcripts contain trailing whitespace, so an unrestricted `git diff --check` reports warnings. These evidence files were not reformatted.
- The planner snapshot does not automatically follow its separate development repository.
- The presentation package passed a ZIP integrity check; visual layout was not revalidated in this Git upload task.

## Current Work

- Week Two is published on `main`. No active implementation is in progress.

## TODO

- None.

## Last Known Working State

- GitHub `main` was verified at archive commit `275e42eaca982ce6f65002b489be71e3d25c4a6b`, with 101 Week Two paths and no credential files, `node_modules`, local Hermes profile, or nested Git pointer.
- Planner `script.js` and `seed.js` passed `node --check`.
- Reviewed staged filenames, staged text, the presentation package, and PNG bytes showed no credential-pattern matches.
- The final PowerPoint ZIP had no corrupt member.
