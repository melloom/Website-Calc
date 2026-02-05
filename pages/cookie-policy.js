import Head from 'next/head';
import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy | Mellow Quote</title>
        <meta name="description" content="Cookie Policy for Mellow Quote - Learn about how we use cookies and similar technologies." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-6 inline-block">
              ← Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
            <p className="text-gray-500 text-sm mb-8">Last updated: February 3, 2026</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies?</h2>
                <p className="text-gray-600 mb-4">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Cookies</h2>
                <p className="text-gray-600 mb-3">Mellow Quote uses cookies for the following purposes:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and selections during your quote process</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Performance Cookies:</strong> Improve the speed and performance of our website</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Types of Cookies We Use</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm mb-2">These cookies are necessary for the website to function and cannot be switched off.</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Cookie</th>
                        <th className="text-left py-2 text-gray-700">Purpose</th>
                        <th className="text-left py-2 text-gray-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-2">cookie_consent</td>
                        <td className="py-2">Stores your cookie preferences</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2">session_id</td>
                        <td className="py-2">Maintains your session</td>
                        <td className="py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-600 text-sm mb-2">These cookies enable enhanced functionality and personalization.</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Cookie</th>
                        <th className="text-left py-2 text-gray-700">Purpose</th>
                        <th className="text-left py-2 text-gray-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-2">quote_data</td>
                        <td className="py-2">Saves your quote selections</td>
                        <td className="py-2">7 days</td>
                      </tr>
                      <tr>
                        <td className="py-2">user_preferences</td>
                        <td className="py-2">Remembers your settings</td>
                        <td className="py-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm mb-2">These cookies help us understand how visitors use our website.</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Cookie</th>
                        <th className="text-left py-2 text-gray-700">Purpose</th>
                        <th className="text-left py-2 text-gray-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b">
                        <td className="py-2">_ga</td>
                        <td className="py-2">Google Analytics tracking</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2">_gid</td>
                        <td className="py-2">Google Analytics session</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Managing Your Cookie Preferences</h2>
                <p className="text-gray-600 mb-4">
                  You can manage your cookie preferences at any time. Here are your options:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Cookie Banner:</strong> Use our cookie consent banner to accept or decline non-essential cookies</li>
                  <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings</li>
                  <li><strong>Opt-Out Links:</strong> Use third-party opt-out tools for analytics cookies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Browser Cookie Settings</h2>
                <p className="text-gray-600 mb-3">You can control cookies through your browser settings:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                  <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Please note that disabling certain cookies may affect the functionality of our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Third-Party Cookies</h2>
                <p className="text-gray-600 mb-4">
                  Some cookies on our website are placed by third-party services. These third parties have their own privacy and cookie policies. We recommend reviewing their policies for more information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Google Analytics: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Google Privacy Policy</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Similar Technologies</h2>
                <p className="text-gray-600 mb-4">
                  In addition to cookies, we may use similar technologies such as:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Local Storage:</strong> Stores data in your browser for improved performance</li>
                  <li><strong>Session Storage:</strong> Temporary storage that is cleared when you close your browser</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Updates to This Policy</h2>
                <p className="text-gray-600 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will post the updated policy on this page with a new "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@mellowquote.com<br />
                  <strong>Website:</strong> mellowquote.com
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
