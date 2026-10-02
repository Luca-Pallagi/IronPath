import Svg, { Line } from 'react-native-svg';
import { PositionedSkill, SkillProgress } from '@/models/skill';
import { NODE_HEIGHT } from '@/utils/skillLogic';

type Props = {
  skills: PositionedSkill[];
  progress: SkillProgress;
  height: number;
};

export default function SkillLines({ skills, progress, height }: Props) {
  const byId = new Map(skills.map((s) => [s.id, s]));

  return (
    <Svg
      width="100%"
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      {skills.flatMap((skill) =>
        skill.voraussetzungen.map((parentId) => {
          const parent = byId.get(parentId);
          if (!parent) return null;

          // Farbe: beide freigeschaltet = grün, Vorgänger frei = gold, sonst grau
          const color = progress.includes(skill.id)
            ? '#2ecc9a'
            : progress.includes(parent.id)
            ? '#f5a623'
            : '#3a444c';

          return (
            <Line
              key={`${parentId}-${skill.id}`}
              x1={`${parent.x}%`}
              y1={parent.y + NODE_HEIGHT}
              x2={`${skill.x}%`}
              y2={skill.y}
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })
      )}
    </Svg>
  );
}