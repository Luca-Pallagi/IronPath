# IronPath

## Architecture

### Komponente
- Liste der Übungen
- Trainingsplan
- Navigation

### Navigation
Navigationsschema: Stack

```
Home
 |___ Trainingsplan
 |          |________ Trainingsplan erstellen
 |
 |___ Übungen
 |       |_____ Übungen erstellen
 |       |_____ Übungen Editieren
 |
 |___ Skill-Tree
```

### Datenmodell
# IronPath

## Architecture

### Komponente
- Liste der Übungen
- Trainingsplan
- Navigation

### Navigation
Navigationsschema: Stack

```
Home
 |___ Trainingsplan
 |          |________ Trainingstag editieren
 |          |________ Trainingstag anschauen
 |
 |___ Übungen
 |       |_____ Übungen erstellen
 |       |_____ Übungen Editieren
 |
 |___ Skill-Tree
```

### Datenmodell

```ts
type MuscleGroup = 'brust' | 'ruecken' | 'beine' | 'schultern' | 'biceps' | 'triceps' | 'core'

// Übung (Übungen-Liste, erstellen, editieren)
type Exercise = {
  id: string
  name: string            // "Bankdrücken"
  muscleGroup: MuscleGroup
  sets: number            // Standard-Sätze, z.B. 3
  repsMin: number         // z.B. 8
  repsMax: number         // z.B. 12
  isCustom: boolean       // true = vom Nutzer erstellt
}

// Trainingsplan (Trainingsplan, erstellen)
type WorkoutPlan = {
  id: string
  name: string            // "Push/Pull/Legs"
  days: PlanDay[]
}
type PlanDay = {
  id: string
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6   // 0 = Montag
  title: string           // "Push"
  exerciseIds: string[]   // Verweise auf Exercise.id (Reihenfolge = Ablauf)
}

// Skill-Tree (Definition, statisch)
type Skill = {
  id: string
  name: string            // "Ausdauer"
  parentId?: string       // Voraussetzung im Baum, leer = Wurzel
  requirement: {
    type: 'workouts' | 'volumeKg' | 'streakDays'
    target: number        // z.B. 10 Trainings
  }
}

// Nutzerprofil
type User = {
  level: number
  xp: number
  streakDays: number
}
```

**Beziehungen**
- Ein `WorkoutPlan` hat mehrere `PlanDay`, jeder Tag verweist über `exerciseIds` auf `Exercise`.
- Ein `WorkoutLog` entsteht aus einem `PlanDay` und liefert XP und Fortschritt für `UserSkill`.
- `Skill` ist eine feste Definition, `UserSkill` speichert den persönlichen Stand.


### Zustand und Side
| Screen | Lokaler State |
|---|---|
| Home | keiner, zeigt nur Daten aus dem Store |
| Trainingsplan | ausgewählter/aufgeklappter Wochentag |
| Trainingsplan erstellen | Formular-Entwurf (`name`, `days`, `exerciseIds`), Validierungsfehler |
| Übungen | Suchtext, gewählter Muskelgruppen-Filter |
| Übungen erstellen / editieren | Formularfelder, Validierungsfehler (beim Editieren wird zuerst die Übung per `id` aus dem Store kopiert) |
| Skill-Tree | Zoom/Pan-Position, gewählter Skill (`selectedSkillId`) für das Detail-Sheet |