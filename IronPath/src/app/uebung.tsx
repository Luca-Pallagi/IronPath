import { Text, View, StyleSheet, Pressable, ScrollView, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { useExercises } from '@/context/uebungContext';
import ExerciseItem from '@/components/exerciseItem';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MUSCLES = ["Alle", "Rücken", "Brust", "Schulter", "Triceps", "Biceps", "Beine"];

export default function Uebung() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedMuscle, setSelectedMuscle] = useState("Alle");
    const { exerciseList, isLoading } = useExercises();

    const norm = (text: string) => (text ?? "").trim().toLowerCase();

    const filtered = exerciseList.filter((e) => {
    const matchesMuscle =
      selectedMuscle === "Alle" || norm(e.targetMuscle) === norm(selectedMuscle);
    const matchesSearch = norm(e.exercise).includes(norm(search));
    return matchesMuscle && matchesSearch;
    });

    if (isLoading) return null;

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Übung z.B Benchpress..."
                value={search}
                onChangeText={setSearch}
            />

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

            <FlatList
                style={styles.list}
                data={filtered}
                keyExtractor={(item) => item.exercise}
                renderItem={({ item }) => <ExerciseItem exercise={item} />}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={<Text style={styles.empty}>Keine Übungen gefunden</Text>}
            />
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => router.push('/addUebung')}
                accessibilityRole="button"
                accessibilityLabel="Neue Übung hinzufügen"
                >
                <Ionicons name="add" size={32} color="#fff" />
            </Pressable>
    </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        alignSelf: "center",
        width: "90%",
        height: 56,
        marginVertical: 16,
        paddingHorizontal: 20,
        flexShrink: 0,              // Suchfeld wird nie gestaucht
        backgroundColor: "lightgrey",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
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
        backgroundColor: "lightgrey",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    chipActive: {
        backgroundColor: "#1f7a5c",
    },
    chipText: {
        textAlign: "center",
    },
    chipTextActive: {
        color: "#fff",
        fontWeight: "bold",
    },
    list: {
        flex: 1,                    // nur die Liste füllt den Restplatz
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 100,   // Platz, damit der FAB den letzten Eintrag nicht verdeckt
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1f7a5c',
        alignItems: 'center',
        justifyContent: 'center',

        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    fabPressed: {
        opacity: 0.8,
    },
});