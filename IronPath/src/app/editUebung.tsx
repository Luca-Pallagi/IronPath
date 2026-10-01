import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExercises } from '@/context/uebungContext';
import ExerciseDetail from '@/components/ExerciseDetail';
import Exercise from '@/models/exercise';

export default function EditUebungScreen() {
  const router = useRouter();
  const { exercise: exerciseName } = useLocalSearchParams<{ exercise: string }>();
  const { exerciseList, updateExercise, removeExercise } = useExercises();

  const exercise = exerciseList.find((e) => e.exercise === exerciseName);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleSave = (updated: Exercise) => {
    updateExercise(exerciseName, updated);
    goBack();
  };

  const handleDelete = () => {
    removeExercise(exerciseName);
    goBack();
  };

  if (!exercise) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ExerciseDetail
        initialExercise={exercise}
        onSave={handleSave}
        onCancel={goBack}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8A1E3',
  },
});