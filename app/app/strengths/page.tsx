import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./strengths.css";
import StrengthsPractice from "./strengths-practice";

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
