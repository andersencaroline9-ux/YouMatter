import Link from "next/link";

const adventures = [
  { href: "/gratitude", label: "Gratitude Garden" },
  { href: "/kindness", label: "The Kindness Tree" },
  { href: "/strengths", label: "The Strengths We Bring" },
  { href: "/live-adventure", label: "RECONNECT — 30 Days in Nature" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__content">
        <div className="site-footer__identity">
          <Link className="brand" href="/">
            You Matter.
          </Link>
          <p>You matter. We matter. What we do matters.</p>
          <p className="site-footer__disclaimer">
            A reflective wellbeing experience—not therapy or medical advice.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="site-footer__links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/what-is-this">What is this?</Link>
            </li>
            {adventures.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
