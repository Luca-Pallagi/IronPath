import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetLog, WorkoutLog } from '@/models/workout';

const STORAGE_KEY = 'workoutlogs_v1';

interface WorkoutContextType {
  workouts: WorkoutLog[];
  isLoading: boolean;
  addWorkout: (workout: WorkoutLog) => void;
  getLastSets: (exercise: string) => SetLog[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addWorkout = (workout: WorkoutLog) => {
    setWorkouts((current) => [...current, workout]);
  };

  // Sätze der Übung aus dem letzten Workout (zum Vorausfüllen)
  const getLastSets = (exercise: string): SetLog[] => {
    for (let i = workouts.length - 1; i >= 0; i--) {
      const found = workouts[i].exercises.find((e) => e.exercise === exercise);
      if (found) return found.sets;
    }
    return [];
  };

  // Beim Start laden
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) setWorkouts(JSON.parse(stored));
      } catch (error) {
        console.error('Fehler beim Laden der Workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Bei jeder Änderung speichern
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts)).catch((error) =>
      console.error('Fehler beim Speichern der Workouts:', error)
    );
  }, [workouts, isLoading]);

  return (
    <WorkoutContext.Provider value={{ workouts, isLoading, addWorkout, getLastSets }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts muss innerhalb von WorkoutProvider verwendet werden');
  }
  return context;
}