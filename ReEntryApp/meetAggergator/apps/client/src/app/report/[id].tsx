import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { reportReasons } from '@recovery/shared';
import { api } from '../../lib/api';
import { Button, Field, s } from '../../components/ui';
export default function Report() {
  const {id} = useLocalSearchParams<{id:string}>(); const [reason,setReason] = useState<string>('wrong_time'); const [note,setNote] = useState(''); const [sent,setSent] = useState(false); const [busy,setBusy] = useState(false); const [error,setError] = useState('');
  async function submit() { setBusy(true);setError('');try {await api(`/api/v1/meetings/${id}/report`,{method:'POST',body:JSON.stringify({reason,note})});setSent(true);}catch(e){setError(e instanceof Error ? e.message : 'Could not submit report.');}finally{setBusy(false);} }
  return <ScrollView contentContainerStyle={s.page}><View style={s.body}><Text style={s.title}>{sent ? 'Thank you for letting us know.' : 'Help keep meeting details accurate.'}</Text>{sent ? <Text style={s.text}>Your report is awaiting review. It does not automatically change the listing.</Text> : <View style={s.card}><Text style={s.text}>Choose what needs correcting. Please leave out personal recovery details and online meeting passwords.</Text><View style={s.row}>{reportReasons.map(r => <Button key={r} secondary={reason!==r} onPress={() => setReason(r)}>{r.replaceAll('_',' ')}</Button>)}</View><Field label="Additional information, optional" multiline maxLength={2000} value={note} onChangeText={setNote}/>{!!error && <Text style={s.error}>{error}</Text>}<Button disabled={busy} onPress={submit}>{busy ? 'Submitting…' : 'Submit report'}</Button></View>}</View></ScrollView>;
}
