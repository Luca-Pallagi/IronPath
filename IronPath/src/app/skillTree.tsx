import { Text, View, StyleSheet, Pressable, ScrollView, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { useExercises } from '@/context/uebungContext';
import ExerciseItem from '@/components/exerciseItem';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { 
    TreeBein, 
    TreeBiceps, 
    TreeBrust, 
    TreeRuecken, 
    TreeSchulter, 
    TreeTriceps 
} from '../components/skillTreeComps/index.ts';

export default function SkillTree(){

    const router = useRouter();
    const MUSCLES = ["Rücken", "Brust", "Schulter", "Triceps", "Biceps", "Beine"];

    const renderTree = () => {
        switch (selectedMuscle) {
        case 'Rücken':
            return <TreeRuecken />;
        case 'Brust':
            return <TreeBrust />;
        case 'Schulter':
            return <TreeSchulter />;
        case 'Triceps':
            return <TreeTriceps />;
        case 'Biceps':
            return <TreeBiceps />;
        case 'Beine':
            return <TreeBein />;
        default:
            return null;
        }
    };

    const [selectedMuscle, setSelectedMuscle] = useState("Rücken");

    return (
        <View style={styles.container}>
            <View style={styles.chipBar}>
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                    keyboardShouldPersistTaps="handled"
                    >
                    {MUSCLES.map((muscle) => {
                        const active = muscle === selectedMuscle;
                        return (
                        <Pressable
                            key={muscle}
                            onPress={() => setSelectedMuscle(muscle)}
                            style={[styles.chip, active && styles.chipActive]}
                        >
                            <Text
                            numberOfLines={1}
                            style={[styles.chipText, active && styles.chipTextActive]}
                            >
                            {muscle}
                            </Text>
                        </Pressable>
                        );
                    })}
                    </ScrollView>
                </View>
                {renderTree()}
            </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1216",
    },
    chipBar: {
        height: 56,                 // feste Höhe
        flexGrow: 0,
        flexShrink: 0,              // wird bei langer Liste nicht zusammengedrückt
    },
    chipRow: {
        paddingHorizontal: 12,
        alignItems: "center",       // Chips mittig in der Leiste
    },
    chip: {
        height: 40,                 // feste Chip-Höhe
        paddingHorizontal: 18,
        marginRight: 10,
        flexShrink: 0,              // Chips behalten ihre Breite
        backgroundColor: "#151c22",
        borderWidth: 1,
        borderColor: "#232c34",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    chipActive: {
        backgroundColor: "#1f7a5c",
        borderColor: "#2ecc9a",
    },
    chipText: {
        textAlign: "center",
        color: "#9aa5ad",
    },
    chipTextActive: {
        color: "#fff",
        fontWeight: "bold",
    },
})