import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Exercise from '@/models/exercise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteImageFile } from '@/utils/imageStorage';

// Neuer Schlüssel, damit alte Daten ohne Muskelgruppe nicht mehr geladen werden
const STORAGE_KEY = 'exercises_v3';

const DEFAULT_EXERCISES: Exercise[] = [
  { exercise: 'Bankdrücken', targetMuscle: 'Brust', sets: 3, reps: '8-12', weightKg: 60 },
  { exercise: 'Schrägbankdrücken', targetMuscle: 'Brust', sets: 3, reps: '8-12', weightKg: 50 },
  { exercise: 'Klimmzüge', targetMuscle: 'Rücken', sets: 3, reps: '6-10', weightKg: 0 },
  { exercise: 'Kreuzheben', targetMuscle: 'Rücken', sets: 3, reps: '5-8', weightKg: 80 },
  { exercise: 'Schulterdrücken', targetMuscle: 'Schulter', sets: 3, reps: '8-12', weightKg: 30 },
  { exercise: 'Seitheben', targetMuscle: 'Schulter', sets: 3, reps: '12-15', weightKg: 8 },
  { exercise: 'Trizepsdrücken', targetMuscle: 'Triceps', sets: 3, reps: '10-12', weightKg: 25 },
  { exercise: 'Bizepscurls', targetMuscle: 'Biceps', sets: 3, reps: '10-12', weightKg: 12 },
  { exercise: 'Kniebeugen', targetMuscle: 'Beine', sets: 3, reps: '8-12', weightKg: 70 },
  { exercise: 'Beinpresse', targetMuscle: 'Beine', sets: 3, reps: '10-15', weightKg: 120 },
];

interface ExerciseContextType {
  exerciseList: Exercise[];
  isLoading: boolean;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (name: string, updated: Exercise) => void;
  removeExercise: (name: string) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [exerciseList, setExerciseList] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [isLoading, setIsLoading] = useState(true);

  const addExercise = (exercise: Exercise) => {
    setExerciseList((current) => [...current, exercise]);
  };

  const updateExercise = (name: string, updated: Exercise) => {
    const old = exerciseList.find((e) => e.exercise === name);
    if (old?.imageUri && old.imageUri !== updated.imageUri) {
      deleteImageFile(old.imageUri);
    }
    setExerciseList((current) =>
      current.map((e) => (e.exercise === name ? updated : e))
    );
  };

  const removeExercise = (name: string) => {
    const toDelete = exerciseList.find((e) => e.exercise === name);
    if (toDelete?.imageUri) {
      deleteImageFile(toDelete.imageUri);
    }
    setExerciseList((current) => current.filter((e) => e.exercise !== name));
  };

  // Beim Start einmal laden
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          const parsed: Exercise[] = JSON.parse(stored);
          setExerciseList(
            parsed.map((e) => ({ ...e, targetMuscle: e.targetMuscle ?? 'Alle' }))
          );
        }
      } catch (error) {
        console.error('Fehler beim Laden der Übungen:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, []);

  // Bei jeder Änderung speichern
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exerciseList)).catch((error) =>
      console.error('Fehler beim Speichern der Übungen:', error)
    );
  }, [exerciseList, isLoading]);

  return (
    <ExerciseContext.Provider
      value={{ exerciseList, isLoading, addExercise, updateExercise, removeExercise }}
    >
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercises() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercises muss innerhalb von ExerciseProvider verwendet werden');
  }
  return context;
}