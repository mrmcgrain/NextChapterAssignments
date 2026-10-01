import { Pressable, Text, View } from 'react-native';
import { colors, s } from './ui';

const groups = [
  { name: 'Meeting Style', options: [['discussion','Discussion'],['speaker','Speaker'],['book_study','Book Study / Big Book'],['step','Step Study'],['meditation','Meditation']] },
  { name: "Who It's For", options: [['women','Women'],['men','Men'],['lgbtq','LGBTQIA+'],['young_people','Young People']] },
  { name: 'Accessibility', options: [['wheelchair_accessible','Wheelchair']] },
  { name: 'Attendance', options: [['open','Open'],['closed','Closed'],['beginner','Beginner']] },
  { name: 'Language', options: [['english','English'],['spanish','Spanish']] },
];

export const characteristicLabels = Object.fromEntries(groups.flatMap(group => group.options));
export function MeetingFilters({selected, onChange}: {selected: string[]; onChange: (values: string[]) => void}) {
  const toggle = (value: string) => onChange(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
  function option(value: string, label: string) {
    const checked = selected.includes(value);
    return <Pressable key={label} accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{checked}} onPress={() => toggle(value)} style={[s.secondary, {borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, minHeight: 48}, checked && {backgroundColor: colors.accent}]}>
      <Text style={[s.label, checked && {color: colors.white}]}>{checked ? '✓ ' : ''}{label}</Text>
    </Pressable>;
  }
  return <View style={{gap: 16}}>
    <Text accessibilityRole="header" style={s.heading}>Meeting Filters · {selected.length}</Text>
    <Text style={s.text}>Choose options, then press Search meetings. Results must match every selected option. Sources do not supply every characteristic; untagged meetings will not match that filter. Book Study includes fellowship-specific books, including the AA Big Book.</Text>
    {groups.map(group => <View key={group.name} style={{gap: 8}}>
      <Text style={s.label}>{group.name} · {group.options.filter(([value]) => selected.includes(value)).length}</Text>
      <View style={s.row}>{group.options.map(([value, label]) => option(value, label))}</View>
    </View>)}
    <Text style={s.label}>Quick Filters</Text>
    <View style={s.row}>{option('wheelchair_accessible','Wheelchair Accessible')}{option('beginner','Newcomer Friendly')}</View>
  </View>;
}

