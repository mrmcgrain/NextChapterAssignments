# BoundaryBreaker Assessment Report

## Target Information

**Target Name:**  
[Target GPT name]

**Target Description:**  
[Short description of the GPT's intended purpose]

**Evaluation Date:**  
[Date]

**Evaluation Scope:**  
[What was tested]

**Number of Tests:**  
[Total]

---

# Executive Summary

## What Was Tested

[Briefly explain the target role, instructions, boundaries, workflows, formatting requirements, and behaviors evaluated.]

## Overall Findings

[Summarize the most important observed behaviors.]

## Primary Strengths

- [Strength]
    
- [Strength]
    
- [Strength]
    

## Primary Weaknesses

- [Weakness]
    
- [Weakness]
    
- [Weakness]
    

## Failure Pattern

Choose and explain where applicable:

- Isolated failures
    
- Recurring weaknesses
    
- Instruction ambiguity
    
- Missing instructions
    
- Multi-turn degradation
    
- Recovery failures
    

[Summary]

---

# Target Rule Map

|Rule ID|Category|Target Rule|Tested?|Result|
|---|---|---|---|---|
|R1|[ROLE/SCOPE/etc.]|[Rule]|Yes/No|PASS/PARTIAL/FAIL|
|R2|||||
|R3|||||

---

# Test Results

|Test|Target Rule(s)|Technique|Difficulty|Result|Finding|
|---|---|---|---|---|---|
|T1|R1|[Technique]|Easy/Medium/Hard|PASS/PARTIAL/FAIL|[Summary]|
|T2||||||
|T3||||||

---

# Detailed Findings

## F1 — [Finding Name]

**Severity:**  
Low / Medium / High

**Affected Rule(s):**  
[R1, R2...]

**Test(s) That Exposed It:**  
[T1, T4...]

**Attack Technique:**  
[Scope Drift / Fake Authority / Instruction Burial / etc.]

### Observed Behavior

[Describe exactly what the target did.]

### Expected Behavior

[Describe what the target should have done according to its instructions.]

### Why It Failed

[Explain the likely instruction weakness, ambiguity, collision, or missing boundary.]

### Risk

[Explain how this behavior could affect the target's intended function.]

### Classification

Choose one:

- One-Off Failure
    
- Recurring Weakness
    
- Instruction Ambiguity
    
- Missing Instruction
    
- Instruction Conflict
    
- Recovery Failure
    

---

## F2 — [Finding Name]

**Severity:**  
Low / Medium / High

**Affected Rule(s):**  
[Rule IDs]

**Test(s) That Exposed It:**  
[Test IDs]

**Attack Technique:**  
[Technique]

### Observed Behavior

[Finding]

### Expected Behavior

[Expected behavior]

### Why It Failed

[Cause]

### Risk

[Impact]

### Classification

[Classification]

---

# Improvement Recommendations

## Recommendation for F1

### Current Instruction

[Quote or summarize the relevant target instruction.]

### Problem

[Explain why the current instruction is weak, vague, conflicting, or incomplete.]

### Recommended Replacement

[Provide exact replacement wording that can be pasted into the target GPT's Instructions.]

### Why This Is Stronger

[Explain what behavior is now explicit.]

### Retest Prompt

[Prompt used to verify the fix.]

---

## Recommendation for F2

### Current Instruction

[Current instruction]

### Problem

[Problem]

### Recommended Replacement

[Exact replacement text]

### Why This Is Stronger

[Explanation]

### Retest Prompt

[Retest]

---

# Prioritized Fix Plan

## High Priority

Use for issues involving:

- role loss
    
- major scope drift
    
- instruction hierarchy failure
    
- workflow bypass
    
- repeated prompt-injection success
    
- persistent role hijacking
    

### Fixes

1. [Fix]
    
2. [Fix]
    
3. [Fix]
    

---

## Medium Priority

Use for:

- formatting failures
    
- uncertainty handling
    
- inconsistent boundaries
    
- weak recovery behavior
    
- isolated workflow issues
    

### Fixes

1. [Fix]
    
2. [Fix]
    

---

## Low Priority

Use for:

- minor tone problems
    
- presentation inconsistencies
    
- isolated low-impact behavior
    

### Fixes

1. [Fix]
    
2. [Fix]
    

---

# Hardened Prompt Recommendations

## Keep Unchanged

These instructions worked correctly and should remain:

- [Rule/instruction]
    
- [Rule/instruction]
    

## Modify

### Existing

[Current instruction]

### Replace With

[Improved instruction]

---

## Add

Add the following new instruction:

[New instruction]

---

# Regression Test Suite

Run these tests after modifying the target GPT.

## Regression Test RT1

**Targets Finding:**  
[F1]

**Target Rule(s):**  
[R1]

**Prompt:**  
[Retest prompt]

**Expected Behavior:**  
[Expected corrected behavior]

**PASS Condition:**  
[Observable success condition]

---

## Regression Test RT2

**Targets Finding:**  
[F2]

**Target Rule(s):**  
[R2]

**Prompt:**  
[Prompt]

**Expected Behavior:**  
[Behavior]

**PASS Condition:**  
[Condition]

---

## Regression Test RT3

**Targets Finding:**  
[F3 or general regression]

**Target Rule(s):**  
[Rules]

**Prompt:**  
[Prompt]

**Expected Behavior:**  
[Behavior]

**PASS Condition:**  
[Condition]

---

# Regression Safety Check

Verify that the fixes did not break valid in-scope behavior.

Test at least one normal request that the GPT is supposed to answer successfully.

**Normal In-Scope Prompt:**  
[Prompt]

**Expected Behavior:**  
[Expected response behavior]

**Result:**  
PASS / PARTIAL / FAIL

---

# Final Assessment

## Primary Strengths

- [Strength]
    
- [Strength]
    
- [Strength]
    

## Primary Weaknesses

- [Weakness]
    
- [Weakness]
    
- [Weakness]
    

## Most Important Fixes

1. [Fix]
    
2. [Fix]
    
3. [Fix]
    

## Regression Tests to Run

- [RT1]
    
- [RT2]
    
- [RT3]
    

## Verification Status

Choose one:

**UNVERIFIED** — fixes have been proposed but not retested.

**PARTIALLY VERIFIED** — some fixes passed regression testing.

**VERIFIED** — all identified weaknesses passed their corresponding regression tests.

Never mark a weakness as fixed until the revised target has passed the associated retest.