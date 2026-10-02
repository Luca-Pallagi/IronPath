import { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SkillProgress, SkillTreeDef } from '@/models/skill';
import { getStatus, layoutSkills } from '@/utils/skillLogic';
import SkillNode from '../skillNode';
import SkillLines from '../skillLines';
import SkillDetailModal from '../skillDetailModal';
import { useSkills } from '../../context/skillContext';

import Triceps from '@/data/skills/triceps.json';

const tree = Triceps as SkillTreeDef;

export default function TreeBrust() {
  const { isLoading, getProgress, setProgress } = useSkills();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const layout = useMemo(() => layoutSkills(tree.skills), []);

  // Startskill ist von Anfang an freigeschaltet
  const progress = getProgress(tree.muskel, ['']);

  const selected = layout.skills.find((s) => s.id === selectedId) ?? null;

  // Namen der Voraussetzungen, die noch nicht abgehakt sind
  const missing = selected
    ? selected.voraussetzungen
        .filter((id) => !progress.includes(id))
        .map((id) => tree.skills.find((s) => s.id === id)?.name ?? id)
    : [];

  // Entfernt einen Skill und alle Skills, die von ihm abhängen
  const removeWithDependents = (id: string, list: SkillProgress): SkillProgress => {
    let result = list.filter((x) => x !== id);
    tree.skills.forEach((s) => {
      if (s.voraussetzungen.includes(id) && result.includes(s.id)) {
        result = removeWithDependents(s.id, result);
      }
    });
    return result;
  };

  const handleToggle = () => {
    if (!selected) return;
    const status = getStatus(selected, progress);

    if (status === 'available') {
      setProgress(tree.muskel, [...progress, selected.id]);
    } else if (status === 'unlocked') {
      setProgress(tree.muskel, removeWithDependents(selected.id, progress));
    }
    setSelectedId(null);
  };

  if (isLoading) return null;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ height: layout.height }}>
        <SkillLines skills={layout.skills} progress={progress} height={layout.height} />

        {layout.skills.map((s) => (
          <SkillNode
            key={s.id}
            skill={s}
            status={getStatus(s, progress)}
            onPress={(skill) => setSelectedId(skill.id)}
          />
        ))}
      </View>

      <SkillDetailModal
        skill={selected}
        status={selected ? getStatus(selected, progress) : 'locked'}
        missing={missing}
        onClose={() => setSelectedId(null)}
        onToggle={handleToggle}
      />
    </ScrollView>
  );
}