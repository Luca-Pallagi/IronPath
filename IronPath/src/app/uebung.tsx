import { Text, View, StyleSheet, Pressable, ScrollView, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { useUebung } from '@/context/uebungContext';

const MUSCLES = ["Alle", "Rücken", "Brust", "Schulter", "Triceps", "Biceps", "Beine"];

export default function Trainingsplan() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Übung z.B Benchpress..."
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollExercise}
        contentContainerStyle={styles.chipRow}
      >
        {MUSCLES.map((muscle) => (
          <Pressable key={muscle} style={styles.chip}>
            <Text style={styles.chipText}>{muscle}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    width: "70%",
    height: 80,
    margin: 40,
    padding: 20,

    backgroundColor: "lightgrey",
    borderRadius: 15,

    // Border
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollExercise: {
    flexGrow: 0,
  },
  chipRow: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    backgroundColor: "lightgrey",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    textAlign: "center",
  },
});