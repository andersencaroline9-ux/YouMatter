export const KINDNESS_TREE_STORY_LIMIT = 18;

export type KindnessCategory = "gave" | "received" | "witnessed";

export type KindnessStory = {
  message: string;
  kind: KindnessCategory;
  displayName: string;
};

export type PendingKindnessEntry = KindnessStory & {
  id: number;
  status: "pending";
};

export function kindnessCategoryLabel(kind: KindnessCategory) {
  switch (kind) {
    case "gave":
      return "A kindness I gave";
    case "received":
      return "A kindness I received";
    case "witnessed":
      return "A kindness I witnessed";
  }
}
