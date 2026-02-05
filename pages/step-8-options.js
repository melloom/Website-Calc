import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step8Options() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const router = useRouter();
  
  const websiteType = router.query.type || 'single';
  const category = router.query.category || 'business';
  const subcategory = router.query.subcategory || '';
  const backend = router.query.backend || '';
  const aiChoice = router.query.ai || '';
  const automation = router.query.automation || '';
  const fromPage = router.query.from || '';
  const storeOptions = router.query.storeOptions || '';
  
  // Bundle preselects (bp_ prefix)
  const bpStoreOptions = router.query.bp_storeOptions || '';
  const bundle = router.query.bundle || '';
  
  // Check if this is a budget bundle
  const isBudgetBundle = () => {
    const budgetBundleIds = ['budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'];
    return budgetBundleIds.includes(bundle);
  };
  
  // All bundle preselects for navigation
  const bpBackend = router.query.bp_backend || '';
  const bpBackendOptions = router.query.bp_backendOptions || '';
  const bpAi = router.query.bp_ai || '';
  const bpAiFeatures = router.query.bp_aiFeatures || '';
  const bpAutomation = router.query.bp_automation || '';
  const bpAutomationFeatures = router.query.bp_automationFeatures || '';
  const bpStore = router.query.bp_store || '';
  const bpSections = router.query.bp_sections || '';
  const bpAddons = router.query.bp_addons || '';
  const bpHosting = router.query.bp_hosting || '';
  const bpMaintenance = router.query.bp_maintenance || '';
  
  // Build bundle params string for navigation (centralized)
  const bundleParams = buildBundleParams(router.query);
  
  // Parse bundle-locked store options (can't be toggled off)
  const lockedStoreOptions = bpStoreOptions ? bpStoreOptions.split(',').filter(o => o.trim()) : [];
  
  // Check if a store option is locked by bundle or included with base store
  const isStoreOptionLocked = (optionId) => {
    const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
    return lockedStoreOptions.includes(optionId) || defaultStoreFeatures.includes(optionId);
  };

  useEffect(() => {
    console.log('Step 8 Options useEffect - fromPage:', fromPage, 'storeOptions:', storeOptions, 'options:', router.query.options, 'bpStoreOptions:', bpStoreOptions);
    
    const initialOptions = {};
    
    // PRIORITY 0: Add default store features that come with base store selection
    // These are always included when store is selected
    const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
    defaultStoreFeatures.forEach(feature => {
      initialOptions[feature] = true;
    });
    console.log('Added default store features:', defaultStoreFeatures);
    
    // PRIORITY 1: Auto-select bundle store options (these are locked)
    if (bpStoreOptions && bpStoreOptions.length > 0) {
      const bpOptions = bpStoreOptions.split(',').filter(o => o.trim());
      bpOptions.forEach(option => {
        if (option) initialOptions[option] = true;
      });
      console.log('Auto-selected bundle store options:', bpOptions);
    }
    
    // PRIORITY 2: Restore any additional options from URL
    const optionsString = storeOptions || router.query.options || '';
    if (optionsString) {
      const options = optionsString.split(',').filter(o => o.trim());
      options.forEach(option => {
        if (option) initialOptions[option] = true;
      });
      console.log('Restored store options from URL:', options);
    }
    
    if (Object.keys(initialOptions).length > 0) {
      setSelectedOptions(initialOptions);
    }
  }, [router.query.options, storeOptions, fromPage, bpStoreOptions]);

  const getStoreOptions = () => {
    // Base options available to all categories
    const baseOptions = [
      {
        id: 'basic-products',
        name: 'Basic Products',
        description: 'Simple product catalog with images and prices',
        price: '+$100',
        features: ['Product Listings', 'Product Images', 'Price Display', 'Basic Search', 'Product Categories']
      },
      {
        id: 'shopping-cart',
        name: 'Shopping Cart',
        description: 'Full shopping cart functionality',
        price: '+$200',
        features: ['Add to Cart', 'Cart Management', 'Quantity Controls', 'Cart Summary', 'Guest Checkout']
      },
      {
        id: 'payment-processing',
        name: 'Payment Processing',
        description: 'Accept credit cards and online payments',
        price: '+$150',
        features: ['Credit Card Processing', 'PayPal Integration', 'Stripe Integration', 'Secure Checkout', 'Payment Confirmation']
      },
      {
        id: 'order-management',
        name: 'Order Management',
        description: 'Complete order processing and tracking system',
        price: '+$250',
        features: ['Order Dashboard', 'Status Tracking', 'Order History', 'Customer Notifications', 'Shipping Labels']
      },
      {
        id: 'inventory-tracking',
        name: 'Inventory Tracking',
        description: 'Real-time stock level monitoring',
        price: '+$200',
        features: ['Stock Levels', 'Low Stock Alerts', 'Automatic Updates', 'Product Variants', 'Warehouse Management']
      },
      {
        id: 'shipping-calculator',
        name: 'Shipping Calculator',
        description: 'Dynamic shipping cost calculation',
        price: '+$150',
        features: ['Rate Calculation', 'Multiple Carriers', 'Zone Pricing', 'Free Shipping Rules', 'International Shipping']
      },
      {
        id: 'customer-accounts',
        name: 'Customer Accounts',
        description: 'User registration and account management',
        price: '+$180',
        features: ['User Registration', 'Order History', 'Saved Addresses', 'Wishlist', 'Account Dashboard']
      },
      {
        id: 'tax-calculator',
        name: 'Tax Calculator',
        description: 'Automatic tax calculation by location',
        price: '+$120',
        features: ['Sales Tax', 'VAT Support', 'Location Based', 'Tax Reports', 'Multi-State Taxes']
      },
      {
        id: 'discount-coupons',
        name: 'Discount & Coupons',
        description: 'Promotional code and discount system',
        price: '+$160',
        features: ['Coupon Codes', 'Percentage Discounts', 'Fixed Amount Off', 'Free Shipping', 'Bulk Discounts']
      },
      {
        id: 'product-reviews',
        name: 'Product Reviews',
        description: 'Customer review and rating system',
        price: '+$140',
        features: ['Star Ratings', 'Written Reviews', 'Photo Reviews', 'Customer Questions', 'Review Moderation']
      },
      {
        id: 'email-notifications',
        name: 'Email Notifications',
        description: 'Automated email alerts for customers',
        price: '+$130',
        features: ['Order Confirmation', 'Shipping Updates', 'Abandoned Cart', 'Marketing Emails', 'Customer Support']
      },
      {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        description: 'Sales and customer analytics',
        price: '+$200',
        features: ['Sales Reports', 'Customer Analytics', 'Product Performance', 'Conversion Tracking', 'Revenue Insights']
      },
      {
        id: 'wishlist-favorites',
        name: 'Wishlist & Favorites',
        description: 'Save products for later purchase',
        price: '+$100',
        features: ['Product Wishlist', 'Share Lists', 'Price Alerts', 'Stock Notifications', 'Quick Reorder']
      },
      {
        id: 'product-comparisons',
        name: 'Product Comparisons',
        description: 'Side-by-side product comparison tool',
        price: '+$120',
        features: ['Feature Comparison', 'Spec Matrix', 'Price Comparison', 'Visual Compare', 'Share Results']
      },
      {
        id: 'quick-view-modal',
        name: 'Quick View Modal',
        description: 'Fast product preview without page load',
        price: '+$80',
        features: ['Modal Preview', 'Add to Cart', 'Image Gallery', 'Product Details', 'Mobile Responsive']
      },
      {
        id: 'related-products',
        name: 'Related Products',
        description: 'Smart product recommendations',
        price: '+$150',
        features: ['Cross-sells', 'Upsells', 'Frequently Bought', 'Category Based', 'Purchase History']
      },
      {
        id: 'order-tracking',
        name: 'Order Tracking Portal',
        description: 'Customer order tracking interface',
        price: '+$110',
        features: ['Tracking Page', 'Status Updates', 'Delivery Estimates', 'SMS Updates', 'Email Notifications']
      },
      {
        id: 'refund-management',
        name: 'Refund Management',
        description: 'Handle returns and refunds efficiently',
        price: '+$140',
        features: ['Return Requests', 'Refund Processing', 'Exchange Options', 'Store Credit', 'Return Labels']
      },
      {
        id: 'bulk-orders',
        name: 'Bulk Orders',
        description: 'Wholesale and bulk purchase support',
        price: '+$180',
        features: ['Quantity Discounts', 'Wholesale Pricing', 'Bulk Shipping', 'B2B Accounts', 'Volume Quotes']
      },
      {
        id: 'gift-cards',
        name: 'Gift Cards',
        description: 'Digital and physical gift card system',
        price: '+$160',
        features: ['Digital Gift Cards', 'Physical Cards', 'Custom Amounts', 'Balance Tracking', 'Gift Messages']
      },
      {
        id: 'subscription-products',
        name: 'Subscription Products',
        description: 'Recurring payment and subscription management',
        price: '+$220',
        features: ['Recurring Billing', 'Subscription Plans', 'Trial Periods', 'Pause/Cancel', 'Usage Tracking']
      }
    ];
    
    // Category-specific options
    const categoryOptions = {
      business: [
        {
          id: 'invoice-system',
          name: 'Invoice System',
          description: 'Generate and send professional invoices',
          price: '+$200',
          features: ['Invoice Generation', 'PDF Export', 'Email Invoices', 'Payment Tracking', 'Invoice History']
        },
        {
          id: 'subscription-billing',
          name: 'Subscription Billing',
          description: 'Recurring payments for services',
          price: '+$250',
          features: ['Recurring Billing', 'Subscription Plans', 'Auto-renewal', 'Plan Management', 'Usage Tracking']
        },
        {
          id: 'customer-accounts-v2',
          name: 'Customer Accounts',
          description: 'Customer login and order history',
          price: '+$150',
          features: ['User Registration', 'Order History', 'Saved Addresses', 'Wishlist', 'Account Dashboard']
        }
      ],
      portfolio: [
        {
          id: 'digital-downloads',
          name: 'Digital Downloads',
          description: 'Sell digital files and artwork',
          price: '+$180',
          features: ['File Delivery', 'Download Links', 'License Management', 'Preview Files', 'Multiple Formats']
        },
        {
          id: 'commission-system',
          name: 'Commission System',
          description: 'Accept custom work requests',
          price: '+$220',
          features: ['Request Forms', 'Quote Generation', 'Progress Tracking', 'Revision Handling', 'Deposit System']
        },
        {
          id: 'print-on-demand',
          name: 'Print on Demand',
          description: 'Sell prints and merchandise',
          price: '+$200',
          features: ['Print Products', 'Size Options', 'Material Choices', 'Fulfillment Integration', 'Mockups']
        }
      ],
      blog: [
        {
          id: 'digital-products',
          name: 'Digital Products',
          description: 'Sell ebooks, courses, templates',
          price: '+$180',
          features: ['File Hosting', 'Instant Delivery', 'Access Control', 'Preview Content', 'Bundle Deals']
        },
        {
          id: 'membership-access',
          name: 'Membership Access',
          description: 'Premium content subscriptions',
          price: '+$250',
          features: ['Member Tiers', 'Content Gating', 'Member Dashboard', 'Drip Content', 'Community Access']
        },
        {
          id: 'merchandise',
          name: 'Merchandise Store',
          description: 'Branded merchandise sales',
          price: '+$150',
          features: ['Product Variants', 'Shipping Calc', 'Order Tracking', 'Inventory Sync', 'Brand Customization']
        }
      ],
      creative: [
        {
          id: 'licensing-system',
          name: 'Licensing System',
          description: 'Sell usage rights and licenses',
          price: '+$220',
          features: ['License Types', 'Usage Terms', 'Rights Management', 'License Downloads', 'Renewal Options']
        },
        {
          id: 'gallery-sales',
          name: 'Gallery Sales',
          description: 'Sell artwork directly from gallery',
          price: '+$180',
          features: ['Gallery Integration', 'Inquiry System', 'Price Display', 'Availability Status', 'Collector Tools']
        },
        {
          id: 'workshop-booking',
          name: 'Workshop Booking',
          description: 'Sell tickets to workshops/classes',
          price: '+$200',
          features: ['Event Calendar', 'Ticket Sales', 'Capacity Limits', 'Attendee Management', 'Reminders']
        }
      ],
      ecommerce: [
        {
          id: 'inventory-management',
          name: 'Inventory Management',
          description: 'Track stock levels and availability',
          price: '+$180',
          features: ['Stock Tracking', 'Low Stock Alerts', 'Product Variants', 'Inventory Reports', 'Bulk Updates']
        },
        {
          id: 'shipping-calculator',
          name: 'Shipping Calculator',
          description: 'Calculate shipping costs by location',
          price: '+$150',
          features: ['Rate Calculation', 'Multiple Carriers', 'Zone Pricing', 'Free Shipping Rules', 'Tracking Integration']
        },
        {
          id: 'order-management',
          name: 'Order Management',
          description: 'Complete order processing system',
          price: '+$200',
          features: ['Order Dashboard', 'Status Updates', 'Fulfillment Tools', 'Returns/Refunds', 'Customer Communication']
        }
      ],
      landing: [
        {
          id: 'single-product',
          name: 'Single Product Focus',
          description: 'Optimized for one product sales',
          price: '+$120',
          features: ['Product Showcase', 'Feature Highlights', 'Social Proof', 'Urgency Elements', 'Simple Checkout']
        },
        {
          id: 'upsell-system',
          name: 'Upsell System',
          description: 'Increase order value',
          price: '+$180',
          features: ['Order Bumps', 'Post-purchase Offers', 'Bundle Suggestions', 'Cross-sells', 'One-click Upsells']
        },
        {
          id: 'affiliate-tracking',
          name: 'Affiliate Tracking',
          description: 'Track referral sales',
          price: '+$200',
          features: ['Affiliate Links', 'Commission Tracking', 'Payout Management', 'Performance Reports', 'Coupon Codes']
        }
      ],
      product: [
        {
          id: 'product-configurator',
          name: 'Product Configurator',
          description: 'Custom product options',
          price: '+$250',
          features: ['Option Builder', 'Visual Preview', 'Price Calculator', 'Save Configurations', 'Share Options']
        },
        {
          id: 'reviews-ratings',
          name: 'Reviews & Ratings',
          description: 'Customer reviews system',
          price: '+$120',
          features: ['Star Ratings', 'Written Reviews', 'Photo Reviews', 'Verified Buyers', 'Review Moderation']
        },
        {
          id: 'comparison-tool',
          name: 'Comparison Tool',
          description: 'Compare product features',
          price: '+$150',
          features: ['Side-by-side Compare', 'Feature Matrix', 'Spec Comparison', 'Save Comparisons', 'Share Feature']
        }
      ]
    };
    
    // Get category-specific options or default to business
    const specificOptions = categoryOptions[category] || categoryOptions.business;
    
    return [...baseOptions, ...specificOptions];
  };
  
  // Legacy options for backward compatibility
  const getLegacyOptions = () => {
    return [
      {
        id: 'customer-accounts',
        name: 'Customer Accounts',
        description: 'Let customers create accounts and track orders',
        price: '+$120',
        features: ['User Registration', 'Order History', 'Wishlist', 'Saved Addresses', 'Account Dashboard']
      },
      {
        id: 'shipping-calculator',
        name: 'Shipping Calculator',
        description: 'Calculate shipping costs based on location',
        price: '+$80',
        features: ['Shipping Rates', 'Location Based', 'Weight Calculations', 'Multiple Carriers', 'Free Shipping Rules']
      }
    ];
  };

  const toggleOption = (optionId) => {
    console.log('Step 8 Options: toggleOption called with:', optionId);
    
    // Check if this store option is locked by bundle (can't toggle off)
    if (isStoreOptionLocked(optionId) && selectedOptions[optionId]) {
      console.log('Step 8 Options: Option is locked by bundle, skipping toggle');
      return; // Can't toggle off bundle-included store options
    }
    
    const newOptions = {
      ...selectedOptions,
      [optionId]: !selectedOptions[optionId]
    };
    console.log('Step 8 Options: New options state:', newOptions);
    setSelectedOptions(newOptions);
    
    // Save to localStorage immediately when selected
    if (typeof window !== 'undefined') {
      try {
        const currentSelections = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const selectedOptionIds = Object.keys(newOptions).filter(id => newOptions[id]);
        console.log('Step 8 Options: Selected store option IDs', selectedOptionIds);
        
        if (selectedOptionIds.length > 0) {
          const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
          const hasOnlyDefaults = selectedOptionIds.every(id => defaultStoreFeatures.includes(id)) && 
                                  defaultStoreFeatures.every(id => selectedOptionIds.includes(id));
          const allOptionsFromBundle = !!bundle && selectedOptionIds.length > 0 && selectedOptionIds.every(id => lockedStoreOptions.includes(id));
          
          let storeCost = 0;
          if (!allOptionsFromBundle) {
            const budgetStorePrice = 200;
            const regularStorePrice = 450;
            const baseStorePrice = isBudgetBundle() ? budgetStorePrice : regularStorePrice;
            if (hasOnlyDefaults) {
              storeCost = baseStorePrice;
            } else {
              storeCost = baseStorePrice;
              selectedOptionIds.forEach(optionId => {
                if (!defaultStoreFeatures.includes(optionId)) {
                  const option = getStoreOptions().find(opt => opt.id === optionId);
                  if (option && !isStoreOptionLocked(optionId)) {
                    storeCost += parseInt(option.price.replace(/[^0-9]/g, ''));
                  }
                }
              });
            }
          }
          
          currentSelections.step8 = {
            step: 8,
            name: 'Store Options',
            value: `${selectedOptionIds.length} selected`,
            items: selectedOptionIds,
            cost: storeCost,
            includedInBundle: allOptionsFromBundle
          };
        } else {
          delete currentSelections.step8;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 8 Options: Saved store options to localStorage', currentSelections.step8);
        
        // Trigger a custom event to notify MobileCostSummary of the change
        console.log('Step 8 Options: Dispatching selections-updated event');
        window.dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving store option selections to localStorage:', error);
      }
    }
  };

  const calculateOptionCost = () => {
    const selectedOptionIds = Object.keys(selectedOptions).filter(id => selectedOptions[id]);
    
    if (selectedOptionIds.length === 0) {
      return 0;
    }
    
    // Check if only default store features are selected
    const defaultStoreFeatures = ['basic-products', 'shopping-cart', 'payment-processing'];
    const hasOnlyDefaults = selectedOptionIds.every(id => defaultStoreFeatures.includes(id)) && 
                            defaultStoreFeatures.every(id => selectedOptionIds.includes(id));
    
    // Check if this is a budget bundle - use cheaper pricing
    const budgetStorePrice = 200; // Budget-friendly price
    const regularStorePrice = 450; // Price from price list: $100 + $200 + $150 = $450
    const baseStorePrice = isBudgetBundle() ? budgetStorePrice : regularStorePrice;
    
    let total = 0;
    if (hasOnlyDefaults) {
      // Only default features selected - charge base store price
      total = baseStorePrice;
    } else {
      // Has additional features - start with base price + add extra features
      total = baseStorePrice;
      selectedOptionIds.forEach(optionId => {
        // Skip default features since they're included in base price
        if (!defaultStoreFeatures.includes(optionId)) {
          const option = getStoreOptions().find(opt => opt.id === optionId);
          if (option && !isStoreOptionLocked(optionId)) {
            total += parseInt(option.price.replace(/[^0-9]/g, ''));
          }
        }
      });
    }
    return total;
  };

  return (
    <>
      <Head>
        <title>Store Options - Mellow Quote</title>
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-3 pt-12 pb-24 sm:pt-4 sm:pb-4 sm:p-4 relative overflow-hidden">
        <div className="hidden sm:block absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 w-full max-w-4xl">
          <div className="fade-in">
            <div className="text-center mb-4 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-2 sm:mb-4">
                Store Options
              </p>
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm max-w-full overflow-hidden">
                <span className="text-blue-600 font-semibold flex-shrink-0">Store</span>
                <span className="mx-1 text-slate-400 flex-shrink-0">•</span>
                <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">📄 Single</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">{subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace('-', ' ')}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">Backend: {backend === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">AI: {aiChoice === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">Automation</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">Store</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="text-blue-600 font-semibold flex-shrink-0 text-[10px] sm:text-xs">Store Options</span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 md:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Customize Your Online Store</h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                  Choose the e-commerce features you need for your online store
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-none overflow-y-auto sm:overflow-visible">
                {getStoreOptions().map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      console.log('Step 8 Options: Click detected on:', option.id);
                      toggleOption(option.id);
                    }}
                    className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      isStoreOptionLocked(option.id)
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : selectedOptions[option.id]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Bundle Lock Badge */}
                    {isStoreOptionLocked(option.id) && (
                      <div className="absolute -top-2 sm:-top-3 left-2 sm:left-4">
                        <span className="bg-purple-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold shadow-md flex items-center gap-1">
                          🔒 Included in Store
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1 sm:mb-2">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 mr-2 sm:mr-3 flex items-center justify-center ${
                            selectedOptions[option.id]
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedOptions[option.id] && (
                              <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{option.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm sm:text-lg font-bold ml-2 sm:ml-4">
                        {isStoreOptionLocked(option.id) ? (
                          <span className="text-purple-600 text-xs sm:text-sm">Included</span>
                        ) : (
                          <span className="text-blue-600 text-xs sm:text-base">{option.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 sm:mt-2">
                      <div className="text-[9px] sm:text-xs text-gray-500 flex flex-wrap gap-0.5 sm:gap-1">
                        {option.features.map((feature, index) => (
                          <span key={index} className="inline-block bg-gray-100 rounded px-1 sm:px-2 py-0.5">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm sm:text-base">Store Options Cost:</span>
                  <span className={`text-lg sm:text-2xl font-bold ${calculateOptionCost() === 800 && Object.keys(selectedOptions).some(key => selectedOptions[key]) ? 'text-purple-600' : 'text-blue-600'}`}>
                    {Object.keys(selectedOptions).some(key => selectedOptions[key]) 
                      ? calculateOptionCost() === 800 
                        ? 'Included in Store' 
                        : `+$${calculateOptionCost()}`
                      : '+$0'}
                  </span>
                </div>
                {Object.keys(selectedOptions).some(key => selectedOptions[key]) && (
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    {Object.keys(selectedOptions).filter(key => selectedOptions[key]).length} option{Object.keys(selectedOptions).filter(key => selectedOptions[key]).length > 1 ? 's' : ''} selected
                    {lockedStoreOptions.length > 0 && ` (${lockedStoreOptions.length} from bundle)`}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    // Go back to store yes/no page with store selection and options preserved
                    const selectedOptionIds = Object.keys(selectedOptions).filter(key => selectedOptions[key]);
                    const features = router.query.features || '';
                    console.log('Going back from store options with selections:', selectedOptionIds, 'features:', features);
                    router.push(`/step-8?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=yes-store&storeOptions=${selectedOptionIds.join(',')}&features=${features}&from=store-options${bundleParams}`);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 text-xs sm:text-sm"
                >
                  ← Back
                </button>
                
                <button
                  onClick={() => {
                    // Add store options to selections and go to sections - preserve features
                    const selectedOptionIds = Object.keys(selectedOptions).filter(key => selectedOptions[key]);
                    const features = router.query.features || '';
                    router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=yes-store&storeOptions=${selectedOptionIds.join(',')}&features=${features}&from=store-options${bundleParams}`);
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-xs sm:text-sm"
                >
                  Add Store Features →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
