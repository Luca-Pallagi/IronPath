import { Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from 'expo-router'

export default function Wochenplan() {

    const router = useRouter();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Montag</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Dienstag</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Mittwoch</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Donnerstag</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Freitag</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Samstag</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text style={styles.cardDay}>Sonntag</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "lightgrey",
    width: "90%",
    height: 120,
    padding: 12,
    margin: 15,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardDay: {
    fontSize: 20,
  },
});