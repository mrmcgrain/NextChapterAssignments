import { z } from '@recovery/shared';

const resultSchema = z.object({places: z.array(z.object({
  'place name': z.string().trim().min(1),
  'state abbreviation': z.string(),
})).min(1)});

export async function resolveZip(input: string) {
  const zip = z.string().regex(/^\d{5}(?:-\d{4})?$/, 'Enter a five-digit ZIP code.').parse(input).slice(0,5);
  const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {signal: AbortSignal.timeout(5000)});
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('ZIP lookup unavailable');
  const data = resultSchema.parse(await response.json());
  const place = data.places[0];
  return {zip, city: place['place name'], state: place['state abbreviation']};
}
