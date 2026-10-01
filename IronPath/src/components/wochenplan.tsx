import { Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from 'expo-router';
import { usePlan } from '@/context/planContext';

export default function Wochenplan() {
  const router = useRouter();
  const { plan, isLoading } = usePlan();

  if (isLoading) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {plan.map((d) => (
        <Pressable
          key={d.day}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => router.push(`/tag?day=${encodeURIComponent(d.day)}`)}
        >
          <Text style={styles.cardDay}>{d.day}</Text>
          <Text style={styles.cardTitle}>
            {d.title || (d.exercises.length > 0 ? 'Training' : 'Ruhetag')}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, alignItems: "center", paddingVertical: 10 },
  card: {
    backgroundColor: "lightgrey",
    width: "90%",
    height: 120,
    padding: 12,
    margin: 15,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pressed: { opacity: 0.7 },
  cardDay: { fontSize: 20, fontWeight: "bold" },
  cardTitle: { marginTop: 6, fontSize: 16, color: "#1f7a5c", fontWeight: "600" },
});