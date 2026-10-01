# Arizona sources

Owner approved Arizona source discovery September 29, 2026 and explicitly requested live API integrations. Approval permits development integration. Third-party production redistribution terms remain unresolved; registration blocks NODE_ENV=production.

| Source | Official directory | Active imported listings | Latest status |
| --- | --- | ---: | --- |
| Phoenix / Salt River AA | https://aaphoenix.org/meetings/ | 1,891 | Partial: two invalid records skipped |
| Arizona Region NA | https://arizona-na.org/meetings/full-arizona-regional-meeting-finder/ | 112 | Partial: 359 missing timezones |
| CMA World Services, Arizona subset | https://www.crystalmeth.org/cma-meeting-directory/ | 73 | Success |
| MA World Services, Arizona subset | https://marijuana-anonymous.org/find-a-meeting/ | 4 | Success |

Counts verified September 29, 2026 through local /api/v1/sources. Listings represent source schedule records, not unique physical groups.

## Feed contracts
- NA uses public BMLT service body 1190 with recursive child areas at https://bmlt.wszf.org/main_server/client_interface/json/?switcher=GetSearchResults&get_used_formats=1&services[]=1190&recursive=1.
- Phoenix AA uses https://aaphoenix.org/wp-admin/admin-ajax.php?action=meetings.
- CMA uses https://www.crystalmeth.org/wp-admin/admin-ajax.php?action=meetings, filtered to explicit Arizona addresses.
- MA discovers the current same-origin public TSML JSON cache from its official directory each refresh. No cache filename is hardcoded.
- TSML normalization follows https://github.com/code4recovery/spec. Source IDs, explicit timezone and valid weekly schedules are required. Temporary closures and non-Arizona records excluded. Approximate locations suppress exact address and coordinates. Raw retained fields exclude contact and online-access credentials.

## Operations
After migration, register sources in development and import:

```sh
npm run sync --workspace @recovery/api -- all --register-development
```

Then refresh with `npm run sync:sources` or select one registry slug. Registration never re-enables a disabled existing source. Independent failures do not prevent other feeds refreshing; CLI prints counts rather than payloads. Failed, empty and partial imports preserve earlier data. Deployment scheduling and stale-record removal policy remain pending.

## Remaining coverage
Tucson AA public feed returned 522 records without timezone values; no schedules are inferred. CA directory inspected at https://caarizona.org/in-person-meetings/; no usable JSON endpoint found during initial inspection. SMART Recovery, Recovery Dharma, Celebrate Recovery and Al-Anon adapters remain pending. Public feed access does not establish redistribution permission.

## Tucson timezone decision, September 29
Owner explicitly authorized assuming Tucson Mountain Standard Time and adding a footnote. The Tucson AA adapter now uses America/Phoenix, UTC-7 year-round, only when the source omits timezone. It retains timezoneAssumptionNote in stored source metadata; API exposes that field and meeting details show it under the schedule. Explicit source timezones remain unchanged. Live import: 520 eligible listings, zero invalid normalized records skipped. Total development listings: 2,600 across five sources. Other sources retain their existing strict timezone policy.

## Tempe NA timezone decision, September 29
Owner authorized America/Phoenix for missing timezone on explicitly Tempe AZ NA records. Explicit timezone values are preserved; other cities remain strict. Assumption footnote retained through existing API/detail mechanism. Refresh imported 125 records and skipped 346. Both Monday Tempe meetings verified through preview search and detail API.


## Recovery Dharma development integration, September 30
Owner requested including available pulled characteristics in finder filters after validating the RD feed. Registered recovery-dharma for local development using https://recoverydharma.org/wp-admin/admin-ajax.php?action=meetings. Imported 21 Arizona listings, rejected one conflicting Mesa schedule. Potential duplicate pairs preserved as distinct source records pending confirmation. Production redistribution terms remain unresolved; existing production block applies.
