import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PositionedSkill } from '@/models/skill';
import { SkillStatus, NODE_HEIGHT } from '@/utils/skillLogic';

type Props = {
  skill: PositionedSkill;
  status: SkillStatus;
  onPress?: (skill: PositionedSkill) => void;
};

const COLORS: Record<SkillStatus, string> = {
  locked: '#ff5a4d',
  available: '#f5a623',
  unlocked: '#2ecc9a',
};

export default function SkillNode({ skill, status, onPress }: Props) {
  const color = COLORS[status];

  return (
    <Pressable
      onPress={() => onPress?.(skill)}
      style={[
        styles.node,
        { borderColor: color, shadowColor: color, left: `${skill.x}%`, top: skill.y },
        status === 'locked' && styles.locked,
      ]}
    >
      <Ionicons
        name={status === 'locked' ? 'lock-closed' : (skill.icon as any)}
        size={24}
        color={color}
      />
      <Text style={styles.name}>{skill.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    width: 112,
    marginLeft: -56, // halbe Breite, damit der Knoten auf x zentriert ist
    height: NODE_HEIGHT,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151c22',
    borderRadius: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  locked: { opacity: 0.6 },
  name: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});