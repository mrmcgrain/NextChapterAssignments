import { useMemo } from 'react';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import type { Meeting } from '../lib/api';
import { mapHtml } from './map-html';
export default function MeetingMap({meetings}: {meetings:Meeting[]}) {
  const html = useMemo(() => mapHtml(meetings), [meetings]);
  return <WebView style={{height:420,flex:0}} originWhitelist={['*']} source={{html}} onMessage={event => {
    try {const {meetingId} = JSON.parse(event.nativeEvent.data);if(meetings.some(m => m.id === meetingId)) router.push(`/meetings/${meetingId}`);} catch {}
  }} />;
}
