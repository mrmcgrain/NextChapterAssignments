import { describe, expect, it } from 'vitest';
import { candidateMatches } from '../apps/api/src/search-diagnostics.js';
describe('rejected meeting diagnostic candidates', () => {
  it('keeps missing timezone candidates but removes known filter mismatches', () => {
    const m = {city:'Mesa', fellowship:'NA', dayOfWeek:1, startTime:'18:00', timezone:null, characteristics:['women']};
    expect(candidateMatches(m,{city:'mesa',fellowship:['NA'],daysOfWeek:[1,3],characteristics:['women']})).toBe(true);
    expect(candidateMatches(m,{city:'Tempe'})).toBe(false);
    expect(candidateMatches(m,{daysOfWeek:[2]})).toBe(false);
    expect(candidateMatches(m,{timeAfter:'19:00'})).toBe(false);
    expect(candidateMatches(m,{characteristics:['beginner']})).toBe(false);
  });
  it('retains unknown locations and excludes rejected records clearly outside the radius', () => {
    const filters = {latitude:33.4,longitude:-111.9,radiusMiles:10};
    expect(candidateMatches({latitude:null,longitude:null},filters)).toBe(true);
    expect(candidateMatches({latitude:32.2,longitude:-110.9},filters)).toBe(false);
    expect(candidateMatches({latitude:33.4,longitude:-111.9},filters)).toBe(true);
  });
});
