import { redirect } from "next/navigation";
import AdventureShell from "../../components/adventure-shell";
import NaturePractice from "../../components/nature-practice";
import { NATURE_MOSAIC_PUBLIC_ENABLED } from "../../lib/nature-mosaic-flag";

export default function NaturePage() {
  if (!NATURE_MOSAIC_PUBLIC_ENABLED) redirect("/");

  return (
    <AdventureShell
      title="The Nature Mosaic"
      subtitle="Look closely enough for the world to become vivid again."
      why="Modern life can narrow attention to tasks, screens and problems. Pausing with the natural world invites a different kind of attention: sensory, spacious and connected to something larger than the immediate self."
      what="Research links nature connectedness with subjective wellbeing, and evaluated month-long nature-engagement programmes have reported increases in happiness, health and connection to nature. The evidence is promising rather than magical: study designs vary, and nature is not a replacement for treatment or material support."
      nuance="You do not need wilderness, good weather or a beautiful photograph. A weed through pavement, rain on a window, changing light or a neighbourhood tree can be enough. The practice is noticing—not producing content."
      sources={[
        {
          label: "Capaldi, Dopko & Zelenski (2014), Nature Connectedness and Happiness",
          href: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00976/full",
        },
        {
          label: "Richardson et al. (2016), 30 Days Wild",
          href: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0149777",
        },
        {
          label: "Hamann & Ivtzan (2016), 30 Minutes in Nature a Day",
          href: "https://doi.org/10.13165/SIIW-16-2-2-04",
        },
      ]}
    >
      <NaturePractice />
    </AdventureShell>
  );
}
