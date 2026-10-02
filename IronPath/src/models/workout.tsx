// Abgeschlossener Satz
export type SetLog = {
  weightKg: number;
  reps: number;
};

// Sätze einer Übung
export type ExerciseLog = {
  exercise: string;
  targetMuscle: string;
  sets: SetLog[];
};

// Ein beendetes Workout
export type WorkoutLog = {
  id: string;
  date: string; 
  day: string;
  title: string;
  exercises: ExerciseLog[];
};