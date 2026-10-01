# Live source JSON and stored rows

Captured 2026-09-30T05:46:32.684Z. Read-only inspection. Source examples are selected field excerpts, not entire payloads.

## Tucson AA Intergroup

Official directory: https://aatucson.org/meetings/

Source JSON excerpt:

```json
{
  "id": 6035,
  "name": "Across the Pond bring your coffee and a resentment!",
  "day": 1,
  "time": "05:00",
  "end_time": "06:00",
  "attendance_option": "online",
  "location": "Online Meeting",
  "formatted_address": "Tucson, AZ, USA",
  "types": [
    "B",
    "D",
    "LIT",
    "LS",
    "BE",
    "O",
    "ONL"
  ]
}
```

Actual meetings row:

```json
{
  "id": "f4037be2-9290-499e-9913-34f7d9650759",
  "source_slug": "tucson-aa",
  "source_meeting_id": "6035:1",
  "fellowship": "AA",
  "name": "Across the Pond bring your coffee and a resentment!",
  "day_of_week": 1,
  "start_time": "05:00",
  "timezone": "America/Phoenix",
  "format": "online",
  "venue_name": "Online Meeting",
  "address": null,
  "city": "Tucson",
  "state": "AZ",
  "geo_point": null,
  "characteristics": [
    "beginner",
    "discussion",
    "open"
  ],
  "last_synced_at": "2026-09-30T02:06:21.517Z",
  "raw_source_data": {
    "id": 6035,
    "day": 1,
    "slug": "across-the-pond-6",
    "time": "05:00",
    "types": [
      "B",
      "D",
      "LIT",
      "LS",
      "BE",
      "O",
      "ONL"
    ],
    "updated": "2026-03-09 20:54:53",
    "approximate": "yes",
    "attendance_option": "online",
    "timezoneAssumptionNote": "The source does not provide a timezone. We assume Mountain Standard Time (UTC−7), America/Phoenix, year-round. Confirm the meeting time with the source."
  }
}
```

## Arizona Region of Narcotics Anonymous

Official directory: https://arizona-na.org/meetings/full-arizona-regional-meeting-finder/

Source JSON excerpt:

```json
{
  "id_bigint": "10068",
  "meeting_name": "Recovery on the River",
  "weekday_tinyint": "1",
  "start_time": "08:00:00",
  "time_zone": "America/Phoenix",
  "venue_type": "3",
  "location_text": "",
  "location_street": "2041 Swanson Ave",
  "location_municipality": "Lake Havasu City",
  "location_province": "AZ",
  "formats": "O,D,WC,NS,HY"
}
```

Actual meetings row:

```json
{
  "id": "2418d861-53ea-46e7-a5e0-c435e78ab699",
  "source_slug": "arizona-na",
  "source_meeting_id": "10068",
  "fellowship": "NA",
  "name": "Recovery on the River",
  "day_of_week": 0,
  "start_time": "08:00",
  "timezone": "America/Phoenix",
  "format": "hybrid",
  "venue_name": null,
  "address": "2041 Swanson Ave",
  "city": "Lake Havasu City",
  "state": "AZ",
  "geo_point": "POINT(-114.3281723 34.4738642)",
  "characteristics": [
    "open",
    "wheelchair_accessible"
  ],
  "last_synced_at": "2026-09-30T05:44:11.331Z",
  "raw_source_data": {
    "formats": "O,D,WC,NS,HY",
    "id_bigint": "10068",
    "time_zone": "America/Phoenix",
    "start_time": "08:00:00",
    "venue_type": "3",
    "duration_time": "01:00:00",
    "weekday_tinyint": "1",
    "location_province": "AZ",
    "service_body_bigint": "1133"
  }
}
```

## Salt River Intergroup / Phoenix AA

Official directory: https://aaphoenix.org/meetings/

Source JSON excerpt:

```json
{
  "id": 404541,
  "name": "Before Breakfast Club Virtual 1.1",
  "day": 0,
  "time": "05:30",
  "timezone": "America/Phoenix",
  "attendance_option": "online",
  "location": ", Phoenix, AZ 85016, USA",
  "formatted_address": "Phoenix, AZ 85016, USA",
  "types": [
    "O",
    "D",
    "ONL"
  ]
}
```

Actual meetings row:

```json
{
  "id": "ea6eb23b-0971-440c-aa4e-7f2036598c79",
  "source_slug": "phoenix-aa",
  "source_meeting_id": "404541:0",
  "fellowship": "AA",
  "name": "Before Breakfast Club Virtual 1.1",
  "day_of_week": 0,
  "start_time": "05:30",
  "timezone": "America/Phoenix",
  "format": "online",
  "venue_name": ", Phoenix, AZ 85016, USA",
  "address": null,
  "city": "Phoenix",
  "state": "AZ",
  "geo_point": null,
  "characteristics": [
    "open",
    "discussion"
  ],
  "last_synced_at": "2026-09-30T00:55:42.427Z",
  "raw_source_data": {
    "id": 404541,
    "day": 0,
    "slug": "3034",
    "time": "05:30",
    "types": [
      "O",
      "D",
      "ONL"
    ],
    "updated": "2024-11-28 08:35:14",
    "timezone": "America/Phoenix",
    "approximate": "yes",
    "attendance_option": "online"
  }
}
```

## Crystal Meth Anonymous World Services

Official directory: https://www.crystalmeth.org/cma-meeting-directory/

Source JSON excerpt:

```json
{
  "id": 21640,
  "name": "Stepping Into The Solutions",
  "day": 0,
  "time": "11:00",
  "end_time": "12:00",
  "timezone": "America/Phoenix",
  "attendance_option": "online",
  "location": "online",
  "formatted_address": "Phoenix, AZ, USA",
  "types": [
    "ONL"
  ]
}
```

Actual meetings row:

```json
{
  "id": "de470fa4-fdb6-434b-8e46-6622f4f827a1",
  "source_slug": "arizona-cma",
  "source_meeting_id": "21640:0",
  "fellowship": "CMA",
  "name": "Stepping Into The Solutions",
  "day_of_week": 0,
  "start_time": "11:00",
  "timezone": "America/Phoenix",
  "format": "online",
  "venue_name": "online",
  "address": null,
  "city": "Phoenix",
  "state": "AZ",
  "geo_point": null,
  "characteristics": [],
  "last_synced_at": "2026-09-30T00:55:47.063Z",
  "raw_source_data": {
    "id": 21640,
    "day": 0,
    "slug": "stepping-into-the-solutions",
    "time": "11:00",
    "types": [
      "ONL"
    ],
    "updated": "2026-04-20 16:45:48",
    "timezone": "America/Phoenix",
    "approximate": "yes",
    "attendance_option": "online"
  }
}
```

## Marijuana Anonymous World Services

Official directory: https://marijuana-anonymous.org/find-a-meeting/

Source JSON excerpt:

```json
{
  "id": 255535,
  "name": "Fantasy of Functionality",
  "day": 6,
  "time": "18:00",
  "end_time": "19:00",
  "timezone": "America/Phoenix",
  "attendance_option": "in_person",
  "location": "United States - Arizona - Tempe - Pigeon Coop",
  "formatted_address": "4415 S Rural Rd #8, Tempe, AZ 85282, USA",
  "types": [
    "BE",
    "H",
    "D",
    "MED",
    "O",
    "EN"
  ]
}
```

Actual meetings row:

```json
{
  "id": "8d7774e7-9e13-43ef-9c6b-77ed8624882c",
  "source_slug": "arizona-ma",
  "source_meeting_id": "255535:6",
  "fellowship": "MA",
  "name": "Fantasy of Functionality",
  "day_of_week": 6,
  "start_time": "18:00",
  "timezone": "America/Phoenix",
  "format": "in_person",
  "venue_name": "United States - Arizona - Tempe - Pigeon Coop",
  "address": "4415 S Rural Rd #8",
  "city": "Tempe",
  "state": "AZ",
  "geo_point": "POINT(-111.9249813 33.383976)",
  "characteristics": [
    "beginner",
    "discussion",
    "meditation",
    "open"
  ],
  "last_synced_at": "2026-09-30T00:55:49.157Z",
  "raw_source_data": {
    "id": 255535,
    "day": 6,
    "slug": "140966-192",
    "time": "18:00",
    "types": [
      "BE",
      "H",
      "D",
      "MED",
      "O",
      "EN"
    ],
    "updated": "2026-09-26 23:07:02",
    "timezone": "America/Phoenix",
    "approximate": "no",
    "attendance_option": "in_person"
  }
}
```
