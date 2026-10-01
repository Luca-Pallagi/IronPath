import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Exercise from '@/models/exercise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteImageFile } from '@/utils/imageStorage';

const STORAGE_KEY = 'exercises';

interface ExerciseContextType {
  exerciseList: Exercise[];
  isLoading: boolean;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (name: string, updated: Exercise) => void;
  removeExercise: (name: string) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([
    { exercise: 'Bankdrücken', targetMuscle: 'Brust', sets: 3, reps: '8-12', weightKg: 60 },
    { exercise: 'Schrägbankdrücken', targetMuscle: 'Brust', sets: 3, reps: '8-12', weightKg: 50 },
    { exercise: 'Klimmzüge', targetMuscle: 'Rücken', sets: 3, reps: '6-10', weightKg: 0 },
    { exercise: 'Kreuzheben', targetMuscle: 'Rücken', sets: 3, reps: '5-8', weightKg: 80 },
    { exercise: 'Kniebeugen', targetMuscle: 'Beine', sets: 3, reps: '8-12', weightKg: 70 },
    { exercise: 'Beinpresse', targetMuscle: 'Beine', sets: 3, reps: '10-15', weightKg: 120 },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const addExercise = (exercise: Exercise) => {
    setExerciseList((current) => [...current, exercise]);
  };

  const updateExercise = (name: string, updated: Exercise) => {
    const old = exerciseList.find((e) => e.exercise === name);

    // Altes Bild löschen, falls es durch ein neues ersetzt wurde
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

        if (stored === null) {
          console.log('Keine gespeicherten Übungen gefunden, verwende Startliste.');
          return;
        }

        const parsed: Exercise[] = JSON.parse(stored);

        // Ältere Einträge ohne targetMuscle ergänzen, damit nichts undefined ist
        const migrated = parsed.map((e) => ({
          ...e,
          targetMuscle: e.targetMuscle ?? 'Alle',
        }));

        setExerciseList(migrated);
        console.log('Übungen geladen:', migrated.length);
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

    const saveExercises = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exerciseList));
        console.log('Übungen gespeichert:', exerciseList.length);
      } catch (error) {
        console.error('Fehler beim Speichern der Übungen:', error);
      }
    };

    saveExercises();
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