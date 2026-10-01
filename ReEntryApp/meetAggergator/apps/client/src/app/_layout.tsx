import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function Layout() {
  return <SafeAreaProvider><Stack screenOptions={{headerStyle: {backgroundColor: '#F6F5EF'}, headerTintColor: '#163C35'}}><Stack.Screen name="index" options={{title: 'Recovery Meeting Finder'}}/><Stack.Screen name="meetings/[id]" options={{title: 'Meeting details'}}/><Stack.Screen name="report/[id]" options={{title: 'Report incorrect information'}}/></Stack></SafeAreaProvider>;
}
