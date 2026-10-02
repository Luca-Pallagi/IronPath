import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PositionedSkill } from '@/models/skill';
import { SkillStatus } from '@/utils/skillLogic';

type Props = {
  skill: PositionedSkill | null;
  status: SkillStatus;
  missing: string[]; // Namen der noch fehlenden Voraussetzungen
  onClose: () => void;
  onToggle: () => void;
};

const COLORS: Record<SkillStatus, string> = {
  locked: '#ff5a4d',
  available: '#f5a623',
  unlocked: '#2ecc9a',
};

export default function SkillDetailModal({ skill, status, missing, onClose, onToggle }: Props) {
  if (!skill) return null;

  const color = COLORS[status];
  const locked = status === 'locked';
  const done = status === 'unlocked';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Pressable im Pressable, damit ein Tipp auf die Karte das Fenster nicht schließt */}
        <Pressable style={[styles.card, { borderColor: color }]} onPress={() => {}}>
          <View style={[styles.iconBox, { borderColor: color, shadowColor: color }]}>
            <Ionicons name={locked ? 'lock-closed' : (skill.icon as any)} size={30} color={color} />
          </View>

          <Text style={styles.name}>{skill.name}</Text>
          <Text style={[styles.status, { color }]}>
            {done ? 'Abgehakt' : locked ? 'Gesperrt' : 'Bereit zum Abhaken'}
          </Text>

          <Text style={styles.description}>{skill.beschreibung}</Text>

          {locked && (
            <Text style={styles.missing}>Zuerst nötig: {missing.join(', ')}</Text>
          )}

          <Pressable
            disabled={locked}
            onPress={onToggle}
            style={({ pressed }) => [
              styles.button,
              done && styles.buttonDone,
              locked && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={done ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={22}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {done ? 'Haken entfernen' : 'Als erledigt abhaken'}
            </Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Schließen</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#151c22',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 22,
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    backgroundColor: '#0d1216',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  name: { marginTop: 14, fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  status: { marginTop: 4, fontSize: 14, fontWeight: '600' },
  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 21,
    color: '#c3ccd2',
    textAlign: 'center',
  },
  missing: { marginTop: 12, fontSize: 13, color: '#ff8a80', textAlign: 'center' },
  button: {
    marginTop: 20,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 24,
    backgroundColor: '#1f7a5c',
  },
  buttonDone: { backgroundColor: '#2a343c' },
  buttonDisabled: { opacity: 0.35 },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  closeButton: { marginTop: 12, padding: 8 },
  closeText: { color: '#9aa5ad', fontSize: 14 },
});