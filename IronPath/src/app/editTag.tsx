import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExercises } from '@/context/uebungContext';
import { usePlan } from '@/context/planContext';

const MUSCLES = ['Alle', 'Rücken', 'Brust', 'Schulter', 'Triceps', 'Biceps', 'Beine'];

const norm = (text: string) => (text ?? '').trim().toLowerCase();

export default function EditTagScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: string }>();
  const { exerciseList } = useExercises();
  const { plan, updateDay } = usePlan();

  const current = plan.find((d) => d.day === day);

  const [title, setTitle] = useState(current?.title ?? '');
  const [selected, setSelected] = useState<string[]>(current?.exercises ?? []);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Alle');

  const filtered = useMemo(
    () =>
      exerciseList.filter((e) => {
        const matchesMuscle =
          selectedMuscle === 'Alle' || norm(e.targetMuscle) === norm(selectedMuscle);
        const matchesSearch = norm(e.exercise).includes(norm(search));
        return matchesMuscle && matchesSearch;
      }),
    [exerciseList, search, selectedMuscle]
  );

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
          placeholderTextColor="#6b7680"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Übungen ({selected.length} gewählt)</Text>

        <TextInput
          style={styles.input}
          placeholder="Übung suchen, z.B. Bankdrücken..."
          placeholderTextColor="#6b7680"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.chipBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
            keyboardShouldPersistTaps="handled"
          >
            {MUSCLES.map((muscle) => {
              const active = muscle === selectedMuscle;
              return (
                <Pressable
                  key={muscle}
                  onPress={() => setSelectedMuscle(muscle)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {muscle}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {filtered.length === 0 && <Text style={styles.empty}>Keine Übungen gefunden</Text>}

        {filtered.map((e) => {
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
                color={active ? '#2ecc9a' : '#5b6670'}
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
  container: { flex: 1, backgroundColor: '#0d1216' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  label: { marginTop: 18, marginBottom: 8, fontSize: 14, fontWeight: '600', color: '#9aa5ad' },
  input: {
    backgroundColor: '#151c22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232c34',
    padding: 12,
    fontSize: 16,
    color: '#fff',
  },
  chipBar: { height: 56, flexGrow: 0, flexShrink: 0, marginHorizontal: -16 },
  chipRow: { paddingHorizontal: 16, alignItems: 'center' },
  chip: {
    height: 40,
    paddingHorizontal: 18,
    marginRight: 10,
    flexShrink: 0,
    backgroundColor: '#151c22',
    borderWidth: 1,
    borderColor: '#232c34',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#1f7a5c', borderColor: '#2ecc9a' },
  chipText: { textAlign: 'center', color: '#9aa5ad' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#6b7680', marginVertical: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151c22',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#232c34',
  },
  rowActive: { borderColor: '#2ecc9a', backgroundColor: '#13221f' },
  rowText: { flex: 1 },
  rowName: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  rowInfo: { fontSize: 13, color: '#9aa5ad', marginTop: 2 },
  button: {
    backgroundColor: '#1f7a5c',
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  cancel: { backgroundColor: '#2a343c', marginTop: 12 },
  clear: { backgroundColor: '#8c2a2a', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});