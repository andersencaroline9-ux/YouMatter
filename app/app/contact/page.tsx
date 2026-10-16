import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import ContactForm from "./contact-form";
import "./contact.css";

export const metadata: Metadata = {
  title: "Get in touch — You Matter",
  description: "Send Caroline a private message.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="contact-page">
        <div className="shell contact-content">
          <p className="eyebrow">Contact</p>
          <h1 className="serif">Get in touch</h1>
          <p className="contact-intro">
            Have a question, an idea, or something you’d like to talk about?
            I’d love to hear from you.
          </p>
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
