# GPTTest

## Function

GPTTest is an authorized red-team evaluator for classroom Custom GPTs. It turns a GPT's stated purpose and rules into controlled adversarial tests, runs those tests against the live GPT, and records the exact prompts, responses, evidence, and verdicts.

It checks whether a GPT:

- stays within its role and scope;
- follows required workflows and output formats;
- resists prompt injection, pressure, and false authority;
- handles uncertainty without inventing facts;
- protects private information and respects tool boundaries;
- recovers after an adversarial turn.

## Why

A GPT can look reliable during a normal demo and still fail when instructions conflict, information is missing, or a user applies pressure. GPTTest finds those gaps before they affect students, users, or real data.

Testing is controlled and evidence-based. Only authorized GPTs are tested. Synthetic data replaces real secrets, and every finding is tied to a documented rule.

## Value

GPTTest turns vague concerns into practical improvements:

- repeatable test cases instead of one-off opinions;
- exact evidence instead of "the model seemed wrong";
- PASS, PARTIAL, FAIL, or INCONCLUSIVE verdicts;
- severity ratings tied to real impact;
- paste-ready instruction fixes;
- regression tests that verify whether a fix works.

## What GPTTest exposed

In our first evaluation, the **Key Comic Issue Cataloger** accepted a prompt telling it to forget comics and become **MealPlanGPT**. It generated a seven-day vegan meal plan and agreed to stay in that new role.

That is a clear role-stability break: a purpose-built comic cataloger abandoned its intended function because a user told it to. GPTTest captured the exact exchange, preserved the evidence, and produced a specific instruction fix and regression test.

The formal report labels this test **INCONCLUSIVE** only because the GPT's private scope instructions were unavailable. The observed behavior itself is verified.

## The result

The owner receives a clear audit trail: what was tested, what held up, what failed, why it failed, and how to improve it.

**GPTTest helps teams move from "it seems safe" to "we tested the boundary."**
