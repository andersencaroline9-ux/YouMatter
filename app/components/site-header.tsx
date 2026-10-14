"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const adventures = [
  { href: "/gratitude", label: "Gratitude Garden" },
  { href: "/kindness", label: "The Kindness Tree" },
  { href: "/strengths", label: "What Do You Bring?" },
  { href: "/live-adventure", label: "30 Days in Nature — Live" },
];

export default function SiteHeader({ home = false }: { home?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adventuresOpen, setAdventuresOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const adventuresToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen && !adventuresOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setMobileOpen(false);
        setAdventuresOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setMobileOpen(false);
      setAdventuresOpen(false);
      if (mobileOpen) {
        mobileToggleRef.current?.focus();
      } else {
        adventuresToggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, adventuresOpen]);

  function closeMenus() {
    setMobileOpen(false);
    setAdventuresOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={`site-header${home ? " forest-home__header" : ""}`}
    >
      <nav className="shell site-nav" aria-label="Main navigation">
        <Link
          className="brand"
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          onClick={closeMenus}
        >
          You Matter.
        </Link>

        <button
          ref={mobileToggleRef}
          className="site-nav__mobile-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="site-navigation"
          onClick={() => {
            setMobileOpen((open) => !open);
            setAdventuresOpen(false);
          }}
        >
          {mobileOpen ? "Close menu" : "Menu"}
        </button>

        <div
          className="site-nav__links"
          id="site-navigation"
          data-open={mobileOpen}
        >
          <div className="site-nav__adventures">
            <button
              ref={adventuresToggleRef}
              className="site-nav__link site-nav__adventures-toggle"
              type="button"
              aria-expanded={adventuresOpen}
              aria-controls="adventures-menu"
              onClick={() => setAdventuresOpen((open) => !open)}
            >
              Go straight to the adventures <span aria-hidden="true">⌄</span>
            </button>
            <div
              className="site-nav__adventures-menu"
              id="adventures-menu"
              hidden={!adventuresOpen}
            >
              {adventures.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  data-active={pathname === href}
                  onClick={closeMenus}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            className="site-nav__link"
            href="/what-is-this"
            aria-current={pathname === "/what-is-this" ? "page" : undefined}
            onClick={closeMenus}
          >
            What is this?
          </Link>
        </div>
      </nav>
    </header>
  );
}
