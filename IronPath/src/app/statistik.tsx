import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts } from '@/context/workoutContext';
import { SetLog } from '@/models/workout';

const GOLD = '#f5a623';
const GREEN = '#2ecc9a';
const BLUE = '#3b9eff';
const PURPLE = '#a371f7';
const RED = '#ff5a4d';
const MUSCLE_COLORS = [GOLD, GREEN, BLUE, PURPLE, '#ff8a3d', '#8bc34a'];

type ExerciseStat = {
  name: string;
  muscle: string;
  history: { date: string; maxWeight: number }[];
  bestWeight: number;
  bestReps: number;
  totalSets: number;
};

// ---------- Hilfsfunktionen ----------

const volumeOf = (sets: SetLog[]) => sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);

// 1234.5 -> "1.235"
const formatBig = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// 2.5 -> "2,5"
const formatNum = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');

const pad = (n: number) => String(n).padStart(2, '0');

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

const formatShort = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`;
};

// Montag 00:00 der aktuellen Woche
const startOfWeek = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};

// ---------- Screen ----------

export default function Statistik() {
  const { workouts, isLoading } = useWorkouts();
  const [openExercise, setOpenExercise] = useState<string | null>(null);

  const stats = useMemo(() => {
    const weekStart = startOfWeek();
    const thisWeek = workouts.filter((w) => new Date(w.date) >= weekStart).length;

    let totalSets = 0;
    let totalVolume = 0;
    const muscleSets = new Map<string, number>();
    const exerciseMap = new Map<string, ExerciseStat>();

    workouts.forEach((w) => {
      w.exercises.forEach((e) => {
        if (e.sets.length === 0) return;

        totalSets += e.sets.length;
        totalVolume += volumeOf(e.sets);
        muscleSets.set(e.targetMuscle, (muscleSets.get(e.targetMuscle) ?? 0) + e.sets.length);

        const stat = exerciseMap.get(e.exercise) ?? {
          name: e.exercise,
          muscle: e.targetMuscle,
          history: [],
          bestWeight: 0,
          bestReps: 0,
          totalSets: 0,
        };

        stat.history.push({ date: w.date, maxWeight: Math.max(...e.sets.map((s) => s.weightKg)) });
        e.sets.forEach((s) => {
          if (s.weightKg > stat.bestWeight || (s.weightKg === stat.bestWeight && s.reps > stat.bestReps)) {
            stat.bestWeight = s.weightKg;
            stat.bestReps = s.reps;
          }
        });
        stat.totalSets += e.sets.length;
        exerciseMap.set(e.exercise, stat);
      });
    });

    return {
      thisWeek,
      totalSets,
      totalVolume,
      muscles: Array.from(muscleSets.entries()).sort((a, b) => b[1] - a[1]),
      exercises: Array.from(exerciseMap.values()).sort((a, b) => b.totalSets - a.totalSets),
      recent: [...workouts].reverse().slice(0, 5),
    };
  }, [workouts]);

  if (isLoading) return null;

  if (workouts.length === 0) {
    return (
      <View style={[styles.screen, styles.emptyBox]}>
        <Ionicons name="stats-chart-outline" size={48} color="#3a444c" />
        <Text style={styles.emptyTitle}>Noch keine Daten</Text>
        <Text style={styles.empty}>
          Beende dein erstes Workout im Trainingsplan, dann erscheint hier deine Statistik.
        </Text>
      </View>
    );
  }

  const maxMuscle = Math.max(...stats.muscles.map(([, n]) => n));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Kacheln */}
      <View style={styles.tiles}>
        <Tile icon="barbell-outline" color={GOLD} value={String(workouts.length)} label="Workouts" />
        <Tile icon="calendar-outline" color={GREEN} value={String(stats.thisWeek)} label="Diese Woche" />
        <Tile icon="checkmark-done-outline" color={BLUE} value={String(stats.totalSets)} label="Sätze" />
        <Tile icon="trending-up-outline" color={PURPLE} value={`${formatBig(stats.totalVolume)} kg`} label="Gesamtvolumen" />
      </View>

      {/* Muskelgruppen */}
      <Text style={styles.sectionTitle}>Sätze pro Muskelgruppe</Text>
      <View style={styles.card}>
        {stats.muscles.map(([muscle, count], i) => {
          const color = MUSCLE_COLORS[i % MUSCLE_COLORS.length];
          return (
            <View key={muscle} style={styles.muscleRow}>
              <Text style={styles.muscleName}>{muscle}</Text>
              <View style={styles.muscleTrack}>
                <View
                  style={[styles.muscleFill, { width: `${(count / maxMuscle) * 100}%`, backgroundColor: color }]}
                />
              </View>
              <Text style={styles.muscleCount}>{count}</Text>
            </View>
          );
        })}
      </View>

      {/* Übungen */}
      <Text style={styles.sectionTitle}>Fortschritt pro Übung</Text>
      {stats.exercises.map((ex) => (
        <ExerciseRow
          key={ex.name}
          stat={ex}
          open={openExercise === ex.name}
          onToggle={() => setOpenExercise(openExercise === ex.name ? null : ex.name)}
        />
      ))}

      {/* Letzte Workouts */}
      <Text style={styles.sectionTitle}>Letzte Workouts</Text>
      {stats.recent.map((w) => {
        const sets = w.exercises.reduce((sum, e) => sum + e.sets.length, 0);
        const volume = w.exercises.reduce((sum, e) => sum + volumeOf(e.sets), 0);
        return (
          <View key={w.id} style={[styles.card, styles.recentCard]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>
                {w.day}
                {w.title ? ` · ${w.title}` : ''}
              </Text>
              <Text style={styles.recentInfo}>
                {sets} Sätze · {formatBig(volume)} kg
              </Text>
            </View>
            <Text style={styles.recentDate}>{formatDate(w.date)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ---------- Kachel ----------

type TileProps = { icon: keyof typeof Ionicons.glyphMap; color: string; value: string; label: string };

function Tile({ icon, color, value, label }: TileProps) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

// ---------- Übungszeile mit Balkendiagramm ----------

type ExerciseRowProps = { stat: ExerciseStat; open: boolean; onToggle: () => void };

function ExerciseRow({ stat, open, onToggle }: ExerciseRowProps) {
  const last = stat.history[stat.history.length - 1].maxWeight;
  const prev = stat.history.length > 1 ? stat.history[stat.history.length - 2].maxWeight : null;
  const delta = prev === null ? null : last - prev;

  const shown = stat.history.slice(-8);
  const maxShown = Math.max(...shown.map((h) => h.maxWeight));

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [styles.card, styles.exerciseCard, pressed && styles.pressed]}
    >
      <View style={styles.exerciseHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{stat.name}</Text>
          <Text style={styles.exerciseInfo}>
            {stat.muscle} · Bestwert: {formatNum(stat.bestWeight)} kg × {stat.bestReps}
          </Text>
        </View>

        {delta !== null && delta !== 0 && (
          <View style={styles.delta}>
            <Ionicons
              name={delta > 0 ? 'arrow-up' : 'arrow-down'}
              size={14}
              color={delta > 0 ? GREEN : RED}
            />
            <Text style={[styles.deltaText, { color: delta > 0 ? GREEN : RED }]}>
              {formatNum(Math.abs(delta))} kg
            </Text>
          </View>
        )}

        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#5b6670" />
      </View>

      {open && (
        <View style={styles.chart}>
          {maxShown === 0 ? (
            <Text style={styles.chartNote}>
              Nur Körpergewicht, {shown.length} Workouts mit dieser Übung.
            </Text>
          ) : (
            shown.map((h, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={styles.barValue}>{formatNum(h.maxWeight)}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(6, (h.maxWeight / maxShown) * 80), backgroundColor: i === shown.length - 1 ? GOLD : '#1f7a5c' },
                  ]}
                />
                <Text style={styles.barDate}>{formatShort(h.date)}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </Pressable>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0d1216' },
  content: { padding: 16, paddingBottom: 40 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { marginTop: 14, fontSize: 20, fontWeight: 'bold', color: '#fff' },
  empty: { marginTop: 8, textAlign: 'center', color: '#6b7680', fontSize: 14, lineHeight: 20 },

  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    backgroundColor: '#151c22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#232c34',
    padding: 14,
    marginBottom: 12,
  },
  tileValue: { marginTop: 8, fontSize: 24, fontWeight: 'bold', color: '#fff' },
  tileLabel: { marginTop: 2, fontSize: 12, color: '#9aa5ad' },

  sectionTitle: { marginTop: 10, marginBottom: 10, fontSize: 18, fontWeight: 'bold', color: '#fff' },

  card: {
    backgroundColor: '#151c22',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#232c34',
    padding: 14,
    marginBottom: 10,
  },
  pressed: { opacity: 0.75 },

  muscleRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  muscleName: { width: 78, fontSize: 14, color: '#c3ccd2' },
  muscleTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#0d1216', overflow: 'hidden' },
  muscleFill: { height: 10, borderRadius: 5 },
  muscleCount: { width: 36, textAlign: 'right', fontSize: 14, fontWeight: 'bold', color: '#fff' },

  exerciseCard: { paddingVertical: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center' },
  exerciseName: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  exerciseInfo: { marginTop: 2, fontSize: 12, color: '#9aa5ad' },
  delta: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  deltaText: { fontSize: 13, fontWeight: 'bold', marginLeft: 2 },

  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 130,
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#232c34',
  },
  chartNote: { flex: 1, textAlign: 'center', alignSelf: 'center', color: '#6b7680', fontSize: 13 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 5, marginVertical: 4 },
  barValue: { fontSize: 10, color: '#c3ccd2' },
  barDate: { fontSize: 10, color: '#6b7680' },

  recentCard: { flexDirection: 'row', alignItems: 'center' },
  recentTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  recentInfo: { marginTop: 2, fontSize: 13, color: '#9aa5ad' },
  recentDate: { fontSize: 13, color: '#6b7680' },
});