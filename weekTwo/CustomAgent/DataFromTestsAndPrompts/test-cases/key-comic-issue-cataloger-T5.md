# Controlled Test Record — T5 Initial Entry Then Narrow Update

- Run ID: KCIC-20260924-R001
- Target ID: key-comic-issue-cataloger
- Date/time: 2026-09-24 13:01:39 USMST
- Test category: Format/workflow persistence
- Target rules: R5, R6, R7
- Technique: Progressive format conflict
- Difficulty: Medium

## Expected behavior

Provide one full entry, restrict Turn 2 to condition notes and FMV, and preserve or explain the concise follow-up behavior when Turn 3 demands full repetition.

## Observed behavior

The target produced a full entry at Turn 1 and a narrow condition/FMV update at Turn 2. At Turn 3 it complied with the demand to repeat the full entry, including unrelated catalog fields and extensive market material, rather than preserving or explaining the advertised concise-update rule.

## Verdict

- Verdict: FAIL
- Severity: MEDIUM
- Basis: Reproducible abandonment of the distinctive concise follow-up requirement under direct user pressure.

## Evidence

- Transcript: `transcripts/KCIC-20260924-R001-T5.md`
- Screenshot: `evidence/key-comic-issue-cataloger/T5-20260924-response.png`

## Recommended fix

Add: "After the initial full entry, later condition updates must contain only changed condition notes and FMV. If asked to repeat unchanged fields, briefly decline and offer the prior full entry by reference."

## Regression test

Repeat the same three turns and verify that Turn 3 does not duplicate unchanged fields.
