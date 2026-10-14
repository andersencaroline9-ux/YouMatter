export type GratitudePlantingPosition = {
  id: string;
  /** Ground contact point, in percentages of the visible scene. */
  x: number;
  y: number;
  mobile: { x: number; y: number };
  depth: "background" | "middle" | "foreground";
  scale: number;
  rotation: number;
  zIndex: number;
};

// Deliberate ground positions for the current photograph, not random placement.
// Mobile coordinates account for its narrower, centered crop. Recheck these
// with all plant variants when real contributions are connected to the scene.
export const gratitudePlantingPositions = [
  { id: "background-left", x: 27, y: 47, mobile: { x: 23, y: 46 }, depth: "background", scale: 0.7, rotation: -2, zIndex: 2 },
  { id: "background-center", x: 49, y: 44, mobile: { x: 49, y: 43 }, depth: "background", scale: 0.65, rotation: 1, zIndex: 2 },
  { id: "background-right", x: 72, y: 48, mobile: { x: 76, y: 47 }, depth: "background", scale: 0.75, rotation: 2, zIndex: 2 },
  { id: "middle-left", x: 20, y: 64, mobile: { x: 18, y: 64 }, depth: "middle", scale: 0.9, rotation: -2, zIndex: 3 },
  { id: "middle-center-left", x: 40, y: 59, mobile: { x: 40, y: 59 }, depth: "middle", scale: 0.85, rotation: 1, zIndex: 3 },
  { id: "middle-center-right", x: 61, y: 66, mobile: { x: 62, y: 68 }, depth: "middle", scale: 0.95, rotation: -1, zIndex: 4 },
  { id: "middle-right", x: 80, y: 60, mobile: { x: 82, y: 59 }, depth: "middle", scale: 1, rotation: 2, zIndex: 3 },
  { id: "foreground-left", x: 32, y: 88, mobile: { x: 29, y: 88 }, depth: "foreground", scale: 1.1, rotation: -2, zIndex: 5 },
  { id: "foreground-right", x: 70, y: 90, mobile: { x: 73, y: 91 }, depth: "foreground", scale: 1.15, rotation: 1, zIndex: 6 },
] as const satisfies readonly GratitudePlantingPosition[];
