export type CharacterStrengthGroup = {
  virtue: string;
  strengths: readonly string[];
};

export const characterStrengthGroups = [
  {
    virtue: "Wisdom",
    strengths: [
      "Creativity",
      "Curiosity",
      "Judgment",
      "Love of Learning",
      "Perspective",
    ],
  },
  {
    virtue: "Courage",
    strengths: ["Bravery", "Perseverance", "Honesty", "Zest"],
  },
  {
    virtue: "Humanity",
    strengths: ["Love", "Kindness", "Social Intelligence"],
  },
  {
    virtue: "Justice",
    strengths: ["Teamwork", "Fairness", "Leadership"],
  },
  {
    virtue: "Temperance",
    strengths: ["Forgiveness", "Humility", "Prudence", "Self-Regulation"],
  },
  {
    virtue: "Transcendence",
    strengths: [
      "Appreciation of Beauty & Excellence",
      "Gratitude",
      "Hope",
      "Humor",
      "Spirituality",
    ],
  },
] as const satisfies readonly CharacterStrengthGroup[];

export const characterStrengths = characterStrengthGroups.flatMap(
  (group) => group.strengths
);

export type CharacterStrength = (typeof characterStrengths)[number];

const characterStrengthSet = new Set<string>(characterStrengths);

export function isCharacterStrength(
  value: unknown
): value is CharacterStrength {
  return typeof value === "string" && characterStrengthSet.has(value);
}

export function isCharacterStrengthSelection(
  value: unknown
): value is [CharacterStrength, CharacterStrength, CharacterStrength] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(isCharacterStrength) &&
    new Set(value).size === 3
  );
}

export function serializeCharacterStrengths(
  strengths: readonly CharacterStrength[]
) {
  return JSON.stringify(strengths);
}

export function parseStoredCharacterStrengths(value: string): CharacterStrength[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every(isCharacterStrength)) {
      return parsed;
    }
  } catch {
    if (isCharacterStrength(value)) return [value];
    return [];
  }

  return isCharacterStrength(value) ? [value] : [];
}
