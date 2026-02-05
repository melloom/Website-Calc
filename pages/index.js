import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { STORAGE_KEY } from '../utils/quote-storage';
import { safeLocalStorage, safeWindow } from '../utils/client-safe';

export default function Home() {
  const [selectedType, setSelectedType] = useState('');
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const fromPage = router.query.from || ''; // Track where we came from
  
  // Clear localStorage when user lands on the main page (starting fresh)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storage = safeLocalStorage();
    console.log('Home: Clearing localStorage for fresh start');
    storage.removeItem(STORAGE_KEY);
    storage.removeItem('selectedBundle');
    storage.removeItem('bundleSelections');
    storage.removeItem('currentStep');
    storage.removeItem('websiteType');
    storage.removeItem('category');
  }, []);
  
  // Initialize selection from query parameters
  useEffect(() => {
    if (router.query.type) {
      setSelectedType(router.query.type);
    }
  }, [router.query.type]);

  return (
    <>
      <Head>
        <title>Mellow Quote</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-3 py-6 sm:p-4 relative overflow-hidden">
        {/* Background decoration - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Solid background fill for mobile PWA widget area */}
        <div className="sm:hidden absolute bottom-0 left-0 right-0 h-20 bg-white"></div>
        
        <div className="relative z-10 w-full max-w-2xl">
          <div className="fade-in">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-3">
                Step 1: Single Page or Multi Page?
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Choose Your Website Structure</h2>
                <p className="text-gray-600 text-center text-sm">Select the type that fits your needs</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <button 
                  onClick={() => {
                    setSelectedType('single');
                    console.log('Single page selected');
                    // Save to localStorage immediately when selected
                    if (typeof window !== 'undefined') {
                      const storage = safeLocalStorage();
                      const currentSelections = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
                      currentSelections.step1 = {
                        step: 1,
                        name: 'Website Type',
                        value: 'Single Page',
                        id: 'single',
                        cost: 0
                      };
                      storage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
                      safeWindow().dispatchEvent(new Event('selections-updated'));
                    }
                  }}
                  className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedType === 'single' 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Single Page</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Perfect for landing pages, portfolios, and simple websites</p>
                    <div className="mt-3 sm:mt-4 text-blue-600 font-medium text-xs sm:text-sm">
                      All sections on one scrollable page
                    </div>
                  </div>
                  {selectedType === 'single' && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={() => {
                    setSelectedType('multi');
                    console.log('Multi page selected');
                    // Save to localStorage immediately when selected
                    if (typeof window !== 'undefined') {
                      const storage = safeLocalStorage();
                      const currentSelections = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
                      currentSelections.step1 = {
                        step: 1,
                        name: 'Website Type',
                        value: 'Multi Page',
                        id: 'multi',
                        cost: 0
                      };
                      storage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
                      safeWindow().dispatchEvent(new Event('selections-updated'));
                    }
                  }}
                  className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedType === 'multi' 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Multi Page</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Ideal for business sites, blogs, and complex websites</p>
                    <div className="mt-3 sm:mt-4 text-blue-600 font-medium text-xs sm:text-sm">
                      Multiple pages with navigation
                    </div>
                  </div>
                  {selectedType === 'multi' && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
              
              {selectedType && (
                  <button
                    onClick={() => {
                      console.log('Selected type:', selectedType);
                      // After type selection, go to category page with current selection
                      router.push(`/step-2?type=${selectedType}&from=type`);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                  >
                    Continue →
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
