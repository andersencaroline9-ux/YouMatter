export type GratitudePlantingPosition = {
  id: string;
  /** Ground contact point, in percentages of the visible scene. */
  x: number;
  y: number;
  mobile: { x: number; y: number };
  mobileScale?: number;
  depth: "background" | "middle" | "foreground";
  scale: number;
  rotation: number;
  zIndex: number;
};

// Deliberate ground positions for the current photograph, not random placement.
// Order the slots as a balanced bloom sequence, not a sweep across the image.
export const gratitudePlantingPositions = [
  { id: "middle-heart", x: 52, y: 60, mobile: { x: 38, y: 57 }, mobileScale: 0.65, depth: "middle", scale: 0.72, rotation: -2, zIndex: 4 },
  { id: "foreground-left", x: 30, y: 92, mobile: { x: 88, y: 84 }, mobileScale: 0.6, depth: "foreground", scale: 0.7, rotation: 2, zIndex: 8 },
  { id: "middle-right", x: 90, y: 60, mobile: { x: 64, y: 56 }, depth: "middle", scale: 0.66, rotation: -1, zIndex: 5 },
  { id: "background-left-center", x: 34, y: 44, mobile: { x: 12, y: 44 }, depth: "background", scale: 0.56, rotation: 2, zIndex: 2 },
  { id: "foreground-right", x: 73, y: 92, mobile: { x: 64, y: 95 }, mobileScale: 0.6, depth: "foreground", scale: 0.72, rotation: -2, zIndex: 9 },
  { id: "middle-left-center", x: 32, y: 76, mobile: { x: 64, y: 70 }, mobileScale: 0.6, depth: "middle", scale: 0.62, rotation: 1, zIndex: 6 },
  { id: "background-right-center", x: 72, y: 44, mobile: { x: 38, y: 44 }, depth: "background", scale: 0.5, rotation: -1, zIndex: 2 },
  { id: "middle-center-right", x: 70, y: 60, mobile: { x: 88, y: 58 }, depth: "middle", scale: 0.58, rotation: 2, zIndex: 4 },
  { id: "middle-far-left", x: 14, y: 76, mobile: { x: 88, y: 71 }, depth: "middle", scale: 0.62, rotation: -2, zIndex: 6 },
  { id: "foreground-center", x: 52, y: 92, mobile: { x: 38, y: 96 }, mobileScale: 0.6, depth: "foreground", scale: 0.72, rotation: 1, zIndex: 8 },
  { id: "background-center", x: 54, y: 44, mobile: { x: 64, y: 43 }, depth: "background", scale: 0.48, rotation: -1, zIndex: 2 },
  { id: "middle-far-right", x: 87, y: 76, mobile: { x: 38, y: 82 }, depth: "middle", scale: 0.58, rotation: 2, zIndex: 6 },
  { id: "foreground-left-center", x: 12, y: 92, mobile: { x: 12, y: 96 }, mobileScale: 0.6, depth: "foreground", scale: 0.68, rotation: -1, zIndex: 8 },
  { id: "background-far-left", x: 15, y: 44, mobile: { x: 12, y: 58 }, depth: "background", scale: 0.5, rotation: 1, zIndex: 2 },
  { id: "middle-right-center", x: 31, y: 60, mobile: { x: 12, y: 70 }, depth: "middle", scale: 0.58, rotation: -2, zIndex: 4 },
  { id: "middle-low-center", x: 51, y: 76, mobile: { x: 12, y: 82 }, depth: "middle", scale: 0.62, rotation: 2, zIndex: 6 },
  { id: "middle-left", x: 12, y: 60, mobile: { x: 38, y: 70 }, depth: "middle", scale: 0.56, rotation: -1, zIndex: 4 },
  { id: "foreground-right-center", x: 89, y: 92, mobile: { x: 88, y: 96 }, mobileScale: 0.6, depth: "foreground", scale: 0.7, rotation: 1, zIndex: 8 },
  { id: "middle-right-low", x: 69, y: 76, mobile: { x: 64, y: 82 }, mobileScale: 0.6, depth: "middle", scale: 0.58, rotation: -2, zIndex: 6 },
  { id: "background-far-right", x: 89, y: 44, mobile: { x: 88, y: 44 }, depth: "background", scale: 0.48, rotation: 2, zIndex: 2 },
] as const satisfies readonly GratitudePlantingPosition[];
