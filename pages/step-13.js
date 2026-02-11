import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step13() {
  const [paymentOption, setPaymentOption] = useState('one-time'); // 'one-time' or 'monthly'
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successQuoteId, setSuccessQuoteId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [savedSelections, setSavedSelections] = useState({});
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Load saved selections from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedSelections(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error loading saved selections:', e);
    }
  }, []);
  
  // Force one-time payment for budget bundles
  useEffect(() => {
    if (isClient && isBudgetBundle()) {
      setPaymentOption('one-time');
    }
  }, [isClient]);
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const aiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const store = router.query.store || '';
  const storeOptions = router.query.storeOptions ? router.query.storeOptions.split(',') : [];
  const bundle = router.query.bundle || '';
  
  // Check if current bundle is a budget bundle
  const isBudgetBundle = () => {
    if (!bundle) return false;
    
    // Check if bundle ID contains budget keywords
    const budgetBundleIds = [
      'budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'
    ];
    
    return budgetBundleIds.includes(bundle);
  };
  
  // Get regular bundle included sections
  const getRegularBundleSections = () => {
    if (!bundle || isBudgetBundle()) return [];
    
    // Determine the bundle key (with or without suffix)
    const bundleKey = bundle;
    const bundleKeyWithSuffix = websiteType === 'multi' ? `${bundle}-mp` : `${bundle}-sp`;
    
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

  // Get budget bundle features and included items
  const getBudgetBundleDetails = () => {
    if (!isBudgetBundle()) return null;
    
    // Define budget bundle details based on bundle ID
    const budgetBundles = {
      'budget-starter': {
        name: 'Starter One-Pager',
        features: [
          'Single Clean Page',
          'Mobile Responsive Design', 
          'Fast Loading',
          'Contact or Call Button',
          '1 Round of Revisions',
          'Basic SEO Setup',
          'Monthly Services: $25 Basic Hosting = $25/mo'
        ],
        included: {
          sections: ['hero', 'contact'],
          backend: 'no',
          backendOptions: [],
          automation: 'no',
          automationFeatures: [],
          addons: [], // No addons included in starter
          hosting: 'basic-hosting',
          maintenance: 'none'
        }
      },
      'budget-essential': {
        name: 'Essential Website',
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
        ],
        included: {
          sections: ['hero'],
          backend: 'yes',
          backendOptions: ['basic-auth', 'auth-storage'],
          automation: 'yes', 
          automationFeatures: ['email-notifications'],
          addons: [], // No addons included in essential
          hosting: 'basic-hosting',
          maintenance: 'none'
        }
      },
      'budget-starter-mp': {
        name: 'Starter Multi-Page Site',
        features: [
          '5-Page Business Website',
          'Mobile Responsive Design',
          'Contact Forms',
          'Basic Navigation', 
          'SEO Setup',
          'Monthly Services: $25 Basic Hosting = $25/mo'
        ],
        included: {
          sections: ['hero', 'about', 'services', 'portfolio', 'contact'],
          backend: 'no',
          backendOptions: [],
          automation: 'no',
          automationFeatures: [],
          addons: ['seo-package'], // SEO package is included in this bundle
          hosting: 'basic-hosting',
          maintenance: 'none'
        }
      },
      'budget-essential-mp': {
        name: 'Essential Multi-Page Site',
        features: [
          '7-Page Business Website',
          'Mobile Responsive Design',
          'Advanced Contact Forms',
          'Professional Navigation',
          'SEO Optimization',
          'Basic Analytics',
          'Monthly Services: $25 Basic Hosting + $25 Backend & Automation = $50/mo'
        ],
        included: {
          sections: ['hero', 'about', 'services', 'portfolio', 'testimonials', 'faq', 'contact'],
          backend: 'yes',
          backendOptions: ['basic-auth', 'auth-storage'],
          automation: 'yes',
          automationFeatures: ['email-notifications'],
          addons: ['seo-package'], // SEO package is included in this bundle
          hosting: 'basic-hosting',
          maintenance: 'basic'
        }
      }
    };
    
    return budgetBundles[bundle] || null;
  };
  
  // Get pages based on whether it's a budget bundle or regular flow
  const getPages = () => {
    if (isBudgetBundle()) {
      // For budget bundles, use the bundle's included sections
      const budgetBundleDetails = getBudgetBundleDetails();
      return budgetBundleDetails?.included?.sections || [];
    } else {
      // For regular bundles, use URL query pages
      return router.query.pages ? router.query.pages.split(',') : [];
    }
  };
  
  const pages = getPages();
  const features = router.query.features ? router.query.features.split(',') : [];
  const addons = router.query.addons ? router.query.addons.split(',') : [];
  const hosting = router.query.hosting || '';
  const domain = router.query.domain || '';
  const maintenance = router.query.maintenance || '';
  const fromBudget = router.query.budget === 'true';
  const storeAddon = router.query.storeAddon || ''; // Track if store was added as bundle addon
  
  // Bundle preselects (bp_ prefix) - track what's included in bundle
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
  
  // Build bundle params string for Back navigation (centralized)
  const bundleParams = buildBundleParams(router.query);
  
  // Parse bundle-included items
  const bundleSections = bpSections ? bpSections.split(',').filter(s => s.trim()) : [];
  const bundleAddons = bpAddons ? bpAddons.split(',').filter(a => a.trim()) : [];
  const bundleBackendOptions = bpBackendOptions ? bpBackendOptions.split(',').filter(b => b.trim()) : [];
  const bundleAiFeatures = bpAiFeatures ? bpAiFeatures.split(',').filter(f => f.trim()) : [];
  const bundleAutomationFeatures = bpAutomationFeatures ? bpAutomationFeatures.split(',').filter(a => a.trim()) : [];
  
  // Check if item is included in bundle (free)
  const isBundleIncluded = (type, id) => {
    // First check bundle preselects (bp_ parameters)
    switch(type) {
      case 'section': 
        if (bundleSections.includes(id)) return true;
        break;
      case 'addon': 
        if (bundleAddons.includes(id)) return true;
        break;
      case 'backend': 
        if (bundleBackendOptions.includes(id)) return true;
        break;
      case 'ai': 
        if (bundleAiFeatures.includes(id)) return true;
        break;
      case 'automation': 
        if (bundleAutomationFeatures.includes(id)) return true;
        break;
    }
    
    // For budget bundles, check the budget bundle details
    if (isBudgetBundle()) {
      const budgetDetails = getBudgetBundleDetails();
      if (!budgetDetails) return false;
      
      switch(type) {
        case 'section':
          return budgetDetails.included.sections.includes(id);
        case 'addon':
          return budgetDetails.included.addons && budgetDetails.included.addons.includes(id);
        case 'backend':
          return budgetDetails.included.backend === 'yes' && budgetDetails.included.backendOptions.includes(id);
        case 'ai':
          return budgetDetails.included.ai === 'yes' && budgetDetails.included.aiFeatures.includes(id);
        case 'automation':
          return budgetDetails.included.automation === 'yes' && budgetDetails.included.automationFeatures.includes(id);
        default:
          return false;
      }
    }
    
    // For regular bundles, check the regular bundle sections
    if (bundle && !isBudgetBundle() && type === 'section') {
      const regularBundleSections = getRegularBundleSections();
      return regularBundleSections.includes(id);
    }
    
    return false;
  };

  // Helper to get the correct term based on website type
  const getSectionTerm = () => websiteType === 'multi' ? 'pages' : 'sections';
  const getSectionTermCap = () => websiteType === 'multi' ? 'Pages' : 'Sections';
  
  // Bundle pricing (if bundle selected, use bundle price instead of à la carte)
  // Realistic pricing for the value provided - bundles save ~20-30% vs à la carte
  const bundlePrices = {
    // ==================== SINGLE-PAGE BUNDLE PRICES ====================
    // Business bundles (Single Page)
    'business-starter-sp': 600,        // Includes: hero, about, services, contact + basic hosting
    'business-professional-sp': 1199,   // + team, testimonials, faq, SEO package, standard hosting, basic maintenance
    'business-premium-sp': 1999,        // + backend, automation, premium hosting, standard maintenance
    // Portfolio bundles (Single Page)
    'portfolio-starter-sp': 600,       // Includes: hero, about, portfolio, contact
    'portfolio-professional-sp': 1199, // + skills, testimonials, SEO package
    'portfolio-premium-sp': 1999,      // + backend, client portal, premium hosting
    // Blog bundles (Single Page)
    'blog-starter-sp': 500,            // Includes: hero, blog, about, contact + content system
    'blog-professional-sp': 1199,       // + newsletter, SEO, content writing
    'blog-premium-sp': 1999,           // + multi-author, analytics, email marketing
    // Landing page bundles (Single Page)
    'landing-starter-sp': 399,         // Includes: hero, features, cta, contact
    'landing-professional-sp': 800,     // + testimonials, SEO package
    'landing-premium-sp': 1999,        // + backend, lead management, automation
    // Product bundles (Single Page)
    'product-starter-sp': 700,         // Includes: hero, product, features, pricing, contact
    'product-professional-sp': 1299,    // + gallery, reviews, faq, SEO
    'product-premium-sp': 1999,         // + backend, order management, store features
    // Custom bundles (Single Page)
    'custom-starter-sp': 800,          // Custom design with core sections
    'custom-professional-sp': 1999,     // Advanced custom features
    'custom-premium-sp': 4999,         // Full custom solution with backend
    // Restaurant bundles (Single Page)
    'restaurant-starter-sp': 700,      // Includes: hero, about, menu, contact
    'restaurant-professional-sp': 1399, // + reservations, testimonials, gallery
    'restaurant-premium-sp': 1999,      // + online ordering, events, backend, automation
    // Budget bundles (Single Page)
    'budget-starter': 400,              // Basic one-pager
    'budget-essential': 600,            // Essential one-pager with backend and hosting
    // ==================== MULTI-PAGE BUNDLE PRICES ====================
    // Budget bundles (Multi Page)
    'budget-starter-mp': 1199,          // Basic 5-page site
    'budget-essential-mp': 1799,        // Essential 7-page site with backend and hosting
    // Business Multi-page bundles
    'business-starter-mp': 1799,       // 5-page business website
    'business-professional-mp': 2999,  // 10-page business website
    'business-premium-mp': 4499,       // 15+ page enterprise business
    
    // Portfolio Multi-page bundles
    'portfolio-starter-mp': 1499,       // 5-page portfolio
    'portfolio-professional-mp': 2499,  // 10-page portfolio
    'portfolio-premium-mp': 3999,      // 15+ page portfolio with client portal
    
    // Ecommerce Multi-page bundles
    'ecommerce-starter-mp': 2999,      // Multi-page online store
    'ecommerce-professional-mp': 4999, // Advanced multi-page store
    'ecommerce-premium-mp': 7999,      // Enterprise e-commerce platform
    
    // Blog Multi-page bundles
    'blog-starter-mp': 1499,           // Multi-page blog
    'blog-professional-mp': 2499,      // Advanced blog platform
    'blog-premium-mp': 3999,           // Professional blogging platform
    
    // Landing Multi-page bundles
    'landing-starter-mp': 1199,        // Multi-page campaign
    'landing-professional-mp': 1999,   // Marketing website
    'landing-premium-mp': 4999,        // Enterprise marketing platform
    
    // Product Multi-page bundles
    'product-starter-mp': 1699,       // Multi-page product showcase
    'product-professional-mp': 2999,  // Comprehensive product site
    'product-premium-mp': 4999,        // Enterprise product platform
    
    // Custom Multi-page bundles
    'custom-starter-mp': 1999,         // Tailored multi-page solution
    'custom-professional-mp': 3999,    // Advanced custom multi-page
    'custom-premium-mp': 7999          // Enterprise custom solution
  };
  
  // Bundle names for display
  const bundleNames = {
    'business-starter': 'Starter Business',
    'business-professional': 'Professional Business',
    'business-premium': 'Premium Business',
    'portfolio-starter': 'Starter Portfolio',
    'portfolio-professional': 'Professional Portfolio',
    'portfolio-premium': 'Premium Portfolio',
    'blog-starter': 'Starter Blog',
    'blog-professional': 'Professional Blog',
    'blog-premium': 'Premium Blog',
    'landing-starter': 'Starter Landing',
    'landing-professional': 'Professional Landing',
    'landing-premium': 'Premium Landing',
    'product-starter': 'Starter Product',
    'product-professional': 'Professional Product',
    'product-premium': 'Premium Product',
    'custom-starter': 'Custom Starter',
    'custom-professional': 'Custom Professional',
    'custom-premium': 'Custom Premium',
    'restaurant-starter': 'Starter Restaurant',
    'restaurant-professional': 'Professional Restaurant',
    'restaurant-premium': 'Premium Restaurant',
    'ecommerce-starter': 'Starter Ecommerce',
    'ecommerce-professional': 'Professional Ecommerce',
    'ecommerce-premium': 'Premium Ecommerce'
  };
  
  const getBundlePrice = () => {
    if (!bundle) return 0;
    
    // Check if bundle exists in our pricing
    if (bundlePrices[bundle]) {
      return bundlePrices[bundle];
    }
    
    // Fallback for legacy bundle IDs (without -sp/-mp suffix)
    // Determine if this is single or multi page based on websiteType
    const suffix = websiteType === 'multi' ? '-mp' : '-sp';
    const legacyBundleId = bundle + suffix;
    
    return bundlePrices[legacyBundleId] || 0;
  };
  const getBundleName = () => {
    if (!bundle) return '';
    
    // Check if bundle name exists directly
    if (bundleNames[bundle]) {
      return bundleNames[bundle];
    }
    
    // Fallback: remove suffix and check base name
    const baseBundleId = bundle.replace(/-(sp|mp)$/, '');
    return bundleNames[baseBundleId] || bundle.replace(/-/g, ' ');
  };
  
  const hasBundle = !!bundle && getBundlePrice() > 0;

  // Subcategory costs - matching MobileCostSummary pricing
  const subcategoryCosts = {
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
        'membership': 750, 'customer-platform': 1800, 'other': 800
      }
    },
    multi: {
      business: {
        'corporate': 600, 'small-business': 600, 'restaurant-chain': 800, 'healthcare-network': 1200,
        'real-estate': 800, 'professional': 1000, 'customer-support': 1400, 'customer-management': 1600
      },
      portfolio: {
        'agency': 2000, 'photography-studio': 1800, 'design-studio': 1900, 'architecture-firm': 2200,
        'production': 2100, 'consulting-group': 2000
      },
      ecommerce: {
        'retail-store': 3500, 'digital-products': 2800, 'subscription-service': 4000,
        'marketplace': 4500, 'dropshipping': 3200, 'b2b-ecommerce': 4200
      },
      blog: {
        'magazine': 2000, 'news': 2200, 'multi-author': 1900, 'niche': 1800,
        'corporate': 2100, 'educational': 1950
      },
      landing: {
        'campaign': 1600, 'product-launch': 1700, 'event-series': 1800, 'brand': 1650,
        'promotion': 1550, 'awareness': 1600
      },
      custom: {
        'platform': 3500, 'education-portal': 2500, 'community-platform': 2300,
        'directory-platform': 2000, 'membership-platform': 3000, 'enterprise-portal': 3800, 'other': 2500
      }
    }
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

  // Section costs - matching MobileCostSummary pricing
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
    'seo-package': { name: 'SEO', cost: 199 },
    'content-writing': { name: 'Content Writing', cost: 149 },
    'social-media-management': { name: 'Social Media', cost: 199 },
    'email-marketing': { name: 'Email Marketing', cost: 129 },
    'website-maintenance': { name: 'Maintenance', cost: 50 },
    'analytics-setup': { name: 'Analytics', cost: 149 },
    'security-package': { name: 'Security', cost: 59 },
    'speed-optimization': { name: 'Speed Optimization', cost: 99 },
    'full-care-plan': { name: 'Full Care Plan', cost: 199 },
    'social-media-setup': { name: 'Social Media Setup', cost: 25 },
    'logo-design': { name: 'Logo Design', cost: 50 },
    'favicon-design': { name: 'Favicon Design', cost: 25 },
    'extra-revision': { name: 'Extra Revision', cost: 25 },
    'basic-ecommerce': { name: 'Basic E-commerce', cost: 299 },
    'branding-package': { name: 'Complete Branding Package', cost: 899 },
    'hosting-setup': { name: 'Website Hosting Setup', cost: 100 },
    'domain-registration': { name: 'Domain Registration', cost: 25 },
    'email-marketing-setup': { name: 'Email Marketing Setup', cost: 300 },
    'google-ads-setup': { name: 'Google Ads Setup', cost: 450 },
    'facebook-ads-setup': { name: 'Facebook Ads Setup', cost: 400 },
    'video-production': { name: 'Video Production', cost: 800 },
    'photography': { name: 'Professional Photography', cost: 650 },
    'copywriting': { name: 'Professional Copywriting', cost: 300 },
    'translation-services': { name: 'Translation Services', cost: 250 },
    'accessibility-audit': { name: 'Accessibility Audit', cost: 400 },
    'performance-optimization': { name: 'Performance Optimization', cost: 350 },
    'security-audit': { name: 'Security Audit', cost: 450 }
  };

  const hostingCostMap = {
    'basic-hosting': { name: 'Basic Hosting', monthly: 25 },
    'standard-hosting': { name: 'Standard Hosting', monthly: 50 },
    'professional-hosting': { name: 'Professional Hosting', monthly: 75 },
    'enterprise-hosting': { name: 'Enterprise Hosting', monthly: 125 }
  };

  const domainCostMap = {
    'no-domain': { name: 'No Domain', cost: 0 },
    'domain-registration': { name: 'Domain Registration', cost: 25 }
  };

  const maintenanceCostMap = {
    'no-maintenance': { name: 'No Maintenance', monthly: 0 },
    'basic-maintenance': { name: 'Basic Maintenance', monthly: 50 },
    'professional-maintenance': { name: 'Professional Maintenance', monthly: 100 },
    'enterprise-maintenance': { name: 'Enterprise Maintenance', monthly: 200 }
  };

  // Calculate costs
  const getBaseCost = () => {
    // Use saved cost from localStorage if available (step3 = subcategory)
    if (savedSelections.step3?.cost !== undefined) {
      return savedSelections.step3.cost;
    }
    // Use subcategory-specific pricing (matching MobileCostSummary)
    const cost = subcategoryCosts[websiteType]?.[category]?.[subcategory];
    if (cost) return cost;
    // Fallback to a default
    return 700;
  };

  const getBackendCost = () => {
    // Use saved cost from localStorage if available
    if (savedSelections.step6?.cost !== undefined) {
      return savedSelections.step6.cost;
    }
    if (!backend || backend === 'no') return 0;
    // Skip backend options included in bundle
    return backend.split(',').filter(b => b.trim()).reduce((total, id) => {
      if (isBundleIncluded('backend', id)) return total; // Free with bundle
      return total + (backendCostMap[id]?.cost || 0);
    }, 0);
  };

  const getAiFeaturesCost = () => {
    // Use saved cost from localStorage if available
    if (savedSelections.step7?.cost !== undefined) {
      return savedSelections.step7.cost;
    }
    if (!features.length) return 0;
    // Skip AI features included in bundle
    return features.filter(f => f.trim()).reduce((total, id) => {
      if (isBundleIncluded('ai', id)) return total; // Free with bundle
      return total + (aiFeatureCostMap[id]?.cost || 0);
    }, 0);
  };

  const getAutomationCost = () => {
    // Use saved cost from localStorage if available
    if (savedSelections.step14?.cost !== undefined) {
      return savedSelections.step14.cost;
    }
    if (!automation || automation === 'no-automation') return 0;
    // Skip automation features included in bundle
    return automation.split(',').filter(a => a.trim() && a !== 'yes-automation' && a !== 'no-automation').reduce((total, id) => {
      if (isBundleIncluded('automation', id)) return total; // Free with bundle
      return total + (automationCostMap[id]?.cost || 0);
    }, 0);
  };

  const hasStoreSelection = () => {
    const storeStep = savedSelections.step8;
    if (storeStep) {
      if (storeStep.includedInBundle) return false;
      const hasItems = Array.isArray(storeStep.items) && storeStep.items.length > 0;
      const hasCost = typeof storeStep.cost === 'number' && storeStep.cost > 0;
      const hasId = !!storeStep.id && storeStep.id !== 'no-store';
      return hasItems || hasCost || hasId;
    }
    if (store === 'yes-store') return true;
    if (storeAddon === 'true') return true;
    return false;
  };

  const getStoreBaseCost = () => {
    // Use saved cost from localStorage if available
    if (savedSelections.step8?.cost !== undefined) {
      return savedSelections.step8.cost;
    }
    // Only charge if user actually selected store AND it's not included in bundle
    if (store !== 'yes-store') return 0; // User didn't select store
    if (bpStore === 'yes-store') return 0; // Included in bundle
    
    // Check if this is a budget bundle - use cheaper pricing
    if (storeAddon === 'true') {
      // Store was added as bundle addon - use cheaper pricing
      const budgetStorePrice = 199; // Budget bundle addon price
      const regularStorePrice = 450; // Bundle addon pricing - updated to $450
      return isBudgetBundle() ? budgetStorePrice : regularStorePrice;
    } else {
      // Regular store selection - use standard pricing
      const budgetStorePrice = 200; // Budget-friendly price
      const regularStorePrice = 450; // Price from price list: $100 + $200 + $150 = $450
      return isBudgetBundle() ? budgetStorePrice : regularStorePrice;
    }
  };

  const getStoreOptionsCost = () => {
    // Store options cost is already included in step8 cost from localStorage
    // Don't double-count
    if (savedSelections.step8?.cost !== undefined) {
      return 0; // Already counted in getStoreBaseCost
    }
    if (!storeOptions.length) return 0;
    // Skip store options included in bundle
    const bundleStoreOptions = bpStoreOptions ? bpStoreOptions.split(',').filter(s => s.trim()) : [];
    return storeOptions.filter(s => s.trim()).reduce((total, id) => {
      if (bundleStoreOptions.includes(id)) return total; // Free with bundle
      return total + (storeCostMap[id]?.cost || 0);
    }, 0);
  };

  const getSectionsCost = () => {
    // For budget bundles, sections are included - don't charge
    if (isBudgetBundle()) {
      return 0; // All sections are included in budget bundles
    }
    // Use saved cost from localStorage if available (but recalculate to ensure bundle sections are excluded)
    // Only charge for sections NOT included in bundle
    const sectionsCost = pages.filter(p => p.trim()).reduce((total, id) => {
      if (isBundleIncluded('section', id)) return total; // Free with bundle
      return total + (sectionCostMap[id]?.cost || 0);
    }, 0);
    
    // If we have a saved cost but it's higher than calculated, use calculated (bundle sections might not have been excluded)
    if (savedSelections.step9?.cost !== undefined) {
      // Only use saved cost if it matches or is less than calculated (to avoid charging for bundle sections)
      return Math.min(savedSelections.step9.cost, sectionsCost);
    }
    
    return sectionsCost;
  };

  const getAddonsCost = () => {
    // For budget bundles, check if addons are included
    if (isBudgetBundle()) {
      // Only charge for addons NOT included in the bundle
      return addons.filter(a => a.trim()).reduce((total, id) => {
        if (isBundleIncluded('addon', id)) return total; // Free with bundle
        return total + (addonCostMap[id]?.cost || 0);
      }, 0);
    }
    // Use saved one-time cost from localStorage if available (but recalculate to ensure bundle addons are excluded)
    const addonsCost = addons.filter(a => a.trim()).reduce((total, id) => {
      if (isBundleIncluded('addon', id)) return total; // Free with bundle
      return total + (addonCostMap[id]?.cost || 0);
    }, 0);
    
    // If we have a saved cost but it's higher than calculated, use calculated (bundle addons might not have been excluded)
    if (savedSelections.step10?.cost !== undefined) {
      // Only use saved cost if it matches or is less than calculated (to avoid charging for bundle addons)
      return Math.min(savedSelections.step10.cost, addonsCost);
    }
    
    return addonsCost;
  };
  
  const getAddonsMonthly = () => {
    // Use saved monthly cost from localStorage
    return savedSelections.step10?.monthly || 0;
  };

  const getDomainCost = () => {
    // Use saved yearly cost from localStorage if available
    if (savedSelections.step11?.yearly !== undefined) {
      return savedSelections.step11.yearly;
    }
    return domainCostMap[domain]?.cost || 0;
  };
  
  const getDomainName = () => {
    // Use saved domain from localStorage if available
    const savedDomain = savedSelections.step11?.domain;
    const domainToUse = savedDomain || domain;
    return domainCostMap[domainToUse]?.name || domainToUse || '';
  };

  // Monthly costs - bundle may include hosting/maintenance
  const getHostingMonthlyCost = () => {
    // Use saved monthly cost from localStorage if available
    if (savedSelections.step11?.monthly !== undefined) {
      return savedSelections.step11.monthly;
    }
    return hostingCostMap[hosting]?.monthly || 0;
  };
  
  const getMaintenanceMonthlyCost = () => {
    // Use saved monthly cost from localStorage if available
    if (savedSelections.step12?.monthly !== undefined) {
      return savedSelections.step12.monthly;
    }
    return maintenanceCostMap[maintenance]?.monthly || 0;
  };
  
  const getStoreBackendMonthlyCost = () => hasStoreSelection() ? 150 : 0;

  const getTotalMonthlyCost = () =>
    getHostingMonthlyCost() + getMaintenanceMonthlyCost() + getAddonsMonthly() + getStoreBackendMonthlyCost();

  // Calculate extra costs beyond bundle (add-ons selected beyond bundle includes)
  const getExtraCostsBeyondBundle = () => {
    if (!hasBundle) return 0;
    // For budget bundles, sections are always included, so don't charge for them
    const sectionsCost = isBudgetBundle() ? 0 : getSectionsCost();
    const addonsCost = getAddonsCost();
    const domainCost = getDomainCost();
    return sectionsCost + addonsCost + domainCost;
  };

  // One-time development cost (excludes hosting/maintenance)
  const getOneTimeDevelopmentCost = () => {
    if (hasBundle) {
      const bundleCost = getBundlePrice();
      const sectionsCost = getSectionsCost();
      const addonsCost = getAddonsCost();
      const storeBaseCost = getStoreBaseCost();
      const storeOptionsCost = getStoreOptionsCost();
      return bundleCost + sectionsCost + addonsCost + storeBaseCost + storeOptionsCost;
    }
    // À la carte pricing
    return getBaseCost() + getBackendCost() + getAiFeaturesCost() + getAutomationCost() + 
           getStoreBaseCost() + getStoreOptionsCost() + getSectionsCost() + getAddonsCost() + getDomainCost();
  };

  // Total with first year hosting/maintenance
  const getTotalWithFirstYear = () => {
    return getOneTimeDevelopmentCost() + (getTotalMonthlyCost() * 12);
  };

  // Monthly payment plan calculations
  const STARTER_FEE_PERCENT = 20; // 20% deposit to start project
  
  const getStarterFee = () => {
    return Math.ceil(getOneTimeDevelopmentCost() * (STARTER_FEE_PERCENT / 100));
  };
  
  const getRemainingAfterDeposit = () => {
    return getOneTimeDevelopmentCost() - getStarterFee();
  };
  
  const getMonthlyPaymentAmount = () => {
    // Remaining 80% split over 12 months
    return Math.ceil(getRemainingAfterDeposit() / 12);
  };

  // Secure promo validation with hashing to prevent theft
  const applyPromoCode = () => {
    const code = promoCode.trim().toLowerCase();
    setPromoError('');
    
    console.log('=== PROMO DEBUG ===');
    console.log('Input code:', code);
    console.log('Trimmed code:', code);
    
    // Secure hash function using HMAC-like approach
    const secureHash = (str) => {
      // Add pepper (secret salt) to prevent rainbow table attacks
      const pepper = 'M3ll0WQu0t3S3cr3t2026!';
      const combined = str + pepper;
      
      console.log('Combined string:', combined);
      
      let hash = '';
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        const shifted = (char * 31 + i * 7) % 16;
        hash += shifted.toString(16);
      }
      console.log('Generated hash:', hash);
      return hash;
    };
    
    // Hashed promo codes (peppered hashes)
    const promoHashes = {
      'e7cff0e5885847f6d4c281af2e': true,  // 2026 (hashed)
      '46979bdec3663625d4b2a06f8d0c': true,  // launch (hashed)
      'd79232e453addad9c4b2917d6f473': true   // special (hashed)
    };
    
    const inputHash = secureHash(code);
    console.log('Final input hash:', inputHash);
    console.log('Hashes object:', promoHashes);
    console.log('Hash exists:', promoHashes[inputHash]);
    
    if (promoHashes[inputHash]) {
      setPromoApplied(true);
      setPromoError('');
      console.log('PROMO ACCEPTED!');
      
      // Update URL with promo code for mobile widget
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (code) url.searchParams.set('promo', code);
        window.history.replaceState({}, '', url.toString());
        
        // Also save promo to localStorage for widget and persistence
        try {
          const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          currentSelections.promo = {
            code: code,
            applied: true,
            discountPercent: 10
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
          window.dispatchEvent(new Event('selections-updated'));
        } catch (e) {
          console.warn('Error saving promo to localStorage:', e);
        }
      }
    } else if (code === '') {
      setPromoError('Please enter a promo code');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
      console.log('PROMO REJECTED!');
    }
  };

  const getDiscountAmount = () => {
    if (!promoApplied) return 0;
    const totalCost = getOneTimeDevelopmentCost();
    return Math.round(totalCost * 0.1); // 10% discount
  };

  const getDiscountedDevelopmentCost = () => {
    return getOneTimeDevelopmentCost() - getDiscountAmount();
  };

  const getDiscountedMonthlyPayment = () => {
    const discountedCost = getDiscountedDevelopmentCost();
    return Math.round(discountedCost * (1 - STARTER_FEE_PERCENT / 100) / 12);
  };

  // PDF Generation Function - Shows both payment options
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    // Colors
    const primaryColor = [34, 197, 94]; // green-500
    const secondaryColor = [59, 130, 246]; // blue-500
    const purpleColor = [147, 51, 234]; // purple-600
    const textColor = [31, 41, 55]; // slate-800
    const lightGray = [241, 245, 249]; // slate-100
    const white = [255, 255, 255];
    
    let currentY = 0;
    
    // Helper function for text
    const addText = (text, x, y, fontSize = 10, fontWeight = 'normal', color = textColor, align = 'left') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontWeight);
      pdf.setTextColor(color[0], color[1], color[2]);
      if (align === 'center') {
        pdf.text(text, x, y, { align: 'center' });
      } else if (align === 'right') {
        pdf.text(text, x, y, { align: 'right' });
      } else {
        pdf.text(text, x, y);
      }
    };
    
    // Check if we need a new page
    const checkNewPage = (neededSpace = 30) => {
      if (currentY + neededSpace > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
        return true;
      }
      return false;
    };
    
    // ==================== PAGE 1: HEADER & PAYMENT OPTIONS ====================
    
    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    addText('MELLOW QUOTE', pageWidth / 2, 22, 22, 'bold', white, 'center');
    
    currentY = 45;
    
    // Quote Info
    addText('Website Project Quote', margin, currentY, 16, 'bold');
    currentY += 8;
    addText(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY, 9, 'normal', [107, 114, 128]);
    addText(`Quote ID: MQ-${Date.now().toString().slice(-8)}`, pageWidth - margin, currentY, 9, 'normal', [107, 114, 128], 'right');
    currentY += 5;
    
    // Bundle info if applicable
    if (hasBundle) {
      currentY += 5;
      pdf.setFillColor(...purpleColor);
      pdf.rect(margin, currentY, contentWidth, 12, 'F');
      addText(`BUNDLE: ${getBundleName()}`, pageWidth / 2, currentY + 8, 11, 'bold', white, 'center');
      currentY += 18;
    }
    
    // ==================== PAYMENT OPTIONS ====================
    currentY += 5;
    
    if (isBudgetBundle()) {
      // Budget bundles - only show one-time payment
      addText('PAYMENT OPTION', margin, currentY, 14, 'bold');
      currentY += 8;
      
      pdf.setFillColor(...primaryColor);
      pdf.rect(margin, currentY, contentWidth, promoApplied ? 55 : 45, 'F');
      addText('ONE-TIME PAYMENT ONLY', margin + 5, currentY + 8, 10, 'bold', white);
      addText(`Development: $${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}`, margin + 5, currentY + 18, 9, 'normal', white);
      if (promoApplied) {
        addText(`Original: $${getOneTimeDevelopmentCost().toLocaleString()}`, margin + 5, currentY + 26, 8, 'normal', [200, 200, 200]);
        addText(`Discount: -$${getDiscountAmount().toLocaleString()}`, margin + 5, currentY + 32, 8, 'normal', [200, 255, 200]);
        addText(`First Year Total: $${(getDiscountedDevelopmentCost() + getTotalMonthlyCost() * 12).toLocaleString()}`, margin + 5, currentY + 44, 11, 'bold', white);
      } else {
        addText(`Monthly Services: $${getTotalMonthlyCost()}/mo`, margin + 5, currentY + 26, 9, 'normal', white);
        addText(`First Year Total: $${getTotalWithFirstYear().toLocaleString()}`, margin + 5, currentY + 38, 11, 'bold', white);
      }
      
      // Add note about budget bundle payment requirement
      currentY += 55;
      pdf.setFillColor(...[255, 249, 196]); // yellow-50
      pdf.rect(margin, currentY, contentWidth, 25, 'F');
      addText('💰 Budget Bundle Payment Terms:', margin + 5, currentY + 8, 9, 'bold', [120, 53, 15]); // yellow-800
      addText('Full payment required. Monthly payment options not available for budget packages.', margin + 5, currentY + 18, 8, 'normal', [120, 53, 15]);
    } else {
      // Regular bundles - show both payment options
      addText('PAYMENT OPTIONS', margin, currentY, 14, 'bold');
      currentY += 8;
      
      // Option 1: One-Time Payment
      pdf.setFillColor(...primaryColor);
      pdf.rect(margin, currentY, contentWidth / 2 - 3, promoApplied ? 55 : 45, 'F');
      addText('OPTION 1: ONE-TIME', margin + 5, currentY + 8, 10, 'bold', white);
      addText(`Development: $${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}`, margin + 5, currentY + 18, 9, 'normal', white);
      if (promoApplied) {
        addText(`Original: $${getOneTimeDevelopmentCost().toLocaleString()}`, margin + 5, currentY + 26, 8, 'normal', [200, 200, 200]);
        addText(`Discount: -$${getDiscountAmount().toLocaleString()}`, margin + 5, currentY + 32, 8, 'normal', [200, 255, 200]);
        addText(`First Year Total: $${(getDiscountedDevelopmentCost() + getTotalMonthlyCost() * 12).toLocaleString()}`, margin + 5, currentY + 44, 11, 'bold', white);
      } else {
        addText(`Monthly Services: $${getTotalMonthlyCost()}/mo`, margin + 5, currentY + 26, 9, 'normal', white);
        addText(`First Year Total: $${getTotalWithFirstYear().toLocaleString()}`, margin + 5, currentY + 38, 11, 'bold', white);
      }
      
      // Option 2: Monthly Payment
      const option2X = margin + contentWidth / 2 + 3;
      pdf.setFillColor(...secondaryColor);
      pdf.rect(option2X, currentY, promoApplied ? 55 : 45, 'F');
      addText('OPTION 2: MONTHLY', option2X + 5, currentY + 8, 10, 'bold', white);
      addText(`Deposit (${STARTER_FEE_PERCENT}%): $${promoApplied ? Math.round(getDiscountedDevelopmentCost() * STARTER_FEE_PERCENT / 100).toLocaleString() : getStarterFee().toLocaleString()}`, option2X + 5, currentY + 18, 9, 'normal', white);
      addText(`Then: $${promoApplied ? getDiscountedMonthlyPayment().toLocaleString() : getMonthlyPaymentAmount().toLocaleString()}/mo x 12`, option2X + 5, currentY + 26, 9, 'normal', white);
      if (promoApplied) {
        addText(`Original: $${getMonthlyPaymentAmount().toLocaleString()}/mo`, option2X + 5, currentY + 34, 8, 'normal', [200, 200, 200]);
        addText(`Savings: $${(getMonthlyPaymentAmount() - getDiscountedMonthlyPayment()).toLocaleString()}/mo`, option2X + 5, currentY + 38, 8, 'normal', [200, 255, 200]);
        addText(`To Start: $${Math.round(getDiscountedDevelopmentCost() * STARTER_FEE_PERCENT / 100).toLocaleString()}`, option2X + 5, currentY + 46, 10, 'bold', white);
      } else {
        addText(`+ Services: $${getTotalMonthlyCost()}/mo`, option2X + 5, currentY + 34, 9, 'normal', white);
        addText(`To Start: $${getStarterFee().toLocaleString()}`, option2X + 5, currentY + 42, 10, 'bold', white);
      }
    }
    
    currentY += 55;
    
    // ==================== PROJECT DETAILS ====================
    addText('PROJECT DETAILS', margin, currentY, 14, 'bold');
    currentY += 10;
    
    // Info grid
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, currentY, contentWidth, 25, 'F');
    
    addText(`Type: ${websiteType === 'single' ? 'Single Page' : 'Multi Page'}`, margin + 5, currentY + 8, 9);
    addText(`Category: ${category}`, margin + 5, currentY + 16, 9);
    addText(`Subcategory: ${subcategory || 'N/A'}`, pageWidth / 2, currentY + 8, 9);
    addText(`E-commerce: ${store === 'yes-store' ? 'Yes' : 'No'}`, pageWidth / 2, currentY + 16, 9);
    
    currentY += 32;
    
    // ==================== SECTIONS ====================
    if (pages.length > 0) {
      checkNewPage(40);
      addText(`WEBSITE ${getSectionTermCap().toUpperCase()} (${pages.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      const sectionItems = pages.filter(p => p.trim()).map(id => {
        const name = sectionCostMap[id]?.name || id;
        const cost = sectionCostMap[id]?.cost || 0;
        const included = isBundleIncluded('section', id);
        return included ? `${name} ✓` : (cost > 0 ? `${name} ($${cost})` : `${name}`);
      });
      
      // Display in columns
      const cols = 2;
      const colWidth = contentWidth / cols;
      sectionItems.forEach((item, i) => {
        if (i > 0 && i % 8 === 0) {
          currentY += 6;
          checkNewPage(20);
        }
        const col = i % cols;
        const row = Math.floor((i % 8) / cols);
        addText(`• ${item}`, margin + (col * colWidth), currentY + (row * 5), 8);
      });
      currentY += Math.ceil(sectionItems.length / cols) * 5 + 8;
    }
    
    // ==================== ADD-ONS ====================
    if (addons.length > 0) {
      checkNewPage(30);
      addText(`ADD-ONS (${addons.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      addons.filter(a => a.trim()).forEach((id, i) => {
        if (i > 0 && i % 6 === 0) checkNewPage(20);
        const name = addonCostMap[id]?.name || id;
        const cost = addonCostMap[id]?.cost || 0;
        const included = isBundleIncluded('addon', id);
        addText(`• ${name} ${included ? '✓ Included' : `($${cost})`}`, margin, currentY, 9);
        currentY += 6;
      });
      currentY += 5;
    }
    
    // ==================== BACKEND ====================
    if (backend && backend !== 'no') {
      checkNewPage(30);
      const backendItems = backend.split(',').filter(b => b.trim());
      addText(`BACKEND (${backendItems.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      backendItems.forEach((id) => {
        const name = backendCostMap[id]?.name || id;
        const cost = backendCostMap[id]?.cost || 0;
        addText(`• ${name} ($${cost})`, margin, currentY, 9);
        currentY += 6;
      });
      currentY += 5;
    }
    
    // ==================== AI FEATURES ====================
    if (features.length > 0) {
      checkNewPage(30);
      addText(`AI FEATURES (${features.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      features.forEach((id) => {
        const name = aiFeatureCostMap[id]?.name || id;
        const cost = aiFeatureCostMap[id]?.cost || 0;
        addText(`• ${name} ($${cost})`, margin, currentY, 9);
        currentY += 6;
      });
      currentY += 5;
    }
    
    // ==================== AUTOMATION ====================
    if (automation && automation !== 'no' && automation !== 'no-automation') {
      checkNewPage(30);
      const automationItems = automation.split(',').filter(a => a.trim() && a !== 'yes-automation' && a !== 'no-automation');
      if (automationItems.length > 0) {
        addText(`AUTOMATION (${automationItems.length})`, margin, currentY, 12, 'bold');
        currentY += 8;
        
        automationItems.forEach((id) => {
          const name = automationCostMap[id]?.name || id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
          const cost = automationCostMap[id]?.cost || 0;
          addText(`• ${name} ($${cost})`, margin, currentY, 9);
          currentY += 6;
        });
        currentY += 5;
      }
    }
    
    // ==================== E-COMMERCE STORE ====================
    if (store === 'yes-store') {
      checkNewPage(30);
      addText('E-COMMERCE STORE', margin, currentY, 12, 'bold');
      currentY += 8;
      
      addText(`• Store Enabled ($${getStoreBaseCost()})`, margin, currentY, 9);
      currentY += 6;
      
      if (storeOptions.length > 0) {
        storeOptions.forEach((id) => {
          const name = storeCostMap[id]?.name || id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
          const cost = storeCostMap[id]?.cost || 0;
          addText(`  - ${name} ($${cost})`, margin + 5, currentY, 8);
          currentY += 5;
        });
      }
      currentY += 5;
    }
    
    // ==================== DOMAIN ====================
    if (getDomainCost() > 0) {
      checkNewPage(20);
      addText('DOMAIN', margin, currentY, 12, 'bold');
      currentY += 8;
      addText(`• ${getDomainName()} ($${getDomainCost()}/year)`, margin, currentY, 9);
      currentY += 10;
    }
    
    // ==================== ONGOING SERVICES ====================
    checkNewPage(40);
    addText('ONGOING MONTHLY SERVICES', margin, currentY, 12, 'bold');
    currentY += 8;
    
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, currentY, contentWidth, 20, 'F');
    
    const hostingName = hostingCostMap[hosting]?.name || hosting || 'None';
    const hostingCost = getHostingMonthlyCost();
    addText(`Hosting: ${hostingName}`, margin + 5, currentY + 7, 9);
    addText(hostingCost > 0 ? `$${hostingCost}/mo` : 'Included', pageWidth - margin - 5, currentY + 7, 9, 'normal', hostingCost > 0 ? textColor : purpleColor, 'right');
    
    const maintName = maintenanceCostMap[maintenance]?.name || maintenance || 'None';
    const maintCost = getMaintenanceMonthlyCost();
    addText(`Maintenance: ${maintName}`, margin + 5, currentY + 15, 9);
    addText(maintCost > 0 ? `$${maintCost}/mo` : 'Included', pageWidth - margin - 5, currentY + 15, 9, 'normal', maintCost > 0 ? textColor : purpleColor, 'right');
    
    currentY += 28;
    
    // ==================== TOTAL SUMMARY ====================
    checkNewPage(50);
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, currentY, contentWidth, promoApplied ? 45 : 35, 'F');
    
    addText('TOTAL SUMMARY', margin + 5, currentY + 10, 12, 'bold', white);
    addText(`One-Time Development: $${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}`, margin + 5, currentY + 20, 10, 'normal', white);
    if (promoApplied) {
      addText(`Original Price: $${getOneTimeDevelopmentCost().toLocaleString()}`, margin + 5, currentY + 28, 8, 'normal', [200, 200, 200]);
      addText(`Promo Discount: -$${getDiscountAmount().toLocaleString()}`, margin + 5, currentY + 34, 8, 'normal', [200, 255, 200]);
      addText(`First Year Total: $${(getDiscountedDevelopmentCost() + getTotalMonthlyCost() * 12).toLocaleString()}`, pageWidth - margin - 5, currentY + 38, 14, 'bold', white, 'right');
    } else {
      addText(`Monthly Services: $${getTotalMonthlyCost()}/mo`, margin + 5, currentY + 28, 10, 'normal', white);
      addText(`First Year Total: $${getTotalWithFirstYear().toLocaleString()}`, pageWidth - margin - 5, currentY + 24, 14, 'bold', white, 'right');
    }
    
    currentY += 45;
    
    // ==================== FOOTER ====================
    addText('Thank you for choosing Mellow Quote!', pageWidth / 2, currentY, 10, 'bold', textColor, 'center');
    addText('Contact us to get started on your project.', pageWidth / 2, currentY + 6, 9, 'normal', [107, 114, 128], 'center');
    
    // Save the PDF
    pdf.save(`mellow-quote-${Date.now()}.pdf`);
  };

  return (
    <>
      <Head>
        <title>Step 13: Project Summary - Mellow Quote</title>
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
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-2 pt-12 pb-24 sm:pt-4 sm:pb-4 sm:p-4 relative overflow-hidden">
        <div className="hidden sm:block fixed top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="hidden sm:block fixed bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tl from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="fade-in">
            {/* Header - compact on mobile */}
            <div className="text-center mb-3 sm:mb-8">
              <div className="hidden sm:inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight">
                Project Summary
              </h1>
              <p className="hidden sm:block text-lg text-slate-600 max-w-2xl mx-auto">
                Complete breakdown of your website project
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-6 md:p-8">
              
              {/* Promo Code Section */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 text-center">Have a Promo Code?</h3>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-1 text-center">{promoError}</p>
                )}
                {promoApplied && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-xs text-center font-medium">
                      ✨ 10% discount applied! You saved ${getDiscountAmount().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Payment Options - compact on mobile */}
              <div className="mb-4 sm:mb-8">
                <h2 className="text-base sm:text-xl font-bold text-slate-900 mb-2 sm:mb-4 text-center">Payment Plan</h2>
                
                {isBudgetBundle() ? (
                  /* Budget bundles - only show one-time payment option */
                  <div className="max-w-sm mx-auto">
                    <div className="relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-green-500 bg-green-50 shadow-lg">
                      <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">One-Time Payment</div>
                        <div className="text-lg sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                          ${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}
                        </div>
                        {promoApplied && (
                          <div className="text-xs text-green-600 line-through mb-1">
                            ${getOneTimeDevelopmentCost().toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm text-slate-600">Pay in full for development</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">+${getTotalMonthlyCost()}/mo for services</div>
                        <div className="mt-2 sm:mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                          <div className="text-xs text-yellow-800 font-medium">
                            💰 Budget Bundle: Full payment required
                          </div>
                          <div className="text-xs text-yellow-600 mt-1">
                            Monthly payment options not available for budget packages
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Regular bundles - show both payment options */
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {/* One-Time Payment */}
                    <div
                      onClick={() => setPaymentOption('one-time')}
                      className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentOption === 'one-time'
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      {paymentOption === 'one-time' && (
                        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">One-Time</div>
                        <div className="text-lg sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                          ${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}
                        </div>
                        {promoApplied && (
                          <div className="text-xs text-green-600 line-through mb-1">
                            ${getOneTimeDevelopmentCost().toLocaleString()}
                          </div>
                        )}
                        <div className="hidden sm:block text-sm text-slate-600">Pay once for development</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">+${getTotalMonthlyCost()}/mo</div>
                      </div>
                    </div>

                    {/* Monthly Payment */}
                    <div
                      onClick={() => setPaymentOption('monthly')}
                      className={`relative p-3 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentOption === 'monthly'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      {paymentOption === 'monthly' && (
                        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Monthly</div>
                        <div className="hidden sm:block text-sm text-orange-600 font-semibold mb-1">
                          ${STARTER_FEE_PERCENT}% Deposit: ${promoApplied ? Math.round(getDiscountedDevelopmentCost() * STARTER_FEE_PERCENT / 100).toLocaleString() : getStarterFee().toLocaleString()}
                        </div>
                        <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                          ${promoApplied ? getDiscountedMonthlyPayment().toLocaleString() : getMonthlyPaymentAmount().toLocaleString()}/mo
                        </div>
                        {promoApplied && (
                          <div className="text-xs text-orange-600 line-through mb-1">
                            ${getMonthlyPaymentAmount().toLocaleString()}/mo
                          </div>
                        )}
                        <div className="hidden sm:block text-sm text-slate-600">Then 12 monthly payments</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">+${getTotalMonthlyCost()}/mo</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cost Breakdown - compact on mobile */}
              <div className="mb-3 sm:mb-6">
                <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">💰 Cost Breakdown</h2>
                
                {/* Bundle Info - Show if bundle selected */}
                {hasBundle && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-300 mb-3">
                    <h3 className="text-sm sm:text-base font-semibold text-purple-900 mb-2 flex items-center">
                      <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2 text-purple-600 text-xs">🎁</span>
                      Bundle Package Selected
                    </h3>
                    <div className="flex justify-between items-center py-2 border-b border-purple-200">
                      <div>
                        <span className="font-bold text-purple-900 text-sm sm:text-base">{getBundleName()}</span>
                        {isBudgetBundle() ? (
                          <div className="text-xs text-purple-700 mt-0.5">
                            Budget Package with {getBudgetBundleDetails()?.features?.length || 0} included features
                          </div>
                        ) : (
                          <div className="text-xs text-purple-700 mt-0.5">
                            Includes: {bundleSections.length} {getSectionTerm()}, {bundleAddons.length > 0 ? bundleAddons.length + ' add-ons, ' : ''}
                            {bpHosting && bpHosting !== 'basic' ? bpHosting + ' hosting, ' : ''}
                            {bpMaintenance && bpMaintenance !== 'none' ? bpMaintenance + ' maintenance' : ''}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-purple-600 text-lg sm:text-xl">${getBundlePrice().toLocaleString()}</span>
                    </div>
                    
                    {/* Show included features for budget bundles */}
                    {isBudgetBundle() && getBudgetBundleDetails() && (
                      <div className="mt-3">
                        <span className="text-xs font-semibold text-purple-700">Included Features:</span>
                        <div className="mt-1 space-y-1">
                          {getBudgetBundleDetails().features.map((feature, i) => (
                            <div key={i} className="flex items-center text-xs text-purple-700">
                              <svg className="w-3 h-3 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        {/* Show technical details */}
                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <span className="text-xs font-semibold text-purple-700">Technical Details:</span>
                          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-purple-700">
                            <div>
                              <span className="font-medium">Sections:</span> {
                                bundle && bundle.includes('-mp') 
                                  ? `${getBudgetBundleDetails().included.sections.length} per page`
                                  : `${getBudgetBundleDetails().included.sections.length} included`
                              }
                            </div>
                            <div>
                              <span className="font-medium">Backend:</span> {getBudgetBundleDetails().included.backend === 'yes' ? 'Included' : 'Not included'}
                            </div>
                            <div>
                              <span className="font-medium">Hosting:</span> {getBudgetBundleDetails().included.hosting} included
                            </div>
                            <div>
                              <span className="font-medium">Maintenance:</span> {getBudgetBundleDetails().included.maintenance === 'none' ? 'Not included' : 'Included'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Show regular bundle included sections */}
                    {!isBudgetBundle() && bundleSections.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-semibold text-purple-700">Included {getSectionTermCap()}:</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {bundleSections.map((section, i) => (
                            <span key={i} className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full capitalize">
                              {section.replace(/-/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {getExtraCostsBeyondBundle() > 0 && (getSectionsCost() > 0 || getAddonsCost() > 0 || getDomainCost() > 0) && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-purple-800">+ Extra Add-ons Beyond Bundle</span>
                          <span className="font-semibold text-purple-700">${getExtraCostsBeyondBundle().toLocaleString()}</span>
                        </div>
                        {/* Itemized extras */}
                        <div className="pl-4 space-y-1">
                          {addons.filter(a => a.trim() && !isBundleIncluded('addon', a)).map((id, i) => (
                            <div key={i} className="flex justify-between text-xs text-purple-700">
                              <span>• {addonCostMap[id]?.name || id}</span>
                              <span>${addonCostMap[id]?.cost || 0}</span>
                            </div>
                          ))}
                          {pages.filter(p => p.trim() && !isBundleIncluded('section', p) && sectionCostMap[p]?.cost > 0).map((id, i) => (
                            <div key={i} className="flex justify-between text-xs text-purple-700">
                              <span>• {sectionCostMap[id]?.name || id} (Section)</span>
                              <span>${sectionCostMap[id]?.cost || 0}</span>
                            </div>
                          ))}
                          {getDomainCost() > 0 && (
                            <div className="flex justify-between text-xs text-purple-700">
                              <span>• {getDomainName()}</span>
                              <span>${getDomainCost()}/yr</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Development Costs */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-3 border border-slate-200 mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 text-xs">🛠️</span>
                    {hasBundle ? 'Development Costs Summary' : 'Development Costs (One-Time)'}
                  </h3>
                  <div className="space-y-2">
                    {/* Bundle or Base Cost */}
                    {hasBundle ? (
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <div>
                          <span className="font-medium text-slate-900">Bundle Package</span>
                          <span className="text-xs text-purple-600 ml-2">• {getBundleName()}</span>
                        </div>
                        <span className="font-semibold text-purple-600">${getBundlePrice().toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <div>
                          <span className="font-medium text-slate-900">Base Website ({websiteType === 'single' ? 'Single Page' : 'Multi Page'} - {category})</span>
                          <span className="text-xs text-slate-500 ml-2">• {subcategory}</span>
                        </div>
                        <span className="font-semibold text-slate-900">${getBaseCost().toLocaleString()}</span>
                      </div>
                    )}

                    {/* Backend */}
                    {backend && backend !== 'no' && (
                      <div className="py-2 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-900">Backend Technology</span>
                          <span className={`font-semibold ${getBackendCost() === 0 && hasBundle ? 'text-purple-600' : 'text-slate-900'}`}>
                            {getBackendCost() === 0 && hasBundle ? 'Included in Bundle' : `$${getBackendCost().toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {backend.split(',').filter(b => b.trim()).map((id, i) => {
                            const isIncluded = isBundleIncluded('backend', id);
                            return (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${isIncluded ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                              {backendCostMap[id]?.name || id} {isIncluded ? '✓ Included' : `($${backendCostMap[id]?.cost || 0})`}
                            </span>
                          )})}
                        </div>
                      </div>
                    )}

                    {/* AI Features */}
                    {features.length > 0 && (
                      <div className="py-2 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-900">AI Features</span>
                          <span className={`font-semibold ${getAiFeaturesCost() === 0 && hasBundle ? 'text-purple-600' : 'text-slate-900'}`}>
                            {getAiFeaturesCost() === 0 && hasBundle ? 'Included in Bundle' : `$${getAiFeaturesCost().toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {features.filter(f => f.trim()).map((id, i) => {
                            const isIncluded = isBundleIncluded('ai', id);
                            return (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${isIncluded ? 'bg-purple-100 text-purple-700' : 'bg-purple-100 text-purple-700'}`}>
                              {aiFeatureCostMap[id]?.name || id} {isIncluded ? '✓ Included' : `($${aiFeatureCostMap[id]?.cost || 0})`}
                            </span>
                          )})}
                        </div>
                      </div>
                    )}

                    {/* Automation */}
                    {automation && automation !== 'no-automation' && (
                      <div className="py-2 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-900">Automation</span>
                          <span className={`font-semibold ${getAutomationCost() === 0 && hasBundle ? 'text-purple-600' : 'text-slate-900'}`}>
                            {getAutomationCost() === 0 && hasBundle ? 'Included in Bundle' : `$${getAutomationCost().toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {automation.split(',').filter(a => a.trim() && a !== 'yes-automation' && a !== 'no-automation').map((id, i) => {
                            const isIncluded = isBundleIncluded('automation', id);
                            return (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${isIncluded ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                              {automationCostMap[id]?.name || id} {isIncluded ? '✓ Included' : `($${automationCostMap[id]?.cost || 0})`}
                            </span>
                          )})}
                        </div>
                      </div>
                    )}

                    {/* Store */}
                    {store === 'yes-store' && (
                      <div className="py-2 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-900">E-Commerce Store</span>
                          <span className={`font-semibold ${(getStoreBaseCost() + getStoreOptionsCost()) === 0 && hasBundle ? 'text-purple-600' : 'text-slate-900'}`}>
                            {(getStoreBaseCost() + getStoreOptionsCost()) === 0 && hasBundle ? 'Included in Bundle' : `$${(getStoreBaseCost() + getStoreOptionsCost()).toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${bpStore === 'yes-store' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            Base Store {bpStore === 'yes-store' ? '✓ Included' : '($600)'}
                          </span>
                          {storeOptions.filter(s => s.trim()).map((id, i) => {
                            const bundleStoreOpts = bpStoreOptions ? bpStoreOptions.split(',') : [];
                            const isIncluded = bundleStoreOpts.includes(id);
                            return (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${isIncluded ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {storeCostMap[id]?.name || id} {isIncluded ? '✓ Included' : `($${storeCostMap[id]?.cost || 0})`}
                            </span>
                          )})}
                        </div>
                      </div>
                    )}


                    {/* Add-ons */}
                    {addons.length > 0 && (
                      <div className="py-2 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-900">Add-ons</span>
                          <span className="font-semibold text-slate-900">
                            {getAddonsCost() > 0 ? `$${getAddonsCost().toLocaleString()}` : (hasBundle ? 'Included in Bundle' : '$0')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {addons.filter(a => a.trim()).map((id, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${isBundleIncluded('addon', id) ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                              {addonCostMap[id]?.name || id} {isBundleIncluded('addon', id) ? '✓ Included' : `($${addonCostMap[id]?.cost || 0})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Domain */}
                    {getDomainCost() > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-900">{getDomainName()}</span>
                        <span className="font-semibold text-slate-900">${getDomainCost().toLocaleString()}/yr</span>
                      </div>
                    )}

                    {/* Development Total */}
                    <div className="flex justify-between items-center py-3 bg-blue-100 rounded-lg px-4 mt-2">
                      <div>
                        <span className="font-bold text-blue-900">Total Development Cost</span>
                        {promoApplied && (
                          <div className="text-xs text-green-600 mt-1">10% promo discount applied</div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-900 text-xl">
                          ${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}
                        </span>
                        {promoApplied && (
                          <div className="text-xs text-green-600 line-through">
                            ${getOneTimeDevelopmentCost().toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ongoing Monthly Costs */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-2 text-orange-600 text-xs">📅</span>
                    Ongoing Monthly Costs
                  </h3>
                  <div className="space-y-2">
                    {/* Hosting */}
                    {hosting && (
                      <div className="flex justify-between items-center py-2 border-b border-orange-200">
                        <div>
                          <span className="font-medium text-slate-900">{hostingCostMap[hosting]?.name || hosting}</span>
                          <span className="text-xs text-slate-500 ml-2">• Billed monthly</span>
                        </div>
                        <span className={`font-semibold ${getHostingMonthlyCost() > 0 ? 'text-orange-600' : 'text-purple-600'}`}>
                          {getHostingMonthlyCost() > 0 ? `$${getHostingMonthlyCost()}/mo` : '✓ Included in Bundle'}
                        </span>
                      </div>
                    )}

                    {/* Maintenance */}
                    {maintenance && maintenance !== 'no-maintenance' && (
                      <div className="flex justify-between items-center py-2 border-b border-orange-200">
                        <div>
                          <span className="font-medium text-slate-900">{maintenanceCostMap[maintenance]?.name || maintenance}</span>
                          <span className="text-xs text-slate-500 ml-2">• Billed monthly</span>
                        </div>
                        <span className={`font-semibold ${getMaintenanceMonthlyCost() > 0 ? 'text-orange-600' : 'text-purple-600'}`}>
                          {getMaintenanceMonthlyCost() > 0 ? `$${getMaintenanceMonthlyCost()}/mo` : '✓ Included in Bundle'}
                        </span>
                      </div>
                    )}

                    {/* Store Backend */}
                    {getStoreBackendMonthlyCost() > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-orange-200">
                        <div>
                          <span className="font-medium text-slate-900">E-Commerce Backend & Payment System</span>
                          <span className="text-xs text-slate-500 ml-2">• Store management, payment processing, security</span>
                        </div>
                        <span className="font-semibold text-orange-600">
                          ${getStoreBackendMonthlyCost()}/mo
                        </span>
                      </div>
                    )}

                    {/* Monthly Add-ons */}
                    {getAddonsMonthly() > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-orange-200">
                        <div>
                          <span className="font-medium text-slate-900">Monthly Add-ons</span>
                          <span className="text-xs text-slate-500 ml-2">• Recurring services</span>
                        </div>
                        <span className="font-semibold text-orange-600">
                          ${getAddonsMonthly()}/mo
                        </span>
                      </div>
                    )}

                    {/* Monthly Total */}
                    <div className="flex justify-between items-center py-3 bg-orange-100 rounded-lg px-4 mt-2">
                      <div>
                        <span className="font-bold text-orange-900">Total Monthly Cost</span>
                        <div className="text-xs text-orange-700 mt-1">
                          {getHostingMonthlyCost() > 0 && (
                            <>
                              <span>Hosting (${getHostingMonthlyCost()}/mo)</span>
                              {getStoreBackendMonthlyCost() > 0 && <span className="mx-1">+</span>}
                            </>
                          )}
                          {getStoreBackendMonthlyCost() > 0 && (
                            <span>Store Backend (${getStoreBackendMonthlyCost()}/mo)</span>
                          )}
                          {getMaintenanceMonthlyCost() > 0 && (
                            <>
                              <span className="mx-1">+</span>
                              <span>Maintenance (${getMaintenanceMonthlyCost()}/mo)</span>
                            </>
                          )}
                          {getAddonsMonthly() > 0 && (
                            <>
                              <span className="mx-1">+</span>
                              <span>Add-ons (${getAddonsMonthly()}/mo)</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-orange-900 text-xl">${getTotalMonthlyCost()}/mo</span>
                    </div>

                    {getTotalMonthlyCost() > 0 && (
                      <div className="text-xs text-slate-600 mt-2 p-3 bg-white/50 rounded-lg">
                        <strong>Monthly Cost Breakdown:</strong> 
                        {getHostingMonthlyCost() > 0 && (
                          <>
                            <span className="ml-1">Hosting (${getHostingMonthlyCost()}/mo)</span>
                            {getStoreBackendMonthlyCost() > 0 && <span className="mx-1">+</span>}
                          </>
                        )}
                        {getStoreBackendMonthlyCost() > 0 && (
                          <span className="ml-1">Store Backend (${getStoreBackendMonthlyCost()}/mo)</span>
                        )}
                        {getMaintenanceMonthlyCost() > 0 && (
                          <>
                            <span className="mx-1">+</span>
                            <span className="ml-1">Maintenance (${getMaintenanceMonthlyCost()}/mo)</span>
                          </>
                        )}
                        {getAddonsMonthly() > 0 && (
                          <>
                            <span className="mx-1">+</span>
                            <span className="ml-1">Add-ons (${getAddonsMonthly()}/mo)</span>
                          </>
                        )}
                        <div className="mt-1">
                          <strong>First year total:</strong> ${(getTotalMonthlyCost() * 12).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yearly Costs */}
                {getDomainCost() > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-3 border border-blue-200 mt-4">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 text-xs">🗓️</span>
                      Yearly Costs
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <div>
                          <span className="font-medium text-slate-900">{getDomainName()}</span>
                          <span className="text-xs text-slate-500 ml-2">• Billed yearly</span>
                        </div>
                        <span className="font-semibold text-blue-700">${getDomainCost()}/yr</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-blue-100 rounded-lg px-4 mt-2">
                        <span className="font-bold text-blue-900">Total Yearly Cost</span>
                        <span className="font-bold text-blue-900 text-xl">${getDomainCost()}/yr</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-6 border border-green-300 shadow-lg mb-6 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-green-200/20 rounded-full -ml-12 -mb-12"></div>
                
                {/* Header */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-xl shadow-lg">
                      <span className="text-2xl">📋</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 ml-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Your Payment Summary
                    </h2>
                  </div>
                </div>
                
                {paymentOption === 'one-time' ? (
                  <div className="relative space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-green-200 shadow-sm">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <span className="text-green-600 text-sm">💻</span>
                        </div>
                        <span className="font-medium text-slate-800">Development (One-Time)</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">
                        ${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}
                      </span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-1.5 rounded-lg mr-2">
                            <span className="text-green-600 text-xs">🎉</span>
                          </div>
                          <span className="text-sm font-medium text-green-700">Promo Discount (10%)</span>
                        </div>
                        <span className="font-bold text-green-600">-${getDiscountAmount().toLocaleString()}</span>
                      </div>
                    )}
                    {getTotalMonthlyCost() > 0 && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-orange-200 shadow-sm">
                          <div className="flex items-center">
                            <div className="bg-orange-100 p-2 rounded-lg mr-3">
                              <span className="text-orange-600 text-sm">🔄</span>
                            </div>
                            <span className="font-medium text-slate-800">Monthly Services</span>
                          </div>
                          <span className="font-bold text-orange-600 text-lg">${getTotalMonthlyCost()}/mo</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center">
                            <div className="bg-orange-100 p-1.5 rounded-lg mr-2">
                              <span className="text-orange-600 text-xs">📅</span>
                            </div>
                            <span className="text-sm font-medium text-orange-700">First Year Services (12 mo)</span>
                          </div>
                          <span className="font-semibold text-orange-600">${(getTotalMonthlyCost() * 12).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg border-2 border-green-600">
                      <div className="flex items-center">
                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                          <span className="text-white text-lg">💰</span>
                        </div>
                        <span className="font-bold text-white text-lg">Total First Year</span>
                      </div>
                      <span className="font-bold text-white text-xl">
                        ${((promoApplied ? getDiscountedDevelopmentCost() : getOneTimeDevelopmentCost()) + (getTotalMonthlyCost() * 12)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative space-y-4">
                    {/* Main Summary Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 shadow-lg">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <span className="bg-blue-100 p-2 rounded-lg mr-3">
                          <span className="text-blue-600">�</span>
                        </span>
                        Monthly Payment Plan
                      </h3>
                      
                      {/* What You Pay Today */}
                      <div className="bg-white rounded-xl p-4 border border-blue-200 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-600">Due Today</span>
                          <span className="text-2xl font-bold text-blue-600">
                            ${promoApplied ? Math.round(getDiscountedDevelopmentCost() * STARTER_FEE_PERCENT / 100).toLocaleString() : getStarterFee().toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {STARTER_FEE_PERCENT}% deposit to begin your project
                        </div>
                      </div>
                      
                      {/* What You Pay Monthly */}
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="text-sm text-slate-600">Monthly for 12 months</span>
                            {promoApplied && (
                              <div className="text-xs text-green-600 font-medium">🎉 Promo discount applied!</div>
                            )}
                          </div>
                          <span className="text-2xl font-bold text-orange-600">
                            ${((promoApplied ? getDiscountedMonthlyPayment() : getMonthlyPaymentAmount()) + getTotalMonthlyCost()).toLocaleString()}/mo
                          </span>
                        </div>
                        
                        {/* Breakdown of monthly payment */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-slate-600">
                            <span>• Development payments</span>
                            <span>${promoApplied ? getDiscountedMonthlyPayment().toLocaleString() : getMonthlyPaymentAmount().toLocaleString()}/mo</span>
                          </div>
                          {promoApplied && (
                            <div className="flex justify-between text-green-600">
                              <span>• Promo savings</span>
                              <span>-${(getMonthlyPaymentAmount() - getDiscountedMonthlyPayment()).toLocaleString()}/mo</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-600">
                            <span>• Monthly services</span>
                            <span>${getTotalMonthlyCost()}/mo</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Development Cost */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-slate-600">Total development cost</span>
                            <div className="text-xs text-slate-500 mt-1">
                              {promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()} paid over 12 months
                            </div>
                          </div>
                          <span className="text-xl font-bold text-slate-800">
                            ${promoApplied ? getDiscountedDevelopmentCost().toLocaleString() : getOneTimeDevelopmentCost().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Simple Payment Schedule */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                        <span className="text-lg mr-2">📅</span>
                        Payment Schedule
                      </h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Today:</span>
                          <span className="font-medium">${promoApplied ? Math.round(getDiscountedDevelopmentCost() * STARTER_FEE_PERCENT / 100).toLocaleString() : getStarterFee().toLocaleString()} (deposit)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next 12 months:</span>
                          <span className="font-medium">${promoApplied ? getDiscountedMonthlyPayment().toLocaleString() : getMonthlyPaymentAmount().toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span>Ongoing after 12 months:</span>
                          <span className="font-medium">${getTotalMonthlyCost()}/mo (services only)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => {
                    // Check if this came from a budget bundle
                    if (fromBudget || isBudgetBundle()) {
                      // Go back to budget selection page (Step 3)
                      router.push(`/step-3?type=${websiteType}&category=${category}&bundle=${bundle}&from=budget&budget=true`);
                    } else {
                      // Regular flow - go back to Step 12 (preserve bundle and maintenance)
                      router.push(`/step-12?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}${addons.length ? '&addons=' + addons.join(',') : ''}&hosting=${hosting}&domain=${domain}&maintenance=${maintenance}${bundleParams}`);
                    }
                  }}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                >
                  ← Back
                </button>
              </div>

              {/* Additional Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={generatePDF}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  📄 Download PDF
                </button>
                
                <button
                  onClick={() => {
                    setShowEmailModal(true);
                    setEmailSent(false);
                    setEmailInput('');
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  📧 Share Quote
                </button>
                
                <button
                  onClick={async () => {
                    // Send quote to owner (OWNER_EMAIL)
                    const quoteData = {
                      quoteId: `MQ-${Date.now().toString().slice(-8)}`,
                      generatedDate: new Date().toLocaleDateString(),
                      customerEmail: emailInput || 'Not provided',
                      websiteType,
                      category,
                      subcategory,
                      bundle: hasBundle ? getBundleName() : null,
                      bundlePrice: hasBundle ? getBundlePrice() : null,
                      sections: pages,
                      addons,
                      backend,
                      aiFeatures: features,
                      automation,
                      store,
                      storeOptions,
                      storeCost: getStoreBaseCost(),
                      hosting,
                      hostingCost: getHostingMonthlyCost(),
                      domain: savedSelections.step11?.domain || domain,
                      domainCost: getDomainCost(),
                      maintenance,
                      maintenanceCost: getMaintenanceMonthlyCost(),
                      developmentCost: getOneTimeDevelopmentCost(),
                      monthlyCost: getTotalMonthlyCost(),
                      firstYearTotal: getTotalWithFirstYear(),
                      starterFee: getStarterFee(),
                      monthlyPayment: getMonthlyPaymentAmount(),
                      starterFeePercent: STARTER_FEE_PERCENT
                    };
                    
                    try {
                      const response = await fetch('/api/send-quote', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(quoteData)
                      });
                      
                      const data = await response.json();
                      
                      if (data.success) {
                        setSuccessQuoteId(quoteData.quoteId);
                        setShowSuccessModal(true);
                      } else {
                        setSuccessQuoteId('');
                        setShowSuccessModal(true);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      setSuccessQuoteId('');
                      setShowSuccessModal(true);
                    }
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  📧 Send to Coder
                </button>
                
                <button
                  onClick={() => {
                    router.push('/');
                  }}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  🚀 Start a New Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Share Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            {!emailSent ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900">📧 Share Quote via Email</h3>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <p className="text-slate-600 mb-4">
                  Enter your email address and we'll send you the complete quote with all details.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Quote Summary</h4>
                  <div className="text-sm text-purple-700 space-y-1">
                    <p>• {websiteType === 'single' ? 'Single Page' : 'Multi Page'} - {category}</p>
                    <p>• Development: ${getOneTimeDevelopmentCost().toLocaleString()}</p>
                    <p>• Monthly Services: ${getTotalMonthlyCost()}/mo</p>
                    {hasBundle && <p>• Bundle: {getBundleName()}</p>}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!emailInput || !emailInput.includes('@')) {
                        alert('Please enter a valid email address');
                        return;
                      }
                      
                      setEmailSending(true);
                      
                      // Build quote data
                      const quoteData = {
                        email: emailInput,
                        websiteType,
                        category,
                        subcategory,
                        bundle: hasBundle ? getBundleName() : null,
                        bundlePrice: hasBundle ? getBundlePrice() : null,
                        sections: pages,
                        addons,
                        backend,
                        aiFeatures: features,
                        automation,
                        store,
                        storeOptions,
                        storeCost: getStoreBaseCost(),
                        hosting,
                        hostingCost: getHostingMonthlyCost(),
                        domain: savedSelections.step11?.domain || domain,
                        domainCost: getDomainCost(),
                        maintenance,
                        maintenanceCost: getMaintenanceMonthlyCost(),
                        developmentCost: getOneTimeDevelopmentCost(),
                        discountedDevelopmentCost: promoApplied ? getDiscountedDevelopmentCost() : null,
                        discountAmount: promoApplied ? getDiscountAmount() : null,
                        monthlyCost: getTotalMonthlyCost(),
                        firstYearTotal: getTotalWithFirstYear(),
                        discountedFirstYearTotal: promoApplied ? (getDiscountedDevelopmentCost() + getTotalMonthlyCost() * 12) : null,
                        starterFee: getStarterFee(),
                        discountedStarterFee: promoApplied ? Math.round(getDiscountedDevelopmentCost() * STARTER_FEE_PERCENT / 100) : null,
                        promoApplied: promoApplied,
                        promoCode: promoApplied ? promoCode : null,
                        monthlyPayment: getMonthlyPaymentAmount(),
                        starterFeePercent: STARTER_FEE_PERCENT,
                        quoteId: `MQ-${Date.now().toString().slice(-8)}`,
                        generatedDate: new Date().toLocaleDateString()
                      };
                      
                      // Send quote to customer email
                      try {
                        const response = await fetch('/api/send-quote-customer', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(quoteData)
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                          setEmailSent(true);
                        } else {
                          alert('Failed to send email: ' + (data.error || 'Unknown error'));
                        }
                      } catch (error) {
                        console.error('Error sending email:', error);
                        alert('Failed to send email. Please try again.');
                      } finally {
                        setEmailSending(false);
                      }
                    }}
                    disabled={emailSending}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emailSending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Quote'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Quote Sent!</h3>
                <p className="text-slate-600 mb-4">
                  We've sent your complete quote to<br/>
                  <span className="font-semibold text-purple-600">{emailInput}</span>
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  Check your inbox (and spam folder) for the detailed quote.
                </p>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal for Send to Coder */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-bounce-in">
            {successQuoteId ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Quote Sent Successfully! 🎉</h3>
                <p className="text-slate-600 mb-4">
                  Your quote has been sent to the Coder.
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
                  <p className="text-sm text-slate-600 mb-1">Quote ID</p>
                  <p className="text-lg font-bold text-green-600">{successQuoteId}</p>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  You'll receive a response shortly!
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Awesome!
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Oops! Something Went Wrong</h3>
                <p className="text-slate-600 mb-6">
                  Failed to send the quote. Please try again or contact support.
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
