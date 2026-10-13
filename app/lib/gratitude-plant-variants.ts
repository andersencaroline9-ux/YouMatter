export const gratitudePlantVariants = {
  foxglove: "/gratitude-plants/foxglove.png",
  oxeyeDaisy: "/gratitude-plants/oxeye-daisy.png",
  redCampion: "/gratitude-plants/red-campion.png",
  bluebell: "/gratitude-plants/bluebell.png",
  cowslip: "/gratitude-plants/cowslip.png",
  woodAnemone: "/gratitude-plants/wood-anemone.png",
} as const;

export type GratitudePlantVariant = keyof typeof gratitudePlantVariants;
