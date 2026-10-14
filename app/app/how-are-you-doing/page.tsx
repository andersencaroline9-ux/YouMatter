import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import HomeCheckinExperience from "../home-checkin-experience";
import "../home-welcome.css";
import "./how-are-you-doing.css";

export const metadata: Metadata = {
  title: "How are you doing? — You Matter",
  description:
    "Pause for a moment, check in with yourself, and see how others are doing too.",
};

export default function HowAreYouDoingPage() {
  return (
    <>
      <SiteHeader />
      <main className="how-are-you-doing">
        <HomeCheckinExperience />
      </main>
      <SiteFooter />
    </>
  );
}
