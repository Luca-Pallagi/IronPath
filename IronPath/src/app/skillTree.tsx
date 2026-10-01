import { Text, View, StyleSheet, Pressable, ScrollView, TextInput, FlatList } from "react-native";
import { useState } from "react";
import { useExercises } from '@/context/uebungContext';
import ExerciseItem from '@/components/exerciseItem';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SkillTree(){

    const router = useRouter();
    const MUSCLES = ["Rücken", "Brust", "Schulter", "Triceps", "Biceps", "Beine"];

    const [selectedMuscle, setSelectedMuscle] = useState("Rücken");
    const matchesMuscle =
      selectedMuscle === "Rücken" || norm(e.targetMuscle) === norm(selectedMuscle);


    return (

        <Text>Skill-Tree</Text>
  );
}