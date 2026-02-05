import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIsClient, safeLocalStorage, safeWindow } from '../utils/client-safe';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step6() {
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [selectedBackend, setSelectedBackend] = useState([]); // Changed to array for multiple selections
  const [aiChoice, setAiChoice] = useState(''); // Add AI choice state
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position
  const isClient = useIsClient();
  
  // Save scroll position before navigation
  const saveScrollPosition = () => {
    if (isClient) {
      setScrollPosition(safeWindow().scrollY);
    }
  };
  
  // Restore scroll position after navigation
  const restoreScrollPosition = () => {
    if (isClient && scrollPosition > 0) {
      safeWindow().scrollTo(0, scrollPosition);
    }
  };
  
  // Add scroll position restoration effect
  useEffect(() => {
    restoreScrollPosition();
  }, [scrollPosition]);

  // Add debug logging for aiChoice changes
  useEffect(() => {
    console.log('aiChoice changed to:', aiChoice);
  }, [aiChoice]);
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const queryAiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const flow = router.query.flow || '';
  const fromPage = router.query.from || ''; // Track where we came from
  
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
  
  // Parse bundle-locked items (can't be toggled off)
  const lockedBackendOptions = bpBackendOptions ? bpBackendOptions.split(',').filter(b => b.trim()) : [];
  const lockedAiFeatures = bpAiFeatures ? bpAiFeatures.split(',').filter(f => f.trim()) : [];
  const isAiLockedByBundle = bpAi === 'yes';

  const syncBackendQueryParam = useCallback((backendSelections, fallbackValue = 'yes') => {
    if (!router.isReady) return;
    const hasSelections = Array.isArray(backendSelections) && backendSelections.length > 0;
    const backendValue = hasSelections ? backendSelections.join(',') : fallbackValue;
    if (router.query.backend === backendValue) return;
    const nextQuery = { ...router.query, backend: backendValue };
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  }, [router]);

  const areArraysEqual = (arr1 = [], arr2 = []) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };
  
  // Initialize selections from query parameters
  useEffect(() => {
    console.log('Step 6 useEffect - flow:', flow, 'backend:', backend, 'ai:', router.query.ai, 'features:', router.query.features, 'fromPage:', fromPage);
    console.log('Bundle params - bpBackend:', bpBackend, 'bpBackendOptions:', bpBackendOptions);
    
    // PRIORITY 0: Restore from localStorage (highest priority)
    if (isClient) {
      try {
        const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        const savedBackendOptions = savedSelections.step6?.items || [];
        if (savedBackendOptions.length > 0 && !areArraysEqual(selectedBackend, savedBackendOptions)) {
          console.log('Restoring backend options from localStorage:', savedBackendOptions);
          setSelectedBackend(savedBackendOptions);
          syncBackendQueryParam(savedBackendOptions);
        }
      } catch (error) {
        console.warn('Invalid JSON in localStorage for selections:', error);
      }
    }
    
    // PRIORITY 1: Bundle backend options (next priority)
    else if (bpBackendOptions && bpBackendOptions.length > 0) {
      const bpBackendArray = bpBackendOptions.split(',').filter(b => b.trim());
      if (bpBackendArray.length > 0 && !areArraysEqual(selectedBackend, bpBackendArray)) {
        setSelectedBackend(bpBackendArray);
        syncBackendQueryParam(bpBackendArray);
        console.log('Auto-selected backend options from bundle:', bpBackendArray);
      }
    }
    // PRIORITY 2: Fallback for bundle with backend but no specific options
    else if (bpBackend === 'yes' && selectedBackend.length === 0) {
      console.log('Bundle includes backend but no specific options - selecting default');
      setSelectedBackend(['content-system']); // Default backend option
      syncBackendQueryParam(['content-system']);
    }
    // PRIORITY 3: URL backend parameter (lowest priority, only if no bundle)
    else if (backend && backend.length > 0 && !bpBackend) {
      // Only restore from URL if no bundle backend options
      if (backend === 'yes') {
        // If backend is just 'yes', don't select anything - let user choose
        console.log('Backend is yes but no specific options - waiting for user selection');
        if (selectedBackend.length > 0) {
          setSelectedBackend([]);
        }
      } else {
        const backendArray = backend.split(',').filter(b => b.trim());
        if (backendArray.length > 0 && !areArraysEqual(selectedBackend, backendArray)) {
          setSelectedBackend(backendArray);
          console.log('Restored backend selections from URL:', backendArray);
        }
      }
    }
    
    // Restore AI choice from localStorage first (highest priority)
    if (isClient) {
      try {
        const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        // Check if we have AI features saved, which implies AI choice was 'yes'
        const savedAiFeatures = savedSelections.step7?.items || [];
        if (savedAiFeatures.length > 0 && aiChoice !== 'yes') {
          console.log('Restoring AI choice to yes based on saved AI features:', savedAiFeatures);
          setAiChoice('yes');
        }
      } catch (error) {
        console.warn('Error checking AI choice from localStorage:', error);
      }
    }
    
    // Always restore AI choice from URL if present (lower priority)
    if (router.query.ai && aiChoice !== router.query.ai) {
      console.log('Restoring aiChoice from URL:', router.query.ai);
      setAiChoice(router.query.ai);
    }
    // Auto-select AI choice from bundle preselects - always set if bundle includes AI
    else if (bpAi === 'yes' && aiChoice !== 'yes') {
      console.log('Auto-selecting AI choice from bundle:', bpAi);
      setAiChoice('yes');
    }
    
    // Restore AI features from localStorage first (highest priority)
    if (isClient) {
      try {
        const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        const savedAiFeatures = savedSelections.step7?.items || [];
        if (savedAiFeatures.length > 0) {
          const initialFeatures = {};
          savedAiFeatures.forEach(feature => {
            initialFeatures[feature] = true;
          });
          setSelectedFeatures(initialFeatures);
          console.log('Restored AI features from localStorage:', initialFeatures);
        }
      } catch (error) {
        console.warn('Invalid JSON in localStorage for AI features:', error);
      }
    }
    
    // Restore AI features from URL if present (lower priority)
    else if (router.query.features && router.query.features.length > 0) {
      const featuresArray = router.query.features.split(',').filter(f => f.trim());
      if (featuresArray.length > 0) {
        const initialFeatures = {};
        featuresArray.forEach(feature => {
          initialFeatures[feature] = true;
        });
        setSelectedFeatures(initialFeatures);
        console.log('Restored AI features from URL:', initialFeatures);
      }
    }
    // Auto-select AI features from bundle preselects - always set if bundle includes AI features
    else if (bpAiFeatures && bpAiFeatures.length > 0) {
      const bpFeaturesArray = bpAiFeatures.split(',').filter(f => f.trim());
      if (bpFeaturesArray.length > 0) {
        const initialFeatures = {};
        bpFeaturesArray.forEach(feature => {
          initialFeatures[feature] = true;
        });
        setSelectedFeatures(initialFeatures);
        console.log('Auto-selected AI features from bundle:', initialFeatures);
      }
    }
  }, [backend, router.query.ai, router.query.features, flow, fromPage, bpBackendOptions, bpAi, bpAiFeatures, bpBackend, selectedBackend, syncBackendQueryParam, router.isReady]);

  // Effect to handle AI flow specifically
  useEffect(() => {
    console.log('AI flow effect - flow:', flow, 'router.query.ai:', router.query.ai, 'current aiChoice:', aiChoice);
    if (flow === 'ai' && router.query.ai && aiChoice !== router.query.ai && aiChoice === '') {
      // Only update if we're in AI flow, URL has ai parameter, state differs, AND state is empty
      // This prevents overriding user selections
      console.log('Updating aiChoice to match URL (state was empty):', router.query.ai);
      setAiChoice(router.query.ai);
    }
  }, [flow, router.query.ai, aiChoice]);

  const getBackendOptions = () => {
    return [
      {
        id: 'basic-auth',
        name: 'Basic Authentication',
        description: 'Simple user login and accounts',
        price: '+$250',
        features: ['User Login', 'User Accounts', 'Password Security', 'Basic Storage', 'Admin Access']
      },
      {
        id: 'auth-storage',
        name: 'Auth & Storage',
        description: 'User accounts with file storage',
        price: '+$400',
        features: ['User Login', 'File Storage', 'Database', 'User Accounts', 'Admin Panel']
      },
      {
        id: 'api-backend',
        name: 'API Backend',
        description: 'RESTful API for mobile apps and integrations',
        price: '+$600',
        features: ['REST API', 'JSON Responses', 'Authentication', 'Database Integration', 'API Documentation']
      },
      {
        id: 'secure-system',
        name: 'Secure System',
        description: 'Advanced security with storage',
        price: '+$600',
        features: ['Secure Login', 'Cloud Storage', 'User Management', 'Database Security', 'File Uploads']
      },
      {
        id: 'full-system',
        name: 'Complete System',
        description: 'Everything you need for your website',
        price: '+$800',
        features: ['Advanced Login', 'Unlimited Storage', 'User Roles', 'Secure Database', 'File Management']
      },
      {
        id: 'content-system',
        name: 'Content Management (CMS)',
        description: 'Manage website content easily',
        price: '+$500',
        features: ['Content Editor', 'File Uploads', 'User Accounts', 'Database', 'Admin Tools']
      },
      {
        id: 'ecommerce-backend',
        name: 'E-commerce Backend',
        description: 'Complete online store backend system',
        price: '+$900',
        features: ['Product Management', 'Shopping Cart', 'Payment Processing', 'Order Management', 'Inventory System']
      },
      {
        id: 'custom-system',
        name: 'Custom Solution',
        description: 'Built exactly for your needs',
        price: '+$1,200',
        features: ['Custom Features', 'User Management', 'File Storage', 'Database', 'Security']
      }
    ];
  };

  const getAIOptions = () => {
    return [
      {
        id: 'ai-chatbot',
        name: 'AI Chatbot',
        description: 'Automated customer support and assistance',
        price: '+$250',
        features: ['Natural Language Processing', '24/7 Support', 'Multi-language', 'Integration Ready', 'Custom Training']
      },
      {
        id: 'ai-content',
        name: 'AI Content Generation',
        description: 'Automated content creation and optimization',
        price: '+$300',
        features: ['Blog Generation', 'SEO Optimization', 'Image Creation', 'Content Scheduling', 'Analytics']
      },
      {
        id: 'ai-analytics',
        name: 'AI Analytics',
        description: 'Intelligent data analysis and insights',
        price: '+$300',
        features: ['Predictive Analytics', 'User Behavior Analysis', 'A/B Testing', 'Conversion Optimization', 'Real-time Insights']
      },
      {
        id: 'ai-personalization',
        name: 'AI Personalization',
        description: 'Customized user experiences',
        price: '+$400',
        features: ['Dynamic Content', 'Recommendation Engine', 'User Profiling', 'Behavior Tracking', 'A/B Testing']
      },
      {
        id: 'ai-automation',
        name: 'AI Automation',
        description: 'Automated workflows and processes',
        price: '+$400',
        features: ['Workflow Automation', 'Smart Notifications', 'Process Optimization', 'Integration Hub', 'Custom Rules']
      },
      {
        id: 'ai-assistant',
        name: 'AI Assistant',
        description: 'Virtual assistant for user guidance',
        price: '+$500',
        features: ['Voice Interface', 'Task Management', 'Smart Recommendations', 'Learning System', 'Multi-platform']
      }
    ];
  };

  const toggleBackend = (backendId) => {
    console.log('Step 6: Toggling backend', backendId);
    // Save current scroll position
    saveScrollPosition();
    
    // Check if this backend option is locked by bundle
    if (lockedBackendOptions.includes(backendId) && selectedBackend.includes(backendId)) {
      // Can't toggle off bundle-included backend options
      return;
    }
    const newBackend = selectedBackend.includes(backendId) 
      ? selectedBackend.filter(id => id !== backendId)
      : [...selectedBackend, backendId];
    
    console.log('Step 6: New backend selection', newBackend);
    setSelectedBackend(newBackend);
    syncBackendQueryParam(newBackend);
    
    // Save to localStorage immediately when selected
    if (isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        
        if (newBackend.length > 0) {
          const allBackendFromBundle = bundle && newBackend.length > 0 && newBackend.every(id => lockedBackendOptions.includes(id));
          let backendCost = 0;
          if (!allBackendFromBundle) {
            newBackend.forEach(backendId => {
              if (!lockedBackendOptions.includes(backendId)) {
                const option = getBackendOptions().find(opt => opt.id === backendId);
                if (option) backendCost += parseInt(option.price.replace(/[^0-9]/g, '')) || 0;
              }
            });
          }
          currentSelections.step6 = {
            step: 6,
            name: 'Backend Options',
            value: newBackend.length > 0 ? newBackend.join(', ') : 'Backend Options',
            items: newBackend,
            cost: backendCost,
            includedInBundle: !!allBackendFromBundle
          };
        } else {
          delete currentSelections.step6;
        }
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 6: Saved backend to localStorage', currentSelections.step6);
        
        // Trigger a custom event to notify MobileCostSummary of the change
        console.log('Step 6 Backend: Dispatching selections-updated event');
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving backend selections to localStorage:', error);
      }
    }
  };

  const toggleFeature = (featureId) => {
    console.log('Step 6: Toggling AI feature', featureId);
    // Save current scroll position
    saveScrollPosition();
    
    // Check if this AI feature is locked by bundle
    if (lockedAiFeatures.includes(featureId) && selectedFeatures[featureId]) {
      console.log('Step 6: AI feature is locked by bundle, skipping toggle');
      return;
    }
    const newFeatures = {
      ...selectedFeatures,
      [featureId]: !selectedFeatures[featureId]
    };
    console.log('Step 6: New AI features state', newFeatures);
    setSelectedFeatures(newFeatures);
    
    // Save to localStorage immediately when selected
    if (isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        const selectedFeatureIds = Object.keys(newFeatures).filter(id => newFeatures[id]);
        console.log('Step 6: Selected AI feature IDs', selectedFeatureIds);
        
        if (selectedFeatureIds.length > 0) {
          // Calculate actual cost for AI features (0 for bundle-included)
          let aiCost = 0;
          selectedFeatureIds.forEach(featureId => {
            const option = getAIOptions().find(opt => opt.id === featureId);
            if (option && !isAiFeatureLocked(featureId)) {
              aiCost += parseInt(option.price.replace(/[^0-9]/g, ''));
            }
          });
          const allAiFromBundle = bundle && selectedFeatureIds.length > 0 && selectedFeatureIds.every(id => lockedAiFeatures.includes(id));
          currentSelections.step7 = {
            step: 7,
            name: 'AI Features',
            value: `${selectedFeatureIds.length} selected`,
            items: selectedFeatureIds,
            cost: aiCost,
            includedInBundle: !!allAiFromBundle
          };
        } else {
          delete currentSelections.step7;
        }
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 6: Saved AI features to localStorage', currentSelections.step7);
        
        // Trigger a custom event to notify MobileCostSummary of the change
        console.log('Step 6 AI: Dispatching selections-updated event');
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving AI feature selections to localStorage:', error);
      }
    }
  };

  // Check if a backend option is locked by bundle
  const isBackendOptionLocked = (backendId) => lockedBackendOptions.includes(backendId);

  // Check if an AI feature is locked by bundle
  const isAiFeatureLocked = (featureId) => lockedAiFeatures.includes(featureId);

  // Handler for AI choice - respects bundle locks
  const handleAiChoice = (value) => {
    // If AI is locked by bundle (yes), can't change to 'no'
    if (isAiLockedByBundle && value === 'no') {
      return; // Can't toggle off bundle-included AI
    }
    setAiChoice(value);
    
    // Save to localStorage and clean up selections when changing AI choice
    if (isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        if (value === 'no') {
          // Remove AI features when AI is disabled
          delete currentSelections.step7;
          setSelectedFeatures({}); // Clear UI state
          console.log('Step 6: Removed AI features due to AI choice = no');
        }
        // Save AI choice (this will be handled by navigation)
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        
        // Trigger event to update widget
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error updating AI choice in localStorage:', error);
      }
    }
  };

  const calculateAdditionalCost = () => {
    let total = 0;
    if (flow === 'ai' || flow === 'ai-options') {
      // AI options flow - calculate cost for selected AI features (excluding bundle-locked)
      Object.keys(selectedFeatures).forEach(featureId => {
        // Skip bundle-locked features - they're included free
        if (selectedFeatures[featureId] && !isAiFeatureLocked(featureId)) {
          const option = getAIOptions().find(opt => opt.id === featureId);
          if (option) {
            total += parseInt(option.price.replace(/[^0-9]/g, ''));
          }
        }
      });
    } else {
      // Backend options - calculate for multiple selections (excluding bundle-locked)
      console.log('Calculating backend cost - selectedBackend:', selectedBackend);
      selectedBackend.forEach(backendId => {
        // Skip bundle-locked backend options - they're included free
        if (isBackendOptionLocked(backendId)) {
          console.log('Skipping bundle-locked backend:', backendId);
          return;
        }
        const option = getBackendOptions().find(opt => opt.id === backendId);
        console.log('Backend option:', backendId, 'found:', option);
        if (option) {
          const price = parseInt(option.price.replace(/[^0-9]/g, ''));
          console.log('Adding price:', price, 'for option:', backendId);
          total += price;
        }
      });
      console.log('Total backend cost:', total);
    }
    return total;
  };

  return (
    <>
      <Head>
        <title>Step 6: {flow === 'ai' ? 'Do you want AI?' : flow === 'ai-options' ? 'Choose AI Features' : 'Backend Technology'} - Mellow Quote</title>
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
        <div className="hidden sm:block absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 w-full max-w-4xl">
          <div className="fade-in">
            <div className="text-center mb-6 sm:mb-12">
              <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-2 sm:mb-4 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Step 6: {flow === 'ai' ? 'Do you want AI?' : flow === 'ai-options' ? 'Choose AI Features' : 'Choose Backend Technology'}
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium max-w-full overflow-x-auto scrollbar-hide">
                {websiteType === 'single' ? '📄 Single Page' : '📑 Multi Page'} → {category.charAt(0).toUpperCase() + category.slice(1)} → {subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')} → Backend: {backend === 'no' ? 'No' : 'Yes'}{flow === 'ai' || flow === 'ai-options' ? ` → AI: ${aiChoice === 'no' ? 'No' : 'Yes'}` : ''}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-6">
              {/* Bundle Selection Notice */}
              {fromPage === 'bundle' && (bpBackend || bpAi || bpBackendOptions || bpAiFeatures) && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-lg">🎁</span>
                    <div>
                      <span className="text-purple-800 font-semibold">Bundle Features Pre-selected!</span>
                      <span className="text-purple-600 text-sm ml-2">Your bundle features are automatically selected below.</span>
                    </div>
                  </div>
                </div>
              )}
              
              {flow === 'ai' ? (
                // AI Yes/No Selection Flow
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Do you want AI?</h2>
                    <p className="text-gray-600 text-center text-sm mb-3">Choose whether to add AI features to your website</p>
                    
                    {/* AI Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                          <p className="text-blue-800 font-medium mb-1">What's AI?</p>
                          <p className="text-blue-700 text-xs leading-relaxed">
                            AI features can include chatbots for customer support, automated content generation, 
                            smart analytics, personalized user experiences, and automated workflows. 
                            These can help your website work smarter and save you time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      onClick={() => {
                        console.log('No AI clicked!');
                        handleAiChoice('no');
                      }}
                      className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        isAiLockedByBundle
                          ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                          : aiChoice === 'no'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ${
                          aiChoice === 'no' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-4 h-4 sm:w-8 sm:h-8 ${aiChoice === 'no' ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-2">No AI</h3>
                        <p className="hidden sm:block text-gray-600 text-sm mb-3">Standard website without AI features</p>
                        <div className="text-[10px] sm:text-base text-green-600 font-semibold">
                          No cost
                        </div>
                      </div>
                      {/* Bundle Lock Indicator */}
                      {isAiLockedByBundle && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                            🔒
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div
                      onClick={() => {
                        console.log('Yes AI clicked!');
                        handleAiChoice('yes');
                      }}
                      className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        isAiLockedByBundle
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : aiChoice === 'yes'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ${
                          aiChoice === 'yes' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-4 h-4 sm:w-8 sm:h-8 ${aiChoice === 'yes' ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-2">Yes AI</h3>
                        <p className="hidden sm:block text-gray-600 text-sm mb-3">Add smart AI features to your website</p>
                        <div className="text-[10px] sm:text-base text-blue-600 font-semibold">
                          +$250+
                        </div>
                      </div>
                      {/* Bundle Lock Indicator */}
                      {isAiLockedByBundle && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                            🔒 <span className="hidden sm:inline">Included</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : flow === 'ai-options' ? (
                // AI Options Selection Flow
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">AI Features</h2>
                    <p className="text-gray-600 text-center text-sm mb-3">Choose the AI features you want to include</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                          <p className="text-blue-800 font-medium mb-1">What's AI?</p>
                          <p className="text-blue-800 font-medium mb-1">AI Features</p>
                          <p className="text-blue-700 text-xs leading-relaxed">
                            Choose from chatbots, content generation, analytics, and more to make your website smarter.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {getAIOptions().map((option) => (
                      <div
                        key={option.id}
                        onClick={() => toggleFeature(option.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                          isAiFeatureLocked(option.id)
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : selectedFeatures[option.id]
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        {/* Bundle Lock Badge */}
                        {isAiFeatureLocked(option.id) && (
                          <div className="absolute -top-3 left-4">
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                              🔒 Included in Bundle
                            </span>
                          </div>
                        )}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                                selectedFeatures[option.id]
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedFeatures[option.id] && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{option.name}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold ml-4">
                            {isAiFeatureLocked(option.id) ? (
                              <span className="text-purple-600">Included</span>
                            ) : (
                              <span className="text-blue-600">{option.price}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                          {option.features.map((feature, index) => (
                            <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Bundle Selection Notice */}
                  {fromPage === 'bundle' && (bpBackend || bpBackendOptions) && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <span className="text-purple-600 mr-2 text-lg">🎁</span>
                        <div>
                          <span className="text-purple-800 font-semibold">Bundle Features Pre-selected!</span>
                          <span className="text-purple-600 text-sm ml-2">Your bundle backend technology is automatically selected below.</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Backend Technology</h2>
                    <p className="text-gray-600 text-center text-sm mb-3">Choose the backend technology for your website</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                          <p className="text-blue-800 font-medium mb-1">What's a backend?</p>
                          <p className="text-blue-700 text-xs leading-relaxed">
                            The backend handles things like user accounts, data storage, file uploads, and admin features. 
                            Choose simple options for basic websites, or advanced options for complex needs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {getBackendOptions().map((option) => (
                      <div
                        key={option.id}
                        onClick={() => toggleBackend(option.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                          isBackendOptionLocked(option.id)
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : selectedBackend.includes(option.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        {/* Bundle Lock Badge */}
                        {isBackendOptionLocked(option.id) && (
                          <div className="absolute -top-3 left-4">
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                              🔒 Included in Bundle
                            </span>
                          </div>
                        )}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                                selectedBackend.includes(option.id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedBackend.includes(option.id) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{option.name}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold ml-4">
                            {isBackendOptionLocked(option.id) ? (
                              <span className="text-purple-600">Included</span>
                            ) : (
                              <span className="text-blue-600">{option.price}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                          {option.features.map((feature, index) => (
                            <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const featuresString = Object.keys(selectedFeatures).filter(key => selectedFeatures[key]).join(',');
                    const backendString = selectedBackend.join(',');
                    
                    if (flow === 'ai-options') {
                      // Go back to AI yes/no question with preserved aiChoice and features
                      console.log('Going back from ai-options, aiChoice:', aiChoice, 'features:', featuresString);
                      saveScrollPosition();
                      router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&flow=ai&ai=${aiChoice}&automation=${automation}&features=${featuresString}&from=ai-options${bundleParams}`);
                    } else if (flow === 'ai') {
                      // If backend=no, go back to step-5 (skip backend options since there are none)
                      // If backend=yes, go back to backend technology options in step-6
                      if (backend === 'no') {
                        console.log('Going back from AI flow to step-5 (backend=no)');
                        saveScrollPosition();
                        router.push(`/step-5?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&from=step-6${bundleParams}`);
                      } else {
                        console.log('Going back from AI flow to backend options, backend:', backendString);
                        saveScrollPosition();
                        router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backendString}&ai=${aiChoice}&features=${featuresString}&from=ai-flow${bundleParams}`);
                      }
                    } else {
                      // Go back to step 5 (backend yes/no page) with preserved backend options and AI selection
                      const backendString = selectedBackend.join(',');
                      saveScrollPosition();
                      router.push(`/step-5?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backendString}&ai=${aiChoice}&automation=${automation}&features=${featuresString}&from=step-6${bundleParams}`);
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                <button
                  onClick={() => {
                    const featuresString = Object.keys(selectedFeatures).filter(key => selectedFeatures[key]).join(',');
                    const backendString = selectedBackend.join(',');
                    
                    if (flow === 'ai') {
                      // If AI choice is yes, show AI options, otherwise go to automation
                      if (aiChoice === 'yes') {
                        // Show AI options - change flow to ai-options, preserve any existing features
                        saveScrollPosition();
                        router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&flow=ai-options&ai=${aiChoice}&automation=${automation}&features=${featuresString}&from=ai-yesno${bundleParams}`);
                      } else {
                        // AI choice is no, go to automation - use the backend parameter from URL, not backendString
                        saveScrollPosition();
                        router.push(`/step-7?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&from=step-6${bundleParams}`);
                      }
                    } else if (flow === 'ai-options') {
                      // AI options selected, go to automation
                      saveScrollPosition();
                      router.push(`/step-7?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backendString}&ai=${aiChoice}&automation=${automation}&features=${featuresString}&from=ai-options${bundleParams}`);
                    } else {
                      // Backend flow - go to AI yes/no question with current selections
                      router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backendString}&flow=ai&from=step-6&backendCost=${calculateAdditionalCost()}${bundleParams}`);
                    }
                  }}
                  disabled={flow === 'ai' && !aiChoice}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                    flow === 'ai' && !aiChoice 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {flow === 'ai' && aiChoice === 'yes' ? 'See AI Options →' : flow === 'ai' && aiChoice === 'no' ? 'Continue →' : flow === 'ai-options' ? 'Continue →' : 'Continue →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
