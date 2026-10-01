import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import type { Meeting } from '../lib/api';
import 'leaflet/dist/leaflet.css';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export default function MeetingMap({meetings}: {meetings:Meeting[]}) {
  const container = useRef<HTMLDivElement>(null);
  const [error,setError] = useState('');
  useEffect(() => {
    let disposed = false;
    let map: import('leaflet').Map | undefined;
    void import('leaflet').then(L => {
      if(disposed || !container.current) return;
      setError('');
      map = L.map(container.current,{scrollWheelZoom:false});
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom:19,referrerPolicy:'strict-origin-when-cross-origin',
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).on('tileerror',() => {if(!disposed) setError('Map tiles unavailable. Meeting dots and the list are still available.');}).addTo(map);
      const groups = new Map<string,Meeting[]>();
      for(const meeting of meetings) {
        if(meeting.latitude === null || meeting.longitude === null) continue;
        const key = `${meeting.latitude},${meeting.longitude}`;
        groups.set(key,[...(groups.get(key) ?? []),meeting]);
      }
      const points: import('leaflet').LatLngTuple[] = [];
      for(const group of groups.values()) {
        const first = group[0];
        const point: import('leaflet').LatLngTuple = [first.latitude!,first.longitude!];
        points.push(point);
        const popup = document.createElement('div');
        popup.style.maxHeight = '240px'; popup.style.overflow = 'auto';
        for(const meeting of group) {
          const title = document.createElement('strong'); title.textContent = meeting.name; popup.append(title);
          const info = document.createElement('p'); info.textContent = `${meeting.fellowship} · ${days[meeting.dayOfWeek]} · ${meeting.startTime} · ${meeting.venueName || meeting.address || 'Meeting location'}`; popup.append(info);
          const button = document.createElement('button'); button.textContent = 'View meeting details'; button.style.padding = '8px'; button.style.marginBottom = '8px'; button.style.cursor = 'pointer';
          button.onclick = () => router.push(`/meetings/${meeting.id}`); popup.append(button);
        }
        L.circleMarker(point,{radius:group.length>1?10:7,color:'#ffffff',weight:2,fillColor:'#087f75',fillOpacity:0.95})
          .addTo(map).bindPopup(popup).bindTooltip(`${group.length} meeting${group.length === 1 ? '' : 's'} here`);
      }
      if(points.length) map.fitBounds(L.latLngBounds(points),{padding:[30,30],maxZoom:14});
      else map.setView([34.2,-111.8],6);
    }).catch(() => {if(!disposed) setError('Map unavailable. Use the meeting list below.');});
    return () => {disposed = true; map?.remove();};
  }, [meetings]);
  return <div style={{position:'relative'}}>
    <div ref={container} role="region" aria-label="Map of matching meetings" style={{height:420,width:'100%',borderRadius:16,zIndex:0}} />
    {!!error && <div role="status" style={{position:'absolute',top:8,left:55,zIndex:1,background:'white',padding:8,borderRadius:6}}>{error}</div>}
  </div>;
}
