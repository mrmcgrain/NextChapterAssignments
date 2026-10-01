# Weekly project recap

## 2026-09-28 to 2026-10-04 | In progress
Last updated: 2026-09-30 17:46:56 -07:00. Partial coverage from this chat; retrospective backfill, no missing days or hours inferred.

- Added and verified web map of all matching physical meeting locations, schedule popups and details navigation.
- Diagnosed OSM street-image failure via live network evidence: missing Referer. Repair remains pending; native maps unverified.
- Maintained project logs; standard Obsidian mirror conflict unresolved.

Sources: [Daily recap](dailyprompt.md), [Conversation history](logs/conversation-log.md), [Exact transcript](logs/prompt-log.md).

- Confirmed no account/key setup is needed for current OSM tile integration; repair remains pending.

- Resolved OSM web tile block through direct Leaflet rendering with valid Referer. Browser street imagery and meeting detail navigation verified; native verification remains pending.

- September 30 live NA comparison verified three Wild Bunch schedules, two rejected for missing timezone and one imported. Tempe comparator uses existing fallback; Tempe NA Monday returns two, Phoenix NA all days six. No application changes; broader timezone handling remains pending.

- Documented repeated timezone repair and saved-location reuse requirement. Current shared resolver uses offline datasets; reusable cache and live rollout remain unverified.
- Verified Obsidian failure note now matches canonical register, including timezone repeat-fix and reuse requirements.

- September 30: Consolidated filter controls into a collapsed Filters dropdown. Selections remain visible as removable breadcrumbs. Typecheck, lint and web export passed; browser/native checks pending.

- Implemented and verified shared missing-timezone import repair with persistent city/location cache. NA recovered 346 schedules, now 471 imported/zero skipped; all three Wild Bunch schedules verified. Six-source total 2,980. Typecheck/lint and all 51 tests passed. Fresh process reused 96 saved resolutions with zero geographic calls for saved Phoenix/Tempe/Tucson and no cache changes after repeat import. Documented TimezoneFix.md; remaining source failures unrelated to NA timezone.


- September 30: moved ReEntryApp into NextChapterAssignments. Inventoried destination regular-file paths and sizes; same-volume rename preserved file contents; repaired three npm workspace junctions. Service and typecheck verification recorded in conversation log.

- Migration verification 2026-09-30 13:16:19 -07:00: typecheck passed, API database connected, preview HTTP 200, proxied meeting query responded. Empty old directory locked; reopen new path in Codex. Existing Obsidian transcript/daily-recap conflicts remain.


### Record reconciliation, 2026-09-30
- Preserved the earlier Obsidian recap timestamp as historical metadata: Last updated: 2026-09-30 17:46:56 -07:00. Partial coverage from this chat; retrospective backfill, no missing days or hours inferred.
- Compared both versions. All recap accomplishments were already retained locally; earlier periods and historical outcomes remain intact. Both installed sync helpers and independent SHA-256 checks verified all seven files; prior sync blockers are resolved.

- 2026-09-30 14:13:22 -07:00: Reconciled project/Obsidian records after preserving both original versions and comparison evidence. No unique mirrored transcript entries were missing locally. All seven files verified equal; unrelated Obsidian notes preserved. Current transcript includes final response; earlier unavailable coverage stays partial. No application code, commit or push.

- 2026-09-30 14:30:11 -07:00: Reviewed next unfinished app milestone. Additional Arizona AA feed inventory is next in the documented coverage-expansion order after Recovery Dharma. Scheduled refresh remains manual and unfinished. Corrected stale RD pending entry; no app implementation this turn.

- 2026-09-30 14:32 -07:00: Restored current local preview after project migration and verified page, search and database. Week September 28-October 4 in progress; partial coverage.


- September 30: Clarified RD counts from saved validation/import evidence, 22 Arizona received and 21 imported.

- September 30: Repaired recurring Obsidian sync conflict caused by line-ending hash differences; preserved both versions, confirmed no mirror-only text, synchronized seven records/recaps. Responsible process unknown.
`n- September 30: Explained APK replacement, future OTA updates and backend/data updates; installed APK unverified.

- September 30: Android preview build attempted; blocked on Expo sign-in before cloud build. Typecheck/lint passed; API URL and existing signing need confirmation.

- September 30: Diagnosed likely PowerShell npx.ps1 launcher block; verified npx.cmd and supplied alternate commands. No policy changes.

- September 30: Confirmed PowerShell launcher failure from user error; npx.cmd workaround supplied, no policy changes.

- September 30: Confirmed Expo sign-in still incomplete with whoami.

- September 30: Fixed EAS workspace packaging and local Android HTTP preview configuration for port 8081; replacement cloud build progressing beyond original failed phase. Local health/search, typecheck/lint verified; phone test pending. Recap conflict resolved.

- September 30: Android preview APK build finished successfully; downloaded 99,370,396-byte signed APK and verified hash/ZIP entries. Uses Wi-Fi API port 8081. PC health/search verified; physical phone test pending. Exact build repair and future wrapper command recorded.


- September 30: Found explicit Windows firewall Node TCP block on Public Wi-Fi and applied UAC administrator repair for only port 8081/local Wi-Fi subnet. Effective rules and healthy PC endpoint verified. Physical phone retest pending; no APK rebuild.

- September 30: User confirmed phone /health now shows ok and connected after scoped firewall repair. Native app test remains next; APK rebuild unnecessary.


- September 30: User confirmed APK not installed yet, only /health opened. Supplied direct APK link and Android installation steps; installation/device app behavior remains pending.

- September 30: Installed verified APK through ADB on live connected OnePlus6T. Install Success, package version1.0.0/code1 verified, MainActivity launch statusok and process running. Native search/map testing next.

- September 30: Curated GitHub upload; typecheck and 44 tests passed, seven integration tests skipped.

- September 30: GitHub application upload completed and remote SHA verified, b7fd1f2.
