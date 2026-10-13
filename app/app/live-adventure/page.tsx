import Link from "next/link";

export default function LiveAdventurePage() {
  return (
    <main className="live-adventure-placeholder">
      <h1>30 Days in Nature</h1>
      <p className="live-adventure-placeholder__tagline">
        15 people. One shared experience.
      </p>
      <p>This live adventure is being prepared. Return to the forest for now.</p>
      <Link href="/">Return to the forest</Link>
    </main>
  );
}
