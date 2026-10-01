import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DayPlan from '@/models/dayPlan';

const STORAGE_KEY = 'weekplan_v1';

export const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const EMPTY_PLAN: DayPlan[] = DAYS.map((day) => ({ day, title: '', exercises: [] }));

interface PlanContextType {
  plan: DayPlan[];
  isLoading: boolean;
  updateDay: (day: string, title: string, exercises: string[]) => void;
  renameExercise: (oldName: string, newName: string) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<DayPlan[]>(EMPTY_PLAN);
  const [isLoading, setIsLoading] = useState(true);

  const updateDay = (day: string, title: string, exercises: string[]) => {
    setPlan((current) =>
      current.map((d) => (d.day === day ? { day, title, exercises } : d))
    );
  };
  const renameExercise = (oldName: string, newName: string) => {
    setPlan((current) =>
      current.map((d) => ({
        ...d,
        exercises: d.exercises.map((n) => (n === oldName ? newName : n)),
      }))
    );
  };

  // Beim Start laden
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) setPlan(JSON.parse(stored));
      } catch (error) {
        console.error('Fehler beim Laden des Plans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Bei jeder Änderung speichern
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan)).catch((error) =>
      console.error('Fehler beim Speichern des Plans:', error)
    );
  }, [plan, isLoading]);

  return (
    <PlanContext.Provider value={{ plan, isLoading, updateDay, renameExercise }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan muss innerhalb von PlanProvider verwendet werden');
  }
  return context;
}