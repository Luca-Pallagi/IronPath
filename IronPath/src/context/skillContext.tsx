import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'skillprogress_v1';

// Muskelgruppe -> IDs der abgehakten Skills, z.B. { "Rücken": ["pull-up-base"] }
type ProgressMap = Record<string, string[]>;

interface SkillContextType {
  isLoading: boolean;
  getProgress: (muskel: string, startSkills?: string[]) => string[];
  setProgress: (muskel: string, progress: string[]) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export function SkillProvider({ children }: { children: ReactNode }) {
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [isLoading, setIsLoading] = useState(true);

  // Wenn für die Muskelgruppe noch nichts gespeichert ist, gilt der Startskill
  const getProgress = (muskel: string, startSkills: string[] = []) =>
    progressMap[muskel] ?? startSkills;

  const setProgress = (muskel: string, progress: string[]) => {
    setProgressMap((current) => ({ ...current, [muskel]: progress }));
  };

  // Beim Start laden
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) setProgressMap(JSON.parse(stored));
      } catch (error) {
        console.error('Fehler beim Laden der Skills:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Bei jeder Änderung speichern
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap)).catch((error) =>
      console.error('Fehler beim Speichern der Skills:', error)
    );
  }, [progressMap, isLoading]);

  return (
    <SkillContext.Provider value={{ isLoading, getProgress, setProgress }}>
      {children}
    </SkillContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkills muss innerhalb von SkillProvider verwendet werden');
  }
  return context;
}