import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__content">
        <div className="site-footer__identity">
          <Link className="brand" href="/">
            You Matter.
          </Link>
          <p>You matter. We matter. What we do matters.</p>
        </div>
        <nav className="site-footer__navigation" aria-label="Footer navigation">
          <div className="site-footer__group" aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <ul className="site-footer__links">
              <li>
                <Link href="/how-are-you-doing">How are you doing?</Link>
              </li>
              <li>
                <Link href="/#adventures">Adventures</Link>
              </li>
              <li>
                <Link href="/writing">Writing</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__group" aria-labelledby="footer-more">
            <h2 id="footer-more">More</h2>
            <ul className="site-footer__links">
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}
