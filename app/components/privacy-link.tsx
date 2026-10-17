import Link from "next/link";

export default function PrivacyLink({ className = "" }: { className?: string }) {
  return (
    <p className={`privacy-link ${className}`.trim()}>
      How we handle your information:{" "}
      <Link href="/privacy">Privacy at You Matter</Link>
    </p>
  );
}
