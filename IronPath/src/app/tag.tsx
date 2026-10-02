import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlan } from '@/context/planContext';
import { useExercises } from '@/context/uebungContext';
import { useWorkouts } from '@/context/workoutContext';
import Exercise from '@/models/uebung';
import { ExerciseLog } from '@/models/workout';

// Während des Workouts sind die Eingaben Text (damit man z.B. "7," tippen kann)
type DraftSet = { weight: string; reps: string; done: boolean };
type DraftExercise = { exercise: Exercise; sets: DraftSet[] };

const toNumber = (text: string) => {
  const n = Number(text.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

export default function TagScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const { plan, isLoading: planLoading } = usePlan();
  const { exerciseList, isLoading: exercisesLoading } = useExercises();
  const { isLoading: workoutsLoading } = useWorkouts();

  if (planLoading || exercisesLoading || workoutsLoading) return null;

  const current = plan.find((d) => d.day === day);
  if (!current) return null;

  // Übungen des Tages aus der Bibliothek holen (gelöschte fallen weg)
  const exercises = current.exercises
    .map((name) => exerciseList.find((e) => e.exercise === name))
    .filter((e): e is Exercise => e !== undefined);

  return <Workout day={current.day} title={current.title} exercises={exercises} />;
}

type WorkoutProps = { day: string; title: string; exercises: Exercise[] };

function Workout({ day, title, exercises }: WorkoutProps) {
  const router = useRouter();
  const { addWorkout, getLastSets } = useWorkouts();

  // Startwerte: Gewicht und Wdh. aus dem letzten Workout, sonst aus der Übung
  const [drafts, setDrafts] = useState<DraftExercise[]>(() =>
    exercises.map((e) => {
      const last = getLastSets(e.exercise);
      const defaultReps = String(parseInt(e.reps, 10) || '');
      return {
        exercise: e,
        sets: Array.from({ length: e.sets }, (_, i) => {
          const prev = last[i] ?? last[last.length - 1];
          return {
            weight: String(prev ? prev.weightKg : e.weightKg),
            reps: prev ? String(prev.reps) : defaultReps,
            done: false,
          };
        }),
      };
    })
  );

  const totalSets = drafts.reduce((sum, d) => sum + d.sets.length, 0);
  const doneSets = drafts.reduce((sum, d) => sum + d.sets.filter((s) => s.done).length, 0);

  const updateSet = (exIndex: number, setIndex: number, patch: Partial<DraftSet>) => {
    setDrafts((current) =>
      current.map((d, i) =>
        i !== exIndex
          ? d
          : { ...d, sets: d.sets.map((s, j) => (j === setIndex ? { ...s, ...patch } : s)) }
      )
    );
  };

  const addSet = (exIndex: number) => {
    setDrafts((current) =>
      current.map((d, i) => {
        if (i !== exIndex) return d;
        const lastSet = d.sets[d.sets.length - 1];
        return {
          ...d,
          sets: [...d.sets, { weight: lastSet?.weight ?? '', reps: lastSet?.reps ?? '', done: false }],
        };
      })
    );
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  // Nur abgehakte Sätze werden gespeichert
  const save = () => {
    const logged: ExerciseLog[] = drafts
      .map((d) => ({
        exercise: d.exercise.exercise,
        targetMuscle: d.exercise.targetMuscle,
        sets: d.sets
          .filter((s) => s.done)
          .map((s) => ({ weightKg: toNumber(s.weight), reps: Math.round(toNumber(s.reps)) })),
      }))
      .filter((e) => e.sets.length > 0);

    addWorkout({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      day,
      title,
      exercises: logged,
    });
    goBack();
  };

  const handleFinish = () => {
    if (doneSets === 0) {
      Alert.alert('Noch nichts abgehakt', 'Hake mindestens einen Satz ab, um das Workout zu speichern.');
      return;
    }
    if (doneSets < totalSets) {
      Alert.alert('Workout beenden?', `Du hast ${doneSets} von ${totalSets} Sätzen abgehakt.`, [
        { text: 'Weitermachen', style: 'cancel' },
        { text: 'Beenden', onPress: save },
      ]);
      return;
    }
    save();
  };

  const progress = totalSets === 0 ? 0 : doneSets / totalSets;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.title}>{title || 'Kein Titel'}</Text>

        {totalSets > 0 && (
          <>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {doneSets} / {totalSets} Sätze
            </Text>
          </>
        )}
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        {drafts.length === 0 && (
          <Text style={styles.empty}>
            Noch keine Übungen. Füge sie im Trainingsplan unter „Bearbeiten“ hinzu.
          </Text>
        )}

        {drafts.map((d, exIndex) => (
          <View key={d.exercise.exercise} style={styles.card}>
            <Text style={styles.name}>{d.exercise.exercise}</Text>
            <Text style={styles.muscle}>
              {d.exercise.targetMuscle} · Ziel: {d.exercise.sets} × {d.exercise.reps} Wdh.
            </Text>

            <View style={styles.row}>
              <Text style={[styles.colLabel, styles.colSet]}>SATZ</Text>
              <Text style={[styles.colLabel, styles.colInput]}>KG</Text>
              <Text style={[styles.colLabel, styles.colInput]}>WDH.</Text>
              <View style={styles.colCheck} />
            </View>

            {d.sets.map((s, setIndex) => (
              <View key={setIndex} style={[styles.row, s.done && styles.rowDone]}>
                <Text style={[styles.setNumber, styles.colSet]}>{setIndex + 1}</Text>

                <TextInput
                  style={[styles.input, styles.colInput]}
                  value={s.weight}
                  onChangeText={(t) => updateSet(exIndex, setIndex, { weight: t })}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#6b7680"
                  selectTextOnFocus
                />

                <TextInput
                  style={[styles.input, styles.colInput]}
                  value={s.reps}
                  onChangeText={(t) => updateSet(exIndex, setIndex, { reps: t })}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor="#6b7680"
                  selectTextOnFocus
                />

                <Pressable
                  style={[styles.colCheck, styles.check, s.done && styles.checkDone]}
                  onPress={() => updateSet(exIndex, setIndex, { done: !s.done })}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: s.done }}
                  accessibilityLabel={`Satz ${setIndex + 1} abhaken`}
                >
                  {s.done && <Ionicons name="checkmark" size={22} color="#fff" />}
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={() => addSet(exIndex)}
              style={({ pressed }) => [styles.addSet, pressed && styles.pressed]}
            >
              <Ionicons name="add" size={18} color="#9aa5ad" />
              <Text style={styles.addSetText}>Satz hinzufügen</Text>
            </Pressable>
          </View>
        ))}

        {drafts.length > 0 && (
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>Workout beenden</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1216' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232c34',
  },
  day: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  title: { fontSize: 18, color: '#f5a623', fontWeight: '600', marginTop: 2 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#232c34',
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: '#2ecc9a' },
  progressText: { marginTop: 6, fontSize: 12, color: '#9aa5ad' },

  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 40 },
  empty: { textAlign: 'center', marginTop: 30, color: '#6b7680', paddingHorizontal: 20 },

  card: {
    backgroundColor: '#151c22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#232c34',
    padding: 14,
    marginBottom: 14,
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  muscle: { fontSize: 13, color: '#2ecc9a', fontWeight: '600', marginTop: 2, marginBottom: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  rowDone: { backgroundColor: '#13221f' },
  colLabel: { fontSize: 11, fontWeight: '600', color: '#6b7680', textAlign: 'center' },
  colSet: { width: 44, textAlign: 'center' },
  colInput: { flex: 1, marginHorizontal: 6 },
  colCheck: { width: 44 },
  setNumber: { fontSize: 16, fontWeight: 'bold', color: '#9aa5ad' },
  input: {
    height: 44,
    backgroundColor: '#0d1216',
    borderWidth: 1,
    borderColor: '#232c34',
    borderRadius: 10,
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  check: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3a444c',
    backgroundColor: '#0d1216',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: '#1f7a5c', borderColor: '#2ecc9a' },

  addSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 8,
  },
  addSetText: { fontSize: 14, color: '#9aa5ad' },
  pressed: { opacity: 0.75 },

  button: {
    backgroundColor: '#1f7a5c',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});