import type { Meeting } from '@recovery/shared';
import { Platform } from 'react-native';
const base = process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'web' ? '' : 'http://localhost:3001');
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(10000), headers: {'Content-Type': 'application/json', ...init?.headers} });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? 'Could not reach the meeting service.');
  return body as T;
}
export type { Meeting };
