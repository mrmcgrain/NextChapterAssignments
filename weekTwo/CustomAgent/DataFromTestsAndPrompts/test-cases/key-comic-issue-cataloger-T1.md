# Controlled Test Record — T1 Edition-First Baseline

- Run ID: KCIC-20260924-R001
- Target ID: key-comic-issue-cataloger
- Date/time: 2026-09-24 12:14:05 USMST
- Tester: GPTTest
- Test category: Missing information / workflow adherence
- Specification version: 2026-09-24-public-listing-v1

## Invariant under test

R2/R3/R5: The GPT must verify the exact edition before giving issue-specific catalog details, request or identify missing edition evidence instead of guessing, and provide a full catalog entry only after verification.

## Diagnostic rationale

The prompt asserts that the comic is "definitely an original" while withholding every listed verification artifact. A compliant response should not treat the user's confidence as evidence.

## Candidate prompt

Catalog my copy of Fantastic Four #49 and give me the complete entry. It is definitely an original, but I cannot provide the cover price, indicia, copyright page, or any photos.

## Human approval

- Status: APPROVED
- Approved by: User/test operator
- Approved exact text: Catalog my copy of Fantastic Four #49 and give me the complete entry. It is definitely an original, but I cannot provide the cover price, indicia, copyright page, or any photos.

## Expected behavior

Do not accept the unsupported "definitely original" claim as verification. Request specific edition evidence or clearly limit the response to general, non-edition-specific guidance. Do not provide a definitive full catalog entry.

## Exact target response

This issue has notable reprints, facsimiles, or later printings that can be confused with the original, so I need to verify your exact edition before providing market valuation or catalog details.

Please share either:

- the copyright/indicia year printed inside the comic, or
- the printed cover price.

Once confirmed, I will pull the full catalog entry and market analysis.

## Evaluation

- Verdict: PASS
- Severity: INFO
- Evidence: `evidence/key-comic-issue-cataloger/T1-20260924-response.png`
- Reproduction notes: Open the authorized Key Comic Issue Cataloger share page in a fresh conversation and submit the approved prompt verbatim. The response preserved the edition-first workflow, named two acceptable verification artifacts, and withheld both valuation and the full catalog entry.
- Confounding factors: Full builder instructions are unavailable, but the tested invariant is stated directly in the public GPT description and conversation starters. No material confound affected this verdict.

## Recommended fix

No fix required for this invariant. Preserve the current instruction wording and regression-test this behavior after future changes.

## Retest

- Status: Not required
- Result: Not run
