import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Candies Studio collects, uses and protects personal information submitted through this website.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="17 November 2026">
      <p>
        This policy explains how {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information collected through{" "}
        {site.url.replace(/^https?:\/\//, "")} and its campaign pages. If you have questions, contact us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Information you give us</strong> when you submit an enquiry: name, business email, phone number, country, company,
          designation, the services you are interested in, your project description, budget range and timeline.
        </li>
        <li>
          <strong>Campaign information</strong> attached to an enquiry: the page you submitted from, and advertising parameters in the
          link you followed (for example UTM tags and Meta campaign, ad set and ad identifiers).
        </li>
        <li>
          <strong>Usage information</strong>, only if you accept cookies: pages viewed and actions taken (such as clicking a button or
          submitting the form), collected through Meta Pixel and Google Analytics.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry, prepare proposals and communicate with you about your project.</li>
        <li>To understand which campaigns and pages bring enquiries, so we can improve our advertising and website.</li>
        <li>To protect our forms against spam and abuse.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>Cookies and advertising measurement</h2>
      <p>
        With your consent, we use Meta Pixel and Google Analytics to measure visits and enquiries. When you submit an enquiry and have
        accepted cookies, we may also send a secure, server-side notification of that enquiry to Meta (Conversions API) so we can measure
        our advertising. Contact details shared this way are hashed before they are sent. You can decline cookies in the banner, or clear
        them in your browser at any time.
      </p>

      <h2>Who processes your information</h2>
      <p>We use trusted service providers to operate this website and handle enquiries, which may include:</p>
      <ul>
        <li>Website hosting (GitHub Pages).</li>
        <li>Enquiry storage and processing (Supabase), and email delivery of enquiry notifications.</li>
        <li>Spam protection (Cloudflare Turnstile), where enabled.</li>
        <li>Advertising measurement and analytics (Meta, Google), only with your consent.</li>
      </ul>
      <p>These providers may process data outside your country, with appropriate safeguards.</p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry information for as long as needed to respond to you and manage any resulting business relationship, and then
        delete or anonymise it unless we are required to keep it longer by law.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (including under the UK/EU GDPR and India&rsquo;s Digital Personal Data Protection Act), you may
        have the right to access, correct or delete your personal information, to withdraw consent, and to object to certain processing.
        To make a request, email <a href={`mailto:${site.email}`}>{site.email}</a>. You may also complain to your local data protection
        authority.
      </p>

      <h2>Security</h2>
      <p>
        Enquiries are sent over encrypted connections (HTTPS) and stored with access restricted to authorised team members. No method of
        transmission or storage is completely secure, but we take reasonable measures to protect your information.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above shows when it last changed.</p>
    </LegalPage>
  );
}
