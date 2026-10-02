import { PositionedSkill, SkillDef, SkillProgress } from '@/models/skill';

export const ROW_HEIGHT = 120; // Abstand zwischen den Ebenen in Pixel
export const NODE_HEIGHT = 76; // Höhe eines Knotens (wird auch für die Linien gebraucht)

export type SkillStatus = 'locked' | 'available' | 'unlocked';

export const getStatus = (skill: SkillDef, progress: SkillProgress): SkillStatus => {
  if (progress.includes(skill.id)) return 'unlocked';
  const ready = skill.voraussetzungen.every((id) => progress.includes(id));
  return ready ? 'available' : 'locked';
};

// Berechnet für jeden Skill die Position: Jeder Skill steht unter seinem Vorgänger
export const layoutSkills = (skills: SkillDef[]): { skills: PositionedSkill[]; height: number } => {
  const byId = new Map(skills.map((s) => [s.id, s]));

  // 1. Ebene (y): immer unter allen Vorgängern
  const depthCache = new Map<string, number>();
  const getDepth = (skill: SkillDef, visiting = new Set<string>()): number => {
    const cached = depthCache.get(skill.id);
    if (cached !== undefined) return cached;
    if (visiting.has(skill.id)) return 0; // Schutz vor kreisförmigen Voraussetzungen
    visiting.add(skill.id);

    const parents = skill.voraussetzungen
      .map((id) => byId.get(id))
      .filter((p): p is SkillDef => p !== undefined);

    const depth = parents.length === 0 ? 0 : 1 + Math.max(...parents.map((p) => getDepth(p, visiting)));
    depthCache.set(skill.id, depth);
    return depth;
  };

  // 2. Baumstruktur: jeder Skill hängt unter seiner ersten Voraussetzung
  const children = new Map<string, SkillDef[]>();
  const roots: SkillDef[] = [];
  skills.forEach((s) => {
    const parentId = s.voraussetzungen.find((id) => byId.has(id));
    if (parentId === undefined) roots.push(s);
    else children.set(parentId, [...(children.get(parentId) ?? []), s]);
  });

  // 3. Spalte (x): Blätter bekommen nacheinander einen Platz,
  //    Eltern stehen mittig über ihren Kindern
  const slotById = new Map<string, number>();
  const visited = new Set<string>();
  let nextSlot = 0;

  const place = (s: SkillDef): number => {
    visited.add(s.id);
    const kids = (children.get(s.id) ?? []).filter((k) => !visited.has(k.id));

    if (kids.length === 0) {
      const slot = nextSlot++;
      slotById.set(s.id, slot);
      return slot;
    }

    const slots = kids.map(place);
    const slot = (Math.min(...slots) + Math.max(...slots)) / 2;
    slotById.set(s.id, slot);
    return slot;
  };

  roots.forEach(place);
  skills.forEach((s) => {
    if (!visited.has(s.id)) place(s); // übrig gebliebene (z.B. bei Kreisen)
  });

  const totalSlots = Math.max(nextSlot, 1);

  const positioned: PositionedSkill[] = skills.map((s) => ({
    ...s,
    x: (((slotById.get(s.id) ?? 0) + 0.5) / totalSlots) * 100,
    y: getDepth(s) * ROW_HEIGHT,
  }));

  const maxDepth = Math.max(0, ...positioned.map((s) => s.y / ROW_HEIGHT));
  return { skills: positioned, height: (maxDepth + 1) * ROW_HEIGHT };
};