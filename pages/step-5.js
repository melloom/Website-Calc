import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIsClient, safeLocalStorage, safeWindow } from '../utils/client-safe';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step5() {
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [selectedBackend, setSelectedBackend] = useState('');
  const isClient = useIsClient();
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const fromPage = router.query.from || ''; // Track where we came from
  const backend = router.query.backend || ''; // Get backend selection from query
  
  // Bundle preselects (bp_ prefix)
  const bpBackend = router.query.bp_backend || '';
  const bpBackendOptions = router.query.bp_backendOptions || '';
  const bpAi = router.query.bp_ai || '';
  const bpAiFeatures = router.query.bp_aiFeatures || '';
  const bpAutomation = router.query.bp_automation || '';
  const bpAutomationFeatures = router.query.bp_automationFeatures || '';
  const bpStore = router.query.bp_store || '';
  const bpStoreOptions = router.query.bp_storeOptions || '';
  const bpSections = router.query.bp_sections || '';
  const bpAddons = router.query.bp_addons || '';
  const bpHosting = router.query.bp_hosting || '';
  const bpMaintenance = router.query.bp_maintenance || '';
  const bundle = router.query.bundle || '';
  
  // Build bundle params string for navigation (centralized)
  const bundleParams = buildBundleParams(router.query);
  
  // Check if backend is locked by bundle (included in bundle = can't turn off)
  const isBackendLockedByBundle = bpBackend === 'yes';
  
  // Initialize features and backend from query parameters if coming back
  useEffect(() => {
    if (!router.isReady) return;

    console.log('Step 5 useEffect - bpSections:', bpSections, 'bpBackend:', bpBackend, 'fromPage:', fromPage);
    
    if (router.query.features) {
      try {
        const features = JSON.parse(router.query.features || '{}');
        setSelectedFeatures(features);
      } catch (error) {
        console.warn('Invalid JSON in features query parameter:', router.query.features, error);
        setSelectedFeatures({});
      }
    }
    
    let nextBackendSelection = '';

    // PRIORITY 1: Bundle preselects (highest priority) - always set if bundle includes backend
    if (bpBackend === 'yes') {
      nextBackendSelection = 'yes';
    }
    // PRIORITY 2: Existing backend selection (lower priority, only if no bundle)
    else if (backend && !bpBackend) {
      if (backend === 'no') {
        nextBackendSelection = 'no';
      } else {
        // Any other value implies backend is enabled with or without specific options
        nextBackendSelection = 'yes';
        if (backend !== 'yes') {
          console.log('Backend has specific options selected:', backend);
        }
      }
    }
    // PRIORITY 3: Default to bundle if no other selection exists
    else if (bpBackend) {
      nextBackendSelection = bpBackend;
    }

    if (nextBackendSelection && nextBackendSelection !== selectedBackend) {
      setSelectedBackend(nextBackendSelection);
    }
  }, [router.isReady, router.query.features, backend, fromPage, bpBackend, bpSections]);

  const syncBackendQueryParam = (value) => {
    if (!router.isReady) return;
    const nextQuery = { ...router.query };
    nextQuery.backend = value;
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  };
  
  // Handler for backend selection - respects bundle locks
  const handleBackendSelect = (value) => {
    // If backend is locked by bundle (yes), can't change to 'no'
    if (isBackendLockedByBundle && value === 'no') {
      return; // Can't toggle off bundle-included backend
    }
    setSelectedBackend(value);
    syncBackendQueryParam(value);

    // Save to localStorage immediately when selected
    if (isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        if (value === 'no') {
          // Remove both backend yes/no and backend technology options
          delete currentSelections.step5;
          delete currentSelections.step6;
          console.log('Step 5: Removed all backend selections from localStorage');
        } else {
          currentSelections.step5 = {
            step: 5,
            name: 'Backend',
            value: 'Yes (Backend)',
            id: 'backend',
            cost: 0, // Will be calculated based on specific options
            includedInBundle: !!(bundle && isBackendLockedByBundle)
          };
        }
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        
        // Trigger event to update widget
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving backend selection to localStorage:', error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Step 5: Do you need a backend? - Mellow Quote</title>
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
                Step 5: Do you need a backend?
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium max-w-full overflow-x-auto scrollbar-hide">
                {websiteType === 'single' ? '📄 Single Page' : '📑 Multi Page'} → {category.charAt(0).toUpperCase() + category.slice(1)} → {subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')} → Features
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Backend Requirements</h2>
                <p className="text-gray-600 text-center text-sm mb-4">Choose whether your website needs a backend system</p>
                
                {/* Backend Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium mb-1">What's a backend?</p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        A backend handles things like user accounts, content management, databases, booking systems, 
                        shopping carts, and other interactive features. If you just need a simple website that displays 
                        information, you probably don't need a backend.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <button
                  onClick={() => handleBackendSelect('no')}
                  className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                    isBackendLockedByBundle
                      ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                      : selectedBackend === 'no'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="bg-green-100 w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                      <svg className="w-4 h-4 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-2">No Backend</h3>
                    <p className="hidden sm:block text-gray-600 text-sm mb-3">Simple {websiteType === 'multi' ? 'multi-page website' : 'website'} with static content</p>
                    <p className="sm:hidden text-[10px] text-gray-500">Static website</p>
                    <div className="hidden sm:block space-y-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {websiteType === 'multi' ? 'Information pages' : 'Information section'}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Contact forms
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {websiteType === 'multi' ? 'Image galleries' : 'Image gallery'}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        SEO optimization
                      </div>
                    </div>
                    <div className="hidden sm:block mt-4 text-green-600 font-semibold">
                      Lower cost • Faster development
                    </div>
                  </div>
                  {/* Bundle Lock Indicator */}
                  {isBackendLockedByBundle && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                        🔒 Not Available
                      </span>
                    </div>
                  )}
                  {selectedBackend === 'no' && !isBackendLockedByBundle && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => handleBackendSelect('yes')}
                  className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                    isBackendLockedByBundle
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : selectedBackend === 'yes'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  {/* Bundle Included Badge */}
                  {isBackendLockedByBundle && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                        🔒 <span className="hidden sm:inline">Included in </span>Bundle
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <div className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ${isBackendLockedByBundle ? 'bg-purple-100' : 'bg-blue-100'}`}>
                      <svg className={`w-4 h-4 sm:w-8 sm:h-8 ${isBackendLockedByBundle ? 'text-purple-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4m0 0l-4 4m4-4H10" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-2">With Backend</h3>
                    <p className="hidden sm:block text-gray-600 text-sm mb-3">Dynamic {websiteType === 'multi' ? 'multi-page website' : 'website'} with interactive features</p>
                    <p className="sm:hidden text-[10px] text-gray-500">Dynamic features</p>
                    <div className="sm:hidden text-blue-600 font-semibold text-[10px]">
                      From $400+
                    </div>
                    <div className="hidden sm:block space-y-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        User accounts
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Content management
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Database integration
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {websiteType === 'multi' ? 'Multi-page navigation' : 'Booking systems'}
                      </div>
                    </div>
                    <div className="hidden sm:block mt-4 text-blue-600 font-bold text-base bg-blue-50 px-3 py-2 rounded-lg text-center">
                      From $400+
                    </div>
                  </div>
                  {selectedBackend === 'yes' && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                      <div className="bg-blue-500 text-white rounded-full p-0.5 sm:p-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Smart back navigation with preserved selections including backend choice
                    if (fromPage === 'subcategory') {
                      // Came from subcategory page, go back there with current selections
                      router.push(`/step-4?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${selectedBackend}&from=backend${bundleParams}`);
                    } else if (fromPage === 'category') {
                      // Came from category page, go back there with current selections
                      router.push(`/step-2?type=${websiteType}&backend=${selectedBackend}&from=backend${bundleParams}`);
                    } else if (fromPage === 'type') {
                      // Came from type page, go back there with current selections
                      router.push(`/?backend=${selectedBackend}&from=backend${bundleParams}&clear=true`);
                    } else {
                      // Default: go to subcategory page with current selections
                      router.push(`/step-4?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${selectedBackend}&from=backend${bundleParams}`);
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                {selectedBackend && (
                  <button
                    onClick={() => {
                      // Get existing AI and automation selections from URL to preserve them
                      const existingAi = router.query.ai || '';
                      const existingAutomation = router.query.automation || '';
                      const existingFeatures = router.query.features || '';
                      
                      // After backend selection, navigate based on choice
                      if (selectedBackend === 'no') {
                        // Skip backend options, go directly to AI features - preserve existing AI selection
                        router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=no&flow=ai&ai=${existingAi}&automation=${existingAutomation}&features=${existingFeatures}&from=backend${bundleParams}`);
                      } else {
                        // Go to backend technology selection
                        // If we have specific backend options from URL, pass them through
                        const hasSpecificBackendOptions = backend && backend !== 'yes' && backend !== 'no';
                        const backendParam = hasSpecificBackendOptions ? backend : 'yes';
                        router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backendParam}&ai=${existingAi}&automation=${existingAutomation}&features=${existingFeatures}&flow=backend&from=backend${bundleParams}`);
                      }
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
