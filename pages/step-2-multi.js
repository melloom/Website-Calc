import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { STORAGE_KEY } from '../utils/quote-storage';

export default function Step2Multi() {
  const [websiteCategory, setWebsiteCategory] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const websiteType = router.query.type || 'multi';
  const fromPage = router.query.from || ''; // Track where we came from

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clear localStorage when coming from page refresh or direct navigation to step 1
  useEffect(() => {
    // Clear localStorage if user is starting fresh (coming from page refresh, direct link, or going all the way back)
    if (fromPage === '' || router.query.clear === 'true') {
      console.log('Step 2 Multi: Clearing localStorage for fresh start');
      localStorage.removeItem(STORAGE_KEY);
      // Also clear any other relevant localStorage items
      localStorage.removeItem('selectedBundle');
      localStorage.removeItem('bundleSelections');
      localStorage.removeItem('currentStep');
      localStorage.removeItem('websiteType');
      localStorage.removeItem('category');
    }
  }, [fromPage, router.query.clear]);

  useEffect(() => {
    if (router.query.category) {
      setWebsiteCategory(router.query.category);
    }
  }, [router.query.category]);
  
  // Multi-page categories only
  const categories = [
    {
      id: 'business',
      name: 'Business',
      description: 'Professional multi-page business websites',
      icon: '🏢'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Multi-page creative portfolios and agencies',
      icon: '🎨'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Online stores with shopping carts and products',
      icon: '🛍️'
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Multi-page content platforms and publications',
      icon: '📝'
    },
    {
      id: 'landing',
      name: 'Landing',
      description: 'Multi-page marketing websites and campaigns',
      icon: '🎯'
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Complex multi-page custom solutions',
      icon: '⚡'
    }
  ];

  return (
    <>
      <Head>
        <title>Step 2: Choose Your Website Type - Mellow Quote</title>
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center pt-12 px-4 pb-24 sm:pt-4 sm:pb-4 sm:p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 w-full max-w-4xl">
          <div className="fade-in">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Step 2: What type of multi-page website do you need?
              </p>
              <div className="mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                📑 Multi Page Website
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Choose Your Specific Type</h2>
                <p className="text-gray-600 text-center text-sm">Select the option that best describes your project</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setWebsiteCategory(category.id);
                      if (typeof window !== 'undefined' && isClient) {
                        const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                        currentSelections.step1 = currentSelections.step1 || { step: 1, name: 'Website Type', value: 'Multi Page', id: 'multi', cost: 0 };
                        currentSelections.step2 = { step: 2, name: 'Category', value: category.name, id: category.id, cost: 0 };
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
                        window.dispatchEvent(new Event('selections-updated'));
                      }
                    }}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      websiteCategory === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{category.icon}</div>
                      {websiteCategory === category.id && (
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/?type=${websiteType}&category=${websiteCategory}&from=category`)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                {websiteCategory && (
                  <button
                    onClick={() => {
                      router.push(`/step-3?type=${websiteType}&category=${websiteCategory}&from=category`);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
