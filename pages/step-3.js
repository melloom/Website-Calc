import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { STORAGE_KEY } from '../utils/quote-storage';

// Cost maps for budget bundle calculations
const backendCostMap = {
  'basic-auth': { name: 'Basic Authentication', cost: 250 },
  'auth-storage': { name: 'Auth & Storage', cost: 400 },
  'api-backend': { name: 'API Backend', cost: 600 },
  'secure-system': { name: 'Secure System', cost: 600 },
  'full-system': { name: 'Complete System', cost: 800 },
  'content-system': { name: 'Content Management (CMS)', cost: 500 },
  'ecommerce-backend': { name: 'E-commerce Backend', cost: 900 },
  'custom-system': { name: 'Custom Backend', cost: 1200 }
};

const aiFeatureCostMap = {
  'ai-chatbot': { name: 'AI Chatbot', cost: 250 },
  'ai-content': { name: 'AI Content Generation', cost: 300 },
  'ai-analytics': { name: 'AI Analytics', cost: 300 },
  'ai-personalization': { name: 'AI Personalization', cost: 400 },
  'ai-automation': { name: 'AI Automation', cost: 400 },
  'ai-assistant': { name: 'AI Assistant', cost: 500 }
};

const automationCostMap = {
  'email-notifications': { name: 'Email Notifications', cost: 100 },
  'auto-responder': { name: 'Auto Responder', cost: 150 },
  'social-integration': { name: 'Social Integration', cost: 200 },
  'lead-capture': { name: 'Lead Capture', cost: 200 },
  'analytics-integration': { name: 'Analytics Integration', cost: 150 },
  'crm-integration': { name: 'CRM Integration', cost: 300 },
  'workflow-automation': { name: 'Workflow Automation', cost: 350 },
  'form-automation': { name: 'Form Automation', cost: 150 },
  'reports': { name: 'Reports', cost: 150 },
  'data-sync': { name: 'Data Sync', cost: 200 },
  'api-integration': { name: 'API Integration', cost: 300 }
};

const storeCostMap = {
  'basic-products': { name: 'Basic Products', cost: 100 },
  'shopping-cart': { name: 'Shopping Cart', cost: 200 },
  'payment-processing': { name: 'Payment Processing', cost: 150 },
  'order-management': { name: 'Order Management', cost: 250 },
  'inventory-tracking': { name: 'Inventory Tracking', cost: 200 },
  'shipping-calculator': { name: 'Shipping Calculator', cost: 150 },
  'customer-accounts': { name: 'Customer Accounts', cost: 180 },
  'tax-calculator': { name: 'Tax Calculator', cost: 120 },
  'discount-coupons': { name: 'Discount & Coupons', cost: 160 },
  'product-reviews': { name: 'Product Reviews', cost: 140 },
  'email-notifications': { name: 'Email Notifications', cost: 130 },
  'analytics-dashboard': { name: 'Analytics Dashboard', cost: 200 },
  'wishlist-favorites': { name: 'Wishlist & Favorites', cost: 100 },
  'product-comparisons': { name: 'Product Comparisons', cost: 120 },
  'quick-view-modal': { name: 'Quick View Modal', cost: 80 },
  'related-products': { name: 'Related Products', cost: 150 },
  'order-tracking': { name: 'Order Tracking Portal', cost: 110 },
  'refund-management': { name: 'Refund Management', cost: 140 },
  'bulk-orders': { name: 'Bulk Orders', cost: 180 },
  'gift-cards': { name: 'Gift Cards', cost: 160 },
  'subscription-products': { name: 'Subscription Products', cost: 220 },
  'inventory-management': { name: 'Inventory Management', cost: 600 },
  'customer-accounts': { name: 'Customer Accounts', cost: 400 }
};

const sectionCostMap = {
  'about': { name: 'About', cost: 100 },
  'services': { name: 'Services', cost: 150 },
  'portfolio': { name: 'Portfolio', cost: 200 },
  'testimonials': { name: 'Testimonials', cost: 100 },
  'faq': { name: 'FAQ', cost: 75 },
  'team': { name: 'Team', cost: 150 },
  'pricing': { name: 'Pricing', cost: 100 },
  'gallery': { name: 'Gallery', cost: 125 },
  'case-studies': { name: 'Case Studies', cost: 200 },
  'blog-setup': { name: 'Blog Setup', cost: 300 },
  'menu': { name: 'Menu', cost: 300 },
  'reservations': { name: 'Reservations', cost: 400 },
  'online-ordering': { name: 'Online Ordering', cost: 500 },
  'hero': { name: 'Hero Section', cost: 0 },
  'contact': { name: 'Contact Section', cost: 0 }
};

const addonCostMap = {
  'seo-package': { name: 'SEO', cost: 199, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$199' }, onetime: { price: '+$599' } } },
  'content-writing': { name: 'Content Writing', cost: 149, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$149' }, onetime: { price: '+$449' } } },
  'social-media-management': { name: 'Social Media', cost: 199, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$199' }, onetime: { price: '+$599' } } },
  'email-marketing': { name: 'Email Marketing', cost: 129, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$129' }, onetime: { price: '+$389' } } },
  'website-maintenance': { name: 'Maintenance', cost: 50, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$50' }, onetime: { price: '+$150' } } },
  'analytics-setup': { name: 'Analytics', cost: 149, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$149' }, onetime: { price: '+$449' } } },
  'security-package': { name: 'Security', cost: 59, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$59' }, onetime: { price: '+$179' } } },
  'speed-optimization': { name: 'Speed Optimization', cost: 99, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$99' }, onetime: { price: '+$299' } } },
  'full-care-plan': { name: 'Full Care Plan', cost: 199, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$199' }, onetime: { price: '+$599' } } },
  'social-media-setup': { name: 'Social Media Setup', cost: 350, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$100' }, onetime: { price: '+$350' }, all: { price: '+$800' } } },
  'logo-design': { name: 'Logo Design', cost: 600, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$200' }, onetime: { price: '+$600' }, all: { price: '+$1,500' } } },
  'branding-package': { name: 'Complete Branding Package', cost: 1200, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$400' }, onetime: { price: '+$1,200' }, all: { price: '+$2,500' } } },
  'hosting-setup': { name: 'Website Hosting Setup', cost: 150, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$450' } } },
  'domain-registration': { name: 'Domain Registration', cost: 25, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$25' }, onetime: { price: '+$75' } } },
  'maintenance-package': { name: 'Website Maintenance', cost: 250, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$250' }, onetime: { price: '+$750' } } },
  'email-marketing-setup': { name: 'Email Marketing Setup', cost: 400, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$400' } } },
  'google-ads-setup': { name: 'Google Ads Setup', cost: 600, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$600' }, onetime: { price: '+$1,800' } } },
  'facebook-ads-setup': { name: 'Facebook Ads Setup', cost: 500, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$500' }, onetime: { price: '+$1,500' } } },
  'video-production': { name: 'Video Production', cost: 1000, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$300' }, onetime: { price: '+$1,000' }, all: { price: '+$2,500' } } },
  'photography': { name: 'Professional Photography', cost: 800, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$250' }, onetime: { price: '+$800' }, all: { price: '+$1,800' } } },
  'copywriting': { name: 'Professional Copywriting', cost: 400, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$400' } } },
  'translation-services': { name: 'Translation Services', cost: 350, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$120' }, onetime: { price: '+$350' } } },
  'accessibility-audit': { name: 'Accessibility Audit', cost: 500, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$200' }, onetime: { price: '+$500' } } },
  'performance-optimization': { name: 'Performance Optimization', cost: 450, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$450' } } },
  'security-audit': { name: 'Security Audit', cost: 600, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$250' }, onetime: { price: '+$600' } } }
};

export default function Step3() {
  const [selectedBundle, setSelectedBundle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalBundle, setModalBundle] = useState(null);
  const [addStoreAddon, setAddStoreAddon] = useState(false);
  const [showBudgetBundles, setShowBudgetBundles] = useState(false);
  const [cameFromBudgetBundle, setCameFromBudgetBundle] = useState(false);
  const [budgetAddons, setBudgetAddons] = useState({
    'logo-design': false,
    'favicon-design': false,
    'social-media-setup': false,
    'extra-revision': false
  });
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const fromPage = router.query.from || ''; // Track where we came from
  
  // Initialize selection from query parameters
  useEffect(() => {
    if (router.query.bundle) {
      setSelectedBundle(router.query.bundle);
      
      // Clear any old budget addon data when loading a budget bundle
      const selectedBundleData = bundles.find(b => b.id === router.query.bundle);
      if (selectedBundleData?.tier === 'budget') {
        // Mark that user came from a budget bundle
        setCameFromBudgetBundle(true);
        
        // Automatically show budget bundles section
        setShowBudgetBundles(true);
        
        // Reset budget addons state
        setBudgetAddons({
          'logo-design': false,
          'favicon-design': false,
          'social-media-setup': false,
          'extra-revision': false
        });
        
        // Set store addon state from URL parameter
        const storeAddonFromUrl = router.query.storeAddon === 'true';
        setAddStoreAddon(storeAddonFromUrl);
        
        // Clear old step10 data from localStorage if it exists
        if (typeof window !== 'undefined') {
          const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          delete currentSelections.step10;
          delete currentSelections.step8;
          delete currentSelections.storeAddon;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
          
          // Trigger event to update MobileCostSummary
          window.dispatchEvent(new Event('selections-updated'));
        }
      }
    }
  }, [router.query.bundle, router.query.storeAddon]);

  // Budget add-on options
  const budgetAddonOptions = [
    { id: 'logo-design', name: 'Logo Design', price: 50, description: 'Custom logo design for your website' },
    { id: 'favicon-design', name: 'Favicon Design', price: 25, description: 'Custom browser icon design' },
    { id: 'social-media-setup', name: 'Social Media Setup', price: 25, description: 'Setup social media links and sharing' },
    { id: 'extra-revision', name: 'Extra Revision', price: 25, description: 'Additional round of revisions' }
  ];

  const toggleBudgetAddon = (addonId) => {
    setBudgetAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  // Save budget add-ons to localStorage when they change (for real-time widget updates)
  useEffect(() => {
    const selectedBundleData = bundles.find(b => b.id === selectedBundle);
    if (selectedBundle && selectedBundleData?.tier === 'budget') {
      const selectedBudgetAddons = budgetAddonOptions.filter(addon => budgetAddons[addon.id]);
      
      if (typeof window !== 'undefined') {
        const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (selectedBudgetAddons.length > 0) {
          currentSelections.step10 = {
            step: 10,
            name: 'Budget Add-ons',
            value: selectedBudgetAddons.map(addon => addon.name).join(', '),
            items: selectedBudgetAddons.map(addon => addon.id),
            cost: getBudgetAddonsTotal()
          };
        } else {
          // Remove step10 completely when no addons are selected
          delete currentSelections.step10;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        
        // Trigger event to update MobileCostSummary
        window.dispatchEvent(new Event('selections-updated'));
      }
    }
  }, [budgetAddons, selectedBundle]);

  // Save store addon state to localStorage when it changes for budget bundles
  useEffect(() => {
    const selectedBundleData = bundles.find(b => b.id === selectedBundle);
    if (selectedBundle && selectedBundleData?.tier === 'budget') {
      if (typeof window !== 'undefined') {
        const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        
        if (addStoreAddon) {
          // Store addon is enabled - save to step8 with budget pricing
          currentSelections.step8 = {
            step: 8,
            name: 'Store',
            value: 'Basic E-commerce',
            id: 'basic-ecommerce',
            cost: 199 // Budget bundle pricing
          };
          // Add storeAddon flag for mobile widget
          currentSelections.storeAddon = 'true';
        } else {
          // Store addon is disabled - remove step8 and storeAddon flag
          delete currentSelections.step8;
          delete currentSelections.storeAddon;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        
        // Update URL to preserve store addon state
        const params = new URLSearchParams(window.location.search);
        if (addStoreAddon) {
          params.set('storeAddon', 'true');
        } else {
          params.delete('storeAddon');
        }
        
        // Update URL without page reload
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
        
        // Trigger event to update MobileCostSummary
        window.dispatchEvent(new Event('selections-updated'));
      }
    }
  }, [addStoreAddon, selectedBundle]);

  // Calculate budget add-ons total
  const getBudgetAddonsTotal = () => {
    return budgetAddonOptions.reduce((total, addon) => {
      return total + (budgetAddons[addon.id] ? addon.price : 0);
    }, 0);
  };

  // Set initial filter to the selected category
  const [selectedCategory, setSelectedCategory] = useState(category);

  const toggleBundle = (bundleId) => {
    const newBundle = selectedBundle === bundleId ? '' : bundleId; // Toggle on/off
    setSelectedBundle(newBundle);
    
    // Find the bundle data to check if it should skip to quote
    const bundle = filteredBundles.find(b => b.id === newBundle);
    
    // Reset cameFromBudgetBundle if switching to regular bundle
    if (newBundle && bundle?.tier !== 'budget') {
      setCameFromBudgetBundle(false);
    }
    
    // Automatically show budget bundles section when budget bundle is selected
    if (newBundle && bundle?.tier === 'budget') {
      console.log('Setting showBudgetBundles to true for budget bundle:', bundle?.id);
      setShowBudgetBundles(true);
    }
    
    // Save to localStorage immediately when selected
    if (typeof window !== 'undefined' && newBundle) {
      const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const bundlePrice = bundle?.price || 0;
      
      // Ensure widget has step1 (Website Type) and step2 (Category) so it shows immediately
      currentSelections.step1 = {
        step: 1,
        name: 'Website Type',
        value: websiteType === 'single' ? 'Single Page' : 'Multi Page',
        id: websiteType
      };
      currentSelections.step2 = {
        step: 2,
        name: 'Category',
        value: (category || '').charAt(0).toUpperCase() + (category || '').slice(1),
        id: category || '',
        cost: 0
      };
      currentSelections.step4 = {
        step: 4,
        name: 'Bundle Selection',
        value: bundle?.name || newBundle,
        id: newBundle,
        cost: bundlePrice
      };
      
      // If it's a budget bundle, save all preselects but don't skip to quote yet
      if (bundle?.tier === 'budget') {
        // Save preselects to localStorage (but not add-ons yet)
        Object.keys(bundle.preselects).forEach(key => {
          if (Array.isArray(bundle.preselects[key])) {
            if (bundle.preselects[key].length > 0) {
              currentSelections[`step${getStepNumber(key)}`] = {
                step: getStepNumber(key),
                name: getStepName(key),
                value: getStepValue(key, bundle.preselects[key]),
                id: bundle.preselects[key].join(','),
                items: bundle.preselects[key],
                cost: getStepCost(key, bundle.preselects[key])
              };
            }
          } else {
            const monthlyCost = getStepCost(key, bundle.preselects[key]);
            currentSelections[`step${getStepNumber(key)}`] = {
              step: getStepNumber(key),
              name: getStepName(key),
              value: getStepValue(key, bundle.preselects[key]),
              id: bundle.preselects[key],
              cost: 0, // No one-time cost for hosting/maintenance
              monthly: monthlyCost // Add monthly cost
            };
          }
        });
        // Save budget add-ons availability for later use
        currentSelections.budgetAddons = bundle.budgetAddons || [];
        // Note: Budget add-ons will be saved when user clicks "Continue"
      } else if (bundle?.preselects) {
        // Save preselects for regular bundles too
        Object.keys(bundle.preselects).forEach(key => {
          if (Array.isArray(bundle.preselects[key])) {
            if (bundle.preselects[key].length > 0) {
              currentSelections[`step${getStepNumber(key)}`] = {
                step: getStepNumber(key),
                name: getStepName(key),
                value: getStepValue(key, bundle.preselects[key]),
                id: bundle.preselects[key].join(','),
                items: bundle.preselects[key],
                cost: getStepCost(key, bundle.preselects[key])
              };
            }
          } else {
            const monthlyCost = getStepCost(key, bundle.preselects[key]);
            currentSelections[`step${getStepNumber(key)}`] = {
              step: getStepNumber(key),
              name: getStepName(key),
              value: getStepValue(key, bundle.preselects[key]),
              id: bundle.preselects[key],
              cost: 0, // No one-time cost for hosting/maintenance
              monthly: monthlyCost // Add monthly cost
            };
          }
        });
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
      window.dispatchEvent(new Event('selections-updated'));
    } else if (typeof window !== 'undefined' && !newBundle) {
      // Remove bundle selection and all bundle preselects if deselected
      const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      
      // Remove bundle selection
      delete currentSelections.step4;
      
      // Remove all bundle preselects (steps that were set by bundle)
      // These steps are: 5 (backend), 6 (backendOptions), 7 (ai), 8 (store), 
      // 9 (sections), 10 (addons), 11 (hosting), 12 (maintenance), 14 (automation)
      // Since we're on step 3, the user hasn't manually configured these yet,
      // so any values would have come from bundle preselects
      const bundlePreselectSteps = [5, 6, 7, 8, 9, 10, 11, 12, 14];
      bundlePreselectSteps.forEach(stepNum => {
        if (currentSelections[`step${stepNum}`]) {
          delete currentSelections[`step${stepNum}`];
        }
      });
      
      // Also remove budget addons if they exist
      if (currentSelections.budgetAddons) {
        delete currentSelections.budgetAddons;
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
      window.dispatchEvent(new Event('selections-updated'));
    }
    
    // Update URL immediately for real-time widget updates
    if (newBundle) {
      // Always stay on step-3, don't navigate instantly even for budget bundles
      router.push(`/step-3?type=${websiteType}&category=${category}&bundle=${newBundle}&from=category`, undefined, { shallow: true });
    } else {
      // When bundle is deselected, remove all bundle-related parameters from URL
      const cleanParams = new URLSearchParams();
      cleanParams.set('type', websiteType);
      cleanParams.set('category', category);
      cleanParams.set('from', 'category');
      // Explicitly remove all bp_* parameters by not including them
      router.push(`/step-3?${cleanParams.toString()}`, undefined, { shallow: true });
    }
  };

  // Helper functions for budget bundle preselects
  const getStepNumber = (key) => {
    const stepMap = {
      'backend': 5, 'backendOptions': 6, 'ai': 7, 'aiFeatures': 7,
      'automation': 14, 'automationFeatures': 14, 'store': 8, 'storeOptions': 8,
      'sections': 9, 'addons': 10, 'hosting': 11, 'maintenance': 12
    };
    return stepMap[key] || 4;
  };

  const getStepName = (key) => {
    const nameMap = {
      'backend': 'Backend', 'backendOptions': 'Backend Options', 'ai': 'AI Features', 'aiFeatures': 'AI Features',
      'automation': 'Automation', 'automationFeatures': 'Automation Features', 'store': 'Store', 'storeOptions': 'Store',
      'sections': 'Sections/Pages', 'addons': 'Add-ons', 'hosting': 'Hosting', 'maintenance': 'Maintenance'
    };
    return nameMap[key] || key;
  };

  const getStepValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.map(v => v.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ');
    }
    return value.toString().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStepCost = (key, value) => {
    if (Array.isArray(value)) {
      return value.reduce((total, id) => {
        if (key === 'backendOptions') return total + (backendCostMap[id]?.cost || 0);
        if (key === 'aiFeatures') return total + (aiFeatureCostMap[id]?.cost || 0);
        if (key === 'automationFeatures') return total + (automationCostMap[id]?.cost || 0);
        if (key === 'storeOptions') return total + (storeCostMap[id]?.cost || 0);
        if (key === 'sections') return total + (sectionCostMap[id]?.cost || 0);
        if (key === 'addons') return total + (addonCostMap[id]?.cost || 0);
        return total;
      }, 0);
    }
    // Handle single value costs (hosting, maintenance)
    if (key === 'hosting') {
      const hostingCosts = {
        'basic': { monthly: 25, onetime: 0 },
        'basic-hosting': { monthly: 50, onetime: 0 },
        'standard': { monthly: 45, onetime: 0 },
        'standard-hosting': { monthly: 45, onetime: 0 },
        'professional': { monthly: 65, onetime: 0 },
        'professional-hosting': { monthly: 65, onetime: 0 },
        'enterprise': { monthly: 95, onetime: 0 },
        'enterprise-hosting': { monthly: 95, onetime: 0 }
      };
      return hostingCosts[value]?.monthly || 0;
    }
    if (key === 'maintenance') {
      const maintenanceCosts = {
        'none': { monthly: 0, onetime: 0 },
        'basic': { monthly: 79, onetime: 0 },
        'standard': { monthly: 149, onetime: 0 },
        'professional': { monthly: 299, onetime: 0 },
        'enterprise': { monthly: 299, onetime: 0 }
      };
      return maintenanceCosts[value]?.monthly || 0;
    }
    return 0;
  };

  const getCategories = (type) => {
    if (type === 'single') {
      return [
        {
          id: 'business',
          name: 'Business Landing',
          description: 'Professional landing page for companies and services',
          icon: '🏢',
          singlePrice: '$600',
          multiPrice: '$800'
        },
        {
          id: 'portfolio',
          name: 'Portfolio',
          description: 'Showcase your work, projects, or creative portfolio',
          icon: '🎨',
          singlePrice: '$600',
          multiPrice: '$600'
        },
        {
          id: 'blog',
          name: 'Blog',
          description: 'Content-focused website with articles and posts',
          icon: '📝',
          singlePrice: '$500',
          multiPrice: '$500'
        },
        {
          id: 'landing',
          name: 'Marketing Landing',
          description: 'Single page focused on marketing or conversion',
          icon: '🎯',
          singlePrice: '$399',
          multiPrice: '$399'
        },
        {
          id: 'product',
          name: 'Product Showcase',
          description: 'Single page highlighting a specific product or service',
          icon: '📦',
          singlePrice: '$700',
          multiPrice: '$700'
        },
        {
          id: 'custom',
          name: 'Custom Single Page',
          description: 'Tailored single-page solution with unique requirements',
          icon: '⚡',
          singlePrice: '$800',
          multiPrice: '$800'
        }
      ];
    } else {
      return [
        {
          id: 'business',
          name: 'Business Website',
          description: 'Professional website for companies and organizations',
          icon: '🏢',
          singlePrice: '$600',
          multiPrice: '$1,799'
        },
        {
          id: 'portfolio',
          name: 'Portfolio',
          description: 'Showcase your work, projects, or creative portfolio',
          icon: '🎨',
          singlePrice: '$600',
          multiPrice: '$1,499'
        },
        {
          id: 'ecommerce',
          name: 'E-commerce Store',
          description: 'Online store with products and shopping cart',
          icon: '🛍️',
          singlePrice: '$800',
          multiPrice: '$4,999'
        },
        {
          id: 'blog',
          name: 'Blog',
          description: 'Content-focused website with articles and posts',
          icon: '📝',
          singlePrice: '$500',
          multiPrice: '$1,499'
        },
        {
          id: 'landing',
          name: 'Marketing Site',
          description: 'Multi-page marketing website with landing pages',
          icon: '🎯',
          singlePrice: '$399',
          multiPrice: '$1,199'
        },
        {
          id: 'custom',
          name: 'Custom Project',
          description: 'Tailored solution with unique requirements',
          icon: '⚡',
          singlePrice: '$800',
          multiPrice: '$3,999'
        }
      ];
    }
  };

  const getBundles = (type, cat) => {
    const bundles = {
      single: {
        business: [
          {
            id: 'starter',
            name: 'Business Starter',
            description: 'Essential features for small businesses',
            price: '$600',
            features: ['Hero Section', 'About Section', 'Services Overview', 'Contact Form', 'Mobile Responsive', 'Basic SEO'],
            popular: false
          },
          {
            id: 'growth',
            name: 'Business Growth',
            description: 'Complete solution for growing businesses',
            price: '$1,199',
            features: ['Hero Section', 'About Section', 'Services Overview', 'Team Section', 'Testimonials', 'Contact Form', 'Google Maps', 'Mobile Responsive', 'Advanced SEO', 'Analytics Setup'],
            popular: true
          }
        ],
        portfolio: [
          {
            id: 'creative',
            name: 'Creative Portfolio',
            description: 'Clean showcase for your work',
            price: '$600',
            features: ['Hero Section', 'About Section', 'Portfolio Gallery', 'Contact Form', 'Mobile Responsive', 'Basic SEO'],
            popular: false
          },
          {
            id: 'professional',
            name: 'Professional Portfolio',
            description: 'Comprehensive creative portfolio',
            price: '$1,199',
            features: ['Hero Section', 'About Section', 'Portfolio Gallery', 'Project Details', 'Client Testimonials', 'Contact Form', 'Mobile Responsive', 'SEO Optimization', 'Social Links', 'Lightbox Gallery'],
            popular: true
          }
        ],
        blog: [
          {
            id: 'personal',
            name: 'Personal Blog',
            description: 'Simple, clean blog setup',
            price: '$500',
            features: ['Hero Section', 'About Section', 'Blog Section', 'Contact Form', 'Mobile Responsive', 'Basic SEO'],
            popular: false
          },
          {
            id: 'content',
            name: 'Content Blog',
            description: 'Feature-rich blogging platform',
            price: '$1,199',
            features: ['Hero Section', 'About Section', 'Blog Section', 'Category System', 'Search Function', 'Newsletter Signup', 'Contact Form', 'Mobile Responsive', 'SEO Tools', 'Social Sharing'],
            popular: true
          }
        ],
        landing: [
          {
            id: 'conversion',
            name: 'Conversion Landing',
            description: 'Essential landing page features',
            price: '$399',
            features: ['Hero Section', 'Feature List', 'Contact Form', 'Mobile Responsive', 'Basic SEO'],
            popular: false
          },
          {
            id: 'marketing',
            name: 'Marketing Landing',
            description: 'High-converting landing page',
            price: '$800',
            features: ['Hero Section', 'Feature Showcase', 'Testimonials', 'Call-to-Action Forms', 'Analytics Integration', 'Mobile Responsive', 'A/B Testing Setup', 'Social Proof', 'Lead Capture'],
            popular: true
          }
        ],
        product: [
          {
            id: 'showcase',
            name: 'Product Showcase',
            description: 'Simple product showcase',
            price: '$700',
            features: ['Hero Section', 'Product Gallery', 'Description Section', 'Contact Form', 'Mobile Responsive', 'Basic SEO'],
            popular: false
          },
          {
            id: 'launch',
            name: 'Product Launch',
            description: 'Comprehensive product presentation',
            price: '$1,299',
            features: ['Hero Section', 'Interactive Gallery', 'Detailed Specifications', 'Customer Reviews', 'Inquiry Forms', 'Technical Specs', 'Contact Form', 'Mobile Responsive', 'SEO Optimization', 'Social Sharing', 'Video Integration'],
            popular: true
          }
        ],
        custom: [
          {
            id: 'tailored',
            name: 'Tailored Solution',
            description: 'Custom solution with core features',
            price: '$800',
            features: ['Custom Layout', 'Hero Section', 'Unique Design', 'Core Functionality', 'Contact Forms', 'Mobile Responsive', 'Basic SEO'],
            popular: false
          },
          {
            id: 'bespoke',
            name: 'Bespoke Solution',
            description: 'Advanced custom solution',
            price: '$4,999',
            features: ['Bespoke Design', 'Hero Section', 'Advanced Features', 'Custom Interactions', 'Database Integration', 'User Accounts', 'Contact Forms', 'Mobile Responsive', 'SEO Optimization', 'Analytics Setup', 'Social Integration'],
            popular: true
          }
        ]
      },
      multi: {
        business: [
          {
            id: 'budget-starter-mp',
            name: 'Starter Multi-Page Site',
            description: 'Essential multi-page website for small businesses',
            price: '$1,199',
            tier: 'budget',
            features: [
              '5-Page Business Website',
              'Mobile Responsive Design',
              'Contact Forms',
              'Basic Navigation',
              'SEO Setup'
            ],
            popular: false
          },
          {
            id: 'budget-essential-mp',
            name: 'Essential Multi-Page Site',
            description: 'Professional multi-page with enhanced features',
            price: '$1,799',
            tier: 'budget',
            features: [
              '7-Page Business Website',
              'Mobile Responsive Design',
              'Advanced Contact Forms',
              'Professional Navigation',
              'SEO Optimization',
              'Basic Analytics'
            ],
            popular: true
          },
          {
            id: 'basic',
            name: 'Basic Business Site',
            description: 'Essential multi-page business website',
            price: '$1,200',
            features: ['5-Page Website', 'Professional Design', 'Contact Forms', 'About/Services Pages', 'Mobile Responsive', 'Basic SEO', 'Navigation Menu'],
            popular: false
          },
          {
            id: 'professional',
            name: 'Professional Business Site',
            description: 'Complete business web presence',
            price: '$1,800',
            features: ['10-Page Website', 'Premium Design', 'Advanced Forms', 'Full Business Pages', 'Blog Section', 'Mobile Responsive', 'Advanced SEO', 'Analytics Setup', 'Social Media Integration', 'Team Pages'],
            popular: true
          }
        ],
        portfolio: [
          {
            id: 'portfolio-creative-mp',
            name: 'Creative Portfolio Site',
            description: 'Multi-page portfolio for creatives',
            price: '$1,499',
            features: ['Portfolio Gallery', 'Project Details Pages', 'About Section', 'Contact Forms', 'Mobile Responsive', 'Basic SEO', 'Navigation Menu'],
            popular: false
          },
          {
            id: 'portfolio-professional',
            name: 'Professional Portfolio Site',
            description: 'Comprehensive multi-page portfolio',
            price: '$2,499',
            features: ['Advanced Portfolio Gallery', 'Individual Project Pages', 'Client Testimonials', 'Blog Section', 'Contact Forms', 'Mobile Responsive', 'Advanced SEO', 'Analytics Setup', 'Social Media Integration'],
            popular: true
          },
          {
            id: 'portfolio-premium',
            name: 'Premium Portfolio Site',
            description: 'Professional portfolio with client management',
            price: '$3,999',
            features: ['Everything in Professional', '15+ Page Portfolio Website', 'Client Portal Dashboard', 'Project Management System', 'File Upload/Download System', 'Client Account Management', 'Portfolio Analytics', 'Password Protected Projects', '3 Rounds of Revisions', '90 Days Support'],
            popular: false
          }
        ],
        ecommerce: [
          {
            id: 'basic',
            name: 'Basic E-commerce Site',
            description: 'Essential online store',
            price: '$2,999',
            features: ['Up to 50 Products', 'Shopping Cart', 'Payment Gateway', 'Product Categories', 'Mobile Responsive', 'Basic SEO', 'Order Management'],
            popular: false
          },
          {
            id: 'professional',
            name: 'Professional E-commerce Site',
            description: 'Complete online retail solution',
            price: '$7,999',
            features: ['Up to 200 Products', 'Advanced Cart', 'Multiple Payment Options', 'Product Variants', 'Customer Accounts', 'Mobile Responsive', 'SEO Optimization', 'Analytics Setup', 'Inventory Management', 'Email Marketing'],
            popular: true
          }
        ],
        blog: [
          {
            id: 'personal',
            name: 'Personal Blog Site',
            description: 'Multi-page personal blog',
            price: '$1,499',
            features: ['Blog Homepage', 'Post Pages', 'About Section', 'Contact Forms', 'Mobile Responsive', 'Basic SEO', 'Navigation Menu'],
            popular: false
          },
          {
            id: 'professional',
            name: 'Professional Blog Site',
            description: 'Feature-rich multi-page blog',
            price: '$2,499',
            features: ['Advanced Blog System', 'Category Pages', 'Author Profiles', 'Newsletter Signup', 'Contact Forms', 'Mobile Responsive', 'Advanced SEO', 'Analytics Setup', 'Social Media Integration'],
            popular: true
          }
        ],
        landing: [
          {
            id: 'campaign',
            name: 'Campaign Site',
            description: 'Multi-page marketing campaign',
            price: '$1,199',
            features: ['Main Landing Page', 'Detail Pages', 'Contact Forms', 'Mobile Responsive', 'Basic SEO', 'Navigation Menu'],
            popular: false
          },
          {
            id: 'marketing',
            name: 'Marketing Site',
            description: 'Complete multi-page marketing website',
            price: '$1,999',
            features: ['Multiple Landing Pages', 'Lead Capture Forms', 'Analytics Integration', 'A/B Testing Setup', 'Mobile Responsive', 'Advanced SEO', 'Social Media Integration'],
            popular: true
          }
        ],
        product: [
          {
            id: 'showcase',
            name: 'Product Showcase Site',
            description: 'Multi-page product presentation',
            price: '$1,699',
            features: ['Product Landing Page', 'Detail Pages', 'Gallery', 'Contact Forms', 'Mobile Responsive', 'Basic SEO', 'Navigation Menu'],
            popular: false
          },
        {
          id: 'launch',
            name: 'Product Launch Site',
            description: 'Comprehensive product launch website',
            price: '$2,999',
            features: ['Launch Landing Page', 'Feature Pages', 'Demo Pages', 'Contact Forms', 'Mobile Responsive', 'Advanced SEO', 'Analytics Setup', 'Social Media Integration'],
            popular: true
          }
        ],
        custom: [
          {
            id: 'tailored',
            name: 'Tailored Multi-Page Site',
            description: 'Custom multi-page solution',
            price: '$1,999',
            features: ['Custom Layout', 'Multiple Pages', 'Contact Forms', 'Mobile Responsive', 'Basic SEO', 'Navigation Menu'],
            popular: false
          },
          {
            id: 'bespoke',
            name: 'Bespoke Multi-Page Site',
            description: 'Advanced custom multi-page solution',
            price: '$7,999',
            features: ['Bespoke Design', 'Advanced Features', 'Database Integration', 'User Accounts', 'Contact Forms', 'Mobile Responsive', 'Advanced SEO', 'Analytics Setup', 'Social Media Integration'],
            popular: true
          }
        ]
      }
    };

    return bundles[type]?.[cat] || [];
  };

  const getAllBundles = (type) => {
    const bundles = {
      single: [
        // ==================== BUDGET BUNDLES ====================
        {
          id: 'budget-starter',
          name: 'Starter One-Pager',
          description: 'Clean, fast, single-page website with essential features',
          price: '$400',
          tier: 'budget',
          features: [
            'Single Clean Page',
            'Mobile Responsive Design',
            'Fast Loading',
            'Contact or Call Button',
            '1 Round of Revisions',
            'Basic SEO Setup'
          ],
          popular: false,
          category: 'all',
          backend: false,
          pages: ['Home'],
          includes: {
            pages: 1,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'contact'],
            addons: [],
            hosting: 'basic',
            maintenance: 'none'
          },
          budgetAddons: [
            { id: 'logo-design', name: 'Logo Design', price: 50, description: 'Professional logo design' },
            { id: 'favicon-design', name: 'Favicon Design', price: 25, description: 'Custom favicon for browser tab' },
            { id: 'social-media-setup', name: 'Social Media Setup', price: 25, description: 'Setup social media profiles' },
            { id: 'extra-revision', name: 'Extra Revision', price: 25, description: 'Additional round of revisions' },
            { id: 'basic-ecommerce', name: 'Basic E-commerce', price: 200, description: 'Simple online store with basic features' }
          ]
        },
        {
          id: 'budget-essential',
          name: 'Essential Website',
          description: 'Single-page website with light backend for form submissions and data management',
          price: '$600',
          tier: 'budget',
          features: [
            'Single Professional Page',
            'Mobile Responsive Design',
            'Fast Loading',
            'Contact Form with Database Storage',
            'Email Notifications on Form Submission',
            'Optional CSV Reports',
            'Spam Protection',
            'Light Backend Admin',
            'About Section',
            'Services/Products Section',
            '1 Round of Revisions',
            'Basic SEO Setup'
          ],
          popular: false,
          category: 'all',
          backend: true,
          pages: ['Home'],
          includes: {
            pages: 1,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['basic-auth', 'auth-storage'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          },
          budgetAddons: [
            { id: 'logo-design', name: 'Logo Design', price: 50, description: 'Professional logo design' },
            { id: 'favicon-design', name: 'Favicon Design', price: 25, description: 'Custom favicon for browser tab' },
            { id: 'social-media-setup', name: 'Social Media Setup', price: 25, description: 'Setup social media profiles' },
            { id: 'extra-revision', name: 'Extra Revision', price: 25, description: 'Additional round of revisions' },
            { id: 'basic-ecommerce', name: 'Basic E-commerce', price: 200, description: 'Simple online store with basic features' }
          ]
        },
        
        // ==================== BUSINESS BUNDLES ====================
        {
          id: 'business-starter',
          name: 'Starter Business',
          description: 'Perfect for new businesses establishing their online presence',
          price: '$600',
          tier: 'starter',
          features: [
            '1 Custom Landing Page',
            'Professional Hero Section',
            'About Us Section',
            'Services/Products Overview (up to 4)',
            'Contact Form with Email Notification',
            'Mobile Responsive Design',
            'Basic SEO Setup',
            'Social Media Links',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'business',
          backend: false,
          pages: ['Home'],
          includes: {
            pages: 1,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'business-professional',
          name: 'Professional Business',
          description: 'Comprehensive solution for established businesses',
          price: '$1,199',
          tier: 'professional',
          features: [
            '1 Premium Landing Page',
            'Custom Hero with Animation',
            'Detailed About Section',
            'Services Showcase (up to 8)',
            'Team/Staff Section',
            'Client Testimonials Slider',
            'FAQ Accordion Section',
            'Contact Form + Google Maps',
            'Advanced SEO Optimization',
            'Google Analytics Integration',
            'Social Media Integration',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'business',
          backend: false,
          pages: ['Home'],
          includes: {
            pages: 1,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'business-premium',
          name: 'Premium Business',
          description: 'Full-featured business site with backend capabilities',
          price: '$1,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Admin Dashboard Access',
            'Content Management System',
            'Lead Capture & Management',
            'Appointment/Booking System',
            'Newsletter Signup Integration',
            'Live Chat Widget',
            'Performance Optimization',
            'Security Certificate (SSL)',
            'Database for Inquiries',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'business',
          backend: true,
          pages: ['Home', 'Dashboard'],
          includes: {
            pages: 1,
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system', 'basic-auth'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact', 'newsletter'],
            addons: ['seo-package', 'email-marketing'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },
        
        // ==================== PORTFOLIO BUNDLES ====================
        {
          id: 'portfolio-starter',
          name: 'Creative Portfolio',
          description: 'Simple showcase for creatives and freelancers',
          price: '$600',
          tier: 'starter',
          features: [
            '1 Portfolio Landing Page',
            'Hero with Your Best Work',
            'About Me Section',
            'Portfolio Grid (up to 6 projects)',
            'Contact Form',
            'Mobile Responsive',
            'Basic SEO',
            'Social Links',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'portfolio',
          backend: false,
          pages: ['Portfolio'],
          includes: {
            pages: 1,
            projects: 6,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'portfolio', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'portfolio-professional',
          name: 'Professional Portfolio',
          description: 'Stunning portfolio for serious creatives',
          price: '$1,199',
          tier: 'professional',
          features: [
            '1 Premium Portfolio Page',
            'Animated Hero Section',
            'Detailed About/Bio Section',
            'Portfolio Gallery (up to 15 projects)',
            'Project Category Filters',
            'Lightbox Image Viewer',
            'Client Testimonials',
            'Skills/Services Section',
            'Contact Form + Social Links',
            'Advanced SEO',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'portfolio',
          backend: false,
          pages: ['Portfolio'],
          includes: {
            pages: 1,
            projects: 15,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'portfolio', 'skills', 'testimonials', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'portfolio-premium',
          name: 'Premium Portfolio',
          description: 'Professional portfolio with client management',
          price: '$1,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Admin Dashboard',
            'Project Management System',
            'Client Portal Access',
            'File Upload/Download',
            'Inquiry Management',
            'Portfolio Analytics',
            'Password Protected Projects',
            'Resume/CV Download',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'portfolio',
          backend: true,
          pages: ['Portfolio', 'Dashboard'],
          includes: {
            pages: 1,
            projects: 'Unlimited',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['auth-storage', 'content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'portfolio', 'skills', 'testimonials', 'contact'],
            addons: ['seo-package'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },
        
        // ==================== BLOG BUNDLES ====================
        {
          id: 'blog-starter',
          name: 'Personal Blog',
          description: 'Simple blog for personal content creators',
          price: '$500',
          tier: 'starter',
          features: [
            'Blog Landing Page',
            'Featured Post Section',
            'Blog Post Grid (up to 10 posts)',
            'About Author Section',
            'Contact Form',
            'Mobile Responsive',
            'Basic SEO',
            'Social Sharing Buttons',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'blog',
          backend: true,
          pages: ['Blog'],
          includes: {
            pages: 1,
            posts: 10,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'blog', 'about', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'blog-professional',
          name: 'Content Blog',
          description: 'Feature-rich blog for content creators',
          price: '$1,199',
          tier: 'professional',
          features: [
            'Premium Blog Design',
            'Category/Tag System',
            'Search Functionality',
            'Related Posts Feature',
            'Newsletter Signup Form',
            'Author Profile Section',
            'Comment System',
            'Social Media Integration',
            'RSS Feed',
            'Advanced SEO Tools',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'blog',
          backend: true,
          pages: ['Blog'],
          includes: {
            pages: 1,
            posts: 'Unlimited',
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'blog', 'about', 'newsletter', 'contact'],
            addons: ['seo-package', 'content-writing'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'blog-premium',
          name: 'Premium Blog',
          description: 'Professional blogging platform with monetization',
          price: '$1,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Full Admin Dashboard',
            'Multi-Author Support',
            'Content Scheduling',
            'Analytics Dashboard',
            'Email Newsletter System',
            'Membership/Subscription Ready',
            'Ad Placement Zones',
            'Performance Optimization',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'blog',
          backend: true,
          pages: ['Blog', 'Dashboard'],
          includes: {
            pages: 1,
            posts: 'Unlimited',
            authors: 'Multiple',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system', 'basic-auth'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'blog', 'about', 'newsletter', 'contact'],
            addons: ['seo-package', 'content-writing', 'email-marketing'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },
        
        // ==================== LANDING PAGE BUNDLES ====================
        {
          id: 'landing-starter',
          name: 'Conversion Landing',
          description: 'Essential landing page for campaigns',
          price: '$399',
          tier: 'starter',
          features: [
            'Single Landing Page',
            'Compelling Hero Section',
            'Key Benefits List',
            'Call-to-Action Button',
            'Contact/Lead Form',
            'Mobile Responsive',
            'Basic SEO',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'landing',
          backend: false,
          pages: ['Landing'],
          includes: {
            pages: 1,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'features', 'cta', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'landing-professional',
          name: 'Marketing Landing',
          description: 'High-converting landing page',
          price: '$800',
          tier: 'professional',
          features: [
            'Premium Landing Design',
            'Animated Hero Section',
            'Feature/Benefit Showcase',
            'Testimonials Section',
            'Trust Badges/Logos',
            'Multiple CTA Sections',
            'Video Embed Support',
            'Lead Capture Form',
            'Thank You Page',
            'SEO & Speed Optimized',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'landing',
          backend: false,
          pages: ['Landing', 'Thank You'],
          includes: {
            pages: 2,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'features', 'testimonials', 'cta', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'landing-premium',
          name: 'Premium Landing',
          description: 'Advanced landing with lead management',
          price: '$1,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Admin Dashboard',
            'Lead Management System',
            'A/B Testing Ready',
            'Analytics Integration',
            'Email Automation Setup',
            'CRM Integration Ready',
            'Countdown Timer',
            'Exit Intent Popup',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'landing',
          backend: true,
          pages: ['Landing', 'Dashboard'],
          includes: {
            pages: 2,
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['basic-auth'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'features', 'testimonials', 'cta', 'contact'],
            addons: ['seo-package', 'email-marketing'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },
        
        // ==================== PRODUCT BUNDLES ====================
        {
          id: 'product-starter',
          name: 'Product Showcase',
          description: 'Simple product showcase page',
          price: '$700',
          tier: 'starter',
          features: [
            'Product Landing Page',
            'Hero with Product Image',
            'Product Description',
            'Key Features List',
            'Pricing Section',
            'Contact/Inquiry Form',
            'Mobile Responsive',
            'Basic SEO',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'product',
          backend: false,
          pages: ['Product'],
          includes: {
            pages: 1,
            products: 1,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'product', 'features', 'pricing', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'product-professional',
          name: 'Product Launch',
          description: 'Detailed product presentation',
          price: '$1,299',
          tier: 'professional',
          features: [
            'Premium Product Page',
            'Image Gallery/Slider',
            'Detailed Specifications',
            'Feature Comparison Table',
            'Customer Reviews Section',
            'FAQ Section',
            'Video Integration',
            'Multiple CTA Buttons',
            'Social Sharing',
            'Advanced SEO',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'product',
          backend: false,
          pages: ['Product'],
          includes: {
            pages: 1,
            products: 1,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'product', 'features', 'gallery', 'reviews', 'faq', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'product-premium',
          name: 'Product Premium',
          description: 'Product page with order management',
          price: '$1,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Admin Dashboard',
            'Order/Inquiry Management',
            'Customer Database',
            'Inventory Tracking',
            'Payment Integration Ready',
            'Email Notifications',
            'Analytics Dashboard',
            'Multiple Product Support',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'product',
          backend: true,
          pages: ['Product', 'Dashboard'],
          includes: {
            pages: 1,
            products: 'Multiple',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['auth-storage', 'content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'yes-store',
            storeOptions: ['product-catalog', 'order-management'],
            sections: ['hero', 'product', 'features', 'gallery', 'reviews', 'faq', 'contact'],
            addons: ['seo-package'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },
        
        // ==================== CUSTOM BUNDLES ====================
        {
          id: 'custom-starter',
          name: 'Tailored Solution',
          description: 'Tailored solution for unique needs',
          price: '$800',
          tier: 'starter',
          features: [
            'Custom Single Page Design',
            'Unique Layout & Style',
            'Core Sections (up to 5)',
            'Custom Graphics/Icons',
            'Contact Form',
            'Mobile Responsive',
            'Basic SEO',
            'Social Integration',
            '2 Rounds of Revisions'
          ],
          popular: false,
          category: 'custom',
          backend: false,
          pages: ['Custom'],
          includes: {
            pages: 1,
            sections: 5,
            revisions: 2,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'custom-professional',
          name: 'Bespoke Solution',
          description: 'Advanced custom solution',
          price: '$1,999',
          tier: 'professional',
          features: [
            'Fully Custom Design',
            'Unlimited Sections',
            'Custom Animations',
            'Interactive Elements',
            'Custom Forms',
            'Third-party Integrations',
            'Advanced SEO',
            'Performance Optimization',
            'Analytics Setup',
            '3 Rounds of Revisions'
          ],
          popular: true,
          category: 'custom',
          backend: false,
          pages: ['Custom'],
          includes: {
            pages: 1,
            sections: 'Unlimited',
            revisions: 3,
            support: '60 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'custom-premium',
          name: 'Custom Premium',
          description: 'Enterprise-level custom solution',
          price: '$4,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Full Admin Dashboard',
            'Custom Database Design',
            'API Development',
            'User Authentication',
            'Role-Based Access',
            'Real-time Features',
            'Advanced Security',
            'Scalable Architecture',
            '5 Rounds of Revisions',
            '120 Days Support'
          ],
          popular: false,
          category: 'custom',
          backend: true,
          pages: ['Custom', 'Dashboard', 'Admin'],
          includes: {
            pages: 'Multiple',
            revisions: 5,
            support: '120 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'custom-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation', 'workflow-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'team', 'contact'],
            addons: ['seo-package', 'maintenance-package'],
            hosting: 'premium',
            maintenance: 'premium'
          }
        }
      ],
      multi: [
        // ==================== BUDGET MULTI-PAGE BUNDLES ====================
        {
          id: 'budget-starter-mp',
          name: 'Starter Multi-Page Site',
          description: 'Essential multi-page website for small businesses',
          price: '$1,199',
          tier: 'budget',
          features: [
            '5-Page Business Website',
            'Mobile Responsive Design',
            'Contact Forms',
            'Basic Navigation',
            'SEO Setup'
          ],
          popular: false,
          category: 'business',
          backend: false,
          pages: ['Home', 'About', 'Services', 'Portfolio', 'Contact'],
          includes: {
            pages: 5,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'contact'],
            addons: ['seo-package'],
            hosting: 'basic',
            maintenance: 'none'
          },
          budgetAddons: [
            { id: 'logo-design', name: 'Logo Design', price: 50, description: 'Professional logo design' },
            { id: 'favicon-design', name: 'Favicon Design', price: 25, description: 'Custom favicon for browser tab' },
            { id: 'social-media-setup', name: 'Social Media Setup', price: 25, description: 'Setup social media profiles' },
            { id: 'extra-revision', name: 'Extra Revision', price: 25, description: 'Additional round of revisions' },
            { id: 'basic-ecommerce', name: 'Basic E-commerce', price: 200, description: 'Simple online store with basic features' }
          ]
        },
        {
          id: 'budget-essential-mp',
          name: 'Essential Multi-Page Site',
          description: 'Professional multi-page with enhanced features',
          price: '$1,799',
          tier: 'budget',
          features: [
            '7-Page Business Website',
            'Mobile Responsive Design',
            'Advanced Contact Forms',
            'Professional Navigation',
            'SEO Optimization',
            'Basic Analytics'
          ],
          popular: true,
          category: 'business',
          backend: true,
          pages: ['Home', 'About', 'Services', 'Portfolio', 'Testimonials', 'FAQ', 'Contact'],
          includes: {
            pages: 7,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['basic-auth', 'auth-storage'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'],
            addons: ['seo-package'],
            hosting: 'basic-hosting',
            maintenance: 'basic'
          },
          budgetAddons: [
            { id: 'logo-design', name: 'Logo Design', price: 50, description: 'Professional logo design' },
            { id: 'favicon-design', name: 'Favicon Design', price: 25, description: 'Custom favicon for browser tab' },
            { id: 'social-media-setup', name: 'Social Media Setup', price: 25, description: 'Setup social media profiles' },
            { id: 'extra-revision', name: 'Extra Revision', price: 25, description: 'Additional round of revisions' },
            { id: 'basic-ecommerce', name: 'Basic E-commerce', price: 200, description: 'Simple online store with basic features' }
          ]
        },
        // ==================== BUSINESS MULTI-PAGE BUNDLES ====================
        {
          id: 'business-starter-mp',
          name: 'Business Starter Site',
          description: 'Essential multi-page business website',
          price: '$1,799',
          tier: 'starter',
          features: [
            '5-Page Business Website',
            'Professional Multi-Page Design',
            'Home Page with Hero Section',
            'About Us Page',
            'Services/Products Page',
            'Contact Page with Form',
            'Navigation Menu System',
            'Mobile Responsive Design',
            'Basic SEO Setup',
            'Social Media Integration',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'business',
          backend: false,
          pages: ['Home', 'About', 'Services', 'Contact'],
          includes: {
            pages: 5,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'business-professional-mp',
          name: 'Business Professional Site',
          description: 'Complete multi-page business web presence',
          price: '$2,999',
          tier: 'professional',
          features: [
            '10-Page Business Website',
            'Premium Multi-Page Design',
            'Advanced Navigation System',
            'Home with Hero & Features',
            'About Us & Team Pages',
            'Services/Products Pages',
            'Portfolio/Case Studies',
            'Testimonials Page',
            'Blog Section',
            'Contact & Location Pages',
            'Advanced SEO Integration',
            'Analytics Setup',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'business',
          backend: true,
          pages: ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'],
          includes: {
            pages: 10,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system', 'auth-storage'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'team', 'blog', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },
        {
          id: 'business-premium-mp',
          name: 'Business Premium Site',
          description: 'Enterprise-level multi-page business solution',
          price: '$4,499',
          tier: 'premium',
          features: [
            'Everything in Professional',
            '15+ Page Website',
            'Admin Dashboard',
            'Customer Management System',
            'Advanced Analytics Dashboard',
            'Multi-Language Support Ready',
            'Advanced Security Features',
            'Performance Optimization',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'business',
          backend: true,
          pages: ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact', 'Admin'],
          includes: {
            pages: 15,
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'team', 'blog', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },

        // ==================== PORTFOLIO MULTI-PAGE BUNDLES ====================
        {
          id: 'portfolio-starter-mp',
          name: 'Starter Portfolio',
          description: 'Multi-page creative portfolio',
          price: '$1,499',
          tier: 'starter',
          features: [
            '5-Page Portfolio Website',
            'Creative Multi-Page Design',
            'Portfolio Gallery Page',
            'Individual Project Pages',
            'About Me/Studio Page',
            'Contact Page',
            'Mobile Responsive',
            'Basic SEO',
            'Social Media Integration',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'portfolio',
          backend: false,
          pages: ['Home', 'Portfolio', 'Projects', 'About', 'Contact'],
          includes: {
            pages: 5,
            projects: 'Unlimited',
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'portfolio', 'about', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'portfolio-professional',
          name: 'Professional Portfolio Site',
          description: 'Comprehensive multi-page portfolio',
          price: '$2,499',
          tier: 'professional',
          features: [
            '10-Page Portfolio Website',
            'Advanced Multi-Page Design',
            'Portfolio Gallery with Filters',
            'Detailed Project Pages',
            'Client Testimonials Page',
            'About & Team Pages',
            'Blog/News Section',
            'Contact & Inquiry Forms',
            'Advanced SEO',
            'Analytics Integration',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'portfolio',
          backend: true,
          pages: ['Home', 'Portfolio', 'Projects', 'About', 'Blog', 'Contact'],
          includes: {
            pages: 10,
            projects: 'Unlimited',
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'portfolio', 'testimonials', 'about', 'blog', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'portfolio-premium',
          name: 'Premium Portfolio Site',
          description: 'Professional portfolio with client management',
          price: '$3,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            '15+ Page Portfolio Website',
            'Client Portal Dashboard',
            'Project Management System',
            'File Upload/Download System',
            'Client Account Management',
            'Portfolio Analytics',
            'Password Protected Projects',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'portfolio',
          backend: true,
          pages: ['Home', 'Portfolio', 'Projects', 'About', 'Blog', 'Contact', 'Client Portal'],
          includes: {
            pages: 15,
            projects: 'Unlimited',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['auth-storage', 'content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'portfolio', 'testimonials', 'about', 'blog', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },

        // ==================== ECOMMERCE MULTI-PAGE BUNDLES ====================
        {
          id: 'ecommerce-starter-mp',
          name: 'Starter Ecommerce',
          description: 'Essential multi-page online store',
          price: '$2,999',
          tier: 'starter',
          features: [
            'Multi-Page Online Store',
            'Professional E-commerce Design',
            'Product Catalog Pages',
            'Product Detail Pages',
            'Shopping Cart System',
            'Checkout Process',
            'Customer Account Pages',
            'Order Management',
            'Mobile Responsive',
            'Basic SEO',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'ecommerce',
          backend: true,
          pages: ['Home', 'Products', 'Product Detail', 'Cart', 'Checkout', 'Account'],
          includes: {
            pages: 10,
            products: 50,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'yes-store',
            storeOptions: ['product-catalog', 'shopping-cart', 'payment-processing'],
            sections: ['hero', 'products', 'contact'],
            addons: [],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'ecommerce-professional-mp',
          name: 'Professional Ecommerce',
          description: 'Complete multi-page retail solution',
          price: '$4,999',
          tier: 'professional',
          features: [
            'Advanced Multi-Page Store',
            'Premium E-commerce Design',
            'Advanced Product Catalog',
            'Product Categories & Filters',
            'Advanced Shopping Cart',
            'Multiple Payment Options',
            'Customer Dashboard',
            'Order Management System',
            'Inventory Management',
            'Advanced SEO',
            'Analytics Integration',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'ecommerce',
          backend: true,
          pages: ['Home', 'Products', 'Categories', 'Product Detail', 'Cart', 'Checkout', 'Account', 'Admin'],
          includes: {
            pages: 15,
            products: 200,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'yes-store',
            storeOptions: ['product-catalog', 'shopping-cart', 'payment-processing', 'inventory-management', 'customer-accounts'],
            sections: ['hero', 'products', 'features', 'reviews', 'contact'],
            addons: ['seo-package'],
            hosting: 'premium',
            maintenance: 'basic'
          }
        },
        {
          id: 'ecommerce-premium-mp',
          name: 'Premium Ecommerce',
          description: 'Enterprise-level multi-page e-commerce solution',
          price: '$7,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            '20+ Page E-commerce Site',
            'Advanced Admin Dashboard',
            'Multi-Vendor Support Ready',
            'Advanced Analytics Dashboard',
            'Marketing Automation Tools',
            'Customer Relationship Management',
            'Advanced Security Features',
            'Performance Optimization',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'ecommerce',
          backend: true,
          pages: ['Home', 'Products', 'Categories', 'Product Detail', 'Cart', 'Checkout', 'Account', 'Admin', 'Dashboard'],
          includes: {
            pages: 20,
            products: 'Unlimited',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'custom-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation', 'workflow-automation'],
            store: 'yes-store',
            storeOptions: ['product-catalog', 'shopping-cart', 'payment-processing', 'inventory-management', 'customer-accounts', 'order-management'],
            sections: ['hero', 'products', 'features', 'reviews', 'faq', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'enterprise',
            maintenance: 'premium'
          }
        },

        // ==================== BLOG MULTI-PAGE BUNDLES ====================
        {
          id: 'blog-starter-mp',
          name: 'Starter Blog',
          description: 'Multi-page personal blog platform',
          price: '$1,499',
          tier: 'starter',
          features: [
            'Multi-Page Blog Website',
            'Blog Homepage Design',
            'Individual Post Pages',
            'Category Pages',
            'About Author Page',
            'Contact Page',
            'Mobile Responsive',
            'Basic SEO',
            'Social Sharing Integration',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'blog',
          backend: true,
          pages: ['Home', 'Blog', 'Post', 'Categories', 'About', 'Contact'],
          includes: {
            pages: 6,
            posts: 'Unlimited',
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'blog', 'about', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'blog-professional',
          name: 'Professional Blog',
          description: 'Feature-rich multi-page blog platform',
          price: '$2,499',
          tier: 'professional',
          features: [
            'Advanced Multi-Page Blog',
            'Premium Blog Design',
            'Advanced Category System',
            'Tag Management',
            'Search Functionality',
            'Author Profile Pages',
            'Newsletter Integration',
            'Comment System',
            'Advanced SEO',
            'Analytics Integration',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'blog',
          backend: true,
          pages: ['Home', 'Blog', 'Post', 'Categories', 'Tags', 'Authors', 'About', 'Contact'],
          includes: {
            pages: 8,
            posts: 'Unlimited',
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'blog', 'about', 'newsletter', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'blog-premium',
          name: 'Premium Blog',
          description: 'Professional multi-page blogging platform',
          price: '$3,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            '12+ Page Blog Platform',
            'Multi-Author Support',
            'Content Management Dashboard',
            'Advanced Analytics',
            'Email Newsletter System',
            'Membership/Subscription Ready',
            'Performance Optimization',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'blog',
          backend: true,
          pages: ['Home', 'Blog', 'Post', 'Categories', 'Tags', 'Authors', 'About', 'Contact', 'Admin', 'Dashboard'],
          includes: {
            pages: 12,
            posts: 'Unlimited',
            authors: 'Multiple',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'content-system'],
            ai: 'yes',
            aiFeatures: ['content-generation'],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'blog', 'about', 'newsletter', 'contact'],
            addons: ['seo-package', 'content-writing'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },

        // ==================== LANDING MULTI-PAGE BUNDLES ====================
        {
          id: 'landing-starter-mp',
          name: 'Starter Landing',
          description: 'Multi-page marketing campaign website',
          price: '$1,199',
          tier: 'starter',
          features: [
            'Multi-Page Landing Site',
            'Main Landing Page Design',
            'Feature/Service Pages',
            'Contact/Lead Capture Pages',
            'Thank You Pages',
            'Mobile Responsive',
            'Basic SEO',
            'Form Integration',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'landing',
          backend: false,
          pages: ['Home', 'Features', 'Contact', 'Thank You'],
          includes: {
            pages: 4,
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'features', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'landing-professional',
          name: 'Professional Landing',
          description: 'Complete multi-page marketing website',
          price: '$1,999',
          tier: 'professional',
          features: [
            'Advanced Multi-Page Marketing Site',
            'High-Converting Landing Pages',
            'Multiple Campaign Pages',
            'Lead Capture Forms',
            'A/B Testing Ready',
            'Analytics Integration',
            'Social Proof Pages',
            'Advanced SEO',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'landing',
          backend: true,
          pages: ['Home', 'Features', 'Testimonials', 'Pricing', 'Contact', 'Thank You'],
          includes: {
            pages: 8,
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['basic-auth'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'features', 'testimonials', 'pricing', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'landing-premium',
          name: 'Premium Landing',
          description: 'Enterprise-level multi-page marketing solution',
          price: '$5,499',
          tier: 'premium',
          features: [
            'Everything in Professional',
            '12+ Page Marketing Platform',
            'Advanced Analytics Dashboard',
            'Marketing Automation Tools',
            'Lead Management System',
            'A/B Testing Platform',
            'Performance Optimization',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'landing',
          backend: true,
          pages: ['Home', 'Features', 'Testimonials', 'Pricing', 'Contact', 'Admin', 'Dashboard'],
          includes: {
            pages: 12,
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system'],
            ai: 'yes',
            aiFeatures: ['smart-analytics'],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation', 'workflow-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'features', 'testimonials', 'pricing', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },

        // ==================== PRODUCT MULTI-PAGE BUNDLES ====================
        {
          id: 'product-starter',
          name: 'Starter Product',
          description: 'Multi-page product showcase website',
          price: '$1,699',
          tier: 'starter',
          features: [
            'Multi-Page Product Site',
            'Product Landing Page',
            'Product Detail Pages',
            'Features/Benefits Pages',
            'Gallery/Showcase Pages',
            'Contact/Inquiry Pages',
            'Mobile Responsive',
            'Basic SEO',
            '1 Round of Revisions'
          ],
          popular: false,
          category: 'product',
          backend: false,
          pages: ['Home', 'Product', 'Features', 'Gallery', 'Contact'],
          includes: {
            pages: 5,
            products: 'Multiple',
            revisions: 1,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'product', 'features', 'gallery', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'product-professional',
          name: 'Professional Product',
          description: 'Comprehensive multi-page product presentation',
          price: '$2,999',
          tier: 'professional',
          features: [
            'Advanced Multi-Page Product Site',
            'Premium Product Showcase',
            'Detailed Feature Pages',
            'Demo/Tutorial Pages',
            'Technical Specification Pages',
            'Customer Review Pages',
            'Support/FAQ Pages',
            'Advanced SEO',
            'Analytics Integration',
            '2 Rounds of Revisions'
          ],
          popular: true,
          category: 'product',
          backend: true,
          pages: ['Home', 'Product', 'Features', 'Demo', 'Reviews', 'Support', 'Contact'],
          includes: {
            pages: 8,
            products: 'Multiple',
            revisions: 2,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'product', 'features', 'reviews', 'faq', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'product-premium',
          name: 'Premium Product',
          description: 'Enterprise-level multi-page product platform',
          price: '$7,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            '12+ Page Product Platform',
            'Customer Dashboard',
            'Order Management Ready',
            'Advanced Analytics',
            'Demo/Tutorial System',
            'Customer Support Portal',
            'Performance Optimization',
            '3 Rounds of Revisions',
            '90 Days Support'
          ],
          popular: false,
          category: 'product',
          backend: true,
          pages: ['Home', 'Product', 'Features', 'Demo', 'Reviews', 'Support', 'Contact', 'Admin', 'Dashboard'],
          includes: {
            pages: 12,
            products: 'Multiple',
            revisions: 3,
            support: '90 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'content-system'],
            ai: 'yes',
            aiFeatures: ['ai-chatbot'],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation'],
            store: 'yes-store',
            storeOptions: ['product-catalog', 'order-management'],
            sections: ['hero', 'product', 'features', 'reviews', 'faq', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'premium',
            maintenance: 'standard'
          }
        },

        // ==================== CUSTOM MULTI-PAGE BUNDLES ====================
        {
          id: 'custom-starter-mp',
          name: 'Custom Starter',
          description: 'Tailored multi-page site',
          price: 'starting at $1,999',
          tier: 'starter',
          features: [
            'Custom Multi-Page Design',
            'Unique Layout System',
            'Core Pages (up to 8)',
            'Custom Navigation',
            'Contact Forms',
            'Mobile Responsive',
            'Basic SEO',
            'Social Integration',
            '2 Rounds of Revisions'
          ],
          popular: false,
          category: 'custom',
          backend: false,
          pages: ['Custom Pages'],
          includes: {
            pages: 8,
            revisions: 2,
            support: '30 days'
          },
          preselects: {
            backend: 'no',
            backendOptions: [],
            ai: 'no',
            aiFeatures: [],
            automation: 'no',
            automationFeatures: [],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'contact'],
            addons: [],
            hosting: 'basic-hosting',
            maintenance: 'none'
          }
        },
        {
          id: 'custom-professional',
          name: 'Custom Professional',
          description: 'Bespoke multi-page site',
          price: 'starting at $3,999',
          tier: 'professional',
          features: [
            'Fully Custom Multi-Page Design',
            'Unlimited Pages',
            'Custom Animations',
            'Interactive Elements',
            'Advanced Forms',
            'Third-party Integrations',
            'Advanced SEO',
            'Performance Optimization',
            'Analytics Setup',
            '3 Rounds of Revisions'
          ],
          popular: true,
          category: 'custom',
          backend: true,
          pages: ['Custom Pages'],
          includes: {
            pages: 'Unlimited',
            revisions: 3,
            support: '60 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['content-system'],
            ai: 'no',
            aiFeatures: [],
            automation: 'yes',
            automationFeatures: ['email-notifications'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'],
            addons: ['seo-package'],
            hosting: 'standard',
            maintenance: 'basic'
          }
        },
        {
          id: 'custom-premium',
          name: 'Custom Premium',
          description: 'Enterprise-level custom multi-page solution',
          price: '$7,999',
          tier: 'premium',
          features: [
            'Everything in Professional',
            'Bespoke Multi-Page System',
            'Custom Database Design',
            'API Development',
            'User Authentication',
            'Role-Based Access',
            'Real-time Features',
            'Advanced Security',
            'Scalable Architecture',
            '5 Rounds of Revisions',
            '120 Days Support'
          ],
          popular: false,
          category: 'custom',
          backend: true,
          pages: ['Custom', 'Admin', 'Dashboard'],
          includes: {
            pages: 'Unlimited',
            revisions: 5,
            support: '120 days'
          },
          preselects: {
            backend: 'yes',
            backendOptions: ['full-system', 'custom-system'],
            ai: 'yes',
            aiFeatures: ['ai-chatbot', 'workflow-automation'],
            automation: 'yes',
            automationFeatures: ['email-notifications', 'form-automation', 'workflow-automation'],
            store: 'no-store',
            storeOptions: [],
            sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'team', 'contact'],
            addons: ['seo-package', 'analytics-setup'],
            hosting: 'enterprise',
            maintenance: 'premium'
          }
        }
      ]
    };

    return bundles[type] || [];
  };

  const bundles = getAllBundles(websiteType);
  const filteredBundles = showBudgetBundles 
    ? bundles.filter(bundle => bundle.tier === 'budget')
    : bundles.filter(bundle => bundle.category === category && bundle.tier !== 'budget');
  
  // Store addon pricing by category and website type (bundle addon pricing)
  const getStoreAddonPrice = () => {
    // Check if selected bundle is a budget bundle
    const selectedBundleData = bundles.find(b => b.id === selectedBundle);
    const isBudgetBundleSelected = selectedBundleData?.tier === 'budget';
    
    if (isBudgetBundleSelected) {
      // Budget-friendly pricing for budget bundles
      return { price: '+$199', description: 'Simple online store for budget bundles' };
    }
    
    // Bundle addon pricing - $450 for regular bundles as requested
    const singlePagePrices = {
      business: { price: '+$450', description: 'Add checkout to your business bundle' },
      portfolio: { price: '+$450', description: 'Add selling features to your portfolio' },
      blog: { price: '+$450', description: 'Add merchandise to your blog bundle' },
      landing: { price: '+$450', description: 'Add products to your landing page' },
      product: { price: '+$450', description: 'Add purchase options to your product bundle' },
      creative: { price: '+$450', description: 'Add sales to your creative bundle' },
      restaurant: { price: '+$450', description: 'Add ordering to your restaurant bundle' },
      custom: { price: '+$450', description: 'Add custom store to your solution bundle' }
    };
    const multiPagePrices = {
      business: { price: '+$450', description: 'Add e-commerce to your business site' },
      portfolio: { price: '+$450', description: 'Add shop to your portfolio site' },
      blog: { price: '+$450', description: 'Add store to your blog platform' },
      landing: { price: '+$450', description: 'Add sales to your landing site' },
      product: { price: '+$450', description: 'Add catalog to your product site' },
      ecommerce: { price: '+$450', description: 'Enhance your e-commerce bundle' },
      creative: { price: '+$450', description: 'Add marketplace to your creative site' },
      restaurant: { price: '+$450', description: 'Add ordering to your restaurant chain' },
      custom: { price: '+$450', description: 'Add platform to your custom site' }
    };
    const prices = websiteType === 'single' ? singlePagePrices : multiPagePrices;
    return prices[category] || { price: '+$450', description: 'Add e-commerce to your bundle' };
  };
  
  // Check if selected bundle already has store
  const selectedBundleData = bundles.find(b => b.id === selectedBundle);
  const bundleAlreadyHasStore = selectedBundleData?.preselects?.store === 'yes-store';

  return (
    <>
      <Head>
        <title>Step 3: Choose Your Bundle - Mellow Quote</title>
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
        
        <div className="relative z-10 w-full max-w-6xl">
          <div className="fade-in">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-3">
                Step 3: Choose Your Website Bundle
              </p>
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {websiteType === 'single' ? '📄 Single Page' : '📑 Multi Page'} → {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center">Select Your Package</h2>
                  <button
                    onClick={() => setShowBudgetBundles(!showBudgetBundles)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      showBudgetBundles 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {showBudgetBundles ? '💰 Budget' : '💰 Show Budget'}
                  </button>
                </div>
                <p className="text-gray-600 text-center text-xs sm:text-sm">
                  {showBudgetBundles 
                    ? `Affordable options for quick ${websiteType === 'single' ? 'single-page' : 'multi-page'} websites`
                    : 'Choose the perfect bundle for your needs'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {filteredBundles.map((bundle) => {
                  const tierColors = {
                    budget: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-400', icon: '💰' },
                    starter: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: '🌱' },
                    professional: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-400', icon: '⭐' },
                    premium: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-400', icon: '👑' }
                  };
                  const tierStyle = tierColors[bundle.tier] || tierColors.starter;
                  
                  return (
                  <div
                    key={bundle.id}
                    onClick={() => toggleBundle(bundle.id)}
                    className={`relative p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedBundle === bundle.id
                        ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200'
                        : bundle.popular 
                          ? 'border-blue-400 bg-blue-50/50 hover:shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    {/* Popular Badge */}
                    {bundle.popular && (
                      <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                          ⭐ <span className="hidden sm:inline">MOST </span>POPULAR
                        </span>
                      </div>
                    )}
                    
                    {/* Selected Badge */}
                    {selectedBundle === bundle.id && (
                      <div className="absolute -top-2 sm:-top-3 right-2 sm:right-3">
                        <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1">
                          ✓
                        </span>
                      </div>
                    )}
                    
                    {/* Tier Badge */}
                    <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 ${tierStyle.bg} ${tierStyle.text}`}>
                      <span>{tierStyle.icon}</span>
                      <span className="uppercase">{bundle.tier}</span>
                    </div>
                    
                    {/* Bundle Name & Price */}
                    <div className="mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1">{bundle.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg sm:text-3xl font-bold text-blue-600">{bundle.price}</span>
                        <span className="text-gray-500 text-[10px] sm:text-sm">one-time</span>
                      </div>
                    </div>
                    
                    <p className="hidden sm:block text-gray-600 text-sm mb-4">{bundle.description}</p>
                    
                    {/* Backend Badge */}
                    {bundle.backend && (
                      <div className="mb-2 sm:mb-3">
                        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                          🔧 <span className="hidden sm:inline">Includes </span>Backend
                        </span>
                      </div>
                    )}
                    
                    {/* What's Included Summary - hidden on mobile */}
                    {bundle.includes && (
                      <div className="hidden sm:block bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-xs font-semibold text-gray-700 mb-2">📦 What's Included:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {bundle.includes.pages && (
                            <div className="flex items-center gap-1">
                              <span className="text-blue-500">📄</span>
                              <span>{bundle.includes.pages} Page{bundle.includes.pages !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                          {bundle.includes.revisions && (
                            <div className="flex items-center gap-1">
                              <span className="text-green-500">🔄</span>
                              <span>{bundle.includes.revisions} Revision{bundle.includes.revisions !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                          {bundle.includes.support && (
                            <div className="flex items-center gap-1">
                              <span className="text-purple-500">💬</span>
                              <span>{bundle.includes.support} Support</span>
                            </div>
                          )}
                          {bundle.includes.projects && (
                            <div className="flex items-center gap-1">
                              <span className="text-orange-500">🎨</span>
                              <span>{bundle.includes.projects} Project{typeof bundle.includes.projects === 'number' && bundle.includes.projects !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Features List - compact on mobile */}
                    <div className="hidden sm:block space-y-2 mb-4">
                      <div className="text-xs font-semibold text-gray-700">✨ Key Features:</div>
                      {bundle.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-xs">{feature}</span>
                        </div>
                      ))}
                      {bundle.features.length > 5 && (
                        <div className="text-blue-600 text-xs font-medium pl-6">
                          +{bundle.features.length - 5} more features included
                        </div>
                      )}
                    </div>
                    
                    {/* Mobile: Simple feature count */}
                    <div className="sm:hidden text-[10px] text-gray-500 mb-2">
                      ✨ {bundle.features.length} features included
                    </div>
                    
                    {/* Action Buttons - compact on mobile */}
                    <div className="flex gap-1 sm:gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalBundle(bundle);
                          setShowModal(true);
                        }}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBundle(bundle.id);
                        }}
                        className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-semibold transition-all ${
                          selectedBundle === bundle.id
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {selectedBundle === bundle.id ? '✓' : 'Select'}
                      </button>
                    </div>
                  </div>
                )})}
              </div>
              
              {/* Store Addon Toggle - Show for any bundle selected that doesn't already have store */}
              {selectedBundle && !bundleAlreadyHasStore && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">Add Store/E-commerce</h4>
                        <p className="text-xs text-gray-600">{getStoreAddonPrice().description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-purple-600 font-bold text-sm">{getStoreAddonPrice().price}</span>
                          <span className="text-xs text-gray-500">• Product catalog, cart, checkout</span>
                        </div>
                        {addStoreAddon && (
                          <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                            <p className="text-xs text-purple-700">
                              <span className="font-semibold">+$150/month</span> for backend & payment system setup
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              Includes secure payment processing, order management, and ongoing maintenance
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => setAddStoreAddon(!addStoreAddon)}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          addStoreAddon ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className="sr-only">Toggle store addon</span>
                        <div className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                          addStoreAddon ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                  {addStoreAddon && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <div className="flex items-center gap-2 text-xs text-purple-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Store will be added to your bundle with product catalog, shopping cart & secure checkout</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Show notice if bundle already includes store */}
              {selectedBundle && bundleAlreadyHasStore && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 text-sm">Store Already Included!</h4>
                      <p className="text-xs text-green-700">This bundle already includes full e-commerce functionality</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Budget Add-ons Section - Only show when budget bundles are displayed and one is selected */}
              {console.log('Budget add-ons section check - showBudgetBundles:', showBudgetBundles, 'selectedBundle:', selectedBundle, 'bundleTier:', selectedBundle && bundles.find(b => b.id === selectedBundle)?.tier) || showBudgetBundles && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  {selectedBundle && bundles.find(b => b.id === selectedBundle)?.tier === 'budget' ? (
                    <>
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Add Extra Services</h3>
                        <p className="text-xs text-gray-600">Optional add-ons for your budget website</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {budgetAddonOptions.map((addon) => (
                          <div
                            key={addon.id}
                            onClick={() => toggleBudgetAddon(addon.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              budgetAddons[addon.id]
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                                <span className="text-xs font-bold text-green-600">+${addon.price}</span>
                              </div>
                              <p className="text-xs text-gray-600">{addon.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              budgetAddons[addon.id]
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {budgetAddons[addon.id] && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {getBudgetAddonsTotal() > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Add-ons Total:</span>
                            <span className="text-sm font-bold text-green-600">+${getBudgetAddonsTotal()}</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Please select a budget bundle to see add-on options
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-3">
                {selectedBundle ? (
                  <>
                    <button
                      onClick={() => {
                        // Smart back navigation with preserved selection
                        if (fromPage === 'category') {
                          // Came from category page, go back there with current selections
                          const storeAddonParam = addStoreAddon ? '&storeAddon=true' : '';
                          router.push(`/step-2?type=${websiteType}&category=${category}&from=subcategory&bundle=${selectedBundle}${storeAddonParam}`);
                        } else if (fromPage === 'type') {
                          // Came from type page, go back there with current selections
                          const storeAddonParam = addStoreAddon ? '&storeAddon=true' : '';
                          router.push(`/?from=subcategory&type=${websiteType}&category=${category}&bundle=${selectedBundle}&clear=true${storeAddonParam}`);
                        } else {
                          // Default: go to category page with current selections
                          const storeAddonParam = addStoreAddon ? '&storeAddon=true' : '';
                          router.push(`/step-2?type=${websiteType}&category=${category}&from=subcategory&bundle=${selectedBundle}${storeAddonParam}`);
                        }
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-base"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        // Find the selected bundle to get its preselects
                        const bundle = filteredBundles.find(b => b.id === selectedBundle);
                        const preselects = bundle?.preselects || {};
                        
                        // Check if this is a budget bundle that should skip to quote
                        if (bundle?.tier === 'budget') {
                          // Budget bundle - save add-ons and go straight to final quote step
                          const selectedBudgetAddons = budgetAddonOptions.filter(addon => budgetAddons[addon.id]);
                          
                          // Save budget add-ons to localStorage
                          if (typeof window !== 'undefined') {
                            const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                            if (selectedBudgetAddons.length > 0) {
                              currentSelections.step10 = {
                                step: 10,
                                name: 'Budget Add-ons',
                                value: selectedBudgetAddons.map(addon => addon.name).join(', '),
                                items: selectedBudgetAddons.map(addon => addon.id),
                                cost: getBudgetAddonsTotal()
                              };
                            } else {
                              delete currentSelections.step10;
                            }
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
                          }
                          
                          // Budget bundle - go straight to final quote page (step-13)
                          const params = new URLSearchParams({
                            type: websiteType,
                            category: category,
                            bundle: selectedBundle,
                            from: 'bundle'
                          });
                          // Add store addon parameter if enabled
                          if (addStoreAddon) {
                            params.set('storeAddon', 'true');
                          }
                          router.push(`/step-13?${params.toString()}`);
                          return;
                        }
                        
                        // Regular bundle - continue with normal flow
                        // Check if store addon is enabled (and bundle doesn't already have store)
                        const shouldAddStore = addStoreAddon && preselects.store !== 'yes-store';
                        
                        // Category-specific store options when adding store addon
                        const categoryStoreOptions = {
                          business: ['basic-products', 'shopping-cart', 'payment-processing', 'invoice-system'],
                          portfolio: ['basic-products', 'shopping-cart', 'payment-processing', 'digital-downloads'],
                          blog: ['basic-products', 'shopping-cart', 'payment-processing', 'digital-products'],
                          landing: ['basic-products', 'shopping-cart', 'payment-processing'],
                          product: ['basic-products', 'shopping-cart', 'payment-processing', 'product-configurator'],
                          ecommerce: ['basic-products', 'shopping-cart', 'payment-processing', 'inventory-management', 'order-management'],
                          creative: ['basic-products', 'shopping-cart', 'payment-processing', 'licensing-system']
                        };
                        const defaultStoreOptions = categoryStoreOptions[category] || ['basic-products', 'shopping-cart', 'payment-processing'];
                        
                        // Build URL with preselects encoded
                        const params = new URLSearchParams({
                          type: websiteType,
                          category: category,
                          bundle: selectedBundle,
                          from: 'bundle',
                          // Pass preselects as individual params for easier reading in subsequent steps
                          bp_backend: preselects.backend || 'no',
                          bp_backendOptions: (preselects.backendOptions || []).join(','),
                          bp_ai: preselects.ai || 'no',
                          bp_aiFeatures: (preselects.aiFeatures || []).join(','),
                          bp_automation: preselects.automation || 'no',
                          bp_automationFeatures: (preselects.automationFeatures || []).join(','),
                          // If store addon enabled, set store to yes-store
                          bp_store: shouldAddStore ? 'yes-store' : (preselects.store || 'no-store'),
                          bp_storeOptions: shouldAddStore ? defaultStoreOptions.join(',') : (preselects.storeOptions || []).join(','),
                          bp_sections: (preselects.sections || []).join(','),
                          bp_addons: (preselects.addons || []).join(','),
                          bp_hosting: preselects.hosting || 'basic-hosting',
                          bp_maintenance: preselects.maintenance || 'none',
                          // Track if store was added as addon
                          storeAddon: shouldAddStore ? 'true' : 'false'
                        });
                        
                        params.set('from', 'bundle');
                        
                        router.push(`/step-4?${params.toString()}`);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-base"
                    >
                      Continue →
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        // Smart back navigation with preserved selection
                        if (fromPage === 'category') {
                          // Came from category page, go back there with current selections
                          router.push(`/step-2?type=${websiteType}&category=${category}&from=subcategory`);
                        } else if (fromPage === 'type') {
                          // Came from type page, go back there with current selections
                          router.push(`/?from=subcategory&type=${websiteType}&category=${category}&clear=true`);
                        } else {
                          // Default: go to category page with current selections
                          router.push(`/step-2?type=${websiteType}&category=${category}&from=subcategory`);
                        }
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-base"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (websiteType === 'single') {
                          router.push(`/step-4?type=${websiteType}&category=${category}&from=subcategory`);
                        } else {
                          router.push(`/step-4?type=${websiteType}&category=${category}&from=subcategory`);
                        }
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-base"
                    >
                      Skip → Customize
                    </button>
                  </>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      
      {/* Bundle Details Modal */}
      {showModal && modalBundle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{modalBundle.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{modalBundle.price}</div>
                  <p className="text-gray-600">{modalBundle.description}</p>
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
              {/* Pages Included */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Pages Included</h4>
                <div className="flex flex-wrap gap-2">
                  {modalBundle.pages.map((page, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {page}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* All Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">All Features Included</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {modalBundle.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* What's Included Summary */}
              {modalBundle.includes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Package Includes</h4>
                <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {modalBundle.includes.pages && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{modalBundle.includes.pages}</div>
                      <div className="text-xs text-gray-600">Page{modalBundle.includes.pages !== 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {modalBundle.includes.revisions && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{modalBundle.includes.revisions}</div>
                      <div className="text-xs text-gray-600">Revision{modalBundle.includes.revisions !== 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {modalBundle.includes.support && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{modalBundle.includes.support.replace(' days', '')}</div>
                      <div className="text-xs text-gray-600">{modalBundle.includes.support.includes('days') ? 'Days Support' : 'Support'}</div>
                    </div>
                  )}
                  {modalBundle.includes.projects && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{modalBundle.includes.projects}</div>
                      <div className="text-xs text-gray-600">Project{typeof modalBundle.includes.projects === 'number' && modalBundle.includes.projects !== 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
              </div>
              )}
              
              {/* Backend Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Technical Requirements</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className={`w-4 h-4 mr-2 ${modalBundle.backend ? 'text-orange-500' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">
                      {modalBundle.backend ? 'Backend Required' : 'Frontend Only'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {modalBundle.backend 
                      ? 'This bundle requires a backend for features like user accounts, content management, or booking systems.'
                      : 'This bundle can be built with frontend technologies only.'}
                  </p>
                </div>
              </div>
              
              {/* Future Add-ons - Only show for non-budget bundles */}
              {modalBundle.tier !== 'budget' && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Available Add-ons</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Content Writing
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Logo Design
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Hosting Setup
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Domain Registration
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Maintenance Plan
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SEO Services
                  </div>
                </div>
              )}
              
              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toggleBundle(modalBundle.id);
                    setShowModal(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedBundle === modalBundle.id
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedBundle === modalBundle.id ? '✓ Selected' : 'Select This Bundle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
