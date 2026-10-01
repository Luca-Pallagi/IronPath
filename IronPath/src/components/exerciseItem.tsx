import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Exercise from '@/models/exercise';

type Props = {
  exercise: Exercise;
};

export default function ExerciseItem({ exercise }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/editUebung?exercise=${encodeURIComponent(exercise.exercise)}`)}
    >
      {exercise.imageUri ? (
        <Image source={{ uri: exercise.imageUri }} style={styles.thumbnail} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🏋️</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name}>{exercise.exercise}</Text>
        <Text style={styles.muscle}>{exercise.targetMuscle}</Text>
        <Text style={styles.details}>
          {exercise.sets} Sätze · {exercise.reps} Wdh. · {exercise.weightKg} kg
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    // Schatten iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Schatten Android
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  muscle: {
    fontSize: 14,
    color: '#1f7a5c',
    fontWeight: '600',
    marginTop: 2,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});