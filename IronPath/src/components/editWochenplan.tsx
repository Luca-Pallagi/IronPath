import { Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from 'expo-router';
import { usePlan } from '@/context/planContext';

export default function EditWochenplan() {
  const router = useRouter();
  const { plan, isLoading } = usePlan();

  if (isLoading) return null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {plan.map((d) => (
        <Pressable
          key={d.day}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => router.push(`/editTag?day=${encodeURIComponent(d.day)}`)}
        >
          <Text style={styles.cardDay}>{d.day}</Text>
          <Text style={styles.cardInfo}>
            {d.exercises.length === 0
              ? 'Noch nichts geplant, tippen zum Bearbeiten'
              : `${d.title || 'Training'} · ${d.exercises.length} Übungen`}
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
    borderLeftColor: "#2ecc9a",
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
  cardInfo: { marginTop: 6, fontSize: 14, color: "#9aa5ad" },
});