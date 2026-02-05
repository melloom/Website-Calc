import { useState, useEffect } from 'react';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Step8() {
  const [selectedStore, setSelectedStore] = useState('');
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const aiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const pages = router.query.pages || '';
  const fromPage = router.query.from || ''; // Track where we came from
  const storeOptions = router.query.storeOptions || ''; // Store options from URL
  
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
  const storeAddon = router.query.storeAddon || ''; // Track if store was added as bundle addon
  
  // Check if this is a budget bundle
  const isBudgetBundle = () => {
    const budgetBundleIds = ['budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'];
    return budgetBundleIds.includes(bundle);
  };
  
  // Build bundle params string for navigation (centralized)
  const bundleParams = buildBundleParams(router.query);
  
  // Check if store is locked by bundle (included in bundle = can't turn off)
  const isStoreLockedByBundle = bpStore === 'yes-store';
  
  // Initialize selection from query parameters
  useEffect(() => {
    console.log('Step 8 useEffect - fromPage:', fromPage, 'store:', router.query.store, 'storeOptions:', storeOptions, 'bpStore:', bpStore);
    
    // PRIORITY 1: Restore user's previous selection from URL (respects their choice)
    if (router.query.store) {
      console.log('Restoring store selection from URL:', router.query.store);
      setSelectedStore(router.query.store);
      return;
    }
    
    // PRIORITY 2: Auto-select from bundle preselects ONLY if no previous selection
    if (bpStore === 'yes-store' && !selectedStore) {
      console.log('Auto-selecting store from bundle:', bpStore);
      setSelectedStore('yes-store');
    }
  }, [router.query.store, fromPage, storeOptions, bpStore]);

  const toggleStore = (storeId) => {
    // If store is locked by bundle (yes-store), can't change to 'no-store'
    if (isStoreLockedByBundle && storeId === 'no-store') {
      return; // Can't toggle off bundle-included store
    }
    console.log('toggleStore called with storeId:', storeId, 'current selectedStore:', selectedStore);
    const newSelection = selectedStore === storeId ? '' : storeId;
    setSelectedStore(newSelection);
    
    // Save to localStorage and clean up store options when changing to 'no'
    if (typeof window !== 'undefined') {
      try {
        const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        
        if (newSelection === 'yes-store') {
          const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
          // Cost 0 only when store is included in bundle; charge when added as addon
          // Regular store selection is $450 (matching MobileCostSummary and price list)
          const storeCost = isStoreLockedByBundle ? 0 : (storeAddon === 'true' ? (isBudgetBundle() ? 199 : 450) : 450);
          currentSelections.step8 = {
            step: 8,
            name: 'E-Commerce Store',
            value: 'Yes (Store)',
            id: 'store',
            items: defaultStoreFeatures,
            cost: storeCost,
            includedInBundle: !!isStoreLockedByBundle
          };
        } else {
          // Remove store when selecting no-store
          delete currentSelections.step8;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 8: Saved store selection to localStorage', currentSelections.step8);
        
        // Trigger a custom event to notify MobileCostSummary of the change
        console.log('Step 8: Dispatching selections-updated event');
        window.dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving store selection to localStorage:', error);
      }
    }
  };

  const calculateAdditionalCost = () => {
    let total = 0;
    if (selectedStore === 'yes-store') {
      // Check pricing based on how store was added
      if (storeAddon === 'true') {
        // Store was added as bundle addon - use cheaper pricing
        const budgetStorePrice = 199; // Budget bundle addon price
        const regularStorePrice = 450; // Bundle addon pricing - updated to $450
        total += isBudgetBundle() ? budgetStorePrice : regularStorePrice;
      } else {
        // Regular store selection - use standard pricing of $450
        // This matches the price list: $100 + $200 + $150 = $450
        total += 450;
      }
    }
    return total;
  };

  return (
    <>
      <Head>
        <title>Step 8: Do you need a store/checkout? - Mellow Quote</title>
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
                Step 8: Do you need a store/checkout?
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium max-w-full overflow-x-auto scrollbar-hide">
                {websiteType === 'single' ? '📄 Single Page' : '📑 Multi Page'} → {category.charAt(0).toUpperCase() + category.slice(1)} → {subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')} → Backend: {backend === 'no' ? 'No' : 'Yes'} → AI: {aiChoice === 'no' ? 'No' : 'Yes'} → Automation → Store
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-6">
              {/* Bundle Selection Notice */}
              {fromPage === 'bundle' && bpStore && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-lg">🎁</span>
                    <div>
                      <span className="text-purple-800 font-semibold">Bundle Features Pre-selected!</span>
                      <span className="text-purple-600 text-sm ml-2">Your bundle store selection is automatically selected below.</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Do you need a store/checkout?</h2>
                <p className="text-gray-600 text-center text-sm mb-3">Choose whether you need e-commerce functionality for your website</p>
                
                {/* Store Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm">
                      <p className="text-blue-800 font-medium mb-1">What's a store/checkout?</p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        Selecting "Yes" gets you checkout and ordering functionality like product listings, shopping cart, secure checkout, and order management. Perfect for taking orders, bookings, or simple sales. Note: Site addons are separate addons that can be selected later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Yes/No Options */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div
                  onClick={() => {
                    console.log('No Store clicked!');
                    toggleStore('no-store');
                  }}
                  className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    isStoreLockedByBundle
                      ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                      : selectedStore === 'no-store'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ${
                      selectedStore === 'no-store' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-4 h-4 sm:w-8 sm:h-8 ${selectedStore === 'no-store' ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-2">No Store</h3>
                    <p className="hidden sm:block text-gray-600 text-sm mb-3">Website without e-commerce functionality</p>
                    <div className="text-[10px] sm:text-base text-green-600 font-semibold">
                      No cost
                    </div>
                  </div>
                  {/* Bundle Lock Indicator */}
                  {isStoreLockedByBundle && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                        🔒
                      </span>
                    </div>
                  )}
                </div>
                
                <div
                  onClick={() => {
                    console.log('Yes Store clicked!');
                    toggleStore('yes-store');
                  }}
                  className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    isStoreLockedByBundle
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : selectedStore === 'yes-store'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ${
                      selectedStore === 'yes-store' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-4 h-4 sm:w-8 sm:h-8 ${selectedStore === 'yes-store' ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-2">Yes Store</h3>
                    <p className="hidden sm:block text-gray-600 text-sm mb-3">Add e-commerce functionality to your website</p>
                    <div className={`text-[10px] sm:text-base font-semibold ${isStoreLockedByBundle ? 'text-purple-600' : 'text-blue-600'}`}>
                      {isStoreLockedByBundle ? 'Bundle' : (
                        storeAddon === 'true' ? 
                          `+$${isBudgetBundle() ? '199' : (websiteType === 'single' ? '299' : '399')}` :
                          `+$${isBudgetBundle() ? '200' : '450'}`
                      )}
                    </div>
                  </div>
                  {/* Bundle Lock Indicator */}
                  {isStoreLockedByBundle && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                        🔒 <span className="hidden sm:inline">Included</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const features = router.query.features || '';
                    console.log('Going back from store, fromPage:', fromPage, 'automation:', automation, 'features:', features);
                    // Check if we came from automation options (automation has actual options, not just yes/no)
                    const hasAutomationOptions = automation && automation !== 'yes-automation' && automation !== 'no-automation';
                    
                    if (fromPage === 'automation-options' || hasAutomationOptions) {
                      // Go back to automation options page - preserve features
                      router.push(`/step-7?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&features=${features}&flow=automation-options&from=store${bundleParams}`);
                    } else {
                      // Go back to automation yes/no page - preserve features
                      router.push(`/step-7?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&features=${features}&from=store${bundleParams}`);
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                {selectedStore && (
                  <button
                    onClick={() => {
                      const features = router.query.features || '';
                      if (selectedStore === 'yes-store') {
                        // Go to store options page with store selection preserved - preserve features
                        router.push(`/step-8-options?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${selectedStore}&storeOptions=${storeOptions}&features=${features}&from=step-8${bundleParams}`);
                      } else {
                        // No store selected, go to sections - preserve features
                        router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${selectedStore}&features=${features}&from=step-8${bundleParams}`);
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                  >
                    {selectedStore === 'yes-store' ? 'Customize Store →' : 'Continue →'}
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
