import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useExercises } from '@/context/uebungContext';
import ExerciseDetail from '@/components/ExerciseDetail';
import Exercise from '@/models/exercise';

export default function AddUebungScreen() {
  const router = useRouter();
  const { addExercise } = useExercises();

  const handleAdd = (newExercise: Exercise) => {
    addExercise(newExercise);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <ExerciseDetail onSave={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1216',
  },
});