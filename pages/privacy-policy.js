import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Mellow Quote</title>
        <meta name="description" content="Privacy Policy for Mellow Quote - Learn how we collect, use, and protect your personal information." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-6 inline-block">
              ← Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500 text-sm mb-8">Last updated: February 3, 2026</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p className="text-gray-600 mb-4">
                  Welcome to Mellow Quote ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website quote calculator service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                <p className="text-gray-600 mb-3">We may collect the following types of information:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and business name when you request a quote</li>
                  <li><strong>Project Information:</strong> Details about your website requirements, preferences, and specifications</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and time spent</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
                  <li><strong>Cookies and Tracking:</strong> We use cookies to enhance your experience (see our Cookie Policy)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <p className="text-gray-600 mb-3">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Generate and deliver website quotes based on your requirements</li>
                  <li>Communicate with you about your quote and potential projects</li>
                  <li>Improve our services and user experience</li>
                  <li>Send you relevant updates and marketing communications (with your consent)</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted third parties who assist us in operating our website and delivering services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you have given us explicit permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
                <p className="text-gray-600 mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Quote information is typically retained for up to 2 years.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
                <p className="text-gray-600 mb-3">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
                <p className="text-gray-600 mb-4">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@mellowquote.com<br />
                  <strong>Website:</strong> mellowquote.com
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
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
