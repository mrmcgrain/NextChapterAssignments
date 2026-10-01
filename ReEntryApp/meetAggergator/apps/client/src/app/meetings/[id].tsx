import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Linking, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { api, type Meeting } from '../../lib/api';
import { Button, s } from '../../components/ui';
export default function Detail() {
  const {id} = useLocalSearchParams<{id:string}>();
  const [meeting,setMeeting] = useState<Meeting>(); const [error,setError] = useState('');
  useEffect(() => {api<Meeting>(`/api/v1/meetings/${id}`).then(setMeeting).catch(e => setError(e.message));},[id]);
  const m = meeting;
  return <ScrollView contentContainerStyle={s.page}><View style={s.body}>{error ? <Text style={s.error}>{error}</Text> : !m ? <ActivityIndicator/> : <>
    <Text style={s.eyebrow}>{m.fellowship} · {m.format.replace('_',' ')}</Text><Text style={s.title}>{m.name}</Text>
    <View style={s.card}><Text style={s.heading}>When and where</Text><Text style={s.text}>{['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][m.dayOfWeek]} · {m.startTime}{m.endTime ? `–${m.endTime}` : ''} · {m.timezone}</Text>
      {!!m.timezoneAssumptionNote && <Text style={s.text}>* {m.timezoneAssumptionNote}</Text>}
      {!!m.venueName && <Text style={s.text}>{m.venueName}</Text>}<Text style={s.text}>{[m.address,m.city,m.state,m.postalCode].filter(Boolean).join(', ')}</Text>
      {!!m.address && <Button secondary onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([m.address,m.city,m.state].filter(Boolean).join(', '))}`).catch(() => setError('Could not open directions.'))}>Open directions</Button>}
      {!!m.onlineUrl && <Button onPress={() => Linking.openURL(m.onlineUrl!).catch(() => setError('Could not open the online meeting.'))}>Open online meeting</Button>}
      {!!m.onlineNotes && <Text style={s.text}>{m.onlineNotes}</Text>}<Text style={s.text}>{m.characteristics.length ? m.characteristics.join(' · ') : 'No additional characteristics supplied.'}</Text>
    </View><View style={s.card}><Text style={s.heading}>Source information</Text><Text style={s.text}>{m.sourceName}</Text>{!!m.attribution && <Text style={s.text}>{m.attribution}</Text>}<Text style={s.text}>Last synced: {new Date(m.lastSyncedAt).toLocaleString()}</Text><Text style={s.text}>A sync date indicates when data was imported. It does not independently verify that the meeting still takes place.</Text><Button secondary onPress={() => router.push(`/report/${id}`)}>Report incorrect information</Button></View>
  </>}</View></ScrollView>;
}
