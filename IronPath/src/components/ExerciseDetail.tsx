import ImagePickerButton from '@/components/ImagePickerButton';
import Exercise from '@/models/exercise';
import { useExercises } from '@/context/uebungContext';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const MUSCLES = ['Rücken', 'Brust', 'Schulter', 'Triceps', 'Biceps', 'Beine'];

interface ExerciseDetailProps {
  initialExercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

const showError = (message: string) => {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert('Fehler', message);
  }
};

export default function ExerciseDetail({
  initialExercise,
  onSave,
  onCancel,
  onDelete,
}: ExerciseDetailProps) {
  const { exerciseList } = useExercises();

  const [name, setName] = useState(initialExercise?.exercise ?? '');
  const [targetMuscle, setTargetMuscle] = useState(initialExercise?.targetMuscle ?? '');
  const [sets, setSets] = useState(initialExercise ? String(initialExercise.sets) : '3');
  const [reps, setReps] = useState(initialExercise?.reps ?? '8-12');
  const [weight, setWeight] = useState(initialExercise ? String(initialExercise.weightKg) : '0');
  const [imageUri, setImageUri] = useState<string | undefined>(initialExercise?.imageUri);

  const isEdit = initialExercise !== undefined;

  const handleSave = () => {
    const trimmedName = name.trim();
    const setsNumber = parseInt(sets, 10);
    const weightNumber = parseFloat(weight.replace(',', '.'));

    if (trimmedName === '') {
      showError('Bitte einen Namen eingeben.');
      return;
    }
    if (targetMuscle === '') {
      showError('Bitte eine Muskelgruppe wählen.');
      return;
    }
    if (Number.isNaN(setsNumber) || setsNumber < 1) {
      showError('Sätze müssen eine Zahl ab 1 sein.');
      return;
    }
    if (reps.trim() === '') {
      showError('Bitte Wiederholungen eingeben (z.B. 8-12).');
      return;
    }
    if (Number.isNaN(weightNumber) || weightNumber < 0) {
      showError('Gewicht muss eine Zahl ab 0 sein.');
      return;
    }
    const nameTaken = exerciseList.some(
      (e) =>
        e.exercise.toLowerCase() === trimmedName.toLowerCase() &&
        e.exercise !== initialExercise?.exercise
    );
    if (nameTaken) {
      showError('Eine Übung mit diesem Namen gibt es schon.');
      return;
    }

    onSave({
      ...initialExercise,
      exercise: trimmedName,
      targetMuscle,
      sets: setsNumber,
      reps: reps.trim(),
      weightKg: weightNumber,
      imageUri,
    });

    if (!isEdit) {
      setName('');
      setTargetMuscle('');
      setSets('3');
      setReps('8-12');
      setWeight('0');
      setImageUri(undefined);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      // Alert.alert mit Buttons funktioniert im Browser nicht
      if (window.confirm(`"${name}" wirklich löschen?`)) {
        onDelete?.();
      }
      return;
    }
    Alert.alert('Übung löschen', `"${name}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => onDelete?.() },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ImagePickerButton imageUri={imageUri} onImageSelected={setImageUri} />

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Übung (z.B. Bankdrücken)"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Muskelgruppe</Text>
      <View style={styles.chipRow}>
        {MUSCLES.map((muscle) => {
          const active = muscle === targetMuscle;
          return (
            <Pressable
              key={muscle}
              onPress={() => setTargetMuscle(muscle)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {muscle}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Sätze</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            keyboardType="number-pad"
            value={sets}
            onChangeText={setSets}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Wiederholungen</Text>
          <TextInput
            style={styles.input}
            placeholder="8-12"
            value={reps}
            onChangeText={setReps}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Gewicht (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="60"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Speichern</Text>
      </Pressable>

      {onCancel && (
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.buttonText}>Abbrechen</Text>
        </Pressable>
      )}

      {onDelete && (
        <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Löschen</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',          // Chips brechen in die nächste Zeile um
    gap: 8,
  },
  chip: {
    height: 40,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 15,
  },
  chipActive: {
    backgroundColor: '#1f7a5c',
  },
  chipText: {
    textAlign: 'center',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1f7a5c',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: '#777',
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: '#c62828',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});