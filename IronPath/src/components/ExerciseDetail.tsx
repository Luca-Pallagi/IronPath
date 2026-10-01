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
const PLACEHOLDER = '#5b6670';

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
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ImagePickerButton imageUri={imageUri} onImageSelected={setImageUri} />

      <Text style={styles.heading}>{isEdit ? 'Übung bearbeiten' : 'Neue Übung'}</Text>
      <Text style={styles.subheading}>
        {isEdit ? 'Passe Details und Ziel an' : 'Lege eine neue Übung für deine Bibliothek an'}
      </Text>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Details</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Übung (z.B. Bankdrücken)"
          placeholderTextColor={PLACEHOLDER}
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
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Training</Text>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <TextInput
              style={styles.statInput}
              placeholder="3"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="number-pad"
              value={sets}
              onChangeText={setSets}
            />
            <Text style={styles.statLabel}>Sätze</Text>
          </View>
          <View style={styles.stat}>
            <TextInput
              style={styles.statInput}
              placeholder="8-12"
              placeholderTextColor={PLACEHOLDER}
              value={reps}
              onChangeText={setReps}
            />
            <Text style={styles.statLabel}>Wdh.</Text>
          </View>
          <View style={styles.stat}>
            <TextInput
              style={styles.statInput}
              placeholder="60"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.statLabel}>Gewicht (kg)</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Speichern</Text>
      </Pressable>

      {(onCancel || onDelete) && (
        <View style={styles.secondaryRow}>
          {onCancel && (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.secondaryText, styles.cancelText]}>Abbrechen</Text>
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
              onPress={handleDelete}
            >
              <Text style={[styles.secondaryText, styles.deleteText]}>Löschen</Text>
            </Pressable>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0d1216',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subheading: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 13,
    color: '#9aa5ad',
    textAlign: 'center',
  },
  panel: {
    backgroundColor: '#151c22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26323b',
    padding: 16,
    marginBottom: 14,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#9aa5ad',
  },
  input: {
    backgroundColor: '#0d1216',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#26323b',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',          // Chips brechen in die nächste Zeile um
    gap: 8,
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1216',
    borderWidth: 1,
    borderColor: '#26323b',
    borderRadius: 14,
  },
  chipActive: {
    backgroundColor: '#1f7a5c',
    borderColor: '#2ecc9a',
  },
  chipText: {
    textAlign: 'center',
    color: '#9aa5ad',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0d1216',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#26323b',
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 6,
  },
  statInput: {
    width: '100%',
    paddingVertical: 8,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f5a623',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9aa5ad',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1f7a5c',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 10,

    // Glow
    shadowColor: '#2ecc9a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.75,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#3a4650',
  },
  cancelText: {
    color: '#9aa5ad',
  },
  deleteButton: {
    borderColor: '#c62828',
  },
  deleteText: {
    color: '#ff5252',
  },
});