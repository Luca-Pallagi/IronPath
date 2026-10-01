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
    backgroundColor: '#151c22',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#232c34',
    marginVertical: 6,
    marginHorizontal: 16,
    // Schatten iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    // Schatten Android
    elevation: 6,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
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
    backgroundColor: '#0d1216',
    borderWidth: 1,
    borderColor: '#232c34',
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
    color: '#fff',
  },
  muscle: {
    fontSize: 14,
    color: '#2ecc9a',
    fontWeight: '600',
    marginTop: 2,
  },
  details: {
    fontSize: 14,
    color: '#9aa5ad',
    marginTop: 2,
  },
});