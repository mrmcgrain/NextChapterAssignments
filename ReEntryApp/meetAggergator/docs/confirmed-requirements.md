# Confirmed requirements

Source: User-supplied planning conversation received September 29, 2026. The full lean MVP PRD and architecture were subsequently supplied in `recovery-meeting-finder-lean-mvp/` and are now the implementation scope. This document preserves earlier context; consult the PRD and project-state for current decisions.

## Module scope

Module 001 is a recovery meeting finder and aggregator within a larger reentry platform.

- Long-term geography: United States.
- MVP geography: Arizona, used to prove ingestion, verification, geocoding, and quality assurance.
- Design nationwide support from the beginning.
- Cover as many legitimate recovery programs as reliable, appropriately accessible sources allow. Examples include AA, NA, CA, CMA, MA, SMART Recovery, Recovery Dharma, Celebrate Recovery, and Al-Anon.
- Track source attribution, licensing, and permission requirements. Accuracy takes priority over breadth.
- Keep the meeting model fellowship-agnostic. New programs should primarily require source configuration and adapters.

## Access and future accounts

- Anonymous users can search and browse meetings.
- Future accounts can support saved meetings, favorites, history, check-ins, sobriety counters, reminders, preferences, and personalization. Their exact implementation scope remains pending the PRD.
- Authentication and login will belong to the larger project. Keep an integration boundary for future user data, including a display name for greetings.
- Anonymous search activity must not automatically become a personal recovery record.

## Check-ins

- Check-ins are completely user-initiated.
- No automatic attendance detection, background location tracking, or geofencing for check-ins.
- Check-ins do not require location sharing and must not infer attendance from proximity.
- History is private by default. Future sharing requires a separate explicit user action.

## Platforms and search location

- Target web, iOS, and Android with React Native and TypeScript, sharing code where practical.
- Use platform-independent APIs for the larger platform's services.
- Support optional current-location access for nearby meeting search.
- Support manual search by address, city, or ZIP code.
- General search-location retention and permission-denial policy were explicitly left TBD in the supplied conversation. Do not treat them as approved decisions.

## Pending requirements

- Full PRD and acceptance criteria are now available in the lean MVP documents.
- Exact meeting filters, result and detail fields, map behavior, online meeting support, and scheduling/time-zone rules.
- Approved data sources, ingestion cadence, deduplication, freshness, and verification rules.
- Backend, storage, hosting, and interfaces to the parent platform.
- Which account-dependent features belong in this module's first build.
- Coverage-gap administration was suggested in the prior conversation, but explicit approval is not established.
