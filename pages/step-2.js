import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { STORAGE_KEY } from '../utils/quote-storage';
import { safeLocalStorage, safeWindow } from '../utils/client-safe';

export default function Step2() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const fromPage = router.query.from || ''; // Track where we came from
  
  // Clear localStorage only when starting fresh (direct visit or explicit clear)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (fromPage === '' || router.query.clear === 'true') {
      const storage = safeLocalStorage();
      console.log('Step 2: Clearing localStorage for fresh start');
      storage.removeItem(STORAGE_KEY);
      storage.removeItem('selectedBundle');
      storage.removeItem('bundleSelections');
      storage.removeItem('currentStep');
      storage.removeItem('websiteType');
      storage.removeItem('category');
    }
  }, [fromPage, router.query.clear]);
  
  // Initialize selection from query parameters
  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    }
  }, [router.query.category]);

  // Only show single-page categories
  const categories = [
    {
      id: 'business',
      name: 'Business',
      description: 'Professional landing pages for companies and services',
      icon: '🏢'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Creative portfolios and work showcases',
      icon: '🎨'
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Single-page blogs and content sites',
      icon: '📝'
    },
    {
      id: 'landing',
      name: 'Landing',
      description: 'Marketing pages and conversions',
      icon: '🎯'
    },
    {
      id: 'product',
      name: 'Product',
      description: 'Product showcases and launches',
      icon: '📦'
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Unique single-page projects',
      icon: '⚡'
    }
  ];

  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    
    // Update URL immediately for real-time widget updates
    router.push(`/step-2?type=${websiteType}&category=${category.id}&from=type`, undefined, { shallow: true });
    
    // Save to localStorage only on client side
    if (isClient) {
      const storage = safeLocalStorage();
      const currentSelections = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
      currentSelections.step2 = {
        step: 2,
        name: 'Category',
        value: category.name,
        id: category.id,
        cost: 0
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
      safeWindow().dispatchEvent(new Event('selections-updated'));
    }
  };

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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-3 pt-12 pb-24 sm:pt-6 sm:pb-6 sm:p-4 relative overflow-hidden">
        {/* Background decoration - hidden on mobile */}
        <div className="hidden sm:block absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 w-full max-w-4xl">
          <div className="fade-in">
            <div className="text-center mb-6 sm:mb-12">
              <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2 sm:mb-4 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Step 2: What type of single-page website do you need?
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                📄 Single Page Website
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">Choose Your Specific Type</h2>
                <p className="text-gray-600 text-center text-xs sm:text-sm">Select the option that best describes your project</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`relative p-3 sm:p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-4">
                      <div className="text-2xl sm:text-4xl">{category.icon}</div>
                      {selectedCategory === category.id && (
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{category.description}</p>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Go back to home page with current selections
                    const categoryToPass = selectedCategory || '';
                    router.push(`/?from=category&category=${categoryToPass}&type=${websiteType}`);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                {selectedCategory && (
                  <button
                    onClick={() => {
                      // After category selection, go to subcategory page with current selection
                      router.push(`/step-3?type=${websiteType}&category=${selectedCategory}&from=category`);
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
