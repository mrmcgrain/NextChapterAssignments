# Sobriety.tools preliminary Arizona comparison

September 30, 2026. Read-only test against the current local database. No imports or source refreshes.

| Measure | Listings |
|---|---:|
| Our active Arizona listings | 2,634 |
| Their retrieved listings explicitly labelled AZ | 2,577 |
| Confident overlap | 2,095 |
| Ours without a confident match | 539 |
| Theirs without a confident match | 482 |
| Uncertain match pairs for review | 317 |

These are schedule listings, not unique groups. Unmatched records are not proven unique meetings.

Their AZ-labelled sample contains 2,541 AA, 14 SMART and 22 Wellbriety listings. Our database contains 2,411 AA, 125 NA, 73 CMA, 21 Recovery Dharma and 4 MA listings. Confident matches in this snapshot were AA only. Absence of AZ-labelled NA/CMA/RD rows does not establish absence from the provider.

## Access and completeness

The developer page identifies https://jb4l-meeting-api.erich-owens.workers.dev. Its /v1/meetings route accepts lat/lng, radius, day, program and limit. Responses are capped at 500; tested offset did not change returned records.

Initial X-API-Key requests used public access. Authorization: Bearer returned HTTP 401 with "API key is pending approval". No key is stored in this project or report.

Collection used a 350-mile radius from 34.3,-111.7, partitioned by day and known/observed program. Saturated AA queries used four overlapping 175-mile Arizona regions. Final Saturday partitions received HTTP 429; Sunday LifeRing received HTTP 500. Counts are incomplete and cannot establish whether complete provider coverage is smaller or larger.

389 fetched IDs lacked state labels and were excluded. Initial snapshot did not retain all excluded rows; their classification remains unknown. Collector now checkpoints all allowlisted rows and accepts AZ and Arizona labels. Geographic API may omit online meetings without coordinates. Unknown programs beyond saturated responses may remain undiscovered.

## Matching and quality

Confident overlap requires equal program, weekday, published start time and normalized name, plus matching street address or coordinates within 0.2 miles. Matches are one-to-one. Name/schedule-only and location/schedule-only pairs need review.

All 2,577 AZ-labelled records omit timezone and source attribution; 2,553 omit city, six omit address. Times are compared literally with no timezone assumptions. This endpoint needs additional timezone and attribution evidence before importing through our current schema.

Exact name/schedule/address/coordinate fingerprints identify 31 extra duplicate-candidate rows in their sample and 14 in ours. No deletions authorized or performed. A Wellbriety listing named "Solutions Of Sobriety Wednesday Meeting" is returned with day 0, so published schedules require source review.

## Evidence and next step

- scripts/compare-sobriety.mjs: read-only collector and matching; self-check passed. Defaults to bearer authentication. --public explicitly selects public quota. Stops on rate limit and checkpoints successful requests.
- output/sobriety-comparison/report.json: allowlisted evidence, requests, overlap and review pairs; no keys, contacts or conference URLs.
- Complete collection once approved access or public quota is available; review missing-state rows and duplicates before claiming net new meetings. Keep direct adapters until coverage, timezone and attribution are established.

