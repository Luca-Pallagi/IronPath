import { Stack, useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  return (
  <Stack>
    <Stack.Screen
      name="index"
      options={{
            title: 'Home',
          }}
    />
    <Stack.Screen
      name="trainingsplan"
      options={{
            title: 'Trainingsplan',
          }}
    />
    <Stack.Screen
      name="uebungen"
      options={{
            title: 'Übungen',
          }}
    />
    <Stack.Screen
      name="skillTree"
      options={{
            title: 'Skill-Tree',
          }}
    />
  </Stack>  
  )
}
