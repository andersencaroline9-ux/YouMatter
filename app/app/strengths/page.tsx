import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./strengths.css";
import StrengthsPractice from "./strengths-practice";

export const metadata: Metadata = {
  title: "The Strengths We Bring — You Matter",
};

export default function StrengthsPage() {
  return (
    <>
      <SiteHeader />
      <main className="strengths-page">
        <div className="shell">
          <StrengthsPractice />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
