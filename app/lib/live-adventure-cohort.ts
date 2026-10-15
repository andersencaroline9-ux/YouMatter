export const LIVE_ADVENTURE_COHORT_SIZE = 10;
export const LIVE_ADVENTURE_WAITLIST_CAPACITY = 20;

export function isLiveAdventureReservePosition(position: number) {
  return position > LIVE_ADVENTURE_COHORT_SIZE;
}
