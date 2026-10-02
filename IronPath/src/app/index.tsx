import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#f5a623';
const GREEN = '#2ecc9a';
const PURPLE = '#a371f7';
const BLUE = '#3b9eff';

type MenuItem = {
  title: string;
  subtitle: string;
  route: '/trainingsplan' | '/uebung' | '/skillTree' | '/statistik';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const ITEMS: MenuItem[] = [
  {
    title: 'Trainingsplan',
    subtitle: 'Erstelle deinen individuellen Plan',
    route: '/trainingsplan',
    icon: 'clipboard-outline',
    color: GOLD,
  },
  {
    title: 'Übungen',
    subtitle: 'Pro Muskelgruppe und Ziel',
    route: '/uebung',
    icon: 'barbell-outline',
    color: GREEN,
  },
  {
    title: 'Statistik',
    subtitle: 'Sieh, wie stark du wirst',
    route: '/statistik',
    icon: 'stats-chart-outline',
    color: BLUE,
  },
  {
    title: 'Skill-Tree',
    subtitle: 'Schalte Skills & Fähigkeiten frei',
    route: '/skillTree',
    icon: 'git-network-outline',
    color: PURPLE,
  },
];

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Ionicons name="trail-sign" size={44} color={GOLD} />
        <Text style={styles.logo}>
          IRON<Text style={styles.logoAccent}>PATH</Text>
        </Text>
        <Text style={styles.tagline}>TRAIN. PROGRESS. UNLOCK.</Text>
      </View>

      {ITEMS.map((item) => (
        <Pressable
          key={item.route}
          style={({ pressed }) => [
            styles.card,
            { borderColor: item.color + '55' },
            pressed && styles.cardPressed,
          ]}
          onPress={() => router.push(item.route)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
        >
          <View
            style={[
              styles.iconBox,
              { borderColor: item.color, shadowColor: item.color },
            ]}
          >
            <Ionicons name={item.icon} size={30} color={item.color} />
          </View>

          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#5b6670" />
        </Pressable>
      ))}

      <Text style={styles.footer}>
        Dein Körper.  ·  Dein Fortschritt.  ·  Deine Skills.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0d1216',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginTop: 10,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 8,
    color: '#fff',
  },
  logoAccent: {
    color: GOLD,
  },
  tagline: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 4,
    color: '#9aa5ad',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151c22',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: '#0d1216',
    alignItems: 'center',
    justifyContent: 'center',

    // Glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#9aa5ad',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7680',
  },
});