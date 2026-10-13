export type PlantingBand = "background" | "middle" | "foreground";

export type PlantingPosition = {
  id: string;
  band: PlantingBand;
  x: number;
  y: number;
  mobile: {
    x: number;
    y: number;
  };
  scaleRange: {
    min: number;
    max: number;
  };
  rotationRange: {
    min: number;
    max: number;
  };
  zIndex: number;
};

export const gratitudePlantingPositions: PlantingPosition[] = [
  {
    id: "background-left",
    band: "background",
    x: 27,
    y: 60,
    mobile: { x: 28, y: 60 },
    scaleRange: { min: 0.17, max: 0.22 },
    rotationRange: { min: -3, max: 3 },
    zIndex: 2,
  },
  {
    id: "background-center",
    band: "background",
    x: 51,
    y: 57,
    mobile: { x: 52, y: 57 },
    scaleRange: { min: 0.17, max: 0.23 },
    rotationRange: { min: -3, max: 3 },
    zIndex: 2,
  },
  {
    id: "background-right",
    band: "background",
    x: 76,
    y: 61,
    mobile: { x: 76, y: 60 },
    scaleRange: { min: 0.17, max: 0.22 },
    rotationRange: { min: -3, max: 3 },
    zIndex: 2,
  },
  {
    id: "middle-left",
    band: "middle",
    x: 18,
    y: 73,
    mobile: { x: 22, y: 73 },
    scaleRange: { min: 0.25, max: 0.32 },
    rotationRange: { min: -5, max: 5 },
    zIndex: 4,
  },
  {
    id: "middle-left-center",
    band: "middle",
    x: 39,
    y: 70,
    mobile: { x: 39, y: 70 },
    scaleRange: { min: 0.25, max: 0.32 },
    rotationRange: { min: -5, max: 5 },
    zIndex: 4,
  },
  {
    id: "middle-center",
    band: "middle",
    x: 58,
    y: 72,
    mobile: { x: 57, y: 72 },
    scaleRange: { min: 0.25, max: 0.32 },
    rotationRange: { min: -5, max: 5 },
    zIndex: 4,
  },
  {
    id: "middle-right",
    band: "middle",
    x: 82,
    y: 71,
    mobile: { x: 80, y: 71 },
    scaleRange: { min: 0.25, max: 0.32 },
    rotationRange: { min: -5, max: 5 },
    zIndex: 4,
  },
  {
    id: "foreground-left",
    band: "foreground",
    x: 33,
    y: 87,
    mobile: { x: 32, y: 86 },
    scaleRange: { min: 0.38, max: 0.48 },
    rotationRange: { min: -7, max: 7 },
    zIndex: 6,
  },
  {
    id: "foreground-right",
    band: "foreground",
    x: 68,
    y: 88,
    mobile: { x: 67, y: 87 },
    scaleRange: { min: 0.38, max: 0.48 },
    rotationRange: { min: -7, max: 7 },
    zIndex: 6,
  },
];
