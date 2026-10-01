import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { api, type Meeting } from '../lib/api';
import { Button, Field, s, colors } from '../components/ui';
import { MeetingFilters, characteristicLabels } from '../components/meeting-filters';
import MeetingMap from '../components/meeting-map';
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
type MeetingPage = {meetings:Meeting[];hasMore:boolean;nextOffset:number;asOf:string};
export default function Finder() {
  const scrollView = useRef<ScrollView>(null);
  const bodyY = useRef(0);
  const resultsY = useRef(0);
  const scrollAfterSearch = useRef(false);
  const [city,setCity] = useState('');
  const [fellowship,setFellowship] = useState<string[]>([]);
  const [format,setFormat] = useState<string[]>([]);
  const [characteristics,setCharacteristics] = useState<string[]>([]);
  const [filtersOpen,setFiltersOpen] = useState(false);
  const [day,setDay] = useState<number[]>([]);
  const toggle = <T,>(values: T[], value: T) => values.includes(value) ? values.filter(item => item !== value) : [...values, value];
  const [timeAfter,setTimeAfter] = useState('');
  const [radius,setRadius] = useState('10');
  const [coords,setCoords] = useState<{latitude:number;longitude:number} | null>(null);
  const [meetings,setMeetings] = useState<Meeting[]>([]);
  const [mapResult,setMapResult] = useState<{meetings:Meeting[];matchedCount:number;unmappedCount:number} | null>(null);
  const [mapError,setMapError] = useState('');
  const [mapLoading,setMapLoading] = useState(false);
  const [loading,setLoading] = useState(false);
  const [loadingMore,setLoadingMore] = useState(false);
  const [moreError,setMoreError] = useState('');
  const [page,setPage] = useState<{query:string;now:boolean;nextOffset:number;asOf:string;hasMore:boolean} | null>(null);
  const searchGeneration = useRef(0);
  const moreInFlight = useRef(false);
  const [error,setError] = useState('');
  const [locationMessage,setLocationMessage] = useState('');
  const [searched,setSearched] = useState(false);
  const [nowMode,setNowMode] = useState(false);
  const [health,setHealth] = useState('Checking meeting service…');
  useEffect(() => {
    if (loading || !scrollAfterSearch.current) return;
    const frame = requestAnimationFrame(() => {
      scrollView.current?.scrollTo({y: Math.max(0, bodyY.current + resultsY.current - 16), animated: true});
      scrollAfterSearch.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [loading]);
  useEffect(() => { api<{status:string}>('/health').then(() => setHealth('Meeting service connected')).catch(() => setHealth('Meeting service is unavailable. You can retry your search below.')); }, []);
  async function search(now = false, coordinates = coords) {
    const generation = ++searchGeneration.current;
    setMapResult(null); setMapError(''); setMapLoading(false);
    setPage(null); setMoreError(''); setLoadingMore(false);
    if (now) scrollAfterSearch.current = true;
    setError(''); setLoading(true); setSearched(true); setNowMode(now);
    const query = new URLSearchParams();
    if (coordinates) {
      query.set('latitude',String(coordinates.latitude)); query.set('longitude',String(coordinates.longitude)); query.set('radiusMiles',radius);
    }
    if (fellowship.length) query.set('fellowship',fellowship.join(','));
    if (format.length) query.set('format',format.join(','));
    if (characteristics.length) query.set('characteristics',characteristics.join(','));
    if (!now && day.length) query.set('daysOfWeek',day.join(','));
    if (!now && timeAfter) query.set('timeAfter',timeAfter);
    try {
      if (!coordinates && city.trim()) {
        const input = city.trim();
        if (/^\d/.test(input)) {
          if (!/^\d{5}(?:-\d{4})?$/.test(input)) throw new Error('Enter a five-digit ZIP code, such as 85281.');
          const location = await api<{zip:string;city:string;state:string}>(`/api/v1/locations/zip/${input}`);
          query.set('city',location.city);
          setLocationMessage(`${location.zip} is ${location.city}, ${location.state}. Searching meetings in ${location.city}.`);
        } else query.set('city',input);
      }
      void api<unknown>(`/api/v1/meetings/diagnostics?${query}&mode=${now ? 'now' : 'regular'}`).then(diagnostics => console.log('[Meeting search diagnostics]', diagnostics)).catch(e => console.log('[Meeting search diagnostics unavailable]', e instanceof Error ? e.message : 'Unknown error'));
      query.set('limit','50');
      const result = await api<MeetingPage>(`/api/v1/meetings${now ? '/now' : ''}?${query}`);
      if (generation !== searchGeneration.current) return;
      setMeetings(result.meetings);
      setPage({query:query.toString(),now,nextOffset:result.nextOffset,asOf:result.asOf,hasMore:result.hasMore});
      query.set('asOf',result.asOf);
      setMapLoading(true);
      void api<{meetings:Meeting[];matchedCount:number;unmappedCount:number}>(`/api/v1/meetings/map?${query}&mode=${now ? 'now' : 'regular'}`).then(data => {
        if(generation === searchGeneration.current) setMapResult(data);
      }).catch(e => {if(generation === searchGeneration.current) setMapError(e instanceof Error ? e.message : 'Map unavailable.');})
        .finally(() => {if(generation === searchGeneration.current) setMapLoading(false);});
    }
    catch (e) { if (generation === searchGeneration.current) { console.log('[Meeting search failed]', e instanceof Error ? e.message : 'Unknown error'); setMeetings([]); setError(e instanceof Error ? e.message : 'Search failed. Please try again.'); } }
    finally { if (generation === searchGeneration.current) setLoading(false); }
  }
  async function loadMore() {
    if (!page?.hasMore || loading || moreInFlight.current) return;
    const generation = searchGeneration.current;
    moreInFlight.current = true; setLoadingMore(true); setMoreError('');
    const query = new URLSearchParams(page.query);
    query.set('offset',String(page.nextOffset)); query.set('asOf',page.asOf);
    try {
      const result = await api<MeetingPage>(`/api/v1/meetings${page.now ? '/now' : ''}?${query}`);
      if (generation !== searchGeneration.current) return;
      setMeetings(current => [...current,...result.meetings.filter(meeting => !current.some(existing => existing.id === meeting.id))]);
      setPage({...page,nextOffset:result.nextOffset,hasMore:result.hasMore});
      void api<unknown>(`/api/v1/meetings/diagnostics?${query}&mode=${page.now ? 'now' : 'regular'}`).then(diagnostics => console.log('[Meeting search diagnostics]', diagnostics)).catch(e => console.log('[Meeting search diagnostics unavailable]', e instanceof Error ? e.message : 'Unknown error'));
    } catch (e) {
      if (generation === searchGeneration.current) setMoreError(e instanceof Error ? e.message : 'Could not load more meetings. Try again.');
    } finally {
      moreInFlight.current = false;
      if (generation === searchGeneration.current) setLoadingMore(false);
    }
  }
  async function nearby() {
    setLocationMessage('Requesting your location…');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') { setLocationMessage('Location is optional. Enter a city below to search without sharing it.'); return; }
      const position = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
      setCoords(position.coords); setCity(''); setLocationMessage('Using your current location for this search only.'); await search(false, position.coords);
    } catch { setLocationMessage('Could not get your location. Enter a city below to continue.'); }
  }
  const breadcrumbs = [
    ...fellowship.map(value => ({key:`fellowship:${value}`, label:`Program: ${value}`, remove:() => setFellowship(current => current.filter(item => item !== value))})),
    ...format.map(value => ({key:`format:${value}`, label:`Format: ${value.replace('_',' ')}`, remove:() => setFormat(current => current.filter(item => item !== value))})),
    ...day.map(value => ({key:`day:${value}`, label:`Day: ${days[value]}`, remove:() => setDay(current => current.filter(item => item !== value))})),
    ...(timeAfter ? [{key:'time', label:`After: ${timeAfter}`, remove:() => setTimeAfter('')}] : []),
    ...characteristics.map(value => ({key:value, label:characteristicLabels[value] ?? value, remove:() => setCharacteristics(current => current.filter(item => item !== value))})),
  ];
  return <ScrollView ref={scrollView} contentContainerStyle={s.page} keyboardShouldPersistTaps="handled"><View style={s.body} onLayout={event => {bodyY.current = event.nativeEvent.layout.y;}}>
    <View style={{gap:12}}><Text style={s.eyebrow}>ARIZONA · OPEN TO EVERYONE</Text><Text accessibilityRole="header" style={s.title}>A meeting that fits{ '\n'}your day.</Text><Text style={[s.text,{maxWidth:620}]}>Find support close to you, at a time that works. No account needed.</Text></View>
    <View style={s.card}><Text style={s.heading}>Where would you like to look?</Text><View style={s.row}><Button onPress={nearby} disabled={loading}>Find a Meeting Near Me</Button><Button secondary onPress={() => search(true)} disabled={loading}>Find a Meeting Now</Button></View>
      {!!locationMessage && <Text accessibilityLiveRegion="polite" style={s.text}>{locationMessage}</Text>}
      <Field label="Arizona city or ZIP code" placeholder="For example, Tempe or 85281" value={city} onChangeText={v => {setCity(v);setCoords(null);setLocationMessage('');}} />
      <Text style={s.text}>Enter a city or ZIP code. ZIP codes resolve to a city when you search. ZIP lookup provided by Zippopotam.us.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Filters" accessibilityState={{expanded: filtersOpen}} onPress={() => setFiltersOpen(current => !current)} style={[s.secondary,{minHeight:48,padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
        <Text style={s.label}>Filters{breadcrumbs.length ? ` · ${breadcrumbs.length} selected` : ''}</Text>
        <Text style={s.label}>{filtersOpen ? '▴' : '▾'}</Text>
      </Pressable>
      {filtersOpen && <View style={{gap:16}}>
      {coords && <Field label="Within miles" value={radius} onChangeText={setRadius} keyboardType="numeric"/>}
      <Text style={s.text}>Select multiple programs, formats, and days. Results can match any selection within each of these groups.</Text>
      <Text style={s.label}>Fellowship</Text><View style={s.row}>{['','AA','NA','CA','CMA','MA','SMART Recovery','Recovery Dharma'].map(f => <Button key={f} secondary={f ? !fellowship.includes(f) : fellowship.length > 0} onPress={() => setFellowship(current => f ? toggle(current,f) : [])}>{f || 'All programs'}</Button>)}</View>
      <Text style={s.label}>Meeting format</Text><View style={s.row}>{[['','All formats'],['in_person','In person'],['online','Online'],['hybrid','Hybrid']].map(([value,label]) => <Button key={value} secondary={value ? !format.includes(value) : format.length > 0} onPress={() => setFormat(current => value ? toggle(current,value) : [])}>{label}</Button>)}</View>
      <Text style={s.label}>Day</Text><View style={s.row}><Button secondary={day.length > 0} onPress={() => setDay([])}>Any day</Button>{days.map((d,i) => <Button key={d} secondary={!day.includes(i)} onPress={() => setDay(current => toggle(current,i))}>{d.slice(0,3)}</Button>)}</View>
      <Field label="Starts after, local meeting time (HH:MM)" placeholder="18:00" value={timeAfter} onChangeText={setTimeAfter}/>
      <MeetingFilters selected={characteristics} onChange={setCharacteristics}/>
      </View>}
      <View style={{gap: 8}}>
        <Text accessibilityLiveRegion="polite" style={s.label}>Selected filters · {breadcrumbs.length}</Text>
        <View style={s.row}>{breadcrumbs.map(crumb => <Pressable key={crumb.key} accessibilityRole="button" accessibilityLabel={`Remove ${crumb.label} filter`} onPress={crumb.remove} style={[s.secondary,{borderRadius:24,paddingHorizontal:16,paddingVertical:12,minHeight:48}]}><Text style={s.label}>{crumb.label} ×</Text></Pressable>)}</View>
        {!breadcrumbs.length && <Text style={s.text}>No filters selected.</Text>}
        <Button secondary disabled={!breadcrumbs.length} onPress={() => {setCharacteristics([]);setFellowship([]);setFormat([]);setDay([]);setTimeAfter('');}}>Clear all filters ({breadcrumbs.length} selected)</Button>
      </View>
      <Button onPress={() => search()} disabled={loading}>Search meetings</Button>
    </View>
    <View style={{gap:14}} onLayout={event => {resultsY.current = event.nativeEvent.layout.y;}}><Text style={s.heading}>{nowMode ? 'Starting in the next 2 hours' : 'Meeting results'}</Text>
      {!loading && searched && !error && <View style={{gap:10}}>
        {mapLoading && <Text style={s.text}>Loading all matching meeting locations…</Text>}
        {!!mapError && <Text accessibilityRole="alert" style={s.error}>Could not load the map. {mapError} Search again to retry.</Text>}
        {mapResult && <>
          <Text accessibilityLiveRegion="polite" style={s.label}>{mapResult.meetings.length} of {mapResult.matchedCount} matching meetings on the map</Text>
          {mapResult.meetings.length > 0 && <MeetingMap meetings={mapResult.meetings}/>}
          <Text style={s.text}>Tap a dot to see meetings at that location. The map includes all matches, even before you load more listings.</Text>
          {mapResult.unmappedCount > 0 && <Text style={s.text}>{mapResult.unmappedCount} matching meetings are online or missing coordinates and appear only in the list.</Text>}
        </>}
      </View>}
      {loading ? <ActivityIndicator color={colors.accent} accessibilityLabel="Searching meetings"/> : error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : searched && !meetings.length ? <View style={s.card}><Text style={s.heading}>No meetings found for this search</Text><Text style={s.text}>Try a different city, day, or program. Source coverage is still being added.</Text>{nowMode && <Button secondary onPress={() => search(false)}>Show the regular weekly schedule</Button>}</View> : !searched ? <Text style={s.text}>Choose a location or browse all available Arizona meetings.</Text> : meetings.map(m => <Pressable accessibilityRole="button" accessibilityLabel={`View ${m.name}`} key={m.id} onPress={() => router.push(`/meetings/${m.id}`)} style={s.card}><Text style={s.eyebrow}>{m.fellowship} · {m.format.replace('_',' ')}</Text><Text style={s.heading}>{m.name}</Text><Text style={s.text}>{days[m.dayOfWeek]} · {m.startTime} · {m.timezone}</Text><Text style={s.text}>{m.city ?? 'Online'}{m.distanceMiles !== null ? ` · ${m.distanceMiles.toFixed(1)} miles away` : ''}</Text><Text style={s.label}>View meeting details →</Text></Pressable>)}
    </View>
    {!loading && !error && page && meetings.length > 0 && <View style={{gap:12}}>
      <Text style={s.text}>We can only receive 50 listings at a time. Select Load more to see the next listings.</Text>
      <Text accessibilityLiveRegion="polite" style={s.label}>{meetings.length} listings loaded{page.hasMore ? '' : ' · All matching listings loaded'}</Text>
      {!!moreError && <Text accessibilityRole="alert" style={s.error}>{moreError}</Text>}
      {page.hasMore && <Button onPress={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading more…' : 'Load more'}</Button>}
    </View>}
    <View style={{gap:8,paddingBottom:32}}><Text style={s.text}>Meeting information comes from approved sources. Confirm details with the source before traveling.</Text><Text style={s.text}>{health}</Text></View>
  </View></ScrollView>;
}


