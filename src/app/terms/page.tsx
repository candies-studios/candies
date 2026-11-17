import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: "Terms governing the use of the Candies Studio website.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="17 November 2026">
      <p>
        These terms apply to your use of the {site.name} website and its campaign pages. By using the website you agree to them. For
        questions, contact <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Website content</h2>
      <p>
        The content on this website — including text, graphics, logos, illustrations and design — belongs to {site.name} or is used with
        permission. Client names and logos are shown to describe our experience and remain the property of their owners. You may not copy,
        reproduce or reuse website content without our written permission, except for personal, non-commercial viewing.
      </p>

      <h2>Enquiries and proposals</h2>
      <p>
        Submitting an enquiry does not create a contract or oblige either party to work together. Information on this website, including
        service descriptions and budget ranges in forms, is general and does not constitute a quotation or offer. Any engagement is
        governed by a separate written proposal or agreement.
      </p>

      <h2>Accuracy</h2>
      <p>
        We aim to keep the website accurate and up to date, but we do not guarantee that it is free from errors or always available. We
        may change or remove content at any time.
      </p>

      <h2>Third-party links</h2>
      <p>The website may link to third-party sites and services. We are not responsible for their content or practices.</p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.name} is not liable for any loss arising from use of, or reliance on, this website.
        Nothing in these terms limits liability that cannot be limited by law.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal information is described in our <a href="/privacy/">Privacy Policy</a>.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The &ldquo;last updated&rdquo; date above shows when they last changed.</p>
    </LegalPage>
  );
}
