import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { safeLocalStorage, safeWindow } from '../utils/client-safe';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step12() {
  const [selectedMaintenance, setSelectedMaintenance] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMaintenance, setModalMaintenance] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const aiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const store = router.query.store || '';
  const pages = router.query.pages ? router.query.pages.split(',') : [];
  const features = router.query.features ? router.query.features.split(',') : [];
  const addons = router.query.addons ? router.query.addons.split(',') : [];
  const hosting = router.query.hosting || '';
  const domain = router.query.domain || '';
  const bundle = router.query.bundle || '';
  const fromPage = router.query.fromPage || '';
  
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
  
  // Build bundle params string for navigation (centralized)
  const bundleParams = buildBundleParams(router.query);
  
  // Map bundle maintenance tiers to actual maintenance option IDs
  const maintenanceMap = {
    'none': 'no-maintenance',
    'basic': 'basic-maintenance',
    'standard': 'professional-maintenance',
    'premium': 'enterprise-maintenance'
  };
  
  // Get the locked maintenance ID from bundle (only if not 'none')
  const lockedMaintenanceId = (bpMaintenance && bpMaintenance !== 'none') ? (maintenanceMap[bpMaintenance] || bpMaintenance) : '';
  
  // Check if maintenance is locked by bundle
  const isMaintenanceLockedByBundle = !!lockedMaintenanceId;

  useEffect(() => {
    if (!isClient) return;

    // Priority 1: Restore from localStorage (highest priority - user's actual selection)
    try {
      const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
      if (savedSelections.step12?.id) {
        console.log('Restoring maintenance from localStorage:', savedSelections.step12.id);
        setSelectedMaintenance(savedSelections.step12.id);
        return; // Don't override with URL or bundle
      }
    } catch (error) {
      console.warn('Error restoring maintenance from localStorage:', error);
    }

    // Priority 2: URL parameter
    if (router.query.maintenance) {
      console.log('Setting maintenance from URL:', router.query.maintenance);
      setSelectedMaintenance(router.query.maintenance);
      return;
    }
    
    // Priority 3: Auto-select maintenance from bundle preselects
    if (bpMaintenance) {
      const maintenanceId = maintenanceMap[bpMaintenance] || bpMaintenance;
      console.log('Auto-selecting maintenance from bundle:', maintenanceId);
      setSelectedMaintenance(maintenanceId);
    }
  }, [router.query.maintenance, bpMaintenance, isClient]);
  
  // Handler for maintenance selection - respects bundle locks
  const handleMaintenanceSelect = (maintenanceId) => {
    // If maintenance is locked by bundle, can't change away from locked option
    if (isMaintenanceLockedByBundle && maintenanceId !== lockedMaintenanceId && selectedMaintenance === lockedMaintenanceId) {
      return; // Can't deselect bundle-included maintenance
    }
    setSelectedMaintenance(maintenanceId);
  };

  const getMaintenanceOptions = () => {
    return [
      {
        id: 'no-maintenance',
        name: 'Self-Managed',
        description: 'Handle all updates and maintenance yourself',
        price: 'Free',
        features: ['Full Control', 'No Monthly Fees', 'DIY Updates', 'Self-Support', 'Manual Backups'],
        recommended: false,
        supportLevel: 'None'
      },
      {
        id: 'basic-maintenance',
        name: 'Basic Maintenance',
        description: 'Essential updates and security monitoring',
        price: '+$79/month',
        features: ['Monthly Updates', 'Security Monitoring', 'Backup Management', 'Email Support', 'Performance Reports', 'SSL Certificate Management'],
        recommended: false,
        supportLevel: 'Basic'
      },
      {
        id: 'professional-maintenance',
        name: 'Professional Maintenance',
        description: 'Comprehensive care with priority support',
        price: '+$149/month',
        features: ['Weekly Updates', 'Advanced Security', 'Daily Backups', 'Priority Support', 'Performance Optimization', 'Content Updates (2hrs/month)', 'Uptime Monitoring', 'SEO Monitoring'],
        recommended: true,
        supportLevel: 'Priority'
      },
      {
        id: 'enterprise-maintenance',
        name: 'Enterprise Maintenance',
        description: 'Complete white-glove service for peace of mind',
        price: '+$299/month',
        features: ['Real-time Updates', 'Enterprise Security', 'Real-time Backups', '24/7 Phone Support', 'Advanced Optimization', 'Unlimited Content Updates', 'Guaranteed Uptime', 'Dedicated Account Manager', 'Custom SLA'],
        recommended: false,
        supportLevel: '24/7'
      }
    ];
  };

  const toggleMaintenance = (maintenanceId) => {
    setSelectedMaintenance(prev => prev === maintenanceId ? '' : maintenanceId); // Toggle on/off
  };

  const calculateMaintenanceCost = () => {
    if (!selectedMaintenance) return 0;
    
    const maintenance = getMaintenanceOptions().find(m => m.id === selectedMaintenance);
    if (maintenance && maintenance.price !== 'Free') {
      return parseInt(maintenance.price.replace(/[^0-9]/g, ''));
    }
    return 0;
  };

  useEffect(() => {
    if (!isClient) return;
    if (!selectedMaintenance) return; // Don't save if nothing selected yet
    
    try {
      const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
      // Save ALL maintenance selections including 'no-maintenance'
      currentSelections.step12 = {
        step: 12,
        name: 'Maintenance',
        value: getMaintenanceOptions().find(m => m.id === selectedMaintenance)?.name || 'Maintenance',
        id: selectedMaintenance,
        monthly: calculateMaintenanceCost(),
        includedInBundle: !!isMaintenanceLockedByBundle
      };
      console.log('Saving maintenance to localStorage:', currentSelections.step12);
      safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
      safeWindow().dispatchEvent(new Event('selections-updated'));
    } catch (error) {
      console.warn('Error saving maintenance selections to localStorage:', error);
    }
  }, [isClient, selectedMaintenance]);

  return (
    <>
      <Head>
        <title>Step 12: Maintenance & Support - Mellow Quote</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          .maintenance-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .maintenance-card:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-12 px-4 pb-24 sm:pt-4 sm:pb-4 sm:p-4 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="fixed bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tl from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="fade-in">
            {/* Header - better mobile positioning */}
            <div className="text-center mb-8 sm:mb-12 pt-8 sm:pt-0">
              <div className="hidden sm:inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2 sm:mb-2 tracking-tight">
                Maintenance
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                Step 12: Maintenance & Support
              </p>
              <div className="hidden sm:inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 shadow-sm max-w-full overflow-hidden">
                <span className="text-blue-600 font-semibold flex-shrink-0">Support</span>
                <span className="mx-1.5 text-slate-400 flex-shrink-0">•</span>
                <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
                  <span className="flex-shrink-0">{websiteType === 'single' ? '📄 Single' : '📑 Multi'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Backend: {backend === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">AI: {aiChoice === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Store</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{websiteType === 'multi' ? 'Pages' : 'Sections'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Add-ons</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">Hosting</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="text-blue-600 font-semibold flex-shrink-0">Maintenance</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-6 md:p-8">
              {/* Bundle Selection Notice - compact on mobile */}
              {fromPage === 'bundle' && bpMaintenance && bpMaintenance !== 'none' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-sm sm:text-lg">🎁</span>
                    <span className="text-purple-800 font-semibold text-xs sm:text-base">Bundle Pre-selected</span>
                  </div>
                </div>
              )}
              
              {/* Introduction - hidden on mobile */}
              <div className="hidden sm:block text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Support Level</h2>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                  Keep your website running smoothly with professional maintenance and support services
                </p>
              </div>

              {/* Maintenance Options - larger and better design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {getMaintenanceOptions().map((maintenance, index) => {
                  const isLockedOption = maintenance.id === lockedMaintenanceId;
                  return (
                  <div
                    key={maintenance.id}
                    onClick={() => handleMaintenanceSelect(maintenance.id)}
                    className={`maintenance-card relative p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isLockedOption
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : selectedMaintenance === maintenance.id
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20 transform scale-[1.02]'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:transform hover:scale-[1.01]'
                    }`}
                  >
                    {/* Bundle Lock Badge */}
                    {isLockedOption && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold shadow-md">
                          🔒
                        </span>
                      </div>
                    )}
                    {maintenance.recommended && !isLockedOption && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-xs font-semibold shadow-md">
                          ⭐
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-3 sm:mb-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${
                        isLockedOption ? 'bg-purple-100' : selectedMaintenance === maintenance.id ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                        <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${
                          isLockedOption ? 'text-purple-600' : selectedMaintenance === maintenance.id ? 'text-blue-600' : 'text-slate-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d={maintenance.id === 'no-maintenance' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z' :
                             maintenance.id === 'basic-maintenance' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
                             maintenance.id === 'professional-maintenance' ? 'M13 10V3L4 14h7v7l9-11h-7z' :
                             'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'} />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{maintenance.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3 line-clamp-2">{maintenance.description}</p>
                      <div className={`text-sm sm:text-xl font-bold ${isLockedOption ? 'text-purple-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
                        {isLockedOption ? '✓ Included' : maintenance.price}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 sm:mt-2">
                        Support: <span className="font-semibold">{maintenance.supportLevel}</span>
                      </div>
                      
                      {/* View Details Button - visible on mobile */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalMaintenance(maintenance);
                          setShowModal(true);
                        }}
                        className="sm:hidden mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {maintenance.features.slice(0, selectedMaintenance === maintenance.id ? maintenance.features.length : 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs sm:text-sm text-slate-700 opacity-70">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                      {maintenance.features.length > 3 && selectedMaintenance !== maintenance.id && (
                        <div className="text-xs text-blue-600 font-medium ml-5">
                          +{maintenance.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>
                )})}
              </div>

              {/* Cost Summary - compact on mobile */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-slate-200">
                <div className="flex sm:flex-col items-center justify-between sm:justify-center">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 sm:mb-4 sm:text-center">Cost: <span className="text-blue-600">${calculateMaintenanceCost()}/mo</span></h3>
                  <div className="hidden sm:block bg-white rounded-lg p-6 text-center shadow-sm w-full">
                    <div className="text-sm font-medium text-slate-600 mb-2">Monthly Maintenance Cost</div>
                    <div className="text-3xl font-bold text-blue-600">
                      ${calculateMaintenanceCost()}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {selectedMaintenance ? getMaintenanceOptions().find(m => m.id === selectedMaintenance)?.name : 'No maintenance plan selected'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex gap-3 mt-8 mb-16 sm:mb-0">
                <button
                  onClick={() => {
                    router.push(`/step-11?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}${addons.length ? '&addons=' + addons.join(',') : ''}&hosting=${hosting}&domain=${domain}${bundleParams}`);
                  }}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                >
                  ← Back
                </button>
                
                {/* Continue Button - Only visible when maintenance is selected */}
                {selectedMaintenance ? (
                  <button
                    onClick={() => {
                      router.push(`/step-13?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}${addons.length ? '&addons=' + addons.join(',') : ''}&hosting=${hosting}&domain=${domain}&maintenance=${selectedMaintenance}${bundleParams}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Continue →
                  </button>
                ) : (
                  <div className="flex-1 bg-gray-200 text-gray-500 px-6 py-3 rounded-xl font-semibold text-base text-center cursor-not-allowed">
                    Select a plan to continue
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Maintenance Details Modal */}
      {showModal && modalMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{modalMaintenance.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{modalMaintenance.description}</p>
                  <div className="text-lg font-bold text-blue-600 mt-2">{modalMaintenance.price}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Support Level: <span className="font-semibold">{modalMaintenance.supportLevel}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
              <div className="space-y-2">
                {modalMaintenance.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleMaintenanceSelect(modalMaintenance.id);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Select This Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
