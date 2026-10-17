import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./business-information.css";

export const metadata: Metadata = {
  title: "Business information — You Matter",
  description: "The registered Danish business behind You Matter.",
};

export default function BusinessInformationPage() {
  return (
    <>
      <SiteHeader />
      <main className="business-page">
        <div className="shell business-content">
          <p className="eyebrow">Business information</p>
          <h1 className="serif">The business behind You Matter</h1>
          <p>You Matter is a project of We Matter, a registered Danish business.</p>
          <address className="business-details">
            <strong>We Matter</strong>
            <span>CVR: 46857054</span>
            <span>Gudhjemvej 105</span>
            <span>3760 Gudhjem</span>
            <span>Denmark</span>
            <a href="mailto:hello@thisisyoumatter.com">
              hello@thisisyoumatter.com
            </a>
          </address>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
