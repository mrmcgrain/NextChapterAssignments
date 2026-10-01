# Recovery Meeting Finder — Lean MVP PRD

## 1. Product Summary

Build a standalone recovery-meeting finder for **Arizona** that runs on **web, iOS, and Android**.

The app aggregates approved recovery-meeting sources into one normalized meeting format, lets users find meetings without creating an account, and supports both ordinary filters and optional natural-language search.

Long-term geography is the **United States**, but the MVP only needs to prove the product in Arizona.

## 2. Locked Product Decisions

- Arizona is the MVP geography.
- United States is the long-term geography.
- Broad recovery-program coverage is the goal.
- Meeting search is available anonymously.
- Login and personal recovery features come later.
- Web, iOS, and Android are first-class targets.
- Client stack: Expo / React Native / TypeScript.
- Users can search by:
  - current location, when they explicitly grant permission;
  - address;
  - city;
  - ZIP code.
- No passive/background location tracking.
- Future meeting check-ins are always initiated by the user.
- AI may interpret a search request, but **AI never invents meetings**.
- Meeting data must come from approved source data stored by the application.
- Default source refresh target is weekly; sources may refresh more often when easy/reliable.
- The product may ship as a standalone App Store / Google Play app.

## 3. MVP User

Primary user:

> A person who wants to quickly find a recovery meeting that fits their location, time, fellowship, and meeting preferences.

The user may be in recovery, newly released, unfamiliar with the area, under time constraints, or simply looking for a meeting nearby.

The app should make finding a meeting easier than visiting several fellowship websites independently.

## 4. MVP Goals

The MVP succeeds if a user can:

1. Open the app without creating an account.
2. Search real Arizona meeting data from multiple approved sources.
3. Search by current location or a manually entered location.
4. Filter by fellowship, time/day, format, and basic meeting characteristics.
5. View results in a list and on a map.
6. Open a meeting detail page.
7. Use a simple **Find a Meeting Now** flow.
8. Use natural language such as:
   - “NA tonight after 6 near Mesa.”
9. Report incorrect meeting information.
10. Use the same core experience on web, iOS, and Android.

## 5. MVP Non-Goals

Do **not** build these as part of Module 001 MVP:

- user registration/login;
- saved meetings;
- favorites;
- meeting history;
- check-ins;
- sobriety counter;
- reminders;
- push notifications;
- sponsor sharing;
- case-manager sharing;
- probation/parole sharing;
- attendance verification;
- transportation planning;
- case management;
- housing/employment/legal/benefits resource directories;
- complex source-health scoring;
- full data-governance platform;
- nationwide rollout;
- advanced analytics.

The architecture should not prevent these later, but Codex should not build them now.

## 6. Core Functional Requirements

### Meeting Data

- Store one normalized meeting format regardless of source.
- Preserve the source name and source-specific ID where available.
- Support:
  - fellowship/program;
  - meeting name;
  - day;
  - start time;
  - timezone;
  - in-person / online / hybrid;
  - address;
  - latitude/longitude when available;
  - online meeting information;
  - basic characteristics/tags.
- Store enough raw/source data to troubleshoot connector issues.
- Do not fabricate missing meeting attributes.

### Data Sources

- Each approved source gets a small adapter/connector.
- A connector:
  1. fetches source data;
  2. parses it;
  3. maps it into the common meeting format;
  4. upserts meetings.
- Sources refresh on a schedule.
- A failed refresh must not wipe out previously valid meetings.
- Codex must not choose or scrape a production source without product approval.

### Search

Anonymous users can search by:

- current location;
- address;
- city;
- ZIP;
- radius;
- fellowship/program;
- day/date;
- time range;
- in-person / online / hybrid;
- supported meeting tags.

Search results show:

- meeting name;
- fellowship;
- day/time;
- format;
- location;
- distance when available.

### Meeting Detail

Meeting detail should show:

- meeting name;
- fellowship;
- schedule;
- physical location where applicable;
- online details where applicable;
- meeting characteristics;
- source name;
- last updated/checked information when available;
- Report Incorrect Information action.

### Find a Meeting Now

Provide a fast search for meetings starting soon.

Inputs:

- current/manual location;
- optional fellowship;
- optional format.

If nothing is found, offer obvious broadening actions such as:

- increase radius;
- show later meetings;
- include online meetings.

Do not silently broaden the search.

### Natural-Language Search

Natural-language input is converted into ordinary search filters.

Example:

> “Find a women’s AA meeting tomorrow morning near Tempe.”

AI output becomes a structured search request.

The normal search service then queries stored meetings.

### Incorrect Meeting Reports

Users can report:

- meeting closed;
- wrong day;
- wrong time;
- wrong address;
- broken online link;
- wrong meeting type/tag;
- other.

A report does not automatically delete or modify the meeting.

For MVP, reports can be reviewed through a minimal internal/admin workflow rather than a large operations dashboard.

## 7. UX Requirements

The home screen should make these actions obvious:

- **Find a Meeting Near Me**
- **Enter City, Address, or ZIP**
- **Find a Meeting Now**
- regular search/filter controls
- natural-language search

Core screens:

1. Home / Meeting Finder
2. Search Results — List
3. Search Results — Map
4. Filters
5. Meeting Detail
6. Find a Meeting Now
7. Natural-Language Search
8. Report Incorrect Information

Target **WCAG AA** where applicable.

The app should feel:

- calm;
- simple;
- trustworthy;
- welcoming;
- noninstitutional;
- nonjudgmental.

## 8. Epic Plan

### Epic 1 — Working Data-to-Screen Foundation

**Goal:** Prove one complete path from an approved Arizona source to a searchable meeting in the app.

#### Story 1.1 — Project Foundation

Set up:

- monorepo;
- Expo React Native client;
- responsive web;
- iOS/Android development builds;
- Node/TypeScript API;
- PostgreSQL/PostGIS;
- shared validation/types;
- basic CI.

**Done when:** client can call `/health`, database is connected, and all three client targets run.

#### Story 1.2 — Common Meeting Model + Source Adapter Interface

Implement a simple normalized meeting schema and a source adapter contract.

Minimum tables/entities:

- meetings;
- sources;
- optional raw source payload/reference;
- incorrect-meeting reports.

Avoid building source-version history, complex provenance graphs, or audit ledgers in MVP.

#### Story 1.3 — First Approved Arizona Source

Connect the first approved real source.

Requirements:

- preserve source identifier where available;
- map source fields into normalized meetings;
- fixture tests;
- safe re-import/upsert;
- failed import does not wipe prior data.

#### Story 1.4 — Basic Search + Meeting Detail

Expose:

- meeting search API;
- basic filters;
- meeting detail API.

Deliver a simple client list and meeting detail screen.

**Epic 1 done when:** a real Arizona meeting can be imported, searched, selected, and viewed on web/iOS/Android.

---

### Epic 2 — Complete Meeting Finder UX

**Goal:** Make the non-AI product genuinely useful.

#### Story 2.1 — Location Search

Support:

- current device location;
- address;
- city;
- ZIP;
- radius search with PostGIS.

Location permission remains optional.

#### Story 2.2 — Full Filters + Results List

Support:

- fellowship;
- day/date;
- time;
- format;
- basic characteristics/tags;
- distance display;
- loading/error/no-result states.

#### Story 2.3 — Map + Deep-Linkable Meeting Detail

Add:

- map results;
- switch between list/map without losing filters;
- map marker → meeting detail;
- shareable meeting URLs;
- directions action.

Map failure must not break list results.

#### Story 2.4 — Find a Meeting Now + No-Results Recovery

Add:

- meetings starting soon;
- time-aware ordering;
- broaden radius/time;
- include online/hybrid fallback.

**Epic 2 done when:** the app is a complete useful Arizona meeting finder without AI.

---

### Epic 3 — Multiple Sources, AI Search, Corrections, Release

**Goal:** Add the convenience and quality features needed for a polished MVP.

#### Story 3.1 — Additional Approved Sources + Scheduled Refresh

Add additional approved Arizona sources.

Implement:

- one adapter per source;
- simple normalization mappings;
- scheduled refresh;
- safe upsert;
- basic duplicate prevention using source ID plus obvious meeting matching.

Do **not** build a sophisticated deduplication engine unless real data proves it is needed.

#### Story 3.2 — Natural-Language Search

Implement:

```text
user text
→ AI structured filters
→ validate
→ normal meeting search
→ stored meeting results
```

Show interpreted filters so users can change them.

If AI fails, normal search remains available.

#### Story 3.3 — Incorrect-Meeting Reports + Release Readiness

Implement:

- user report form;
- minimal protected internal view/API to review reports;
- basic source last-sync visibility;
- basic error logging;
- app icons/configuration;
- web production build;
- iOS build;
- Android build;
- release documentation.

**Epic 3 done when:** Module 001 is ready for an Arizona public MVP release.

## 9. Total Story Count

**11 stories**

- Epic 1: 4
- Epic 2: 4
- Epic 3: 3

## 10. Only Known Product Blocker

Before Story 1.3:

> Approve the first real Arizona meeting-data source.

Each production source should have a short note covering:

- source owner;
- URL;
- access method;
- what fellowship/geography it covers;
- whether we are allowed to aggregate/use the data;
- required attribution;
- expected refresh frequency.

That is enough governance for MVP.
