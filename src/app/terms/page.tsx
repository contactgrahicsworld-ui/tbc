import { PageHero } from '@/components/tbc/page-hero'

export default function TermsPage() {
  return (
    <>
      <PageHero badge="Legal" title="Terms of Service" />
      <section className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 space-y-6">
            <p className="text-sm text-tbc-gray">Last updated: September 2026</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">1. Acceptance of Terms</h2>
            <p className="text-tbc-gray leading-relaxed">By accessing or using the TBC — Tailik Business Committee website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">2. Membership</h2>
            <p className="text-tbc-gray leading-relaxed">TBC membership is subject to application approval and adherence to chapter bylaws. Members must attend weekly meetings regularly, provide quality referrals, and maintain professional conduct. Membership may be revoked for violations of TBC policies or unethical business practices.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">3. Business Category Exclusivity</h2>
            <p className="text-tbc-gray leading-relaxed">Each TBC chapter maintains one member per business category to ensure exclusivity and quality of referrals. Category classification is determined by TBC leadership and is subject to review.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">4. Intellectual Property</h2>
            <p className="text-tbc-gray leading-relaxed">All content on the TBC website, including text, graphics, logos, and images, is the property of Tailik Business Committee and is protected by intellectual property laws. Unauthorized use is prohibited.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">5. Limitation of Liability</h2>
            <p className="text-tbc-gray leading-relaxed">TBC provides a platform for professional networking but does not guarantee specific business results from membership. TBC is not liable for the quality of products or services provided by its members or for any disputes between members.</p>

            <h2 className="text-xl font-bold text-tbc-charcoal">6. Contact</h2>
            <p className="text-tbc-gray leading-relaxed">For questions about these Terms, contact TBC — Tailik Business Committee at Gandhi Nagar, Pahari Chowk, Gudhiyari, Raipur (C.G.), India or call 9301056006.</p>
          </div>
        </div>
      </section>
    </>
  )
}
