import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { STORAGE_KEY } from '../utils/quote-storage';

// Step names for display
const STEP_NAMES = {
  1: 'Website Type',
  2: 'Category',
  3: 'Subcategory', 
  4: 'Bundle Selection',
  5: 'Backend',
  6: 'Backend Options',
  7: 'AI Features',
  8: 'Store',
  9: 'Sections/Pages',
  10: 'Add-ons',
  11: 'Hosting',
  12: 'Maintenance',
  13: 'Summary'
};

// Cost maps for calculating running totals
const baseCosts = {
  'single': { 'business': 1500, 'portfolio': 1200, 'blog': 1400, 'landing': 1000, 'product': 1300, 'custom': 1800, 'restaurant': 1600 },
  'multi': { 'business': 3000, 'portfolio': 2500, 'blog': 2200, 'landing': 2000, 'product': 2800, 'custom': 4000, 'ecommerce': 5000 }
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
  'stats': { name: 'Stats & Numbers', cost: 75 },
  'case-studies': { name: 'Case Studies', cost: 200 },
  'clients': { name: 'Clientele', cost: 100 },
  'product': { name: 'Product Demo', cost: 200 },
  'traction': { name: 'Traction & Metrics', cost: 150 },
  'menu': { name: 'Menu', cost: 300 },
  'reservations': { name: 'Reservations', cost: 400 },
  'events': { name: 'Events', cost: 300 },
  'location-hours': { name: 'Location & Hours', cost: 150 },
  'blog-articles': { name: 'Blog Articles (initial setup)', cost: 300 },
  'collections': { name: 'Collections', cost: 300 },
  'skills': { name: 'Skills', cost: 200 },
  'process': { name: 'How It Works', cost: 100 },
  'newsletter': { name: 'Newsletter', cost: 200 },
  'cta': { name: 'Call-to-Action Section', cost: 50 },
  'video': { name: 'Video Section', cost: 150 },
  'partners': { name: 'Partners & Clients', cost: 75 },
  'features': { name: 'Features', cost: 250 },
  'reviews': { name: 'Reviews', cost: 200 },
  'blog': { name: 'Blog Preview', cost: 250 },
  'specials': { name: 'Daily Specials', cost: 200 },
  'chef': { name: 'Meet the Chef', cost: 250 },
  'order-online': { name: 'Online Ordering', cost: 500 },
  'gift-cards': { name: 'Gift Cards', cost: 300 },
  'map': { name: 'Location Map', cost: 75 },
  // Additional category-specific sections
  'blog-preview': { name: 'Blog/News Preview', cost: 100 },
  'social-feed': { name: 'Social Media Feed', cost: 100 },
  'how-it-works': { name: 'How It Works', cost: 100 },
  'value-prop': { name: 'Value Proposition', cost: 150 },
  'products': { name: 'Products', cost: 200 },
  'projects': { name: 'Projects', cost: 200 },
  'locations': { name: 'Locations', cost: 100 },
  'social': { name: 'Social Links', cost: 50 },
  'social-proof': { name: 'Social Proof', cost: 100 },
  'trust-badges': { name: 'Trust Badges', cost: 75 },
  'download': { name: 'Download Section', cost: 100 },
  'comparison': { name: 'Comparison Table', cost: 150 },
  'countdown': { name: 'Countdown Timer', cost: 100 },
  'integrations': { name: 'Integrations', cost: 200 },
  'support': { name: 'Support Section', cost: 150 },
  'resources': { name: 'Resources', cost: 150 },
  'screenshots': { name: 'Screenshots', cost: 150 },
  'search': { name: 'Search Function', cost: 100 },
  'categories': { name: 'Categories', cost: 100 },
  'comments': { name: 'Comments Section', cost: 150 },
  'featured-posts': { name: 'Featured Posts', cost: 100 },
  'recent-posts': { name: 'Recent Posts', cost: 100 },
  'equipment': { name: 'Equipment', cost: 200 },
  'shipping': { name: 'Shipping Info', cost: 100 },
  'size-guide': { name: 'Size Guide', cost: 100 },
  'wishlist-favorites': { name: 'Wishlist & Favorites', cost: 120 },
  'product-comparisons': { name: 'Product Comparisons', cost: 150 },
  'quick-view-modal': { name: 'Quick View Modal', cost: 100 },
  'related-products': { name: 'Related Products', cost: 150 },
  'order-tracking': { name: 'Order Tracking Portal', cost: 150 },
  'refund-management': { name: 'Refund Management', cost: 150 },
  'bulk-orders': { name: 'Bulk Orders', cost: 200 },
  'subscription-products': { name: 'Subscription Products', cost: 300 },
  'inventory-management': { name: 'Inventory Management (Advanced)', cost: 500 },
  'customer-accounts-advanced': { name: 'Customer Accounts (Advanced)', cost: 350 },
  'hero': { name: 'Hero Section', cost: 0 },
  'contact': { name: 'Contact Section', cost: 0 }
};

const addonCostMap = {
  'seo-package': { name: 'SEO', cost: 199, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$199' }, onetime: { price: '+$599' } } },
  'content-writing': { name: 'Content Writing', cost: 149, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$149' }, onetime: { price: '+$449' } } },
  'social-media-management': { name: 'Social Media', cost: 199, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$199' }, onetime: { price: '+$599' } } },
  'email-marketing': { name: 'Email Marketing', cost: 129, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$129' }, onetime: { price: '+$389' } } },
  'website-maintenance': { name: 'Maintenance', cost: 79, recurring: true, hasToggle: true, toggleOptions: { monthly: { price: '+$79' }, onetime: { price: '+$239' } } },
  'analytics-setup': { name: 'Analytics', cost: 149 },
  'security-package': { name: 'Security', cost: 59 },
  'speed-optimization': { name: 'Speed Optimization', cost: 99 },
  'full-care-plan': { name: 'Full Care Plan', cost: 199 },
  // Budget add-ons
  'social-media-setup': { name: 'Social Media Setup', cost: 25 },
  'logo-design': { name: 'Logo Design', cost: 50 },
  'favicon-design': { name: 'Favicon Design', cost: 25 },
  'extra-revision': { name: 'Extra Revision', cost: 25 },
  'basic-ecommerce': { name: 'Basic E-commerce', cost: 200 },
  'branding-package': { name: 'Complete Branding Package', cost: 899, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$400' }, onetime: { price: '+$899' }, all: { price: '+$2,500' } } },
  'hosting-setup': { name: 'Website Hosting Setup', cost: 100, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$100' }, onetime: { price: '+$300' } } },
  'domain-registration': { name: 'Domain Registration', cost: 25, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$25' }, onetime: { price: '+$75' } } },
  'email-marketing-setup': { name: 'Email Marketing Setup', cost: 300, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$300' } } },
  'google-ads-setup': { name: 'Google Ads Setup', cost: 450, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$450' }, onetime: { price: '+$1,350' } } },
  'facebook-ads-setup': { name: 'Facebook Ads Setup', cost: 400, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$400' }, onetime: { price: '+$1,200' } } },
  'video-production': { name: 'Video Production', cost: 800, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$300' }, onetime: { price: '+$800' }, all: { price: '+$2,500' } } },
  'photography': { name: 'Professional Photography', cost: 650, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$250' }, onetime: { price: '+$650' }, all: { price: '+$1,800' } } },
  'copywriting': { name: 'Professional Copywriting', cost: 300, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$300' } } },
  'translation-services': { name: 'Translation Services', cost: 250, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$120' }, onetime: { price: '+$250' } } },
  'accessibility-audit': { name: 'Accessibility Audit', cost: 400, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$200' }, onetime: { price: '+$400' } } },
  'performance-optimization': { name: 'Performance Optimization', cost: 350, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$150' }, onetime: { price: '+$350' } } },
  'security-audit': { name: 'Security Audit', cost: 450, recurring: false, hasToggle: true, toggleOptions: { monthly: { price: '+$250' }, onetime: { price: '+$450' } } }
};

const backendCostMap = {
  'basic-auth': { name: 'Basic Authentication', cost: 250 },
  'auth-storage': { name: 'Auth & Storage', cost: 400 },
  'api-backend': { name: 'API Backend', cost: 600 },
  'secure-system': { name: 'Secure System', cost: 600 },
  'full-system': { name: 'Complete System', cost: 800 },
  'content-system': { name: 'Content Management (CMS)', cost: 500 },
  'ecommerce-backend': { name: 'E-commerce Backend', cost: 900 },
  'custom-system': { name: 'Custom Solution', cost: 1200 }
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
  'inventory-tracking': { name: 'Inventory Tracking', cost: 250 },
  'shipping-calculator': { name: 'Shipping Calculator', cost: 150 },
  'customer-accounts': { name: 'Customer Accounts (Basic)', cost: 200 },
  'tax-calculator': { name: 'Tax Calculator', cost: 120 },
  'discount-coupons': { name: 'Discount & Coupons', cost: 150 },
  'product-reviews': { name: 'Product Reviews', cost: 150 },
  'email-notifications': { name: 'Email Notifications', cost: 120 },
  'analytics-dashboard': { name: 'Analytics Dashboard', cost: 200 },
  'wishlist-favorites': { name: 'Wishlist & Favorites', cost: 120 },
  'product-comparisons': { name: 'Product Comparisons', cost: 150 },
  'quick-view-modal': { name: 'Quick View Modal', cost: 100 },
  'related-products': { name: 'Related Products', cost: 150 },
  'order-tracking': { name: 'Order Tracking Portal', cost: 150 },
  'refund-management': { name: 'Refund Management', cost: 150 },
  'bulk-orders': { name: 'Bulk Orders', cost: 200 },
  'gift-cards': { name: 'Gift Cards', cost: 150 },
  'subscription-products': { name: 'Subscription Products', cost: 300 },
  'inventory-management': { name: 'Inventory Management (Advanced)', cost: 500 },
  'customer-accounts-advanced': { name: 'Customer Accounts (Advanced)', cost: 350 }
};

const hostingCostMap = {
  'basic': { name: 'Basic Hosting', monthly: 25 },
  'standard': { name: 'Standard Hosting', monthly: 45 },
  'professional': { name: 'Professional Hosting', monthly: 65 },
  'enterprise': { name: 'Enterprise Hosting', monthly: 95 },
  'basic-hosting': { name: 'Basic Hosting', monthly: 50 },
  'standard-hosting': { name: 'Standard Hosting', monthly: 45 },
  'professional-hosting': { name: 'Professional Hosting', monthly: 65 },
  'enterprise-hosting': { name: 'Enterprise Hosting', monthly: 95 }
};

const maintenanceCostMap = {
  'no-maintenance': { name: 'No Maintenance', monthly: 0 },
  'basic-maintenance': { name: 'Basic Maintenance', monthly: 79 },
  'professional-maintenance': { name: 'Professional Maintenance', monthly: 149 },
  'enterprise-maintenance': { name: 'Enterprise Maintenance', monthly: 299 }
};

const bundlePrices = {
  // Budget bundles (single page only)
  'budget-starter': 400, 'budget-essential': 600,
  // Budget bundles (multi page)
  'budget-starter-mp': 1199, 'budget-essential-mp': 1799,
  // Single page bundles
  'business-starter-sp': 600, 'business-professional-sp': 1199, 'business-premium-sp': 1999,
  'portfolio-starter-sp': 600, 'portfolio-professional-sp': 1199, 'portfolio-premium-sp': 1999,
  'blog-starter-sp': 500, 'blog-professional-sp': 1199, 'blog-premium-sp': 1999,
  'landing-starter-sp': 399, 'landing-professional-sp': 800, 'landing-premium-sp': 1999,
  'product-starter-sp': 700, 'product-professional-sp': 1299, 'product-premium-sp': 1999,
  'custom-starter-sp': 800, 'custom-professional-sp': 1999, 'custom-premium-sp': 4999,
  'restaurant-starter-sp': 700, 'restaurant-professional-sp': 1399, 'restaurant-premium-sp': 1999,
  // Multi page bundles
  'business-starter-mp': 1799, 'business-professional-mp': 2999, 'business-premium-mp': 4499,
  'portfolio-starter-mp': 1499, 'portfolio-professional-mp': 2499, 'portfolio-premium-mp': 3999,
  'ecommerce-starter-mp': 2999, 'ecommerce-professional-mp': 4999, 'ecommerce-premium-mp': 7999,
  'blog-starter-mp': 1499, 'blog-professional-mp': 2499, 'blog-premium-mp': 3999,
  'landing-starter-mp': 1199, 'landing-professional-mp': 1999, 'landing-premium-mp': 4999,
  'product-starter-mp': 1699, 'product-professional-mp': 2999, 'product-premium-mp': 4999,
  'custom-starter-mp': 1999, 'custom-professional-mp': 3999, 'custom-premium-mp': 7999
};

export default function MobileCostSummary() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selections, setSelections] = useState({});
  const [shouldShow, setShouldShow] = useState(true); // Start with true since we show on all steps
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Get section price from step-9 pricing structure
  const getSectionPrice = (sectionId) => {
    // This should match the pricing logic in step-9.js
    // For now, we'll use the sectionCostMap but it should be synchronized with step-9.js prices
    return sectionCostMap[sectionId]?.cost || 0;
  };
  const validatePromo = (promoCode) => {
    // If promo is already validated in localStorage, trust that
    if (selections.promo?.applied && selections.promo?.code) {
      return true;
    }
    // Simple validation - accept common promo codes (these match the hashed codes in step-13)
    const validPromos = ['2026', 'launch', 'special', 'SAVE10', 'WELCOME10', 'DISCOUNT10', 'PROMO10'];
    return validPromos.includes(promoCode.toLowerCase()) || validPromos.includes(promoCode.toUpperCase());
  };

  const getQueryValue = (value, fallback = '') => {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }
    return value ?? fallback;
  };

  const getQueryList = (value) => {
    const rawValue = getQueryValue(value, '');
    return rawValue ? rawValue.split(',') : [];
  };

  // Get sorted steps for display
  const getSortedSteps = () => {
    const steps = Object.values(selections)
      .filter(item => item.step && item.name) // Filter out debugging properties
      .sort((a, b) => a.step - b.step);
    return steps;
  };

  // Extract all query params (moved here to fix temporal dead zone)
  const websiteType = getQueryValue(router.query.type, 'single');
  const category = getQueryValue(router.query.category, '');
  const subcategory = getQueryValue(router.query.subcategory, '');
  const backend = getQueryValue(router.query.backend, '');
  const aiChoice = getQueryValue(router.query.ai, '');
  const automation = getQueryValue(router.query.automation, '');
  const store = getQueryValue(router.query.store, '');
  const storeOptions = getQueryList(router.query.storeOptions);
  const features = getQueryList(router.query.features);
  const addons = getQueryList(router.query.addons);
  const hosting = getQueryValue(router.query.hosting, '');
  const domain = getQueryValue(router.query.domain, '');
  const maintenance = getQueryValue(router.query.maintenance, '');
  const bundle = getQueryValue(router.query.bundle, '');
  const urlPromoCode = getQueryValue(router.query.promo, '');
  const storeAddon = getQueryValue(router.query.storeAddon, ''); // Track if store was added as bundle addon

  console.log('=== URL PARAMETERS DEBUG ===');
  console.log('router.query:', router.query);
  console.log('bundle:', bundle);
  console.log('websiteType:', websiteType);
  console.log('store:', store);
  console.log('storeAddon:', storeAddon);
  console.log('storeOptions:', storeOptions);
  console.log('=== END URL DEBUG ===');

  // Helper functions for budget bundle detection (moved here to fix temporal dead zone)
  const isBudgetBundle = (bundleId) => {
    const budgetBundleIds = ['budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'];
    return budgetBundleIds.includes(bundleId);
  };
  
  // Get regular bundle included sections
  const getRegularBundleSections = (bundleId) => {
    if (!bundleId || isBudgetBundle(bundleId)) return [];
    
    // Determine the bundle key (with or without suffix)
    const bundleKey = bundleId;
    const bundleKeyWithSuffix = websiteType === 'multi' ? `${bundleId}-mp` : `${bundleId}-sp`;
    
    // Regular bundle included sections (matching step-3.js preselects)
    const regularBundleSections = {
      // Single-page bundles
      'business-starter-sp': ['hero', 'about', 'services', 'contact'],
      'business-professional-sp': ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact'],
      'business-premium-sp': ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact', 'newsletter'],
      'portfolio-starter-sp': ['hero', 'about', 'portfolio', 'contact'],
      'portfolio-professional-sp': ['hero', 'about', 'portfolio', 'skills', 'testimonials', 'contact'],
      'portfolio-premium-sp': ['hero', 'about', 'portfolio', 'skills', 'testimonials', 'contact'],
      'blog-starter-sp': ['hero', 'blog', 'about', 'contact'],
      'blog-professional-sp': ['hero', 'blog', 'about', 'newsletter', 'contact'],
      'blog-premium-sp': ['hero', 'blog', 'about', 'newsletter', 'contact'],
      'landing-starter-sp': ['hero', 'features', 'cta', 'contact'],
      'landing-professional-sp': ['hero', 'features', 'testimonials', 'cta', 'contact'],
      'landing-premium-sp': ['hero', 'features', 'testimonials', 'cta', 'contact'],
      'product-starter-sp': ['hero', 'product', 'features', 'pricing', 'contact'],
      'product-professional-sp': ['hero', 'product', 'features', 'pricing', 'gallery', 'reviews', 'faq', 'contact'],
      'product-premium-sp': ['hero', 'product', 'features', 'pricing', 'gallery', 'reviews', 'faq', 'contact'],
      'custom-starter-sp': ['hero', 'about', 'services', 'contact'],
      'custom-professional-sp': ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'],
      'custom-premium-sp': ['hero', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'],
      'restaurant-starter-sp': ['hero', 'about', 'menu', 'contact'],
      'restaurant-professional-sp': ['hero', 'about', 'menu', 'reservations', 'testimonials', 'gallery', 'contact'],
      'restaurant-premium-sp': ['hero', 'about', 'menu', 'reservations', 'testimonials', 'gallery', 'events', 'contact'],
      // Multi-page bundles
      'business-starter-mp': ['hero', 'about', 'services', 'portfolio', 'contact'],
      'business-professional-mp': ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'portfolio', 'contact'],
      'business-premium-mp': ['hero', 'about', 'services', 'team', 'testimonials', 'faq', 'portfolio', 'newsletter', 'contact'],
      'portfolio-starter-mp': ['hero', 'about', 'portfolio', 'contact'],
      'portfolio-professional-mp': ['hero', 'about', 'portfolio', 'skills', 'testimonials', 'contact'],
      'portfolio-premium-mp': ['hero', 'about', 'portfolio', 'skills', 'testimonials', 'contact'],
      'blog-starter-mp': ['hero', 'blog', 'about', 'contact'],
      'blog-professional-mp': ['hero', 'blog', 'about', 'newsletter', 'contact'],
      'blog-premium-mp': ['hero', 'blog', 'about', 'newsletter', 'contact'],
      'landing-starter-mp': ['hero', 'features', 'cta', 'contact'],
      'landing-professional-mp': ['hero', 'features', 'testimonials', 'cta', 'contact'],
      'landing-premium-mp': ['hero', 'features', 'testimonials', 'cta', 'contact'],
      'product-starter-mp': ['hero', 'product', 'features', 'pricing', 'contact'],
      'product-professional-mp': ['hero', 'product', 'features', 'pricing', 'gallery', 'reviews', 'faq', 'contact'],
      'product-premium-mp': ['hero', 'product', 'features', 'pricing', 'gallery', 'reviews', 'faq', 'contact'],
      'custom-starter-mp': ['hero', 'about', 'services', 'contact'],
      'custom-professional-mp': ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'],
      'custom-premium-mp': ['hero', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'],
      'ecommerce-starter-mp': ['hero', 'about', 'services', 'portfolio', 'contact'],
      'ecommerce-professional-mp': ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'],
      'ecommerce-premium-mp': ['hero', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'],
    };
    
    // Try with suffix first, then without
    return regularBundleSections[bundleKeyWithSuffix] || regularBundleSections[bundleKey] || [];
  };
  
  const getBudgetBundleDetails = (bundleId) => {
    const budgetBundles = {
      'budget-starter': {
        name: 'Starter One-Pager',
        included: {
          sections: ['hero', 'contact'],
          backend: 'no',
          backendOptions: [],
          automation: 'no',
          automationFeatures: [],
          store: 'no-store',
          storeOptions: [],
          hosting: 'basic',
          maintenance: 'none'
        },
        features: [
          'Single Clean Page',
          'Mobile Responsive Design', 
          'Fast Loading',
          'Contact or Call Button',
          '1 Round of Revisions',
          'Basic SEO Setup',
          'Monthly Services: $25 Basic Hosting = $25/mo'
        ]
      },
      'budget-essential': {
        name: 'Essential Website',
        included: {
          sections: ['hero'],
          backend: 'yes',
          backendOptions: ['basic-auth', 'auth-storage'],
          automation: 'yes',
          automationFeatures: ['email-notifications'],
          store: 'no-store',
          storeOptions: [],
          hosting: 'basic-hosting',
          maintenance: 'none'
        },
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
          'Basic SEO Setup',
          'Monthly Services: $25 Basic Hosting + $25 Backend & Automation = $50/mo'
        ]
      },
      'budget-starter-mp': {
        name: 'Starter Multi-Page Site',
        included: {
          sections: ['hero', 'about', 'services', 'portfolio', 'contact'],
          backend: 'no',
          backendOptions: [],
          automation: 'no',
          automationFeatures: [],
          store: 'no-store',
          storeOptions: [],
          hosting: 'basic',
          maintenance: 'none'
        },
        features: [
          '5-Page Business Website',
          'Mobile Responsive Design',
          'Contact Forms',
          'Basic Navigation', 
          'SEO Setup',
          'Monthly Services: $25 Basic Hosting = $25/mo'
        ]
      },
      'budget-essential-mp': {
        name: 'Essential Multi-Page Site',
        included: {
          sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'],
          backend: 'yes',
          backendOptions: ['basic-auth', 'auth-storage'],
          automation: 'yes',
          automationFeatures: ['email-notifications'],
          store: 'no-store',
          storeOptions: [],
          hosting: 'basic-hosting',
          maintenance: 'basic'
        },
        features: [
          '7-Page Business Website',
          'Mobile Responsive Design',
          'Advanced Contact Forms',
          'Professional Navigation',
          'SEO Optimization',
          'Basic Analytics',
          'Monthly Services: $25 Basic Hosting + $25 Backend & Automation = $50/mo'
        ]
      }
    };
    return budgetBundles[bundleId];
  };

  // Calculate sorted steps 
  const sortedSteps = getSortedSteps();
  const yearlyDomain = selections.step11?.yearly || 0;
  const stepCount = sortedSteps.length;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if we should show the widget after component mounts (SSR-safe)
  useEffect(() => {
    // Show widget on all steps now
    const shouldShowWidget = true;
    setShouldShow(shouldShowWidget);
    
    // Ensure widget is visible when it should be shown
    if (shouldShowWidget && !isVisible) {
      setIsVisible(true);
    }
  }, [shouldShow, isVisible]);

  // Calculate costs - moved here to be used by hasBundle
  const getBundlePrice = () => {
    console.log('=== getBundlePrice DEBUG ===');
    console.log('bundle:', bundle);
    console.log('bundlePrices[bundle]:', bundlePrices[bundle]);
    console.log('websiteType:', websiteType);
    
    if (!bundle) {
      console.log('No bundle found, returning 0');
      return 0;
    }
    if (bundlePrices[bundle]) {
      console.log('Found direct bundle price:', bundlePrices[bundle]);
      return bundlePrices[bundle];
    }
    const suffix = websiteType === 'multi' ? '-mp' : '-sp';
    const priceWithSuffix = bundlePrices[bundle + suffix] || 0;
    console.log('Trying with suffix:', bundle + suffix, 'price:', priceWithSuffix);
    return priceWithSuffix;
  };
  
  // Check if bundle is selected - moved here to fix temporal dead zone
  const hasBundle = !!bundle && getBundlePrice() > 0;

  // Get pages based on whether it's a budget bundle or regular flow
  const getPages = () => {
    if (hasBundle && isBudgetBundle(bundle)) {
      // For budget bundles, use the bundle's included sections
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      return budgetBundleDetails?.included?.sections || [];
    } else {
      // For regular bundles, use URL query pages
      return getQueryList(router.query.pages);
    }
  };
  
  const pages = getPages();
  
  // Get promo from localStorage or URL (localStorage takes priority as it's set when promo is applied)
  const getPromoCode = () => {
    if (selections.promo?.applied && selections.promo?.code) {
      return selections.promo.code;
    }
    return urlPromoCode;
  };
  const promoCode = getPromoCode();
  
  console.log('=== MOBILE WIDGET URL DEBUG ===');
  console.log('All query params:', router.query);
  console.log('URL promo code:', urlPromoCode);
  console.log('localStorage promo:', selections.promo);
  console.log('Final promo code:', promoCode);
  
  // Bundle preselects
  const bpSections = router.query.bp_sections || '';
  const bpAddons = router.query.bp_addons || '';
  const bpStore = router.query.bp_store || '';
  const bpStoreOptions = router.query.bp_storeOptions || '';
  const bpHosting = router.query.bp_hosting || '';
  const bpMaintenance = router.query.bp_maintenance || '';
  
  // Calculate bundleHasStore here to make it available to calculateTotals
  const bundleHasStore = bpStore === 'yes-store';
  
  // Load saved selections from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSelections(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved selections');
        }
      }
    }
  }, [isClient]);
  
  // Listen for selection updates from Step 6
  useEffect(() => {
    if (isClient) {
      const handleSelectionsUpdate = () => {
        console.log('MobileCostSummary: Received selections-updated event - FORCING UPDATE');
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            console.log('MobileCostSummary: Parsed selections', parsed);
            console.log('MobileCostSummary: Store options in step8:', parsed.step8);
            
            // Force immediate update
            setSelections({...parsed});
            
            // Force multiple updates to ensure widget refreshes
            setTimeout(() => {
              console.log('MobileCostSummary: First force update');
              setSelections(prev => ({...prev, _update1: Date.now()}));
            }, 50);
            
            setTimeout(() => {
              console.log('MobileCostSummary: Second force update');
              setSelections(prev => ({...prev, _update2: Date.now()}));
            }, 100);
          } catch (error) {
            console.error('MobileCostSummary: Error parsing selections:', error);
          }
        }
      };
      
      window.addEventListener('selections-updated', handleSelectionsUpdate);
      return () => window.removeEventListener('selections-updated', handleSelectionsUpdate);
    }
  }, [isClient]);
  
  // Re-read URL parameters when selections change to catch store toggle updates
  useEffect(() => {
    if (isClient && selections.step8) {
      console.log('MobileCostSummary: Re-reading URL parameters due to selections change');
      // This will trigger re-calculation of totals when store is toggled
      const dummy = Date.now();
      console.log('MobileCostSummary: Triggering recalculation due to store toggle');
    }
  }, [selections.step8, isClient]);
  
  // Re-read URL parameters when storeAddon changes to catch real-time updates
  useEffect(() => {
    if (isClient) {
      console.log('MobileCostSummary: storeAddon changed, re-reading URL parameters');
      console.log('MobileCostSummary: Current storeAddon:', storeAddon);
      console.log('MobileCostSummary: Current store:', store);
      
      // Force re-calculation by updating a dummy state that totals depends on
      const dummy = Date.now();
      console.log('MobileCostSummary: Triggering recalculation due to storeAddon change');
      
      // Also trigger a direct update of the selections to force recalculation
      setSelections(prev => ({...prev, _storeAddonUpdate: Date.now()}));
    }
  }, [storeAddon, store, isClient]);
  
  // Backup: Listen for localStorage changes directly
  useEffect(() => {
    if (isClient) {
      const handleStorageChange = (e) => {
        if (e.key === STORAGE_KEY) {
          console.log('MobileCostSummary: localStorage changed directly - forcing update');
          const saved = e.newValue;
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              console.log('MobileCostSummary: Updated from localStorage event:', parsed);
              setSelections({...parsed});
            } catch (error) {
              console.error('Failed to parse localStorage change:', error);
            }
          }
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isClient]);
  
  // Save selections to localStorage whenever query params change
  useEffect(() => {
    if (!isClient) return;
    
    console.log('MobileCostSummary: Main calculation useEffect triggered');
    
    const currentPath = router.pathname;
    const stepMatch = currentPath.match(/step-(\d+)/);
    const currentStep = stepMatch ? parseInt(stepMatch[1]) : 0;
    
    if (currentStep === 0 && !router.query.type) {
      // On home page, clear selections
      localStorage.removeItem(STORAGE_KEY);
      setSelections({});
      return;
    }
    
    setSelections(prevSelections => {
    console.log('=== CALCULATION START ===');
    console.log('prevSelections keys:', Object.keys(prevSelections));
    console.log('prevSelections values:', prevSelections);
    
    const newSelections = { ...prevSelections };
    console.log('newSelections after copy:', Object.keys(newSelections));

    // If there's no bundle in the URL, treat it as bundle deselected and clear any persisted bundle-only items
    if (!bundle) {
      const hadPersistedBundle = !!newSelections.step4;
      if (hadPersistedBundle) {
        console.log('Bundle param missing: clearing persisted bundle selections');
      }

      // Always remove persisted bundle selection step
      if (newSelections.step4) delete newSelections.step4;

      // When bundle is deselected, clear all bundle preselect steps if they were set by bundle
      // Check if we had a bundle before (step4 existed) - if so, clear all preselect steps
      if (hadPersistedBundle) {
        // Clear all bundle preselect steps: 5 (backend), 6 (backendOptions), 7 (ai), 8 (store),
        // 9 (sections), 10 (addons), 11 (hosting), 12 (maintenance), 14 (automation)
        const bundlePreselectSteps = [5, 6, 7, 8, 9, 10, 11, 12, 14];
        bundlePreselectSteps.forEach(stepNum => {
          // Only delete if it was from a bundle (has includedInBundle flag OR was recently set)
          // For safety, if step4 existed (bundle was selected), clear these steps
          if (newSelections[`step${stepNum}`]) {
            delete newSelections[`step${stepNum}`];
          }
        });
      } else {
        // No bundle was selected before, but still check for includedInBundle flag
        if (newSelections.step6?.includedInBundle) delete newSelections.step6;
        if (newSelections.step7?.includedInBundle) delete newSelections.step7;
        if (newSelections.step8?.includedInBundle) delete newSelections.step8;
        if (newSelections.step9?.includedInBundle) delete newSelections.step9;
        if (newSelections.step14?.includedInBundle) delete newSelections.step14;
        if (newSelections.step11?.includedInBundle) delete newSelections.step11;
        if (newSelections.step12?.includedInBundle) delete newSelections.step12;
      }
    }
    
    // Check if bundle is selected - bundle includes base cost, so don't charge separately
    const bundlePrice = hasBundle ? (bundlePrices[bundle] || bundlePrices[bundle + (websiteType === 'multi' ? '-mp' : '-sp')] || 0) : 0;
    
    // Parse bundle included items
    // Get bundle sections from URL params and also from regular bundle definitions
    let bundleSectionsList = bpSections ? bpSections.split(',').filter(s => s.trim()) : [];
    // If we have a regular bundle, also include its sections
    if (hasBundle && bundle && !isBudgetBundle(bundle)) {
      const regularBundleSections = getRegularBundleSections(bundle);
      // Merge URL sections with regular bundle sections (avoid duplicates)
      bundleSectionsList = [...new Set([...bundleSectionsList, ...regularBundleSections])];
    }
    const bundleAddonsList = bpAddons ? bpAddons.split(',').filter(a => a.trim()) : [];
    const bundleBackendOpts = router.query.bp_backendOptions ? router.query.bp_backendOptions.split(',').filter(b => b.trim()) : [];
    const bundleStoreOpts = bpStoreOptions ? bpStoreOptions.split(',').filter(s => s.trim()) : [];
    const bundleHasBackend = router.query.bp_backend === 'yes';
    
    // For budget bundles, get included items from bundle details
    let budgetBundleIncludedItems = { backend: [], ai: [], automation: [] };
    if (isBudgetBundle(bundle)) {
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      console.log('Budget bundle details:', budgetBundleDetails);
      
      if (budgetBundleDetails?.included) {
        const included = budgetBundleDetails.included;
        budgetBundleIncludedItems = {
          backend: included.backendOptions || [],
          ai: included.aiFeatures || [],
          automation: included.automationFeatures || []
        };
        console.log('Budget bundle included items:', budgetBundleIncludedItems);
      }
    }
    
    // Step 1: Website Type (no cost)
    if (websiteType) {
      newSelections.step1 = {
        step: 1,
        name: STEP_NAMES[1],
        value: websiteType === 'single' ? 'Single Page' : 'Multi Page',
        id: websiteType
      };
    }
    
    // Step 2: Category - NO cost (just classification, not a feature)
    if (category) {
      newSelections.step2 = {
        step: 2,
        name: STEP_NAMES[2],
        value: category.charAt(0).toUpperCase() + category.slice(1),
        id: category,
        cost: 0
      };
    }
    
    // Step 3: Subcategory (preserve cost from Step 4)
    if (subcategory) {
      // Get the cost from the subcategory data in Step 4
      const getSubcategoryCost = (type, cat, subId) => {
        const subcategories = {
          single: {
            business: {
              'restaurant': 700, 'consulting': 600, 'retail': 650, 'healthcare': 800,
              'tech': 750, 'service': 550, 'customer-service': 500, 'customer-portal': 900
            },
            portfolio: {
              'photographer': 500, 'designer': 550, 'developer': 500, 'artist': 450,
              'architect': 600, 'writer': 400
            },
            blog: {
              'personal': 400, 'business': 500, 'travel': 450, 'food': 450,
              'tech': 500, 'lifestyle': 400
            },
            landing: {
              'product': 350, 'event': 400, 'app': 300, 'service': 350,
              'newsletter': 250, 'campaign': 450
            },
            product: {
              'saas': 600, 'physical': 500, 'digital': 450, 'mobile': 550,
              'service': 500, 'subscription': 550
            },
            custom: {
              'nonprofit': 600, 'education': 700, 'community': 650, 'directory': 550,
              'membership': 750, 'customer-platform': 2000, 'other': 800
            }
          },
          multi: {
            business: {
              'corporate': 1200, 'small-business': 800, 'restaurant-chain': 1000, 'healthcare-network': 1500,
              'real-estate': 1100, 'professional': 900, 'customer-support': 1300, 'customer-management': 1600
            },
            portfolio: {
              'agency': 800, 'photography-studio': 700, 'design-studio': 750, 'architecture-firm': 900,
              'production': 850, 'consulting-group': 800
            },
            ecommerce: {
              'retail-store': 1800, 'digital-products': 1200, 'subscription-service': 2000,
              'marketplace': 2500, 'dropshipping': 1500, 'b2b-ecommerce': 2200
            },
            blog: {
              'magazine': 800, 'news': 1000, 'multi-author': 700, 'niche': 600,
              'corporate': 900, 'educational': 750
            },
            landing: {
              'campaign': 600, 'product-launch': 700, 'event-series': 800, 'brand': 650,
              'promotion': 550, 'awareness': 600
            },
            custom: {
              'platform': 3000, 'education-portal': 2000, 'community-platform': 1800,
              'directory-platform': 1200, 'membership-platform': 2500, 'enterprise-portal': 4000, 'other': 1500
            }
          }
        };
        return subcategories[type]?.[cat]?.[subId] || 0;
      };
      
      // Prefer saved cost (e.g. 0 when bundle) so widget matches step-4
      const cost = prevSelections.step3?.cost != null && typeof prevSelections.step3.cost === 'number'
        ? prevSelections.step3.cost
        : getSubcategoryCost(websiteType, category, subcategory);
      newSelections.step3 = {
        step: 3,
        name: STEP_NAMES[3],
        value: subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        id: subcategory,
        cost
      };
    }
    
    // Step 4: Bundle
    console.log('=== BUNDLE STEP DEBUG ===');
    console.log('bundle:', bundle);
    console.log('bundlePrice:', bundlePrice);
    console.log('hasBundle:', hasBundle);
    console.log('bundlePrices[bundle]:', bundlePrices[bundle]);
    
    if (bundle && bundlePrice > 0) {
      newSelections.step4 = {
        step: 4,
        name: STEP_NAMES[4],
        value: bundle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        id: bundle,
        cost: bundlePrice
      };
      console.log('Bundle selection saved:', newSelections.step4);
    } else if (newSelections.step4) {
      console.log('Removing bundle selection');
      delete newSelections.step4;
    }
    console.log('=== END BUNDLE STEP DEBUG ===');
    
    // Step 11: Hosting & Domain (prefer saved selection if URL param missing)
    console.log('=== HOSTING SECTION START ===');
    console.log('hasBundle at hosting section:', hasBundle);
    const savedHostingId = prevSelections.step11?.id;
    const savedDomain = prevSelections.step11?.domain;
    const savedYearly = prevSelections.step11?.yearly;
    
    console.log('Initial hosting state:');
    console.log('- savedHostingId:', savedHostingId);
    console.log('- savedDomain:', savedDomain);
    console.log('- prevSelections.step11:', prevSelections.step11);
    
    // For budget bundles, get included hosting
    let bundleIncludedHosting = null;
    if (hasBundle && isBudgetBundle(bundle)) {
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      bundleIncludedHosting = budgetBundleDetails?.included?.hosting;
      console.log('Budget bundle includes hosting:', bundleIncludedHosting);
    }
    
    // Show hosting for both bundle flow (with bundle) and à la carte (no bundle but user selected on step-11)
    const hasHostingFromUrl = !!(hosting || domain);
    const hasHostingFromSaved = !!(savedHostingId || savedDomain || prevSelections.step11?.monthly != null);
    const shouldShowHosting = hasBundle ? true : (hasHostingFromUrl || hasHostingFromSaved);

    if (!shouldShowHosting) {
      if (newSelections.step11) delete newSelections.step11;
    } else {
      let hostingToUse = hosting || savedHostingId;
      let domainToUse = domain || savedDomain;
      if (hasBundle && !hostingToUse && bundleIncludedHosting && bundleIncludedHosting !== 'none') {
        hostingToUse = bundleIncludedHosting;
      }
      // À la carte: keep saved step11 if URL doesn't have hosting yet (e.g. on step-10)
      if (!hasBundle && prevSelections.step11 && !hostingToUse && !domainToUse) {
        newSelections.step11 = { ...prevSelections.step11 };
      } else if (hostingToUse || domainToUse) {
        const savedMonthly = prevSelections.step11?.monthly;
        let isHostingIncludedInBundle = false;
        if (hasBundle && isBudgetBundle(bundle)) {
          isHostingIncludedInBundle = bundleIncludedHosting && bundleIncludedHosting !== 'none';
        }
        const costMapKey = isHostingIncludedInBundle ? (bundleIncludedHosting || hostingToUse) : hostingToUse;
        const hostingMonthlyCost = hostingCostMap[costMapKey]?.monthly ?? (typeof savedMonthly === 'number' ? savedMonthly : 0);
        newSelections.step11 = {
          step: 11,
          name: STEP_NAMES[11],
          value: hostingToUse ? (hostingCostMap[costMapKey]?.name || hostingToUse) : 'Domain Only',
          id: hostingToUse,
          domain: domainToUse,
          monthly: hostingMonthlyCost,
          yearly: typeof savedYearly === 'number' ? savedYearly : (prevSelections.step11?.yearly ?? 0),
          includedInBundle: isHostingIncludedInBundle
        };
      }
    }
    
    // Step 5: Backend - only show if not part of bundle or if bundle is not selected
    if (backend && backend !== 'no') {
      // For budget bundles, backend is included, so don't show it separately
      if (hasBundle && isBudgetBundle(bundle)) {
        console.log('Hiding backend for budget bundle');
        if (newSelections.step5) delete newSelections.step5;
      } else {
        // Check if this was previously a budget bundle scenario
        const wasPreviouslyBundled = prevSelections.step6?.includedInBundle === true;
        if (!hasBundle && wasPreviouslyBundled) {
          console.log('Hiding backend that was previously bundled with budget bundle');
          if (newSelections.step5) delete newSelections.step5;
        } else {
          // Check if backend comes from bundle preselects but bundle is not selected
          const backendFromBundle = router.query.bp_backend === 'yes';
          const hasBundlePreselects = router.query.bundle === '' && (backendFromBundle || 
            router.query.bp_ai || router.query.bp_automation || router.query.bp_store);
          
          if (!hasBundle && hasBundlePreselects) {
            console.log('Hiding backend from bundle preselects - no bundle selected');
            if (newSelections.step5) delete newSelections.step5;
          } else {
            newSelections.step5 = {
              step: 5,
              name: STEP_NAMES[5],
              value: backend === 'yes' ? 'Yes' : backend.split(',').map(id => backendCostMap[id]?.name || id).join(', '),
              id: backend,
              cost: 0 // Backend selection itself has no cost, options are calculated separately
            };
          }
        }
      }
    } else if (newSelections.step5 && !hasBundle) {
      delete newSelections.step5;
    }
    
    // Step 6: Backend Options - preserve localStorage selection if it exists
    const savedBackendOptions = prevSelections.step6?.items || [];
    const urlBackendItems = backend && backend !== 'no' ? backend.split(',').filter(b => b.trim() && b !== 'yes') : [];
    
    // If bundle was deselected, clear backend options that were part of the bundle
    let backendOptionsToUse;
    if (!hasBundle && savedBackendOptions.length > 0) {
      // Check if this was previously a bundle scenario by looking at includedInBundle flag
      const wasPreviouslyBundled = prevSelections.step6?.includedInBundle === true;
      if (wasPreviouslyBundled) {
        // Clear them since bundle was deselected and they were previously bundled
        console.log('Clearing backend options that were previously bundled');
        backendOptionsToUse = []; // Clear completely when bundle deselected
        
        // Also clear step6 from localStorage to prevent showing old bundled options
        delete newSelections.step6;
      } else {
        // Check if backend options come from bundle preselects but bundle is not selected
        const backendFromBundle = router.query.bp_backend === 'yes';
        const hasBundlePreselects = router.query.bundle === '' && (backendFromBundle || 
          router.query.bp_ai || router.query.bp_automation || router.query.bp_store);
        
        if (hasBundlePreselects) {
          console.log('Clearing backend options from bundle preselects - no bundle selected');
          backendOptionsToUse = []; // Clear from bundle preselects
          delete newSelections.step6;
        } else {
          // Keep them as they weren't from the bundle
          backendOptionsToUse = savedBackendOptions.length > 0 ? savedBackendOptions : urlBackendItems;
        }
      }
    } else {
      backendOptionsToUse = savedBackendOptions.length > 0 ? savedBackendOptions : urlBackendItems;
    }
    
    if (backendOptionsToUse.length > 0) {
      // Determine which backend options are included in bundle
      let includedBackendOpts = bundleBackendOpts;
      if (isBudgetBundle(bundle)) {
        includedBackendOpts = budgetBundleIncludedItems.backend;
      }
      
      const chargeableItems = backendOptionsToUse.filter(id => !includedBackendOpts.includes(id));
      const calculatedBackendCost = bundleHasBackend ? 0 : chargeableItems.reduce((t, id) => t + (backendCostMap[id]?.cost || 0), 0);
      const allItemsIncludedInBundle = backendOptionsToUse.length > 0 && backendOptionsToUse.every(id => includedBackendOpts.includes(id));
      // Prefer saved cost from step-6 page when we're using saved items (align with step-13)
      const backendCost = (prevSelections.step6?.cost != null && backendOptionsToUse.length && backendOptionsToUse.every(id => (prevSelections.step6?.items || []).includes(id)))
        ? prevSelections.step6.cost
        : calculatedBackendCost;
      newSelections.step6 = {
        step: 6,
        name: STEP_NAMES[6],
        value: backendOptionsToUse.map(id => backendCostMap[id]?.name || id).join(', '),
        items: backendOptionsToUse,
        cost: backendCost,
        includedInBundle: bundleHasBackend || allItemsIncludedInBundle
      };
    } else if (newSelections.step6 && !hasBundle) {
      delete newSelections.step6;
    }
    
    // Step 7: AI Features - preserve localStorage selection if it exists
    const savedAiFeatures = prevSelections.step7?.items || [];
    const urlFeatures = features.filter(f => f.trim());
    const bundleAiFeatures = router.query.bp_aiFeatures ? router.query.bp_aiFeatures.split(',').filter(f => f.trim()) : [];
    
    // If bundle was deselected, clear AI features that were part of the bundle
    let featuresToUse;
    if (!hasBundle && savedAiFeatures.length > 0) {
      // Check if this was previously a bundle scenario by looking at includedInBundle flag
      const wasPreviouslyBundled = prevSelections.step7?.includedInBundle === true;
      if (wasPreviouslyBundled) {
        // Clear them since bundle was deselected and they were previously bundled
        console.log('Clearing AI features that were previously bundled');
        featuresToUse = urlFeatures;
      } else {
        // Keep them as they weren't from the bundle
        featuresToUse = savedAiFeatures.length > 0 ? savedAiFeatures : urlFeatures;
      }
    } else {
      featuresToUse = savedAiFeatures.length > 0 ? savedAiFeatures : urlFeatures;
    }
    
    console.log('MobileCostSummary AI Debug:');
    console.log('- savedAiFeatures from localStorage:', savedAiFeatures);
    console.log('- urlFeatures from query:', urlFeatures);
    console.log('- featuresToUse (final):', featuresToUse);
    
    if (featuresToUse.length > 0) {
      // Determine which AI features are included in bundle
      let includedAiFeatures = bundleAiFeatures;
      if (isBudgetBundle(bundle)) {
        includedAiFeatures = budgetBundleIncludedItems.ai;
      }
      
      const chargeableFeatures = featuresToUse.filter(f => f.trim() && !includedAiFeatures.includes(f));
      const calculatedAiCost = chargeableFeatures.reduce((t, id) => t + (aiFeatureCostMap[id]?.cost || 0), 0);
      const allFeaturesIncludedInBundle = featuresToUse.length > 0 && featuresToUse.every(id => includedAiFeatures.includes(id));
      const aiCost = (prevSelections.step7?.cost != null && featuresToUse.length && featuresToUse.every(id => (prevSelections.step7?.items || []).includes(id)))
        ? prevSelections.step7.cost
        : calculatedAiCost;
      newSelections.step7 = {
        step: 7,
        name: STEP_NAMES[7],
        value: featuresToUse.length > 0 ? featuresToUse.map(id => aiFeatureCostMap[id]?.name || id).join(', ') : 'AI Features',
        items: featuresToUse,
        cost: aiCost,
        includedInBundle: allFeaturesIncludedInBundle
      };
    } else if (newSelections.step7 && !hasBundle) {
      console.log('- No AI features, deleting step7');
      delete newSelections.step7;
    }
    
    // Step 8: Store - handle both regular store selection and bundle addon
    // Prioritize localStorage data over URL for store options
    const savedStoreOptions = prevSelections.step8?.items || [];
    const urlStoreOptions = storeOptions.filter(s => s.trim());
    
    // If bundle was deselected, clear store that was part of the bundle
    let storeOptionsToUse;
    if (!hasBundle && savedStoreOptions.length > 0) {
      // Check if this was previously a bundle scenario by looking at includedInBundle flag
      const wasPreviouslyBundled = prevSelections.step8?.includedInBundle === true;
      if (wasPreviouslyBundled) {
        // Store was from bundle, clear it since bundle was deselected
        console.log('Clearing store that was previously bundled');
        storeOptionsToUse = urlStoreOptions;
      } else {
        // Keep them as they weren't from the bundle
        storeOptionsToUse = savedStoreOptions.length > 0 ? savedStoreOptions : urlStoreOptions;
      }
    } else {
      storeOptionsToUse = savedStoreOptions.length > 0 ? savedStoreOptions : urlStoreOptions;
    }
    
    console.log('MobileCostSummary Store Debug:');
    console.log('- savedStoreOptions from localStorage:', savedStoreOptions);
    console.log('- urlStoreOptions from query:', urlStoreOptions);
    console.log('- storeOptionsToUse (final):', storeOptionsToUse);
    console.log('- store parameter:', store);
    console.log('- storeAddon parameter:', storeAddon);
    console.log('- bundleHasStore:', bundleHasStore);
    
    // Check if we should show store: either regular store selection OR bundle addon
    // First check localStorage (user's actual selection), then URL parameters
    const savedStoreStep = prevSelections.step8;
    const hasStoreInLocalStorage = savedStoreStep && (
      savedStoreStep.items && savedStoreStep.items.length > 0 ||
      savedStoreStep.cost > 0 ||
      savedStoreStep.value === 'Yes (Store)' || savedStoreStep.value === 'yes-store'
    );
    
    const hasRegularStore = hasStoreInLocalStorage || (store === 'yes-store' && storeOptionsToUse.length > 0);
    const hasBundleAddonStore = (storeAddon === 'true' || bundleHasStore) && hasBundle;
    
    if (hasRegularStore || hasBundleAddonStore) {
      const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
      const hasOnlyDefaults = storeOptionsToUse.length > 0 && 
                              storeOptionsToUse.every(id => defaultStoreFeatures.includes(id)) && 
                              defaultStoreFeatures.every(id => storeOptionsToUse.includes(id));
      
      let storeCost = 0;
      // Check if this is a budget bundle and how store was added
      // Only use budget pricing if we're currently in a budget bundle context
      const isBudgetBundleCurrent = isBudgetBundle(bundle) && hasBundle;
      let baseStorePrice;
      
      if (storeAddon === 'true') {
        // Store was added as bundle addon - use budget pricing for budget bundles
        const budgetStorePrice = 200; // Budget bundle addon price
        const regularStorePrice = 450; // Regular bundle addon price
        baseStorePrice = isBudgetBundleCurrent ? budgetStorePrice : regularStorePrice;
      } else {
        // Regular store selection - use standard pricing
        const budgetStorePrice = 200; // Budget-friendly price
        const regularStorePrice = 450; // Price from price list: $100 + $200 + $150 = $450
        baseStorePrice = isBudgetBundleCurrent ? budgetStorePrice : regularStorePrice;
      }
      
      // For bundle addon stores with no options, use the base price
      if (hasBundleAddonStore && storeOptionsToUse.length === 0) {
        storeCost = baseStorePrice;
      } else if (hasOnlyDefaults) {
        // Only default features selected - charge base store price
        storeCost = bundleHasStore ? 0 : baseStorePrice;
      } else {
        // Has additional features - start with base price + add extra features
        storeCost = bundleHasStore ? 0 : baseStorePrice;
        storeOptionsToUse.forEach(optionId => {
          // Skip default features since they're included in base price
          if (!defaultStoreFeatures.includes(optionId) && !bundleStoreOpts.includes(optionId)) {
            storeCost += storeCostMap[optionId]?.cost || 0;
          }
        });
      }
      
      // Use saved step8 data if available, otherwise create new
      if (hasStoreInLocalStorage && savedStoreStep) {
        // Preserve the saved store data (user's selection)
        newSelections.step8 = {
          ...savedStoreStep,
          // Update cost if needed, but preserve other data
          cost: savedStoreStep.cost || storeCost
        };
      } else {
        newSelections.step8 = {
          step: 8,
          name: STEP_NAMES[8],
          value: storeOptionsToUse.length > 0 ? storeOptionsToUse.map(id => storeCostMap[id]?.name || id).join(', ') : 'Yes (Store)',
          items: storeOptionsToUse.length > 0 ? storeOptionsToUse : (savedStoreStep?.items || ['basic-products', 'shopping-cart', 'payment-processing']),
          cost: storeCost,
          // Do not set monthly here - getStoreBackendMonthlyCost() is added once in calculateTotals to avoid double-count
          includedInBundle: bundleHasStore
        };
      }
    } else if (newSelections.step8 && !hasBundle && !hasStoreInLocalStorage) {
      // Only delete if not in localStorage (user might have selected it but URL doesn't have it)
      // But if it's in localStorage, keep it
      if (!savedStoreStep) {
        delete newSelections.step8;
      } else {
        // Keep the saved store selection even if URL doesn't have it
        newSelections.step8 = savedStoreStep;
      }
    }
    
    // Step 14: Handle automation features (prioritize URL over localStorage)
    const urlAutomationFeatures = automation && automation !== 'yes-automation' && automation !== 'no-automation' 
      ? automation.split(',').filter(a => a.trim()) 
      : [];
    const savedAutomationFeatures = prevSelections.step14?.items || [];
    
    // If bundle was deselected, clear automation features that were part of the bundle
    let automationFeaturesToUse;
    if (!hasBundle && savedAutomationFeatures.length > 0) {
      // Check if this was previously a bundle scenario by looking at includedInBundle flag
      const wasPreviouslyBundled = prevSelections.step14?.includedInBundle === true;
      if (wasPreviouslyBundled) {
        // Clear them since bundle was deselected and they were previously bundled
        console.log('Clearing automation features that were previously bundled');
        automationFeaturesToUse = urlAutomationFeatures;
      } else {
        // Keep them as they weren't from the bundle
        automationFeaturesToUse = savedAutomationFeatures.length > 0 ? savedAutomationFeatures : urlAutomationFeatures;
      }
    } else {
      automationFeaturesToUse = savedAutomationFeatures.length > 0 ? savedAutomationFeatures : urlAutomationFeatures;
    }
    
    // Check if we have automation features
    const hasAutomationFeatures = automationFeaturesToUse.length > 0;
    
    // For budget bundles, get included automation features
    let includedAutomationFeatures = [];
    if (isBudgetBundle(bundle)) {
      includedAutomationFeatures = budgetBundleIncludedItems.automation;
    }
    
    if (hasAutomationFeatures) {
      // Determine which automation features are included in bundle
      const chargeableFeatures = automationFeaturesToUse.filter(id => !includedAutomationFeatures.includes(id));
      const calculatedAutomationCost = chargeableFeatures.reduce((total, id) => total + (automationCostMap[id]?.cost || 0), 0);
      const allFeaturesIncludedInBundle = automationFeaturesToUse.length > 0 && automationFeaturesToUse.every(id => includedAutomationFeatures.includes(id));
      const automationCost = (prevSelections.step14?.cost != null && automationFeaturesToUse.length && automationFeaturesToUse.every(id => (prevSelections.step14?.items || []).includes(id)))
        ? prevSelections.step14.cost
        : calculatedAutomationCost;
      newSelections.step14 = {
        step: 14,
        name: 'Automation Features',
        value: `${automationFeaturesToUse.length} selected`,
        items: automationFeaturesToUse,
        cost: automationCost,
        includedInBundle: allFeaturesIncludedInBundle
      };
    } else if (newSelections.step14 && !hasBundle) {
      delete newSelections.step14;
    }
    
    // Step 9: Handle sections/pages (show when saved in localStorage)
    const urlSections = pages.filter(p => p.trim());
    const savedSections = prevSelections.step9?.items || [];
    const hasUrlSections = urlSections.length > 0;
    const hasSavedSections = savedSections.length > 0;
    
    // Check if saved sections are actually valid sections (not automation data)
    const isValidSectionsData = hasSavedSections && 
      !savedSections.some(item => 
        ['email-notifications', 'auto-responder', 'social-media-integration', 'lead-capture', 'analytics-integration', 'crm-integration'].includes(item)
      );
    
    // Show sections if they're in URL OR if they're saved in localStorage AND valid OR if it's a bundle
    if (hasUrlSections || (hasBundle && isBudgetBundle(bundle)) || (hasBundle && hasSavedSections && isValidSectionsData)) {
      // For budget bundles, use the bundle's included sections
      let sectionsToUse = urlSections;
      if (hasBundle && isBudgetBundle(bundle) && !hasUrlSections) {
        const budgetBundleDetails = getBudgetBundleDetails(bundle);
        sectionsToUse = budgetBundleDetails?.included?.sections || [];
      } else if (hasBundle && !isBudgetBundle(bundle) && !hasUrlSections && hasSavedSections) {
        // For regular bundles, use saved sections from localStorage
        sectionsToUse = savedSections;
      }
      
      const paidSections = sectionsToUse.filter(p => !bundleSectionsList.includes(p) && p !== 'hero' && p !== 'contact');
      
      // Always recalculate cost based on paid sections (don't use saved cost if sections are in bundle)
      // This ensures bundle sections are properly excluded even if they were previously saved with a cost
      let sectionsCost = 0;
      
      // Calculate cost only for sections not included in bundle
      if (paidSections.length > 0) {
        sectionsCost = paidSections.reduce((t, id) => {
          // Use correct prices that match step-9.js
          const step9Prices = {
            'about': 100, 'services': 150, 'portfolio': 200, 'testimonials': 100,
            'faq': 75, 'team': 150, 'pricing': 100, 'gallery': 125, 'stats': 75,
            'case-studies': 200, 'clients': 100, 'product': 200, 'traction': 150,
            'video': 100, 'process': 100, 'map': 75, 'blog-preview': 100,
            'newsletter': 250, 'cta': 150, 'partners': 200, 'features': 300,
            'reviews': 250, 'blog': 350, 'specials': 250, 'chef': 300,
            'order-online': 600, 'gift-cards': 400, 'menu': 400, 'reservations': 500,
            'events': 400, 'location-hours': 200, 'blog-articles': 500, 'collections': 400,
            'skills': 250
          };
          return t + (step9Prices[id] || 0);
        }, 0);
      }
      
      newSelections.step9 = {
        step: 9,
        name: 'Sections/Pages',
        value: `${sectionsToUse.length} included`,
        items: sectionsToUse,
        cost: sectionsCost
      };
    } else if (hasSavedSections && isValidSectionsData) {
      // Use saved sections from localStorage only if they're valid
      const sectionsToUse = savedSections;
      const paidSections = sectionsToUse.filter(p => !bundleSectionsList.includes(p) && p !== 'hero' && p !== 'contact');
      
      // Use saved cost from step9
      let sectionsCost = prevSelections.step9?.cost || 0;
      
      // If no saved cost, calculate it using correct step-9 prices
      if (!sectionsCost && paidSections.length > 0) {
        sectionsCost = paidSections.reduce((t, id) => {
          // Use correct prices that match step-9.js
          const step9Prices = {
            'about': 100, 'services': 150, 'portfolio': 200, 'testimonials': 100,
            'faq': 75, 'team': 150, 'pricing': 100, 'gallery': 125, 'stats': 75,
            'case-studies': 200, 'clients': 100, 'product': 200, 'traction': 150,
            'video': 100, 'process': 100, 'map': 75, 'blog-preview': 100,
            'newsletter': 250, 'cta': 150, 'partners': 200, 'features': 300,
            'reviews': 250, 'blog': 350, 'specials': 250, 'chef': 300,
            'order-online': 600, 'gift-cards': 400, 'menu': 400, 'reservations': 500,
            'events': 400, 'location-hours': 200, 'blog-articles': 500, 'collections': 400,
            'skills': 250
          };
          return t + (step9Prices[id] || 0);
        }, 0);
      }
      
      newSelections.step9 = {
        step: 9,
        name: 'Sections/Pages',
        value: `${paidSections.length} selected`,
        items: paidSections,
        cost: sectionsCost
      };
    } else {
      // No valid sections anywhere - remove step9
      delete newSelections.step9;
    }
    
    // Step 10: Add-ons - USE the saved costs from step-10.js, don't recalculate
    // This ensures the widget shows exactly what step-10.js calculated
    const savedStep10 = prevSelections.step10;
    if (savedStep10 && savedStep10.items && savedStep10.items.length > 0) {
      // Use the saved cost and monthly values directly from step-10.js
      newSelections.step10 = {
        step: 10,
        name: STEP_NAMES[10],
        value: savedStep10.value || `${savedStep10.items.length} selected`,
        items: savedStep10.items,
        cost: savedStep10.cost || 0,
        monthly: savedStep10.monthly || 0,
        paymentMode: savedStep10.paymentMode || 'onetime',
        toggles: savedStep10.toggles || {}
      };
      console.log('Step 10: Using saved costs - oneTime:', savedStep10.cost, 'monthly:', savedStep10.monthly);
    }
    // Don't delete step10 - let it persist from localStorage}
    
    // Step 12: Maintenance - use URL when present; preserve saved only when maintenance not in URL yet
    if (maintenance === 'no-maintenance') {
      if (newSelections.step12) delete newSelections.step12;
    } else if (maintenance && maintenance !== 'no-maintenance') {
      newSelections.step12 = {
        step: 12,
        name: STEP_NAMES[12],
        value: maintenanceCostMap[maintenance]?.name || maintenance,
        id: maintenance,
        monthly: maintenanceCostMap[maintenance]?.monthly ?? prevSelections.step12?.monthly ?? 0
      };
    } else if (prevSelections.step12 && prevSelections.step12.monthly != null) {
      newSelections.step12 = { ...prevSelections.step12 };
    } else if (newSelections.step12) {
      delete newSelections.step12;
    }
    
    // Only update if selections actually changed
    if (JSON.stringify(newSelections) === JSON.stringify(prevSelections)) {
      return prevSelections;
    }
    
    console.log('=== FINAL SELECTIONS BEFORE SAVE ===');
    console.log('step4 (bundle):', newSelections.step4);
    console.log('step11 (hosting):', newSelections.step11);
    console.log('step12 (maintenance):', newSelections.step12);
    console.log('All selections keys:', Object.keys(newSelections));
    console.log('=== END FINAL SELECTIONS ===');
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelections));
    return newSelections;
    });
  }, [router.pathname, router.query.type, router.query.category, router.query.subcategory, router.query.bundle, router.query.backend, router.query.features, router.query.store, router.query.storeOptions, router.query.pages, router.query.addons, router.query.hosting, router.query.maintenance, router.query.promo, router.query.bp_sections, router.query.bp_addons, router.query.bp_store, router.query.bp_storeOptions, router.query.bp_backend, router.query.bp_backendOptions, router.query.bp_aiFeatures, router.query.bp_hosting, router.query.bp_maintenance, promoCode]);
  
  // Force recalculation when promo code changes
  useEffect(() => {
    console.log('=== PROMO CODE CHANGE DETECTED ===');
    console.log('New promo code:', promoCode);
    console.log('Recalculating costs...');
    
    // Force a re-render by updating a dummy state
    const dummy = Date.now();
    console.log('Force render with:', dummy);
  }, [promoCode]);
  
  const bundleSections = bpSections ? bpSections.split(',').filter(s => s.trim()) : [];
  const bundleAddons = bpAddons ? bpAddons.split(',').filter(a => a.trim()) : [];
  
  const isBundleIncluded = (type, id) => {
    switch(type) {
      case 'section': return bundleSections.includes(id);
      case 'addon': return bundleAddons.includes(id);
      default: return false;
    }
  };
  
  const getBaseCost = () => {
    // Base cost should include subcategory cost, not add it separately
    const baseCost = baseCosts[websiteType]?.[category] || baseCosts['single']?.['business'] || 1500;
    console.log('getBaseCost: Called - websiteType:', websiteType, 'category:', category, 'baseCost:', baseCost);
    console.log('getBaseCost: This should already include subcategory cost');
    return baseCost;
  };
  
  const getBackendCost = () => {
    if (!backend || backend === 'no') return 0;
    
    // For budget bundles, check if backend is included in bundle
    if (hasBundle && isBudgetBundle(bundle)) {
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      const bundleBackend = budgetBundleDetails?.included?.backend;
      if (bundleBackend && bundleBackend !== 'no') {
        return 0; // Backend is included in budget bundle
      }
    }
    
    return backend.split(',').filter(b => b.trim()).reduce((total, id) => {
      return total + (backendCostMap[id]?.cost || 0);
    }, 0);
  };
  
  const getAiFeaturesCost = () => {
    console.log('getAiFeaturesCost: Called - checking AI features cost');
    
    // Priority 1: Check localStorage for AI features (from user toggles)
    if (typeof window !== 'undefined') {
      try {
        const savedSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const savedAiFeatures = savedSelections.step7?.items || [];
        if (savedAiFeatures.length > 0) {
          console.log('getAiFeaturesCost: Using localStorage AI features:', savedAiFeatures);
          const cost = savedAiFeatures.reduce((total, id) => total + (aiFeatureCostMap[id]?.cost || 0), 0);
          console.log('getAiFeaturesCost: Calculated cost from localStorage:', cost);
          return cost;
        }
      } catch (error) {
        console.warn('Error reading localStorage for AI features cost:', error);
      }
    }
    
    // Priority 2: Fallback to URL parameters
    if (!features.length) {
      console.log('getAiFeaturesCost: No features found, returning 0');
      return 0;
    }
    console.log('getAiFeaturesCost: Using URL AI features:', features);
    const cost = features.filter(f => f.trim()).reduce((total, id) => {
      return total + (aiFeatureCostMap[id]?.cost || 0);
    }, 0);
    console.log('getAiFeaturesCost: Calculated cost from URL:', cost);
    return cost;
  };
  
  const getStoreOptionsCost = () => {
    if (!storeOptions.length) return 0;
    const bundleStoreOpts = bpStoreOptions ? bpStoreOptions.split(',').filter(s => s.trim()) : [];
    
    // Check if only default store features are selected
    const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
    const hasOnlyDefaults = storeOptions.filter(s => s.trim()).every(id => defaultStoreFeatures.includes(id)) && 
                            defaultStoreFeatures.every(id => storeOptions.includes(id));
    
    // Check if this is a budget bundle and how store was added
    // Only use budget pricing if we're currently in a budget bundle context
    const isBudgetBundleCurrent = isBudgetBundle(bundle) && hasBundle;
    let baseStorePrice;
    
    if (storeAddon === 'true') {
      // Store was added as bundle addon - use budget pricing for budget bundles
      const budgetStorePrice = 200; // Budget bundle addon price
      const regularStorePrice = 450; // Regular bundle addon price
      baseStorePrice = isBudgetBundleCurrent ? budgetStorePrice : regularStorePrice;
    } else {
      // Regular store selection - use standard pricing
      const budgetStorePrice = 200; // Budget-friendly price
      const regularStorePrice = 450; // Price from price list: $100 + $200 + $150 = $450
      baseStorePrice = isBudgetBundleCurrent ? budgetStorePrice : regularStorePrice;
    }
    
    if (hasOnlyDefaults) {
      // Only default features selected - charge base store price
      return bundleStoreOpts.length > 0 ? 0 : baseStorePrice;
    } else {
      // Has additional features - start with base price + add extra features
      const bundleStoreOpts = bpStoreOptions ? bpStoreOptions.split(',').filter(s => s.trim()) : [];
      const baseCost = bundleStoreOpts.length > 0 ? 0 : baseStorePrice;
      const additionalCost = storeOptions.filter(s => s.trim()).reduce((total, id) => {
        // Skip default features since they're included in base price
        if (defaultStoreFeatures.includes(id)) return total;
        if (bundleStoreOpts.includes(id)) return total;
        return total + (storeCostMap[id]?.cost || 0);
      }, 0);
      return baseCost + additionalCost;
    }
  };
  
  const getStoreBaseCost = () => {
    if (!store || store === 'no-store') return 0;
    
    // Check if store is included in bundle
    if (hasBundle && bundleHasStore) {
      return 0; // Store is included in bundle
    }
    
    // For budget bundles, check if store is included
    if (hasBundle && isBudgetBundle(bundle)) {
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      const bundleStore = budgetBundleDetails?.included?.store;
      if (bundleStore && bundleStore !== 'no') {
        return 0; // Store is included in budget bundle
      }
    }
    
    // Base store cost
    const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
    const hasOnlyDefaults = storeOptions.filter(s => s.trim()).every(id => defaultStoreFeatures.includes(id)) && 
                              storeOptions.filter(s => s.trim()).length > 0;
    
    if (hasOnlyDefaults) {
      return baseStorePrice;
    } else {
      return baseStorePrice + getStoreOptionsCost();
    }
  };
  
  const hasStoreSelection = (sourceSelections = selections, overrides = {}) => {
    const storeStep = sourceSelections.step8;
    if (storeStep) {
      if (storeStep.includedInBundle) return false;
      const hasItems = Array.isArray(storeStep.items) && storeStep.items.length > 0;
      const hasCost = typeof storeStep.cost === 'number' && storeStep.cost > 0;
      const hasId = !!storeStep.id && storeStep.id !== 'no-store';
      return hasItems || hasCost || hasId;
    }
    const fallbackStore = overrides.store ?? store;
    const fallbackStoreAddon = overrides.storeAddon ?? storeAddon;
    return fallbackStore === 'yes-store' || fallbackStoreAddon === 'true';
  };

  const getStoreBackendMonthlyCost = (sourceSelections = selections, overrides = {}) => {
    const storePresent = hasStoreSelection(sourceSelections, overrides);
    console.log('=== getStoreBackendMonthlyCost DEBUG ===');
    console.log('Store present:', storePresent);
    console.log('sourceSelections.step8:', sourceSelections.step8);
    return storePresent ? 150 : 0;
  };
  
  const getAutomationCost = () => {
    // Check localStorage for automation features first
    if (typeof window !== 'undefined') {
      try {
        const savedSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const savedAutomationFeatures = savedSelections.step14?.items || [];
        if (savedAutomationFeatures.length > 0) {
          return savedAutomationFeatures.reduce((total, id) => total + (automationCostMap[id]?.cost || 0), 0);
        }
      } catch (error) {
        console.warn('Error reading localStorage for automation cost:', error);
      }
    }
    
    // Fallback to URL parameters
    if (!automation || automation === 'no-automation' || automation === 'yes-automation') return 0;
    
    return automation.split(',').filter(a => a.trim()).reduce((total, id) => {
      return total + (automationCostMap[id]?.cost || 0);
    }, 0);
  };
  
  const getSectionsCost = () => {
    // Use saved cost from step9 instead of recalculating
    return selections.step9?.cost || 0;
  };
  
  const getAddonsCost = () => {
    // Use saved one-time cost from step10 when available (align with step-13)
    if (selections.step10?.cost != null && typeof selections.step10.cost === 'number') {
      return selections.step10.cost;
    }
    let total = 0;
    addons.filter(a => a.trim()).forEach(id => {
      if (!isBundleIncluded('addon', id)) total += (addonCostMap[id]?.cost || 0);
    });
    const budgetAddons = selections.step10?.items || [];
    budgetAddons.forEach(addonId => {
      total += (addonCostMap[addonId]?.cost || 0);
    });
    return total;
  };
  
  const getHostingMonthlyCost = () => {
    // Use saved monthly when we have it (regular bundle or user selection)
    if (selections.step11?.monthly != null && typeof selections.step11.monthly === 'number') {
      return selections.step11.monthly;
    }
    // For budget bundles, check if hosting is included
    if (hasBundle && isBudgetBundle(bundle)) {
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      const bundleHosting = budgetBundleDetails?.included?.hosting;
      if (bundleHosting && bundleHosting !== 'none') {
        // Hosting is included in budget bundle, but still has monthly cost
        return hostingCostMap[bundleHosting]?.monthly || 0;
      }
      return 0; // No hosting in budget bundle
    }
    
    return hostingCostMap[hosting]?.monthly || 0;
  };
  
  const getMaintenanceMonthlyCost = () => {
    // Use saved monthly when we have it (regular bundle or user selection)
    if (selections.step12?.monthly != null && typeof selections.step12.monthly === 'number') {
      return selections.step12.monthly;
    }
    // For budget bundles, check if maintenance is included
    if (hasBundle && isBudgetBundle(bundle)) {
      const budgetBundleDetails = getBudgetBundleDetails(bundle);
      const bundleMaintenance = budgetBundleDetails?.included?.maintenance;
      if (bundleMaintenance && bundleMaintenance !== 'none') {
        // Maintenance is included in budget bundle, but still has monthly cost
        return maintenanceCostMap[bundleMaintenance]?.monthly || 0;
      }
      return 0; // No maintenance in budget bundle
    }
    
    return maintenanceCostMap[maintenance]?.monthly || 0;
  };
  const getAddonsMonthly = () => selections.step10?.monthly || 0;
  const getTotalMonthlyCost = () => getHostingMonthlyCost() + getMaintenanceMonthlyCost() + getAddonsMonthly() + getStoreBackendMonthlyCost();
  
  // Calculate totals using saved costs from selections (moved after all helper functions)
  const calculateTotals = () => {
    let oneTime = 0;
    let monthly = 0;
    
    // Check if this is a budget bundle
    // Only treat as budget bundle if we're currently in a budget bundle context
    const isBudgetBundleCurrent = isBudgetBundle(bundle) && hasBundle;
    
    console.log('=== CALCULATE TOTALS DEBUG ===');
    console.log('bundle:', bundle);
    console.log('hasBundle:', hasBundle);
    console.log('isBudgetBundleCurrent:', isBudgetBundleCurrent);
    console.log('selections:', selections);
    
    if (isBudgetBundleCurrent && hasBundle) {
      // For budget bundles, start with the bundle price
      oneTime = getBundlePrice();
      
      // Add monthly costs for hosting/maintenance if included
      monthly += getHostingMonthlyCost();
      monthly += getMaintenanceMonthlyCost();
      
      // Add monthly cost for store backend if store is added
      monthly += getStoreBackendMonthlyCost();
      
      // Add any extra addons beyond what's included in bundle
      oneTime += getAddonsCost();
      
      // Store addon cost (bundle addon store) - step8 already in forEach for regular flow
      if (selections.step8 && selections.step8.cost && typeof selections.step8.cost === 'number') {
        oneTime += selections.step8.cost;
      }
      
      // Add-ons monthly (recurring add-ons from step10)
      monthly += (selections.step10?.monthly || 0);
      
      // NOTE: Essential bundle pricing already includes backend hosting costs
      // The $50/month hosting cost is handled by getHostingMonthlyCost() for the monthly display
      
    } else {
      // For regular bundles or à la carte, add up all saved costs
      console.log('Adding up individual costs from selections:');
      Object.values(selections).forEach(item => {
        if (item.step && item.name) {
          console.log(`- Step ${item.step}: ${item.name}, cost: ${item.cost}, monthly: ${item.monthly}, includedInBundle: ${item.includedInBundle}`);
          if (item.cost && typeof item.cost === 'number') {
            oneTime += item.cost;
          }
          if (item.monthly && typeof item.monthly === 'number') {
            monthly += item.monthly;
          }
        }
      });
      
      // Add store backend monthly cost for regular flow
      monthly += getStoreBackendMonthlyCost();
      
      // step8 cost already included in forEach above - do not add again (would double-count)
    }
    
    console.log('Final totals - oneTime:', oneTime, 'monthly:', monthly);
    
    // Debug: Log all relevant values when store changes
    console.log('=== STORE DEBUG ===');
    console.log('store:', store);
    console.log('storeAddon:', storeAddon);
    console.log('hasBundle:', hasBundle);
    console.log('bundle:', bundle);
    console.log('bundleHasStore:', bundleHasStore);
    console.log('getStoreBackendMonthlyCost():', getStoreBackendMonthlyCost());
    console.log('getTotalMonthlyCost():', getTotalMonthlyCost());
    console.log('=== END STORE DEBUG ===');
    
    // Apply promo discount to one-time cost only (not monthly services)
    const promoIsValid = selections.promo?.applied === true;
    if (promoIsValid && oneTime > 0) {
      const discountPercent = selections.promo?.discountPercent || 10;
      oneTime = Math.round(oneTime * (1 - discountPercent / 100));
    }
    
    return { oneTime, monthly };
  };

  // Calculate totals using the function defined above - moved inside useEffect to fix timing
  const [totals, setTotals] = useState({ oneTime: 0, monthly: 0 });
  
  useEffect(() => {
    if (isClient) {
      const newTotals = calculateTotals();
      console.log('MobileCostSummary: Calculated totals:', newTotals);
      setTotals(newTotals);
    }
  }, [selections, bundle, websiteType, store, storeAddon, isClient]);

  // Test: Add manual trigger for debugging (remove this later)
  useEffect(() => {
    if (isClient) {
      // Add a global test function
      window.testMobileWidget = () => {
        console.log('MobileCostSummary: Manual test triggered');
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            console.log('MobileCostSummary: Current selections:', parsed);
            setSelections({...parsed});
          } catch (e) {
            console.error('Test failed:', e);
          }
        }
      };
      
      // Add a global function to show the widget
      window.showMobileWidget = () => {
        console.log('MobileCostSummary: Force showing widget');
        setIsVisible(true);
        setShouldShow(true);
      };
      
      // Add a global function to check widget state
      window.checkWidgetState = () => {
        console.log('Widget State:');
        console.log('- isVisible:', isVisible);
        console.log('- shouldShow:', shouldShow);
        console.log('- pathname:', router.pathname);
        console.log('- stepCount:', sortedSteps.length);
        console.log('- totals:', totals);
      };
      
      console.log('MobileCostSummary: Test functions available - call window.showMobileWidget() to show widget');
    }
  }, [isClient, isVisible, shouldShow, router.pathname, sortedSteps.length, totals]);
  
  const getOneTimeDevelopmentCost = () => {
    console.log('getOneTimeDevelopmentCost: Called - calculating total cost');
    
    // Align with step-13: bundle = bundle + sections + addons + store (addon)
    const baseCost = hasBundle
      ? getBundlePrice() + (selections.step9?.cost || 0) + getAddonsCost() + (selections.step8?.cost || 0)
      : getBaseCost() + getBackendCost() + getAiFeaturesCost() + getAutomationCost() +
        getStoreBaseCost() + getStoreOptionsCost() + (selections.step9?.cost || 0) + getAddonsCost();
    
    console.log('getOneTimeDevelopmentCost: Cost breakdown:');
    console.log('- getBaseCost():', getBaseCost());
    console.log('- getBackendCost():', getBackendCost());
    console.log('- getAiFeaturesCost():', getAiFeaturesCost());
    console.log('- getAutomationCost():', getAutomationCost());
    console.log('- getStoreBaseCost():', getStoreBaseCost());
    console.log('- getStoreOptionsCost():', getStoreOptionsCost());
    console.log('- Sections (saved from step9):', selections.step9?.cost || 0);
    console.log('- getAddonsCost():', getAddonsCost());
    console.log('- hasBundle:', hasBundle);
    console.log('- Checking if step3 (subcategory) is being added:', selections.step3?.cost);
    console.log('- All selections:', selections);
    console.log('- Final baseCost:', baseCost);
    console.log('=== DETAILED COST ANALYSIS ===');
    console.log('Expected total calculation:');
    console.log('- Subcategory:', selections.step3?.cost || 0);
    console.log('- Backend:', selections.step6?.cost || 0);
    console.log('- Store:', selections.step8?.cost || 0);
    console.log('- Sections:', selections.step9?.cost || 0);
    console.log('- Automation:', selections.step14?.name === 'Automation Features' ? selections.step14?.cost || 0 : 0);
    console.log('- Expected sum:', (selections.step3?.cost || 0) + (selections.step6?.cost || 0) + (selections.step8?.cost || 0) + (selections.step9?.cost || 0) + (selections.step14?.cost || 0));
    
    // Apply promo discount to valid promo code
    console.log('Mobile widget cost calculation:', { 
      promoCode, 
      baseCost, 
      hasBundle,
      bundlePrice: hasBundle ? getBundlePrice() : null
    });
    
    if (validatePromo(promoCode)) {
      const discountedCost = Math.round(baseCost * 0.9); // 10% discount
      console.log('Mobile widget applying discount:', discountedCost);
      return discountedCost;
    }
    console.log('Mobile widget no discount applied');
    return baseCost;
  };
  
  // Helper to get a short summary value for collapsed widget display
  const getSummaryValue = (stepData) => {
    if (!stepData || !stepData.value) return '';
    
    const value = stepData.value;
    
    // If it's a simple Yes/No, return as is
    if (value === 'Yes' || value === 'No' || value === 'yes' || value === 'no') {
      return value;
    }
    
    // If it has items array, show count
    if (stepData.items && Array.isArray(stepData.items) && stepData.items.length > 0) {
      const count = stepData.items.length;
      if (count === 1) {
        return '1 item';
      }
      return `${count} items`;
    }
    
    // If it's a long comma-separated list, show count
    if (typeof value === 'string' && value.includes(',')) {
      const items = value.split(',').filter(item => item.trim());
      if (items.length > 1) {
        return `${items.length} items`;
      }
    }
    
    // If it's a long string, truncate it
    if (typeof value === 'string' && value.length > 20) {
      return value.substring(0, 17) + '...';
    }
    
    return value;
  };
  
  // Get yes/no selections for prominent display - simplified with acronyms
  const getYesNoSelections = () => {
    const yesNoSteps = [];
    
    // Backend selection (step 5/6) - show "BE: Yes" or "BE: No"
    // Check if backend exists (by step5 value or step6 items)
    const hasBackend = selections.step5 && (
      selections.step5.value === 'Yes' || 
      selections.step5.value === 'yes' ||
      (selections.step6 && selections.step6.items && selections.step6.items.length > 0)
    );
    
    if (hasBackend) {
      yesNoSteps.push({
        name: 'BE',
        value: 'Yes',
        step: 5
      });
    } else if (selections.step5) {
      // Backend exists but is "No"
      yesNoSteps.push({
        name: 'BE',
        value: 'No',
        step: 5
      });
    }
    
    // AI selection (step 7) - show "AI: Yes" or "AI: No"
    if (selections.step7 && selections.step7.value) {
      const isYes = selections.step7.value === 'Yes' || selections.step7.value === 'yes' ||
                    (selections.step7.items && selections.step7.items.length > 0);
      yesNoSteps.push({
        name: 'AI',
        value: isYes ? 'Yes' : 'No',
        step: 7
      });
    }
    
    // Automation selection (step 14) - show "Auto: Yes" or "Auto: No"
    // Check if automation exists (by items, value, or name)
    const hasAutomation = selections.step14 && (
      (selections.step14.items && selections.step14.items.length > 0) ||
      selections.step14.value && (
        selections.step14.value.includes('selected') ||
        selections.step14.value === 'Yes' || 
        selections.step14.value === 'yes' ||
        selections.step14.value === 'yes-automation'
      ) ||
      selections.step14.name === 'Automation Features'
    );
    
    if (hasAutomation) {
      yesNoSteps.push({
        name: 'Auto',
        value: 'Yes',
        step: 14
      });
    }
    
    // Store selection (step 8) - show "Store: Yes" or "Store: No"
    // Check if store exists in selections (from localStorage or URL)
    // Handle various value formats: "Yes (Store)", "E-Commerce Store", "yes-store", etc.
    const hasStore = selections.step8 && (
      (selections.step8.items && selections.step8.items.length > 0) ||
      selections.step8.cost > 0 ||
      (selections.step8.value && (
        selections.step8.value.includes('Store') ||
        selections.step8.value === 'Yes (Store)' || 
        selections.step8.value === 'yes-store' ||
        selections.step8.value === 'Yes' || 
        selections.step8.value === 'yes'
      )) ||
      selections.step8.id === 'store' || 
      selections.step8.id === 'yes-store' ||
      selections.step8.name === 'E-Commerce Store' ||
      selections.step8.name === 'Store'
    );
    
    if (hasStore) {
      yesNoSteps.push({
        name: 'Store',
        value: 'Yes',
        step: 8
      });
    }
    
    return yesNoSteps;
  };

    
  // Get the appropriate display total based on payment mode
  const getDisplayTotal = () => {
    // Always show one-time total on the left side
    return totals.oneTime;
  };

  const getDisplayLabel = () => {
    // Always show empty label for one-time costs (monthly shown separately on right)
    return '';
  };

  const getDisplayColor = () => {
    // Always use green color for one-time costs
    return 'text-green-400';
  };

  const getIconColor = () => {
    const paymentMode = selections.step10?.paymentMode || 'onetime';
    
    if (paymentMode === 'monthly') {
      return 'text-orange-400';
    } else {
      return 'text-green-400';
    }
  };

  const getIconBgColor = () => {
    const paymentMode = selections.step10?.paymentMode || 'onetime';
    
    if (paymentMode === 'monthly') {
      return 'bg-orange-500/20';
    } else {
      return 'bg-green-500/20';
    }
  };

  const getSecondaryTotal = () => {
    // Always show monthly total on the right side
    // Use the calculated monthly total directly to avoid double-counting
    console.log('getSecondaryTotal called - totals.monthly:', totals.monthly);
    return totals.monthly;
  };

  const getSecondaryLabel = () => {
    // Always show "Monthly" label
    // Use the calculated monthly total directly
    return totals.monthly > 0 ? '/mo' : '';
  };

  const getSecondaryColor = () => {
    // Always use orange color for monthly costs
    return 'text-orange-400';
  };

  // Debug visibility states
  console.log('MobileCostSummary Debug:');
  console.log('- isVisible:', isVisible);
  console.log('- shouldShow:', shouldShow);
  console.log('- pathname:', router.pathname);
  console.log('- stepCount:', stepCount);
  console.log('- totals:', totals);

  // Reset function to clear all selections and return to step 1
  const handleReset = () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Navigate to home page (step 1)
      router.push('/');
    }
  };

  // Step pages where widget should show (excludes home, privacy, terms, cookie-policy, etc.)
  const isStepPage = router.pathname.startsWith('/step') || router.pathname === '/10';

  // Add body class for desktop padding when widget is visible (step pages only)
  useEffect(() => {
    if (isStepPage && shouldShow) {
      document.body.classList.add('has-cost-widget');
      return () => document.body.classList.remove('has-cost-widget');
    }
    document.body.classList.remove('has-cost-widget');
  }, [isStepPage, shouldShow]);

  // Don't render on home page or non-step pages
  if (!isStepPage) {
    return null;
  }

  if (!shouldShow) return null;


  return (
    <>
      {/* Cost Summary Widget - Sticky at bottom, mobile and desktop */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
           style={{
             paddingBottom: 'var(--safe-area-inset-bottom, 0)',
             paddingLeft: 'var(--safe-area-inset-left, 0)',
             paddingRight: 'var(--safe-area-inset-right, 0)'
           }}>
        {/* Collapsed Bar */}
        <div 
          className={`bg-gradient-to-r from-slate-900 to-slate-800 text-white transition-all duration-300 ${isExpanded ? 'rounded-t-2xl' : 'rounded-t-2xl shadow-2xl'}`}
        >
          {/* Handle/Toggle Bar */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
            className="w-full px-4 py-3 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`${getIconBgColor()} p-2 rounded-lg`}>
                <svg className={`w-5 h-5 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400">Your Selections</div>
                <div className={`text-lg font-bold ${getDisplayColor()}`}>{getDisplayTotal().toLocaleString()}{getDisplayLabel()}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Reset Button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                title="Reset to Step 1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              {/* Promo Badge in collapsed view */}
              {validatePromo(promoCode) && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                  ✨ 10% OFF
                </span>
              )}
              {getSecondaryTotal() > 0 && (
                <div className="text-right">
                  <div className="text-xs text-slate-400">{getSecondaryLabel()}</div>
                  <div className={`text-sm font-semibold ${getSecondaryColor()}`}>{getSecondaryTotal()}{getSecondaryLabel() === '/mo' ? '/mo' : ''}</div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full font-medium">
                  {stepCount > 0 ? `${stepCount} steps` : 'Start'}
                </span>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Yes/No Selections Bar - Single row, simplified with acronyms */}
          {getYesNoSelections().length > 0 && (
            <div className="px-3 py-1 bg-slate-800 border-t border-slate-700">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {getYesNoSelections().map((selection, index) => (
                  <div key={`${selection.step}-${index}`} className="flex items-center bg-slate-700 rounded-full px-2 py-0.5 flex-shrink-0">
                    <span className="text-[10px] font-medium text-slate-300 whitespace-nowrap">{selection.name}:</span>
                    <span className={`ml-1 text-[10px] font-bold whitespace-nowrap ${
                      selection.value === 'Yes' ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      {selection.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Expanded Content */}
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[55vh]' : 'max-h-0'}`}>
            <div className="px-4 pb-4 border-t border-slate-700">
              {/* Scrollable Items List */}
              <div className="max-h-[40vh] overflow-y-auto py-3 space-y-2">
                {sortedSteps.length === 0 ? (
                  <div className="text-center text-slate-400 py-4">
                    <p>No items selected yet</p>
                    <p className="text-xs mt-1">Your selections will appear here</p>
                  </div>
                ) : (
                  sortedSteps.map((item, index) => {
                    console.log(`Rendering item ${index}:`, item.name, 'cost:', item.cost, 'step:', item.step);
                    // Fix step9 items cost if wrong
                    let displayCost = item.cost;
                    if (item.step === 9 && item.cost > 0) {
                      // Recalculate cost for step9 items using correct prices
                      const step9Prices = {
                        'about': 100, 'services': 150, 'portfolio': 200, 'testimonials': 100,
                        'faq': 75, 'team': 150, 'pricing': 100, 'gallery': 125, 'stats': 75,
                        'case-studies': 200, 'clients': 100, 'product': 200, 'traction': 150,
                        'video': 100, 'process': 100, 'map': 75, 'blog-preview': 100,
                        'newsletter': 250, 'cta': 150, 'partners': 200, 'features': 300,
                        'reviews': 250, 'blog': 350, 'specials': 250, 'chef': 300,
                        'order-online': 600, 'gift-cards': 400, 'menu': 400, 'reservations': 500,
                        'events': 400, 'location-hours': 200, 'blog-articles': 500, 'collections': 400,
                        'skills': 250
                      };
                      
                      if (item.items && Array.isArray(item.items)) {
                        displayCost = item.items.reduce((total, sectionId) => {
                          return total + (step9Prices[sectionId] || 0);
                        }, 0);
                      }
                      
                      console.log(`Corrected step9 cost from ${item.cost} to ${displayCost}`);
                    }
                    
                    // Helper to truncate long values
                    const truncateValue = (value, maxLength = 40) => {
                      if (!value) return '';
                      if (typeof value !== 'string') return String(value);
                      if (value.length <= maxLength) return value;
                      return value.substring(0, maxLength) + '...';
                    };
                    
                    // Get a summary value instead of full list for certain steps
                    const getSummaryValue = (item) => {
                      if (!item.value) return '';
                      
                      // For steps with multiple items, show count instead of full list
                      if (item.items && Array.isArray(item.items) && item.items.length > 0) {
                        // For backend options, sections, addons, etc. - show count
                        if ([6, 9, 10, 14].includes(item.step)) {
                          return `${item.items.length} ${item.items.length === 1 ? 'item' : 'items'}`;
                        }
                      }
                      
                      // For other values, truncate if too long
                      return truncateValue(item.value, 30);
                    };
                    
                    return (
                    <div 
                      key={`${item.step}-${index}`} 
                      className={`flex items-center justify-between py-2 px-3 rounded-lg ${item.includedInBundle ? 'bg-purple-500/20' : 'bg-slate-700/50'}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${item.step === 4 ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                          {item.step === 4 ? '🎁' : '📄'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-slate-200">{item.name}</span>
                          {item.value && (
                            <span className="text-xs text-slate-400 ml-1 block truncate">
                              • {getSummaryValue(item)}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.step === 10 ? (
                        <div className="text-right leading-tight">
                          {item.includedInBundle ? (
                            <div className="text-sm font-medium text-purple-400">✓ bundled</div>
                          ) : (
                            <>
                              {displayCost > 0 && (
                                <div className="text-sm font-medium text-green-400">${displayCost.toLocaleString()}</div>
                              )}
                              {item.monthly > 0 && (
                                <div className="text-xs font-medium text-orange-400">${item.monthly}/mo</div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <span className={`text-sm font-medium ${
                          item.includedInBundle ? 'text-purple-400' :
                          displayCost === 0 && !item.monthly ? 'text-slate-500' : 
                          displayCost > 0 ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {item.includedInBundle ? '✓ bundled' :
                           displayCost > 0 && item.monthly > 0 ? `$${displayCost.toLocaleString()} + $${item.monthly}/mo` :
                           displayCost > 0 ? `$${displayCost.toLocaleString()}` : 
                           item.monthly > 0 ? `$${item.monthly}/mo` : ''}
                        </span>
                      )}
                    </div>
                    );
                  })
                )}
              </div>
              
              {/* Summary Footer */}
              <div className="border-t border-slate-700 pt-3 mt-2">
                {/* Promo Applied Badge */}
                {validatePromo(promoCode) && (
                  <div className="flex items-center justify-center gap-2 mb-2 py-1.5 px-3 bg-green-900/50 border border-green-600 rounded-lg">
                    <span className="text-green-400 text-xs font-semibold">✨ 10% PROMO APPLIED</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Development Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-400">${totals.oneTime.toLocaleString()}</span>
                    {validatePromo(promoCode) && (
                      <div className="text-xs text-green-500">Discounted</div>
                    )}
                  </div>
                </div>
                {totals.monthly > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Monthly Services</span>
                    <span className="font-medium text-orange-400">${totals.monthly}/mo</span>
                  </div>
                )}
                {yearlyDomain > 0 && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-slate-400">Yearly Services</span>
                    <span className="font-medium text-blue-300">${yearlyDomain}/yr</span>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Show button when hidden */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-xl animate-bounce"
          style={{
            bottom: 'calc(1rem + var(--safe-area-inset-bottom, 0))',
            right: 'calc(1rem + var(--safe-area-inset-right, 0))'
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      )}
    </>
  );
}
