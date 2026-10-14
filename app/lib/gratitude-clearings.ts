import { gratitudePlantingPositions, type GratitudePlantingPosition } from "./gratitude-planting-layout";

export type GratitudeClearing = {
  id: string;
  image: string;
  positions: readonly GratitudePlantingPosition[];
};

// Capacity is the number of deliberately designed positions in each clearing.
// Append new photographs with their own layouts; preserve existing registry
// order and slots once permanent contribution sequences have been assigned.
export const gratitudeClearings: readonly GratitudeClearing[] = [
  {
    id: "clearing-1",
    image: "/gratitude-clearing-base-temporary.png",
    positions: gratitudePlantingPositions,
  },
];

/** Resolve a future permanent, 1-based sequence using cumulative capacity.
 * Unregistered capacity has no visual home yet, so returns undefined.
 * This never assigns a sequence or derives one from API array order.
 */
export function locateGratitudeSequence(
  sequence: number,
  clearings: readonly GratitudeClearing[] = gratitudeClearings,
) {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError("A garden sequence must be a positive safe integer.");
  }

  let remaining = sequence;
  for (const [index, clearing] of clearings.entries()) {
    if (remaining <= clearing.positions.length) {
      return {
        clearingId: clearing.id,
        clearingNumber: index + 1,
        slotNumber: remaining,
        position: clearing.positions[remaining - 1],
      };
    }
    remaining -= clearing.positions.length;
  }
  return undefined;
}
