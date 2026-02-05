import { useState, useEffect } from 'react';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Step7() {
  const [selectedAutomation, setSelectedAutomation] = useState([]); // Changed to array for multiple selections
  const [selectedYesNo, setSelectedYesNo] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState({}); // Add selectedFeatures state
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const aiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const flow = router.query.flow || '';
  const fromPage = router.query.from || ''; // Track where we came from
  const features = router.query.features || ''; // Get features from URL
  
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
  const lockedAutomationFeatures = bpAutomationFeatures ? bpAutomationFeatures.split(',').filter(a => a.trim()) : [];
  const isAutomationLockedByBundle = bpAutomation === 'yes';
  
  // Initialize selections from query parameters
  useEffect(() => {
    console.log('Step 7 useEffect - fromPage:', fromPage, 'automation:', automation, 'flow:', flow, 'features:', features);
    console.log('Step 7 - current selectedAutomation state:', selectedAutomation);
    
    // Auto-select from bundle preselects if no existing automation selection
    if (bpAutomation === 'yes') {
      console.log('Auto-selecting automation from bundle');
      const bpAutomationFeatures = bpAutomationFeatures ? bpAutomationFeatures.split(',').filter(f => f.trim()) : [];
      if (bpAutomationFeatures.length > 0 && !areArraysEqual(selectedAutomation, bpAutomationFeatures)) {
        console.log('Setting automation from bundle:', bpAutomationFeatures);
        setSelectedAutomation(bpAutomationFeatures);
        console.log('After setting automation from bundle, state should be:', bpAutomationFeatures);
      }
    } else if (automation && automation.length > 0 && selectedAutomation.length === 0) {
      // Restore from URL parameter
      const automationArray = automation.split(',').filter(a => a.trim() && a !== 'yes');
      console.log('Restoring automation from URL:', automationArray);
      setSelectedAutomation(automationArray);
      console.log('After setting automation from URL, state should be:', automationArray);
    }
    
    // Also try to restore from localStorage (highest priority)
    if (typeof window !== 'undefined') {
      try {
        const savedSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const savedAutomation = savedSelections.step14?.items || [];
        const isAutomationData = savedAutomation.length > 0 && 
                               savedAutomation.some(item => 
                                 ['email-notifications', 'auto-responder', 'social-media-integration', 'lead-capture', 'analytics-integration', 'crm-integration'].includes(item)
                               );
        
        if (isAutomationData && !areArraysEqual(selectedAutomation, savedAutomation)) {
          console.log('Restoring automation from localStorage:', savedAutomation);
          console.log('Before setting from localStorage, current state:', selectedAutomation);
          setSelectedAutomation(savedAutomation);
          console.log('After setting from localStorage, state should be:', savedAutomation);
        }
      } catch (error) {
        console.warn('Error checking automation from localStorage:', error);
      }
    }
    
    // Handle coming back from automation options - restore selections and set yes/no to yes
    if (fromPage === 'automation-options' && automation) {
      console.log('Coming back from automation options - automation parameter:', automation);
      const automationArray = automation.split(',').filter(a => 
        a.trim() && a !== 'yes-automation' && a !== 'no-automation'
      );
      if (automationArray.length > 0) {
        setSelectedAutomation(automationArray);
        setSelectedYesNo('yes-automation');
        console.log('Restored automation selections:', automationArray);
      }
      return;
    }
    
    // Handle coming back from store - restore selections
    if (fromPage === 'store' && automation) {
      console.log('Coming back from store - automation parameter:', automation);
      const automationArray = automation.split(',').filter(a => 
        a.trim() && a !== 'yes-automation' && a !== 'no-automation'
      );
      if (automationArray.length > 0) {
        setSelectedAutomation(automationArray);
        setSelectedYesNo('yes-automation');
        console.log('Restored automation selections from store:', automationArray);
      } else if (automation === 'no-automation') {
        setSelectedYesNo('no-automation');
        setSelectedAutomation([]);
      }
      return;
    }
    
    // Restore automation options from URL when in options flow
    if (flow === 'automation-options') {
      if (automation && automation.length > 0) {
        console.log('In automation-options flow - automation parameter:', automation);
        const automationArray = automation.split(',').filter(a => 
          a.trim() && a !== 'yes-automation' && a !== 'no-automation'
        );
        if (automationArray.length > 0) {
          setSelectedAutomation(automationArray);
          console.log('Restored automation options:', automationArray);
        }
      }
      
      // Auto-select automation options from bundle preselects
      if (bpAutomationFeatures && bpAutomationFeatures.length > 0) {
        const bpAutoArray = bpAutomationFeatures.split(',').filter(a => a.trim());
        if (bpAutoArray.length > 0) {
          setSelectedAutomation(bpAutoArray);
          console.log('Auto-selected automation options from bundle:', bpAutoArray);
        }
      }
      return;
    }
    
    // Default: restore yes/no selection from URL
    if (automation && automation.length > 0) {
      if (automation === 'yes-automation' || automation === 'no-automation') {
        setSelectedYesNo(automation);
      } else {
        // This looks like automation options (comma-separated)
        const automationArray = automation.split(',').filter(a => 
          a.trim() && a !== 'yes-automation' && a !== 'no-automation'
        );
        if (automationArray.length > 0) {
          setSelectedAutomation(automationArray);
          setSelectedYesNo('yes-automation');
        }
      }
    }
  }, [flow, automation, fromPage, features]);

  const getAutomationYesNo = () => {
    return [
      {
        id: 'no-automation',
        name: 'No Automation',
        description: 'Standard website without automated workflows',
        price: '+$0',
        features: ['Manual Updates', 'Standard Forms', 'Basic Functionality']
      },
      {
        id: 'yes-automation',
        name: 'Yes Automation',
        description: 'Add automated workflows and processes',
        price: '+$150',
        features: ['Automated Workflows', 'Email Notifications', 'Scheduled Tasks', 'Process Automation']
      }
    ];
  };

  const toggleYesNo = (optionId) => {
    // If automation is locked by bundle (yes), can't change to 'no'
    if (isAutomationLockedByBundle && optionId === 'no-automation') {
      return; // Can't toggle off bundle-included automation
    }
    const newSelection = selectedYesNo === optionId ? '' : optionId;
    setSelectedYesNo(newSelection);
    
    // Save to localStorage and clean up automation selections when changing to 'no'
    if (typeof window !== 'undefined') {
      try {
        if (optionId === 'no-automation') {
          // Clear automation selections UI state
          setSelectedAutomation([]); 
          console.log('Step 7: Cleared automation features due to automation choice = no');
          
          // Note: Automation is handled via URL parameters, not localStorage steps
          // The navigation will update the URL parameter appropriately
        }
        // Trigger event to update widget (automation cost will be recalculated from URL)
        window.dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error updating automation choice:', error);
      }
    }
  };

  const toggleAutomation = (automationId) => {
    console.log('Step 7: toggleAutomation called with:', automationId);
    console.log('Step 7: current selectedAutomation before toggle:', selectedAutomation);
    
    // Check if this automation feature is locked by bundle (can't toggle off)
    if (isAutomationFeatureLocked(automationId) && selectedAutomation.includes(automationId)) {
      console.log('Step 7: Feature is locked by bundle, skipping toggle');
      return; // Can't toggle off bundle-included automation features
    }
    
    const newAutomation = selectedAutomation.includes(automationId) 
      ? selectedAutomation.filter(id => id !== automationId)
      : [...selectedAutomation, automationId];
    
    console.log('Step 7: newAutomation after toggle:', newAutomation);
    setSelectedAutomation(newAutomation);
    console.log('Step 7: After setSelectedAutomation, state should be updated to:', newAutomation);
    
    // Save to localStorage immediately when selected
    if (typeof window !== 'undefined') {
      try {
        const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        
        if (newAutomation.length > 0) {
          // Calculate automation cost - check for budget bundles
          let automationCost = 0;
          const isBudgetBundleCurrent = ['budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'].includes(bundle);
          
          if (!isBudgetBundleCurrent) {
            // Only calculate cost if not a budget bundle
            newAutomation.forEach(featureId => {
              const option = getAutomationOptions().find(opt => opt.id === featureId);
              if (option && !isAutomationFeatureLocked(featureId)) {
                automationCost += parseInt(option.price.replace(/[^0-9]/g, ''));
              }
            });
          }
          const allAutomationFromBundle = bundle && newAutomation.length > 0 && newAutomation.every(id => lockedAutomationFeatures.includes(id));
          currentSelections.step14 = {
            step: 14,
            name: 'Automation Features',
            value: `${newAutomation.length} selected`,
            items: newAutomation,
            cost: automationCost,
            includedInBundle: !!allAutomationFromBundle
          };
        } else {
          delete currentSelections.step14;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 7: Saved automation features to localStorage', currentSelections.step14);
        
        // Trigger a custom event to notify MobileCostSummary of the change
        window.dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving automation selections to localStorage:', error);
      }
    }
  };
  
  // Check if an automation feature is locked by bundle
  const isAutomationFeatureLocked = (automationId) => lockedAutomationFeatures.includes(automationId);

  const calculateAutomationCost = () => {
    // Check if this is a budget bundle - if so, automation is included
    const isBudgetBundleCurrent = ['budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'].includes(bundle);
    if (isBudgetBundleCurrent) {
      return 0; // Automation is included in budget bundle
    }
    
    let total = 0;
    selectedAutomation.forEach(automationId => {
      // Skip bundle-locked automation features - they're included free
      if (isAutomationFeatureLocked(automationId)) {
        return;
      }
      const option = getAutomationOptions().find(opt => opt.id === automationId);
      if (option) {
        total += parseInt(option.price.replace(/[^0-9]/g, ''));
      }
    });
    return total;
  };

  const getAutomationOptions = () => {
    // Base automation options that match bundle preselect IDs
    return [
      {
        id: 'email-notifications',
        name: 'Email Notifications',
        description: 'Automated email alerts and notifications',
        price: '+$100',
        features: ['Contact Form Alerts', 'Order Confirmations', 'Appointment Reminders', 'Welcome Emails']
      },
      {
        id: 'auto-responder',
        name: 'Auto Responder',
        description: 'Automated email responses',
        price: '+$150',
        features: ['Instant Replies', 'Lead Nurturing', 'Follow-up Sequences', 'Personalization']
      },
      {
        id: 'social-integration',
        name: 'Social Integration',
        description: 'Connect with social media platforms',
        price: '+$200',
        features: ['Auto-posting', 'Social Sharing', 'Social Login', 'Analytics Integration']
      },
      {
        id: 'lead-capture',
        name: 'Lead Capture',
        description: 'Automated lead generation and capture',
        price: '+$200',
        features: ['Lead Forms', 'Data Collection', 'CRM Integration', 'Lead Scoring']
      },
      {
        id: 'analytics-integration',
        name: 'Analytics Integration',
        description: 'Connect with analytics platforms',
        price: '+$150',
        features: ['Google Analytics', 'Custom Tracking', 'Conversion Goals', 'Data Visualization']
      },
      {
        id: 'crm-integration',
        name: 'CRM Integration',
        description: 'Connect with CRM systems',
        price: '+$300',
        features: ['Contact Sync', 'Deal Tracking', 'Pipeline Management', 'Custom Fields']
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        description: 'Advanced automated workflows and processes',
        price: '+$350',
        features: ['Multi-step Workflows', 'Conditional Logic', 'Task Assignment', 'Status Updates']
      },
      {
        id: 'form-automation',
        name: 'Form Automation',
        description: 'Automated form processing and responses',
        price: '+$150',
        features: ['Auto-responders', 'Lead Capture', 'Data Validation', 'CRM Integration']
      },
      {
        id: 'reports',
        name: 'Reports',
        description: 'Automated reporting and insights',
        price: '+$150',
        features: ['Weekly Reports', 'Monthly Summaries', 'Custom Schedules', 'Email Delivery']
      },
      {
        id: 'data-sync',
        name: 'Data Sync',
        description: 'Automated data synchronization',
        price: '+$200',
        features: ['Real-time Sync', 'Multi-platform', 'Conflict Resolution', 'Backup Sync']
      },
      {
        id: 'api-integration',
        name: 'API Integration',
        description: 'Connect with third-party APIs',
        price: '+$300',
        features: ['REST API', 'Webhooks', 'Data Exchange', 'Custom Endpoints']
      }
    ];
  };

  return (
    <>
      <Head>
        <title>Step 7: {flow === 'automation-options' ? 'Choose Automation Features' : 'Do you want automation?'} - Mellow Quote</title>
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
                Step 7: {flow === 'automation-options' ? 'Choose Automation Features' : 'Do you want automation?'}
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium max-w-full overflow-x-auto scrollbar-hide">
                {websiteType === 'single' ? '📄 Single Page' : '📑 Multi Page'} → {category.charAt(0).toUpperCase() + category.slice(1)} → {subcategory.charAt(0).toUpperCase() + subcategory.replace('-', ' ')} → Backend: {backend === 'no' ? 'No' : 'Yes'} → AI: {aiChoice === 'no' ? 'No' : 'Yes'}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-6">
              {/* Bundle Selection Notice */}
              {fromPage === 'bundle' && (bpAutomation || bpAutomationFeatures) && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-lg">🎁</span>
                    <div>
                      <span className="text-purple-800 font-semibold">Bundle Features Pre-selected!</span>
                      <span className="text-purple-600 text-sm ml-2">Your bundle automation features are automatically selected below.</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Show automation yes/no question if coming from AI step */}
              {(aiChoice === 'yes' || aiChoice === 'no') && flow !== 'automation-options' ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Do you want automation?</h2>
                    <p className="text-gray-600 text-center text-sm mb-4">Choose whether to add automated workflows to your website</p>
                    
                    {/* Automation Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                          <p className="text-blue-800 font-medium mb-1">What's automation?</p>
                          <p className="text-blue-700 text-xs leading-relaxed">
                            Automation can handle repetitive tasks like sending emails, updating content, 
                            processing forms, and managing data. This saves you time and ensures 
                            consistent operation of your website 24/7.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {getAutomationYesNo().map((option) => (
                      <div
                        key={option.id}
                        onClick={() => {
                          toggleYesNo(option.id);
                        }}
                        className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isAutomationLockedByBundle && option.id === 'no-automation'
                            ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                            : selectedYesNo === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 ${
                            option.id === 'no-automation' ? 'bg-gray-100' : 'bg-blue-100'
                          }`}>
                            <svg className={`w-4 h-4 sm:w-8 sm:h-8 ${option.id === 'no-automation' ? 'text-gray-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {option.id === 'no-automation' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              )}
                            </svg>
                          </div>
                          <h3 className="text-sm sm:text-xl font-semibold text-gray-900 mb-0.5 sm:mb-2">{option.name}</h3>
                          <p className="hidden sm:block text-gray-600 text-sm mb-3">{option.description}</p>
                          <div className={`text-[10px] sm:text-base font-semibold ${option.id === 'no-automation' ? 'text-green-600' : isAutomationLockedByBundle ? 'text-purple-600' : 'text-blue-600'}`}>
                            {option.id === 'yes-automation' && isAutomationLockedByBundle ? 'Bundle' : option.price}
                          </div>
                        </div>
                        {/* Bundle Lock Indicator */}
                        {isAutomationLockedByBundle && option.id === 'no-automation' && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                              🔒
                            </span>
                          </div>
                        )}
                        {isAutomationLockedByBundle && option.id === 'yes-automation' && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-purple-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                              🔒 <span className="hidden sm:inline">Included</span>
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const features = router.query.features || '';
                        const automationString = selectedAutomation.length > 0 ? selectedAutomation.join(',') : (selectedYesNo || '');
                        console.log('Back button clicked - fromPage:', fromPage, 'features:', features, 'aiChoice:', aiChoice, 'automation:', automationString);
                        
                        // Smart back navigation - check where we came from and if we have AI features
                        if (fromPage === 'ai-options' || (features && features.length > 0)) {
                          console.log('Going back to AI options page');
                          // Go back to AI options page with features preserved
                          router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&flow=ai-options&ai=${aiChoice}&automation=${automationString}&features=${features}&from=automation${bundleParams}`);
                        } else {
                          console.log('Going back to AI yes/no page');
                          // Go to AI yes/no page - preserve AI selection
                          router.push(`/step-6?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&flow=ai&ai=${aiChoice}&automation=${automationString}&features=${features}&from=automation-yesno${bundleParams}`);
                        }
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                    >
                      ← Back
                    </button>
                    
                    <button
                      onClick={() => {
                        const features = router.query.features || '';
                        if (selectedYesNo === 'no-automation') {
                          // No automation - go to store checkout page (yes/no question) - preserve features
                          router.push(`/step-8?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${selectedYesNo}&features=${features}&from=automation-yesno${bundleParams}`);
                        } else if (selectedYesNo === 'yes-automation') {
                          // Yes automation - go to automation options with current selections preserved
                          const automationString = selectedAutomation.join(',');
                          router.push(`/step-7?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&flow=automation-options&automation=${automationString}&features=${features}&from=automation-yesno${bundleParams}`);
                        }
                      }}
                      disabled={!selectedYesNo}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        !selectedYesNo 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Automation Options</h2>
                    <p className="text-gray-600 text-center text-sm mb-4">Choose the level of automation for your website</p>
                    
                    {/* Automation Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                          <p className="text-blue-800 font-medium mb-1">What's automation?</p>
                          <p className="text-blue-700 text-xs leading-relaxed">
                            Automation can handle repetitive tasks like sending emails, updating content, 
                            processing forms, and managing data. This saves you time and ensures 
                            consistent operation of your website 24/7.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {getAutomationOptions().map((option) => (
                      <div
                        key={option.id}
                        onClick={() => toggleAutomation(option.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                          isAutomationFeatureLocked(option.id)
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : selectedAutomation.includes(option.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        {/* Bundle Lock Badge */}
                        {isAutomationFeatureLocked(option.id) && (
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
                                selectedAutomation.includes(option.id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAutomation.includes(option.id) && (
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
                            {isAutomationFeatureLocked(option.id) ? (
                              <span className="text-purple-600">Included</span>
                            ) : (
                              <span className="text-blue-600">{option.price}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                            {option.features.map((feature, index) => (
                              <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Automation Cost:</span>
                      <span className={`text-2xl font-bold ${calculateAutomationCost() === 0 && selectedAutomation.length > 0 ? 'text-purple-600' : 'text-blue-600'}`}>
                        {selectedAutomation.length > 0 
                          ? calculateAutomationCost() === 0 
                            ? 'Included in Bundle' 
                            : `+$${calculateAutomationCost()}`
                          : '+$0'}
                      </span>
                    </div>
                    {selectedAutomation.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {selectedAutomation.length} option{selectedAutomation.length > 1 ? 's' : ''} selected
                        {lockedAutomationFeatures.length > 0 && ` (${lockedAutomationFeatures.length} from bundle)`}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Save current automation selections when going back to yes/no page
                        const automationString = selectedAutomation.join(',');
                        console.log('Going back from automation options with selections:', automationString);
                        router.push(`/step-7?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automationString}&from=automation-options${bundleParams}`);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                    >
                      ← Back
                    </button>
                    
                    {selectedAutomation.length > 0 && (
                      <button
                        onClick={() => {
                          // After automation selection, go to store step with current selections - preserve features
                          const automationString = selectedAutomation.join(',');
                          const features = router.query.features || '';
                          console.log('Continue clicked - selectedAutomation:', selectedAutomation, 'features:', features);
                          console.log('Automation string to pass:', automationString);
                          router.push(`/step-8?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automationString}&features=${features}&from=automation-options${bundleParams}`);
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
                      >
                        Continue →
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
