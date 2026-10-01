import { Pressable, StyleSheet, Text, View, TextInput, type TextInputProps } from 'react-native';
import type { ReactNode } from 'react';
export const colors = {ink: '#163C35', muted: '#52645E', paper: '#F6F5EF', white: '#FFFFFF', line: '#CDD8D2', accent: '#21634F'};
export function Button({children, onPress, secondary = false, disabled = false}: {children: ReactNode; onPress: () => void; secondary?: boolean; disabled?: boolean}) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({pressed}) => [s.button, secondary && s.secondary, {opacity: disabled ? 0.5 : pressed ? 0.8 : 1}]}><Text style={[s.buttonText, secondary && {color: colors.ink}]}>{children}</Text></Pressable>;
}
export function Field({label, ...props}: TextInputProps & {label: string}) {
  return <View style={{gap: 8}}><Text style={s.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} style={s.input} {...props}/></View>;
}
export const s = StyleSheet.create({
  page: {flexGrow: 1, backgroundColor: colors.paper, padding: 24, paddingTop: 36, alignItems: 'center'},
  body: {width: '100%', maxWidth: 1000, gap: 24},
  eyebrow: {color: colors.accent, fontSize: 13, letterSpacing: 2, fontWeight: '700'},
  title: {fontSize: 38, fontWeight: '700', color: colors.ink, lineHeight: 44},
  text: {color: colors.muted, fontSize: 16, lineHeight: 25},
  heading: {fontSize: 23, fontWeight: '600', color: colors.ink},
  card: {backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 22, gap: 16},
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center'},
  label: {fontSize: 14, fontWeight: '600', color: colors.ink},
  input: {borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 13, fontSize: 16, minHeight: 48, color: colors.ink, backgroundColor: colors.white},
  button: {backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 14, minHeight: 48, justifyContent: 'center'},
  secondary: {backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line},
  buttonText: {color: colors.white, fontSize: 15, fontWeight: '600'},
  error: {color: '#8A2525', fontSize: 15, lineHeight: 23},
});
