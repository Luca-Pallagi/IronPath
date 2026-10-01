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
  scroll: { flex: 1, backgroundColor: "#0d1216" },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  card: {
    backgroundColor: "#151c22",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#232c34",
    borderLeftWidth: 3,
    borderLeftColor: "#f5a623",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  cardDay: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  cardTitle: { marginTop: 6, fontSize: 15, color: "#f5a623", fontWeight: "600" },
});