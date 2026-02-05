import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { safeLocalStorage, safeWindow } from '../utils/client-safe';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step11() {
  const [selectedHosting, setSelectedHosting] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
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
  const fromPage = router.query.from || '';
  
  // Build bundle params string for navigation (centralized)
  const bundleParams = buildBundleParams(router.query);
  
  // Map bundle hosting tiers to actual hosting option IDs
  const hostingMap = {
    'basic': 'basic-hosting',
    'standard': 'professional-hosting',
    'premium': 'enterprise-hosting'
  };
  
  // Get the locked hosting ID from bundle
  const lockedHostingId = bpHosting ? (hostingMap[bpHosting] || bpHosting) : '';
  
  // Check if hosting is locked by bundle
  const isHostingLockedByBundle = !!lockedHostingId;

  useEffect(() => {
    if (!isClient) return;

    try {
      const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
      if (savedSelections.step11?.id) {
        setSelectedHosting(savedSelections.step11.id);
      }
      if (savedSelections.step11?.domain) {
        setSelectedDomain(savedSelections.step11.domain);
      }
    } catch (error) {
      console.warn('Error restoring hosting/domain from localStorage:', error);
    }

    if (router.query.hosting) setSelectedHosting(router.query.hosting);
    // Auto-select hosting from bundle preselects
    else if (bpHosting && !selectedHosting) {
      const hostingId = hostingMap[bpHosting] || bpHosting;
      console.log('Auto-selecting hosting from bundle:', hostingId);
      setSelectedHosting(hostingId);
    }
    if (router.query.domain) setSelectedDomain(router.query.domain);
  }, [router.query.hosting, router.query.domain, bpHosting, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
      if (selectedHosting || selectedDomain) {
        currentSelections.step11 = {
          step: 11,
          name: 'Hosting & Domain',
          id: selectedHosting,
          domain: selectedDomain,
          monthly: getHostingMonthlyCost(selectedHosting),
          yearly: getDomainYearlyCost(selectedDomain),
          includedInBundle: !!isHostingLockedByBundle
        };
      } else {
        delete currentSelections.step11;
      }
      safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
      safeWindow().dispatchEvent(new Event('selections-updated'));
    } catch (error) {
      console.warn('Error saving hosting/domain selections to localStorage:', error);
    }
  }, [isClient, selectedHosting, selectedDomain]);
  
  // Handler for hosting selection - respects bundle locks
  const handleHostingSelect = (hostingId) => {
    // If hosting is locked by bundle, can't change away from locked option
    if (isHostingLockedByBundle && hostingId !== lockedHostingId && selectedHosting === lockedHostingId) {
      return; // Can't deselect bundle-included hosting
    }
    setSelectedHosting(hostingId);
  };

  const getHostingOptions = () => {
    return [
      {
        id: 'basic-hosting',
        name: 'Basic Hosting',
        description: 'Essential managed hosting for small business sites',
        price: '+$19/month',
        features: ['20GB SSD Storage', '500GB Bandwidth', '1 Website', '10 Email Accounts', 'Weekly Backups', 'SSL Certificate', 'Managed Updates', '99.9% Uptime'],
        popular: false
      },
      {
        id: 'standard-hosting',
        name: 'Standard Hosting',
        description: 'Enhanced hosting for growing websites',
        price: '+$39/month',
        features: ['50GB SSD Storage', '1TB Bandwidth', 'Up to 3 Websites', '50 Email Accounts', 'Daily Backups', 'SSL Certificate', 'CDN Included', '99.9% Uptime'],
        popular: true
      },
      {
        id: 'professional-hosting',
        name: 'Professional Hosting',
        description: 'Optimized for growing brands with higher traffic',
        price: '+$59/month',
        features: ['100GB SSD Storage', '2TB Bandwidth', 'Up to 5 Websites', 'Unlimited Email', 'Daily Backups', 'CDN Included', 'Staging Environment', 'Priority Support', '99.95% Uptime'],
        popular: false
      },
      {
        id: 'enterprise-hosting',
        name: 'Enterprise Hosting',
        description: 'High-performance infrastructure for mission-critical apps',
        price: '+$89/month',
        features: ['200GB SSD Storage', 'Unlimited Bandwidth', 'Unlimited Websites', 'Advanced SSL', 'Real-time Backups', 'Global CDN', 'DDoS Protection', 'Dedicated Support', '99.99% Uptime'],
        popular: false
      }
    ];
  };

  const getDomainYearlyCost = (domainId) => {
    if (!domainId) return 0;
    const domain = getDomainOptions().find(d => d.id === domainId);
    if (!domain || domain.price === 'Free') return 0;
    return parseInt(domain.price.replace(/[^0-9]/g, '')) || 0;
  };

  const getHostingMonthlyCost = (hostingId) => {
    if (!hostingId) return 0;
    const hosting = getHostingOptions().find(h => h.id === hostingId);
    if (!hosting || hosting.price === 'Free') return 0;
    return parseInt(hosting.price.replace(/[^0-9]/g, '')) || 0;
  };

  const getDomainOptions = () => {
    return [
      {
        id: 'new-domain',
        name: 'Register New Domain',
        description: 'Get a brand new domain name for your website',
        price: '+$25/year',
        features: ['Free Domain Registration', 'DNS Management', 'Privacy Protection', 'Auto-renewal Setup', 'Email Forwarding'],
        setup: 'We\'ll help you find and register the perfect domain'
      },
      {
        id: 'existing-domain',
        name: 'Use Existing Domain',
        description: 'Connect a domain you already own',
        price: 'Free',
        features: ['Domain Transfer Assistance', 'DNS Configuration', 'SSL Setup', 'Email Configuration', 'Domain Verification'],
        setup: 'We\'ll help you configure your existing domain'
      },
      {
        id: 'subdomain',
        name: 'Free Subdomain',
        description: 'Get a free subdomain on our platform',
        price: 'Free',
        features: ['Instant Setup', 'Free SSL Certificate', 'DNS Management', 'Basic Email Forwarding'],
        setup: 'Get yourdomain.mellowquote.com instantly'
      }
    ];
  };

  const toggleHosting = (hostingId) => {
    // Don't deselect if clicking the same option - just keep it selected
    setSelectedHosting(hostingId);
  };

  const toggleDomain = (domainId) => {
    // Don't deselect if clicking the same option - just keep it selected
    setSelectedDomain(domainId);
  };

  const calculateTotalCost = () => {
    let hostingCost = 0;
    let domainCost = 0;
    
    if (selectedHosting) {
      const hosting = getHostingOptions().find(h => h.id === selectedHosting);
      if (hosting) hostingCost = parseInt(hosting.price.replace(/[^0-9]/g, ''));
    }
    
    if (selectedDomain) {
      const domain = getDomainOptions().find(d => d.id === selectedDomain);
      if (domain && domain.price !== 'Free') {
        domainCost = parseInt(domain.price.replace(/[^0-9]/g, ''));
      }
    }
    
    return { hostingCost, domainCost, total: hostingCost + domainCost };
  };

  return (
    <>
      <Head>
        <title>Step 11: Hosting & Domain - Mellow Quote</title>
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
          .option-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .option-card:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-12 px-4 pb-24 sm:pt-4 sm:pb-4 sm:p-4 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="fixed bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tl from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="fade-in pt-6 sm:pt-0">
            {/* Header - compact on mobile */}
            <div className="text-center mb-3 sm:mb-8">
              <div className="hidden sm:inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight">
                Hosting & Domain
              </h1>
              <p className="hidden sm:block text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                Step 11: Hosting & Domain
              </p>
              <div className="hidden sm:inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 shadow-sm max-w-full overflow-hidden">
                <span className="text-blue-600 font-semibold flex-shrink-0">Infrastructure</span>
                <span className="mx-1.5 text-slate-400 flex-shrink-0">•</span>
                <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
                  <span className="flex-shrink-0">{websiteType === 'single' ? '📄 Single' : '📑 Multi'}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="text-slate-400 flex-shrink-0">→</span>
                  <span className="flex-shrink-0">{subcategory.charAt(0).toUpperCase() + subcategory.replace('-', ' ')}</span>
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
                  <span className="text-blue-600 font-semibold flex-shrink-0">Hosting</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-6 md:p-8">
              {/* Bundle Selection Notice - compact on mobile */}
              {fromPage === 'bundle' && bpHosting && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-sm sm:text-lg">🎁</span>
                    <span className="text-purple-800 font-semibold text-xs sm:text-base">Bundle Pre-selected</span>
                  </div>
                </div>
              )}
              
              {/* Hosting Section */}
              <div className="mb-6 sm:mb-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-base sm:text-2xl font-bold text-slate-900">Hosting Plan</h2>
                    <p className="text-xs sm:text-base text-slate-600">Choose infrastructure that matches your traffic and growth.</p>
                    <p className="mt-1 text-[11px] sm:text-sm text-slate-500">No hosting required — you can also use your own host.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-3 py-1 text-[11px] sm:text-xs text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Managed hosting with SLA-backed uptime
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {getHostingOptions().map((hosting) => {
                    const isLockedOption = hosting.id === lockedHostingId;
                    const isSelected = selectedHosting === hosting.id;
                    return (
                      <div
                        key={hosting.id}
                        onClick={() => handleHostingSelect(hosting.id)}
                        className={`option-card group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isLockedOption
                            ? 'border-purple-500/60 bg-purple-50 ring-2 ring-purple-200'
                            : isSelected
                              ? 'border-blue-500/70 bg-white shadow-xl shadow-blue-200/60'
                              : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg'
                        }`}
                      >
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-100/60"></div>
                          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-purple-100/50"></div>
                        </div>
                        
                        <div className="relative p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-slate-900">{hosting.name}</h3>
                              <p className="text-[11px] sm:text-sm text-slate-500">{hosting.description}</p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                              isLockedOption
                                ? 'bg-purple-600 text-white'
                                : hosting.popular
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isLockedOption ? 'Bundle' : hosting.popular ? 'Popular' : 'Plan'}
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between mb-4">
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                              {isLockedOption ? 'Included' : hosting.price}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-500">per month</div>
                          </div>
                          
                          <div className="grid gap-2 text-[11px] sm:text-xs text-slate-600">
                            {hosting.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-700">
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              {isSelected ? '✓' : '+'}
                            </span>
                            {isSelected ? 'Selected' : 'Choose plan'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Domain Section */}
              <div className="mb-6 sm:mb-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4 sm:mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-2xl font-bold text-slate-900">Domain</h2>
                      <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">Required</span>
                    </div>
                    <p className="text-xs sm:text-base text-slate-600">Secure your brand name and connect it instantly.</p>
                    <p className="mt-1 text-[11px] sm:text-sm text-slate-500">Please select one domain option to continue.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-3 py-1 text-[11px] sm:text-xs text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Domain setup & DNS handled for you
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {getDomainOptions().map((domain) => {
                    const isSelected = selectedDomain === domain.id;
                    return (
                      <div
                        key={domain.id}
                        onClick={() => toggleDomain(domain.id)}
                        className={`option-card group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-blue-500/70 bg-white shadow-xl shadow-blue-200/60'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg'
                        }`}
                      >
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-blue-100/60"></div>
                          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-indigo-100/50"></div>
                        </div>
                        
                        <div className="relative p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-slate-900">{domain.name}</h3>
                              <p className="text-[11px] sm:text-sm text-slate-500">{domain.description}</p>
                            </div>
                            <div className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] sm:text-xs font-semibold text-slate-600">
                              {domain.price === 'Free' ? 'Free' : 'Annual'}
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between mb-4">
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                              {domain.price}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-500">per year</div>
                          </div>
                          
                          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] sm:text-xs text-slate-600 mb-4">
                            {domain.setup}
                          </div>
                          
                          <div className="grid gap-2 text-[11px] sm:text-xs text-slate-600">
                            {domain.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-700">
                            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              {isSelected ? '✓' : '+'}
                            </span>
                            {isSelected ? 'Selected' : 'Choose domain'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-3 text-center">Infrastructure Cost Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-xs font-medium text-slate-600 mb-1">Hosting (Monthly)</div>
                    <div className="text-lg font-bold text-blue-600">
                      ${calculateTotalCost().hostingCost}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-xs font-medium text-slate-600 mb-1">Domain (Yearly)</div>
                    <div className="text-lg font-bold text-purple-600">
                      ${calculateTotalCost().domainCost}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-xs font-medium text-slate-600 mb-1">Setup Cost</div>
                    <div className="text-lg font-bold text-green-600">
                      ${calculateTotalCost().total}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex gap-3 mt-8 mb-16 sm:mb-0">
                <button
                  onClick={() => {
                    router.push(`/10?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}${addons.length ? '&addons=' + addons.join(',') : ''}${bundleParams}`);
                  }}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                >
                  ← Back
                </button>
                
                {/* Continue Button - Only visible if domain is selected (hosting optional) */}
                {selectedDomain && (
                  <button
                    onClick={() => {
                      router.push(`/step-12?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}${addons.length ? '&addons=' + addons.join(',') : ''}&domain=${selectedDomain}${selectedHosting ? '&hosting=' + selectedHosting : ''}${bundleParams}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
