import { cityMapping } from 'city-timezones';
import { find } from 'geo-tz';

const text = (value: unknown) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
const states = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '));
// Reviewed city centres supplement omissions in the bundled city dataset.
const arizonaCityCentres: Record<string, [number, number]> = {
  tempe:[33.4255,-111.94], mesa:[33.4152,-111.8315], chandler:[33.3062,-111.8413],
  gilbert:[33.3528,-111.789], scottsdale:[33.4942,-111.9261], glendale:[33.5387,-112.186],
  peoria:[33.5806,-112.2374], surprise:[33.6292,-112.3679], avondale:[33.4356,-112.3496],
  goodyear:[33.4353,-112.3577], 'apache junction':[33.415,-111.5496],
  'fountain hills':[33.6042,-111.7257], 'sun city':[33.5975,-112.2718]
};

export type CachedTimezone = {timezone:string; method:string};
const cityZones = new Map<string, string[]>();
for (const candidate of cityMapping) {
  if (candidate.iso2 !== 'US') continue;
  for (const name of [candidate.city, candidate.city_ascii]) {
    const key = `US|${candidate.state_ansi}|${text(name).toLowerCase()}`;
    cityZones.set(key, [...new Set([...(cityZones.get(key) ?? []), candidate.timezone])]);
  }
}
const processCache = new Map<string, CachedTimezone>();

export function createTimezoneResolver(cache = new Map<string, CachedTimezone>(), geographicLookup = find) {
return function fill(input: unknown): unknown {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return input;
  const record = input as Record<string, unknown>;
  // Malformed explicit values remain validation errors, rather than being overwritten.
  if (record.timezone != null && (typeof record.timezone !== 'string' || text(record.timezone))) return input;
  const city = text(record.city);
  const state = text(record.state).toUpperCase();
  if (!city || !states.has(state)) return input;
  const cityKey = `US|${state}|${city.toLowerCase()}`;
  const centre = state === 'AZ' ? arizonaCityCentres[city.toLowerCase()] : undefined;
  const cityCandidates = cityZones.get(cityKey) ?? [];
  const knownCity = Boolean(centre) || cityCandidates.length === 1;
  let zones: string[];
  let method: string;
  const { latitude, longitude } = record;
  const hasCoordinates = typeof latitude === 'number' && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
      typeof longitude === 'number' && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
  // Known cities reuse one city/state value. Unlisted or ambiguous cities keep precise location keys.
  const cacheKey = knownCity ? cityKey : hasCoordinates ? `${cityKey}|${latitude}|${longitude}` : cityKey;
  const cached = cache.get(cacheKey);
  if (cached) {
    zones = [cached.timezone];
    method = cached.method;
  } else if (knownCity) {
    zones = centre ? geographicLookup(...centre) : cityCandidates;
    method = centre ? 'reviewed_city_centre' : 'city_state_dataset';
  } else if (hasCoordinates) {
    zones = geographicLookup(latitude as number, longitude as number);
    method = 'meeting_coordinates';
  } else {
    return input;
  }
  if (zones.length !== 1 || zones[0].startsWith('Etc/')) return input;
  const timezone = zones[0];
  try { new Intl.DateTimeFormat('en', {timeZone:timezone}); } catch { return input; }
  cache.set(cacheKey, {timezone,method});
  const raw = record.rawSourceData;
  const rawSourceData = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  return {
    ...record, timezone,
    rawSourceData: {
      ...rawSourceData,
      timezoneResolution: {method, city, state, country:'US', timezone, cacheKey},
      timezoneAssumptionNote: `The source does not provide a timezone. We resolved ${timezone} from the location of ${city}, ${state}, US${method === 'meeting_coordinates' ? ' using the meeting coordinates' : ''}. Confirm the meeting time with the source.`
    }
  };
};
}

export const fillMissingTimezone = createTimezoneResolver(processCache);
