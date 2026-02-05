import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        setShowBanner(true);
      }
    }
  }, [isClient]);

  const acceptAll = () => {
    if (isClient) {
      localStorage.setItem('cookie_consent', JSON.stringify({
        essential: true,
        functionality: true,
        analytics: true,
        accepted_at: new Date().toISOString()
      }));
      setShowBanner(false);
    }
  };

  const acceptEssential = () => {
    if (isClient) {
      localStorage.setItem('cookie_consent', JSON.stringify({
        essential: true,
        functionality: false,
        analytics: false,
        accepted_at: new Date().toISOString()
      }));
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">🍪 Cookie Consent</h3>
            <p className="text-gray-600 text-sm">
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies. 
              <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-700 ml-1">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={acceptEssential}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
