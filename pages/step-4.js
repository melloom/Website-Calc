import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step4() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const normalizeQueryParam = (value, fallback = '') => {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }
    return value ?? fallback;
  };

  const websiteType = normalizeQueryParam(router.query.type, 'single');
  const category = normalizeQueryParam(router.query.category, 'business');
  const subcategory = normalizeQueryParam(router.query.subcategory, '');
  const fromPage = router.query.from || ''; // Track where we came from
  
  const bundle = router.query.bundle || '';
  // Bundle preselects - pass through to next steps (centralized URL building)
  const bundleParams = buildBundleParams(router.query);
  
  // Check if coming from bundle selection
  const fromBundle = router.query.from === 'bundle';
  
  const handleSubcategorySelect = (sub) => {
    setSelectedSubcategory(sub.id);
    
    // Update URL immediately for real-time widget updates (keep bundle params so cost stays 0)
    router.push(`/step-4?type=${websiteType}&category=${category}&subcategory=${sub.id}&from=category${bundleParams}`, undefined, { shallow: true });
    
    // Save to localStorage only on client side (cost is 0 when a bundle was selected)
    if (isClient) {
      const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const subCost = bundle ? 0 : (parseInt(sub.price.replace(/[^0-9]/g, '')) || 0);
      currentSelections.step3 = {
        step: 3,
        name: 'Subcategory',
        value: sub.name,
        id: sub.id,
        cost: subCost,
        includedInBundle: !!bundle
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
      
      // Trigger a custom event to notify MobileCostSummary of the change
      window.dispatchEvent(new Event('selections-updated'));
    }
  };

  // Initialize selection from query parameters
  useEffect(() => {
    if (subcategory) {
      setSelectedSubcategory(subcategory);
      
      // Also restore to localStorage when coming back
      if (isClient) {
        const subcategories = getSubcategories(websiteType, category);
        const selectedSub = subcategories.find(sub => sub.id === subcategory);
        
        if (selectedSub) {
          const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          const subCost = bundle ? 0 : (parseInt(selectedSub.price.replace(/[^0-9]/g, '')) || 0);
          currentSelections.step3 = {
            step: 3,
            name: 'Subcategory',
            value: selectedSub.name,
            id: selectedSub.id,
            cost: subCost,
            includedInBundle: !!bundle
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
          
          // Trigger update to refresh the widget
          window.dispatchEvent(new Event('selections-updated'));
        }
      }
    }
  }, [subcategory, websiteType, category, isClient, bundle]);

  const getSubcategories = (type, cat) => {
    const subcategories = {
      single: {
        business: [
          { id: 'restaurant', name: 'Restaurant', description: 'Food service, dining, menus', price: '$700' },
          { id: 'consulting', name: 'Consulting', description: 'Professional services, expertise', price: '$600' },
          { id: 'retail', name: 'Retail', description: 'Shop, store, local business', price: '$650' },
          { id: 'healthcare', name: 'Healthcare', description: 'Medical, dental, wellness', price: '$800' },
          { id: 'tech', name: 'Tech Startup', description: 'Software, SaaS, technology', price: '$750' },
          { id: 'service', name: 'Service Business', description: 'Home services, repairs, etc.', price: '$550' },
          { id: 'customer-service', name: 'Customer Service', description: 'Support center, help desk', price: '$500' },
          { id: 'customer-portal', name: 'Customer Portal', description: 'Client dashboard, account access', price: '$900' }
        ],
        portfolio: [
          { id: 'photographer', name: 'Photographer', description: 'Photo portfolio, galleries', price: '$500' },
          { id: 'designer', name: 'Designer', description: 'UI/UX, graphic design work', price: '$550' },
          { id: 'developer', name: 'Developer', description: 'Code projects, GitHub showcase', price: '$500' },
          { id: 'artist', name: 'Artist', description: 'Artwork, creative portfolio', price: '$450' },
          { id: 'architect', name: 'Architect', description: 'Building designs, projects', price: '$600' },
          { id: 'writer', name: 'Writer', description: 'Writing samples, publications', price: '$400' }
        ],
        blog: [
          { id: 'personal', name: 'Personal Blog', description: 'Personal thoughts, lifestyle', price: '$400' },
          { id: 'business', name: 'Business Blog', description: 'Company news, industry insights', price: '$500' },
          { id: 'travel', name: 'Travel Blog', description: 'Travel experiences, guides', price: '$450' },
          { id: 'food', name: 'Food Blog', description: 'Recipes, restaurant reviews', price: '$450' },
          { id: 'tech', name: 'Tech Blog', description: 'Technology, tutorials, reviews', price: '$500' },
          { id: 'lifestyle', name: 'Lifestyle Blog', description: 'Fashion, wellness, living', price: '$400' }
        ],
        landing: [
          { id: 'product', name: 'Product Launch', description: 'New product announcement', price: '$350' },
          { id: 'event', name: 'Event Registration', description: 'Conference, meetup, webinar', price: '$400' },
          { id: 'app', name: 'App Download', description: 'Mobile app promotion', price: '$300' },
          { id: 'service', name: 'Service Booking', description: 'Appointment scheduling', price: '$350' },
          { id: 'newsletter', name: 'Newsletter Signup', description: 'Email list building', price: '$250' },
          { id: 'campaign', name: 'Marketing Campaign', description: 'Brand awareness, promotion', price: '$450' }
        ],
        product: [
          { id: 'saas', name: 'SaaS Product', description: 'Software as a service', price: '$600' },
          { id: 'physical', name: 'Physical Product', description: 'Tangible goods showcase', price: '$500' },
          { id: 'digital', name: 'Digital Product', description: 'Ebooks, courses, downloads', price: '$450' },
          { id: 'mobile', name: 'Mobile App', description: 'iOS/Android app showcase', price: '$550' },
          { id: 'service', name: 'Service Package', description: 'Service offerings, pricing', price: '$500' },
          { id: 'subscription', name: 'Subscription Box', description: 'Monthly subscription service', price: '$550' }
        ],
        custom: [
          { id: 'nonprofit', name: 'Nonprofit', description: 'Charity, organization website', price: '$600' },
          { id: 'education', name: 'Education', description: 'School, course, training', price: '$700' },
          { id: 'community', name: 'Community', description: 'Forum, group platform', price: '$650' },
          { id: 'directory', name: 'Directory', description: 'Listing, resource directory', price: '$550' },
          { id: 'membership', name: 'Membership Site', description: 'Exclusive content, access', price: '$750' },
          { id: 'customer-platform', name: 'Customer Platform', description: 'Custom customer management solution', price: '$1,800' },
          { id: 'other', name: 'Other Custom', description: 'Unique requirements', price: '$800' }
        ]
      },
      multi: {
        business: [
          { id: 'corporate', name: 'Corporate Website', description: 'Large company, enterprise', price: '$600' },
          { id: 'small-business', name: 'Small Business', description: 'Local business, startup', price: '$600' },
          { id: 'restaurant-chain', name: 'Restaurant Chain', description: 'Multiple locations, franchise', price: '$800' },
          { id: 'healthcare-network', name: 'Healthcare Network', description: 'Clinics, hospitals network', price: '$1,200' },
          { id: 'real-estate', name: 'Real Estate', description: 'Property listings, agency', price: '$800' },
          { id: 'professional', name: 'Professional Services', description: 'Law firm, accounting, etc.', price: '$1,000' },
          { id: 'customer-support', name: 'Customer Support', description: 'Multi-channel support center', price: '$1,400' },
          { id: 'customer-management', name: 'Customer Management', description: 'CRM, customer relationship platform', price: '$1,600' }
        ],
        portfolio: [
          { id: 'agency', name: 'Creative Agency', description: 'Multi-creative services showcase', price: '$2,000' },
          { id: 'photography-studio', name: 'Photography Studio', description: 'Multiple photographers, services', price: '$1,800' },
          { id: 'design-studio', name: 'Design Studio', description: 'Team portfolio, case studies', price: '$1,900' },
          { id: 'architecture-firm', name: 'Architecture Firm', description: 'Building projects, team', price: '$2,200' },
          { id: 'production', name: 'Production Company', description: 'Video, media projects', price: '$2,100' },
          { id: 'consulting-group', name: 'Consulting Group', description: 'Team expertise, services', price: '$2,000' }
        ],
        ecommerce: [
          { id: 'retail-store', name: 'Retail Store', description: 'Physical products, clothing, etc.', price: '$3,500' },
          { id: 'digital-products', name: 'Digital Products', description: 'Software, courses, downloads', price: '$2,800' },
          { id: 'subscription-service', name: 'Subscription Service', description: 'Recurring billing, boxes', price: '$4,000' },
          { id: 'marketplace', name: 'Marketplace', description: 'Multi-vendor platform', price: '$4,500' },
          { id: 'dropshipping', name: 'Dropshipping', description: 'No inventory, fulfillment', price: '$3,200' },
          { id: 'b2b-ecommerce', name: 'B2B E-commerce', description: 'Business to business sales', price: '$4,200' }
        ],
        blog: [
          { id: 'magazine', name: 'Online Magazine', description: 'Multi-author, editorial', price: '$2,000' },
          { id: 'news', name: 'News Website', description: 'Current events, journalism', price: '$2,200' },
          { id: 'multi-author', name: 'Multi-Author Blog', description: 'Team of writers, contributors', price: '$1,900' },
          { id: 'niche', name: 'Niche Community', description: 'Specialized topic, community', price: '$1,800' },
          { id: 'corporate', name: 'Corporate Blog', description: 'Company insights, thought leadership', price: '$2,100' },
          { id: 'educational', name: 'Educational Blog', description: 'Tutorials, learning content', price: '$1,950' }
        ],
        landing: [
          { id: 'campaign', name: 'Marketing Campaign', description: 'Multi-page campaign site', price: '$1,600' },
          { id: 'product-launch', name: 'Product Launch Site', description: 'Multiple product pages', price: '$1,700' },
          { id: 'event-series', name: 'Event Series', description: 'Multiple events, conferences', price: '$1,800' },
          { id: 'brand', name: 'Brand Microsite', description: 'Brand storytelling, multiple sections', price: '$1,650' },
          { id: 'promotion', name: 'Promotional Site', description: 'Sales, special offers', price: '$1,550' },
          { id: 'awareness', name: 'Awareness Campaign', description: 'Cause, advocacy, information', price: '$1,600' }
        ],
        custom: [
          { id: 'platform', name: 'Web Platform', description: 'Complex web application', price: '$3,500' },
          { id: 'customer-portal', name: 'Customer Portal', description: 'Client dashboard, access', price: '$2,500' },
          { id: 'learning-platform', name: 'Learning Platform', description: 'Courses, LMS, education', price: '$2,500' },
          { id: 'community-platform', name: 'Community Platform', description: 'Social features, forums', price: '$2,300' },
          { id: 'booking-system', name: 'Booking System', description: 'Reservations, scheduling', price: '$2,000' },
          { id: 'customer-management', name: 'Customer Management', description: 'Advanced CRM and customer tools', price: '$3,000' },
          { id: 'enterprise', name: 'Enterprise Solution', description: 'Large-scale business solution', price: '$3,800' }
        ]
      }
    };

    return subcategories[type]?.[cat] || [];
  };

  const subcategories = getSubcategories(websiteType, category);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <Head>
        <title>Step 4: Customize Details - Mellow Quote</title>
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
                Step 4: What type of {categoryName} do you need?
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {websiteType === 'single' ? '📄 Single Page' : '📑 Multi Page'} → {categoryName}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              {/* Bundle Selection Notice */}
              {bundle && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-lg">🎁</span>
                    <div>
                      <span className="text-purple-800 font-semibold">Bundle Selected!</span>
                      <span className="text-purple-600 text-sm ml-2">Your bundle features will be pre-selected in the following steps.</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Choose Your Specific Type</h2>
                <p className="text-gray-600 text-center text-sm">Select the option that best describes your project</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-6">
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategorySelect(sub)}
                    className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedSubcategory === sub.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs sm:text-sm">{sub.name.charAt(0)}</span>
                      </div>
                      {selectedSubcategory === sub.id && (
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{sub.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2">{sub.description}</p>
                    <div className={`font-bold text-sm sm:text-base px-2 py-1 rounded ${bundle ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'}`}>
                      {bundle ? 'Included' : sub.price}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Smart back navigation based on where we came from (preserve bundle params)
                    if (fromPage === 'category') {
                      router.push(`/step-2?type=${websiteType}&category=${category}&from=subcategory${bundleParams}`);
                    } else if (fromPage === 'type') {
                      router.push(`/?from=subcategory&type=${websiteType}&category=${category}&clear=true`);
                    } else {
                      // From bundle or default: go to category page
                      router.push(`/step-2?type=${websiteType}&category=${category}&from=subcategory${bundleParams}`);
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                >
                  ← Back
                </button>
                
                {selectedSubcategory && (
                  <button
                    onClick={() => {
                      const backend = router.query.backend || '';
                      router.push(`/step-5?type=${websiteType}&category=${category}&subcategory=${selectedSubcategory}&backend=${backend}&from=subcategory${bundleParams}`);
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
