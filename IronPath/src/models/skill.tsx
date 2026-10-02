export type SkillDef = {
  id: string;
  name: string;
  beschreibung: string;
  icon: string;
  voraussetzungen: string[];
};

export type PositionedSkill = SkillDef & { x: number; y: number };

export type SkillTreeDef = { muskel: string; skills: SkillDef[] };

export type SkillProgress = string[];