import { PageHero } from '@/components/tbc/page-hero'

export default function PrivacyPage() {
  return (
    <>
      <PageHero badge="Legal" title="Privacy Policy" />
      <section className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 space-y-6">
            <p className="text-sm text-tbc-gray">Last updated: September 2026</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">1. Information We Collect</h2>
            <p className="text-tbc-gray leading-relaxed">When you interact with TBC — Tailik Business Committee, we may collect personal information including your name, email address, phone number, business name, profession, and city. This information is collected when you fill out membership applications, visitor registration forms, contact forms, or event registration forms on our website.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">2. How We Use Your Information</h2>
            <p className="text-tbc-gray leading-relaxed">We use the information we collect to process your membership applications and visitor requests, communicate with you about chapter meetings and events, provide you with updates about TBC activities, improve our services and website experience, and comply with legal obligations. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">3. Data Security</h2>
            <p className="text-tbc-gray leading-relaxed">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">4. Your Rights</h2>
            <p className="text-tbc-gray leading-relaxed">You have the right to access, correct, or delete your personal information. You may also opt out of receiving communications from us at any time. To exercise these rights, please contact us using the information provided on our Contact page.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">5. Cookies</h2>
            <p className="text-tbc-gray leading-relaxed">Our website may use cookies to enhance your browsing experience and analyze website usage. You can control cookie settings through your browser preferences.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">6. Contact</h2>
            <p className="text-tbc-gray leading-relaxed">For any questions about this Privacy Policy, please contact TBC — Tailik Business Committee at Gandhi Nagar, Pahari Chowk, Gudhiyari, Raipur (C.G.), India or call 9301056006.</p>
          </div>
        </div>
      </section>
    </>
  )
}
