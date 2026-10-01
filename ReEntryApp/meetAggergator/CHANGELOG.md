# Changelog

## Unreleased

- Added Git upload exclusions for local artifacts, backups and credential files.

- Added scoped administrator firewall repair for local phone access to preview port 8081; preserved other Node port blocks and firewall profiles.

- Fixed Android preview build packaging to include npm workspaces/shared package and root lockfile; added audited EAS archive wrapper and port 8081 Wi-Fi test configuration, with preview-only Android HTTP support.

- Moved all optional meeting filter controls into a collapsed Filters dropdown above the selected breadcrumbs, retaining selections and visible clear-all/search actions.

- Added read-only Sobriety.tools comparison script and preliminary Arizona coverage report, including overlap, duplicate candidates, field-quality checks and incomplete-collection limitations. No imports or application behavior changes.

### Added
- Added Recovery Dharma development importer with source-specific filter mappings, 21 Arizona listings and schedule-conflict rejection; added English filter and broadened book-study label.
- Documented live Recovery Dharma feed validation, Arizona coverage and pre-import data issues.
- Documented the confirmed Tempe Monday NA timezone omissions and current database service outage in project records.


### Fixed
- Apply automatic missing-timezone repair to every source import using city/state and offline geographic data; persist and reuse resolutions in PostgreSQL. Replace Tempe/Tucson one-off assignments, retain source values and provenance, and recover 346 NA schedules including Wild Bunch Sunday/Tuesday. Document policy in TimezoneFix.md and add regression/cache verification coverage.
- Allow multiple programs, formats and days with individual removable breadcrumbs; validate and query multiple days while preserving single-day API compatibility.
- Import missing-timezone Tempe AZ NA meetings using owner-approved America/Phoenix fallback and existing assumption footnote. Preserve explicit timezones and other-city validation.

- Added Arizona ZIP and ZIP+4 city lookup for regular and upcoming meeting searches, visible city confirmation, provider attribution and actionable lookup errors.

- Refreshed source examples with actual PostgreSQL rows after Docker recovered.

### Added
- Added Recovery Dharma development importer with source-specific filter mappings, 21 Arizona listings and schedule-conflict rejection; added English filter and broadened book-study label.
- Documented live Recovery Dharma feed validation, Arizona coverage and pre-import data issues.
- Grouped meeting filters with removable breadcrumbs, selection counts, clear-all and synchronized wheelchair/newcomer shortcuts. Unmapped source options visibly unavailable.


### Added
- Added Recovery Dharma development importer with source-specific filter mappings, 21 Arizona listings and schedule-conflict rejection; added English filter and broadened book-study label.
- Added a failure and owner-requested change register, starting with missing-timezone meeting exclusions and the scoped Tempe fix.


### Added
- Added Recovery Dharma development importer with source-specific filter mappings, 21 Arizona listings and schedule-conflict rejection; added English filter and broadened book-study label.
- Per-search console diagnostics for matching listings omitted by the result limit, validation-rejected candidates with field-specific reasons, missing coordinates and source sync status. Persist safe rejected-record snapshots during approved source refresh.

### Fixed
- Apply automatic missing-timezone repair to every source import using city/state and offline geographic data; persist and reuse resolutions in PostgreSQL. Replace Tempe/Tucson one-off assignments, retain source values and provenance, and recover 346 NA schedules including Wild Bunch Sunday/Tuesday. Document policy in TimezoneFix.md and add regression/cache verification coverage.
- Removed unavailable meeting-filter controls from the finder while retaining supported options and shortcuts.
- Removed unavailable meeting-filter controls from the finder while retaining supported options and shortcuts.
- Find a Meeting Now scrolls to the meeting listings after the search completes.

### Added
- Added Recovery Dharma development importer with source-specific filter mappings, 21 Arizona listings and schedule-conflict rejection; added English filter and broadened book-study label.
- Load more for meeting searches in batches of 50, visible batch-size note and loaded count. Preserve submitted filters and upcoming reference time across pages; keep loaded results on retryable page failures.


### Added
- Search-results map showing every matching physical meeting independently of list pagination, grouped location dots, schedules/detail links, and unmapped counts. Added Expo-compatible WebView for native map rendering.

### Fixed
- Apply automatic missing-timezone repair to every source import using city/state and offline geographic data; persist and reuse resolutions in PostgreSQL. Replace Tempe/Tucson one-off assignments, retain source values and provenance, and recover 346 NA schedules including Wild Bunch Sunday/Tuesday. Document policy in TimezoneFix.md and add regression/cache verification coverage.
- Fixed OpenStreetMap blocked web tiles by rendering bundled Leaflet directly in the page, preserving the valid Referer header, map attribution and ordinary browser caching.

- Documented repeated timezone repair in failure register entry 3 and clarified universal resolution and saved-location reuse requirements in TimezoneFix.md.




### 2026-09-30 project location
- Moved project under NextChapterAssignments/ReEntryApp/meetAggergator and repaired npm workspace junctions.



