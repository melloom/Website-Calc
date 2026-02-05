import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | Mellow Quote</title>
        <meta name="description" content="Terms of Service for Mellow Quote - Read our terms and conditions for using our website quote calculator." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-6 inline-block">
              ← Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-500 text-sm mb-8">Last updated: February 3, 2026</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-4">
                  By accessing and using Mellow Quote ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                <p className="text-gray-600 mb-4">
                  Mellow Quote provides an online website quote calculator that allows users to receive estimated pricing for website development projects. The quotes generated are estimates only and may be subject to change based on project requirements and scope.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Quote Estimates</h2>
                <p className="text-gray-600 mb-3">Please understand that:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>All quotes are estimates and not binding contracts</li>
                  <li>Final pricing may vary based on detailed project analysis</li>
                  <li>Quotes are valid for 30 days from the date of generation</li>
                  <li>Additional features or changes may affect the final price</li>
                  <li>We reserve the right to modify pricing at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
                <p className="text-gray-600 mb-3">When using our Service, you agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not attempt to interfere with or disrupt the Service</li>
                  <li>Not use automated systems to access the Service without permission</li>
                  <li>Not impersonate any person or entity</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
                <p className="text-gray-600 mb-4">
                  All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and software, are the exclusive property of Mellow Quote and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reproduce any part of the Service without our prior written consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Privacy</h2>
                <p className="text-gray-600 mb-4">
                  Your use of the Service is also governed by our Privacy Policy. Please review our <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link> to understand how we collect, use, and protect your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
                <p className="text-gray-600 mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. YOUR USE OF THE SERVICE IS AT YOUR OWN RISK.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
                <p className="text-gray-600 mb-4">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, MELLOW QUOTE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Indemnification</h2>
                <p className="text-gray-600 mb-4">
                  You agree to indemnify, defend, and hold harmless Mellow Quote and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modifications to Terms</h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of the Service after any changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Termination</h2>
                <p className="text-gray-600 mb-4">
                  We may terminate or suspend your access to the Service at any time, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
                <p className="text-gray-600 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Mellow Quote operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Dispute Resolution</h2>
                <p className="text-gray-600 mb-4">
                  Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with applicable arbitration rules.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Severability</h2>
                <p className="text-gray-600 mb-4">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@mellowquote.com<br />
                  <strong>Website:</strong> mellowquote.com
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
                <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-700">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
