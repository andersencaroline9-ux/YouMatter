import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import DreamExperience from "./dream-experience";
import "./dream.css";

export const metadata: Metadata = {
  title: "Give Yourself Permission to Dream — You Matter",
  description:
    "Before you ask whether it’s possible, ask what you want.",
};

export default function DreamPage() {
  return (
    <>
      <SiteHeader />
      <main className="dream-page">
        <DreamExperience />
      </main>
      <SiteFooter />
    </>
  );
}
