import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePlan } from '@/context/planContext';
import { useExercises } from '@/context/uebungContext';
import ExerciseItem from '@/components/exerciseItem';
import Exercise from '@/models/exercise';

export default function TagScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: string }>();
  const { plan } = usePlan();
  const { exerciseList } = useExercises();

  const current = plan.find((d) => d.day === day);
  if (!current) return null;

  // Übungen des Tages aus der Bibliothek holen (gelöschte fallen weg)
  const exercises = current.exercises
    .map((name) => exerciseList.find((e) => e.exercise === name))
    .filter((e): e is Exercise => e !== undefined);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.day}>{current.day}</Text>
        <Text style={styles.title}>{current.title || 'Kein Titel'}</Text>
      </View>

      <FlatList
        style={styles.list}
        data={exercises}
        keyExtractor={(item) => item.exercise}
        renderItem={({ item }) => <ExerciseItem exercise={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>Noch keine Übungen. Tippe unten auf „Tag bearbeiten“.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  day: { fontSize: 26, fontWeight: 'bold' },
  title: { fontSize: 18, color: '#1f7a5c', fontWeight: '600', marginTop: 2 },
  list: { flex: 1 },
  listContent: { paddingTop: 8, paddingBottom: 100 },
  empty: { textAlign: 'center', marginTop: 30, color: '#666', paddingHorizontal: 20 },
  button: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: '#1f7a5c',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});