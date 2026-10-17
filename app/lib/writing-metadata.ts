export type WritingChapterNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type WritingChapter = {
  number: WritingChapterNumber;
  title: string;
  description: string;
  imageBrief: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type WritingPiece = {
  number: number;
  slug: string;
  title: string;
  provenance: string;
  sourceThemes: readonly string[];
  chapter: WritingChapterNumber;
  chapterOrder: number;
  explore: readonly string[];
  adventures?: readonly { label: string; href: string }[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const writingPieces = [
  {
    number: 1,
    slug: "take-a-walk-with-your-toddler",
    title: "Take a Walk with Your Toddler",
    provenance: "Original reflection",
    sourceThemes: ["Nature", "mindfulness", "presence"],
    chapter: 3,
    chapterOrder: 1,
    explore: ["theres-gold-for-everyone", "cursing-at-beauty-while-writing-about-beauty"],
    adventures: [{ label: "RECONNECT", href: "/live-adventure" }],
  },
  {
    number: 2,
    slug: "it-was-a-bad-morning",
    title: "It Was a BAD Morning",
    provenance: "Original reflection",
    sourceThemes: ["Perspective", "emotional regulation", "motherhood"],
    chapter: 2,
    chapterOrder: 1,
    explore: ["oh-how-you-love-her-your-mom", "are-you-happy-mommy"],
    adventures: [{ label: "Gratitude Garden", href: "/gratitude" }],
  },
  {
    number: 3,
    slug: "theres-gold-for-everyone",
    title: "There’s Gold for Everyone",
    provenance: "Approved English translation",
    sourceThemes: ["Shared gratitude", "nature", "collective experience"],
    chapter: 3,
    chapterOrder: 2,
    explore: ["i-am-so-very-grateful", "take-a-walk-with-your-toddler"],
    adventures: [{ label: "Gratitude Garden", href: "/gratitude" }],
    image: {
      src: "/writing/theres-gold-for-everyone.png",
      alt: "Sunset light spreads gold across the sea beside a coastal village.",
      width: 960,
      height: 540,
    },
  },
  {
    number: 4,
    slug: "oh-how-you-love-her-your-mom",
    title: "Oh How You Love Her. Your Mom.",
    provenance: "Original reflection",
    sourceThemes: ["Love", "attachment", "parent-child connection"],
    chapter: 2,
    chapterOrder: 4,
    explore: ["are-you-happy-mommy", "i-am-so-very-grateful"],
  },
  {
    number: 5,
    slug: "do-you-know-that-feeling",
    title: "Do You Know That Feeling?",
    provenance: "Original reflection",
    sourceThemes: ["Presence", "contentment", "fleeting moments of motherhood"],
    chapter: 2,
    chapterOrder: 3,
    explore: ["take-a-walk-with-your-toddler", "i-am-so-very-grateful"],
    adventures: [{ label: "RECONNECT", href: "/live-adventure" }],
  },
  {
    number: 6,
    slug: "the-kindness-of-strangers",
    title: "The Kindness of Strangers",
    provenance: "Original reflection",
    sourceThemes: ["Kindness", "empathy", "motherhood", "human connection"],
    chapter: 4,
    chapterOrder: 1,
    explore: ["the-little-conversations-that-connect-us", "the-little-connections-between-us"],
    adventures: [{ label: "The Kindness Tree", href: "/kindness" }],
  },
  {
    number: 7,
    slug: "are-you-happy-mommy",
    title: "Are You Happy, Mommy?",
    provenance: "Original reflection",
    sourceThemes: ["Happiness", "contentment", "motherhood", "personal values"],
    chapter: 2,
    chapterOrder: 2,
    explore: ["by-my-own-definition-i-am-successful", "money-really-isnt-everything"],
  },
  {
    number: 8,
    slug: "today-we-choose-to-appreciate-each-other",
    title: "Today We Choose to Appreciate Each Other",
    provenance: "Original reflection",
    sourceThemes: ["Relationships", "gratitude", "intentional appreciation"],
    chapter: 2,
    chapterOrder: 5,
    explore: ["i-am-so-very-grateful", "the-little-conversations-that-connect-us"],
    adventures: [{ label: "The Kindness Tree", href: "/kindness" }],
  },
  {
    number: 9,
    slug: "i-am-so-very-grateful",
    title: "I Am So Very Grateful",
    provenance: "Original reflection",
    sourceThemes: ["Gratitude", "family", "love", "everyday blessings"],
    chapter: 3,
    chapterOrder: 3,
    explore: ["theres-gold-for-everyone", "today-we-choose-to-appreciate-each-other"],
    adventures: [{ label: "Gratitude Garden", href: "/gratitude" }],
  },
  {
    number: 10,
    slug: "money-really-isnt-everything",
    title: "Money Really Isn’t Everything",
    provenance: "Original reflection",
    sourceThemes: ["Work-life balance", "family", "values", "intentional living"],
    chapter: 1,
    chapterOrder: 2,
    explore: ["by-my-own-definition-i-am-successful", "dearest-money-fuck-ever-so-much-off"],
  },
  {
    number: 11,
    slug: "by-my-own-definition-i-am-successful",
    title: "By My Own Definition, I Am Successful",
    provenance: "Original reflection",
    sourceThemes: ["Success", "contentment", "gratitude", "personal values"],
    chapter: 5,
    chapterOrder: 1,
    explore: ["money-really-isnt-everything", "when-the-fire-starts-to-fade"],
  },
  {
    number: 12,
    slug: "when-the-fire-starts-to-fade",
    title: "When the Fire Starts to Fade",
    provenance: "Book excerpt — Four of Cups",
    sourceThemes: ["Meaning", "purpose", "work", "identity", "passions"],
    chapter: 1,
    chapterOrder: 3,
    explore: ["by-my-own-definition-i-am-successful", "and-so-you-leap"],
  },
  {
    number: 13,
    slug: "life-is-just-50-shades-of-grey",
    title: "Life Is Just 50 Shades of Grey",
    provenance: "Book excerpt — Eight of Swords",
    sourceThemes: ["Career", "security", "dissatisfaction", "gratitude", "identity"],
    chapter: 1,
    chapterOrder: 1,
    explore: ["by-my-own-definition-i-am-successful", "dearest-money-fuck-ever-so-much-off"],
  },
  {
    number: 14,
    slug: "the-little-conversations-that-connect-us",
    title: "The Little Conversations That Connect Us",
    provenance: "Original reflection",
    sourceThemes: ["Belonging", "technology", "strangers", "small interactions"],
    chapter: 4,
    chapterOrder: 2,
    explore: ["the-little-connections-between-us", "the-kindness-of-strangers"],
    adventures: [{ label: "The Kindness Tree", href: "/kindness" }],
  },
  {
    number: 15,
    slug: "you-matter",
    title: "You Matter",
    provenance: "Book excerpt",
    sourceThemes: ["Interconnectedness", "mattering", "purpose", "impact"],
    chapter: 6,
    chapterOrder: 2,
    explore: ["the-little-connections-between-us", "meet-hilda-an-atheist-tries-to-understand-the-universe"],
    adventures: [{ label: "The Strengths We Bring", href: "/strengths" }],
  },
  {
    number: 16,
    slug: "meet-hilda-an-atheist-tries-to-understand-the-universe",
    title: "Meet Hilda: An Atheist Tries to Understand the Universe",
    provenance: "Book excerpt — complete attached markdown, unedited",
    sourceThemes: ["Scepticism", "spirituality", "hope", "interconnectedness", "meaning"],
    chapter: 6,
    chapterOrder: 1,
    explore: ["you-matter", "the-little-connections-between-us"],
    adventures: [{ label: "RECONNECT", href: "/live-adventure" }],
  },
  {
    number: 17,
    slug: "the-little-connections-between-us",
    title: "The Little Connections Between Us",
    provenance: "Book excerpt",
    sourceThemes: ["Smiling at strangers", "human connection", "belonging", "technology"],
    chapter: 4,
    chapterOrder: 3,
    explore: ["the-little-conversations-that-connect-us", "the-kindness-of-strangers"],
    adventures: [{ label: "The Kindness Tree", href: "/kindness" }],
  },
  {
    number: 18,
    slug: "cursing-at-beauty-while-writing-about-beauty",
    title: "Cursing at Beauty While Writing About Beauty",
    provenance: "You Matter. But This Isn't About You",
    sourceThemes: ["News detox", "attention", "presence", "gratitude", "mental wellbeing", "rediscovering everyday beauty"],
    chapter: 3,
    chapterOrder: 4,
    explore: ["take-a-walk-with-your-toddler", "theres-gold-for-everyone"],
    adventures: [{ label: "Gratitude Garden", href: "/gratitude" }],
  },
  {
    number: 19,
    slug: "dearest-money-fuck-ever-so-much-off",
    title: "Dearest Money, Fuck Ever So Much Off!",
    provenance: "You Matter. But This Isn't About You",
    sourceThemes: ["Money", "abundance", "childhood experiences", "financial anxiety", "self-worth", "limiting beliefs", "redefining wealth"],
    chapter: 1,
    chapterOrder: 4,
    explore: ["money-really-isnt-everything", "life-is-just-50-shades-of-grey"],
  },
  {
    number: 20,
    slug: "and-so-you-leap",
    title: "And So You Leap",
    provenance: "User-submitted excerpt",
    sourceThemes: ["Trust", "career change", "studying psychology", "uncertainty", "partnership", "courage"],
    chapter: 5,
    chapterOrder: 2,
    explore: ["when-the-fire-starts-to-fade", "by-my-own-definition-i-am-successful"],
  },
] as const satisfies readonly WritingPiece[];

export const writingChapters = [
  {
    number: 1,
    title: "WHEN LIFE DOESN'T QUITE FIT",
    description:
      "About dissatisfaction, work, money, success and that nagging feeling that surely this isn't it.",
    imageBrief:
      "A real, quiet image suggesting a life or work transition without relying on career clichés.",
    image: {
      src: "/writing/chapter-1-winding-woodland-path.jpg",
      alt: "A gravel path bending out of sight between oaks, birches and ferns in dappled green woodland.",
      width: 1600,
      height: 1067,
    },
  },
  {
    number: 2,
    title: "LOVE, HAPPINESS & OTHER COMPLICATED THINGS",
    description:
      "The tenderness, strain and shifting definitions woven through family life.",
    imageBrief:
      "A candid, warm image that holds tenderness and complexity without looking staged.",
    image: {
      src: "/writing/chapter-2-sunlit-branching-oak.jpg",
      alt: "Low sun breaking through the tangled branches of an old oak, casting long shadows across the grass.",
      width: 1600,
      height: 1067,
    },
  },
  {
    number: 3,
    title: "NOTICE WHAT'S HERE",
    description:
      "Small moments, attention, and the beauty that asks only to be noticed.",
    imageBrief:
      "The source document's real coastal sunset photograph, used as this chapter image.",
    image: {
      src: "/writing/theres-gold-for-everyone.png",
      alt: "Sunset light spreads gold across the sea beside a coastal village.",
      width: 960,
      height: 540,
    },
  },
  {
    number: 4,
    title: "THE LITTLE CONNECTIONS BETWEEN US",
    description:
      "Brief encounters and ordinary gestures that bring us closer.",
    imageBrief:
      "A real, quiet image of a small moment of connection; existing project photography is used for now.",
    image: {
      src: "/caroline-with-dog.png",
      alt: "A woman sitting beside a dog outdoors.",
      width: 1276,
      height: 600,
    },
  },
  {
    number: 5,
    title: "THE PURSUIT OF FULFILMENT",
    description:
      "Questions of success, courage and choosing what matters.",
    imageBrief:
      "A real image suggesting a chosen path or a new beginning, without generic success imagery.",
    image: {
      src: "/writing/chapter-5-woodland-path-light.jpg",
      alt: "A leaf-strewn forest track rising through tall beech trees, with shafts of sunlight cutting through the haze.",
      width: 1600,
      height: 1067,
    },
  },
  {
    number: 6,
    title: "IS THERE SOMETHING GREATER THAN US?",
    description:
      "Wonder, belief and the possibility of belonging to something larger.",
    imageBrief:
      "A contemplative real image that evokes the wider universe or meaning without religious symbolism.",
    image: {
      src: "/writing/chapter-6-canopy-upward.jpg",
      alt: "Looking straight up through the crowns of tall trees to pale sky.",
      width: 1600,
      height: 1067,
    },
  },
] as const satisfies readonly WritingChapter[];

export const writingPieceBySlug = new Map(
  writingPieces.map((piece) => [piece.slug, piece])
);
