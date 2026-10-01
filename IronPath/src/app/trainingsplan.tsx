import { Text, ScrollView, StyleSheet, Pressable, View } from "react-native";
import { useState } from "react";
import { useRouter } from 'expo-router';
import Wochenplan from "../components/wochenplan";
import EditWochenplan from "../components/editWochenplan";

const VIEWS = ["Wochenplan", "Edit"];

type SegmentedControlProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

const SegmentedControl = ({ options, selected, onChange }: SegmentedControlProps) => (
  <View style={styles.segmentContainer}>
    {options.map((option) => {
      const active = option === selected;
      return (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={[styles.segment, active && styles.segmentActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
        >
          <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
            {option}
          </Text>
        </Pressable>
      );
    })}
  </View>
  // SegmentedControl wurde mit Hilfe der KI erstellt.
);

export default function Trainingsplan() {
    
    const [view, setView] = useState("Wochenplan");

    return (
        <View style={styles.container}>
        <SegmentedControl options={VIEWS} selected={view} onChange={setView} />
        {view === "Wochenplan" ? <Wochenplan /> : <EditWochenplan />}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1216",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#151c22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232c34",
    padding: 3,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  segmentActive: {
    backgroundColor: "#1f7a5c",
  },
  segmentText: {
    color: "#9aa5ad",
    fontSize: 14,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});