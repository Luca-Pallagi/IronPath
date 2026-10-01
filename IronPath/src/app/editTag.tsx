import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExercises } from '@/context/uebungContext';
import { usePlan } from '@/context/planContext';

export default function EditTagScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: string }>();
  const { exerciseList } = useExercises();
  const { plan, updateDay } = usePlan();

  const current = plan.find((d) => d.day === day);

  const [title, setTitle] = useState(current?.title ?? '');
  const [selected, setSelected] = useState<string[]>(current?.exercises ?? []);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const toggle = (name: string) => {
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  };

  const handleSave = () => {
    updateDay(day, title.trim(), selected);
    goBack();
  };

  const handleClear = () => {
    updateDay(day, '', []);
    goBack();
  };

  if (!current) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{day}</Text>

        <Text style={styles.label}>Titel</Text>
        <TextInput
          style={styles.input}
          placeholder="z.B. Push, Pull, Beine"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Übungen ({selected.length} gewählt)</Text>
        {exerciseList.map((e) => {
          const active = selected.includes(e.exercise);
          return (
            <Pressable
              key={e.exercise}
              onPress={() => toggle(e.exercise)}
              style={[styles.row, active && styles.rowActive]}
            >
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{e.exercise}</Text>
                <Text style={styles.rowInfo}>
                  {e.targetMuscle} · {e.sets} Sätze · {e.reps} Wdh.
                </Text>
              </View>
              <Ionicons
                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={active ? '#1f7a5c' : '#999'}
              />
            </Pressable>
          );
        })}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Speichern</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.cancel]} onPress={goBack}>
          <Text style={styles.buttonText}>Abbrechen</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.clear]} onPress={handleClear}>
          <Text style={styles.buttonText}>Tag leeren</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  label: { marginTop: 16, marginBottom: 6, fontSize: 14, fontWeight: '600', color: '#444' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rowActive: { borderColor: '#1f7a5c' },
  rowText: { flex: 1 },
  rowName: { fontSize: 17, fontWeight: 'bold', color: '#111' },
  rowInfo: { fontSize: 13, color: '#666', marginTop: 2 },
  button: {
    backgroundColor: '#1f7a5c',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  cancel: { backgroundColor: '#777', marginTop: 12 },
  clear: { backgroundColor: '#c62828', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});