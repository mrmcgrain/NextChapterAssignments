# Recovery Meeting Finder — Lean Codex Build Pack

This folder replaces the earlier enterprise-sized implementation plan for the **first build**.

The longer PRD/architecture remains useful as a future-state reference. Codex should use the documents in this folder for the MVP implementation unless a later decision explicitly promotes a deferred capability.

## Build Documents

1. [Lean MVP PRD](./lean-mvp-prd.md)
2. [Lean MVP Architecture](./lean-mvp-architecture.md)

## Build Shape

- 3 epics
- 11 stories
- Arizona MVP
- U.S.-ready data model
- web + iOS + Android
- Expo / React Native / TypeScript
- small Node API
- PostgreSQL/PostGIS
- simple scheduled source sync
- optional AI search

## First Development Sequence

```text
Epic 1
→ foundation
→ meeting model
→ first approved source
→ basic search/detail

Epic 2
→ location
→ filters/list
→ map/detail
→ Find a Meeting Now

Epic 3
→ additional sources + scheduled sync
→ natural-language search
→ reports + release readiness
```

## Immediate Product Dependency

Before implementing the first live source adapter, approve the first real Arizona meeting-data source.

Codex may build fixture adapters and the entire app around test data before that approval.
