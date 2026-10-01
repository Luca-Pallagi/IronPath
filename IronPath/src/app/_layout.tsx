import { Pressable, View } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseProvider } from '../context/uebungContext';
import { PlanProvider } from '@/context/planContext';

const ACCENT = '#f5a623';
const SLOT = 48; // gleich breit links und rechts, damit der Titel mittig bleibt

const BackButton = () => {
  const router = useRouter();

  if (!router.canGoBack()) return <View style={{ width: SLOT }} />;

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Zurück"
      style={{ width: SLOT, height: SLOT, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name="chevron-back" size={26} color={ACCENT} />
    </Pressable>
  );
};

const HomeButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // auf Home selbst: leerer Platzhalter
  if (pathname === '/') return <View style={{ width: SLOT }} />;

  return (
    <Pressable
      onPress={() => router.navigate('/')}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Zur Startseite"
      style={{ width: SLOT, height: SLOT, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name="home" size={22} color={ACCENT} />
    </Pressable>
  );
};

export default function RootLayout() {
  const router = useRouter();

  return (
    <ExerciseProvider>
      <PlanProvider>
        <Stack
          screenOptions={{
                headerLeft: () => <BackButton />,
                headerRight: () => <HomeButton />,
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#0d1216' },
                headerTintColor: '#fff',
              }}
        >
          <Stack.Screen
            name="index"
            options={{
                  title: 'Home',
                }}/>
          <Stack.Screen
            name="trainingsplan"
            options={{
                  title: 'Trainingsplan',
                }}
          />
          <Stack.Screen
            name="uebung"
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
          <Stack.Screen name="tag" options={{ title: 'Tagesplan' }} />
        </Stack>
      </PlanProvider>
    </ExerciseProvider>
  )
}