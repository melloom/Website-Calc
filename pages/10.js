import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIsClient, safeLocalStorage, safeWindow } from '../utils/client-safe';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step12() {
  const [selectedAddons, setSelectedAddons] = useState({});
  const [addonToggles, setAddonToggles] = useState({});
  const [hoveredAddon, setHoveredAddon] = useState(null);
  const [paymentMode, setPaymentMode] = useState('onetime'); // 'monthly', 'onetime', or 'all'
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
  const fromPage = router.query.from || '';
  
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
  
  // Parse bundle-locked addons (can't be toggled off)
  const lockedAddons = bpAddons ? bpAddons.split(',').filter(a => a.trim()) : [];

  // Restore selected addons from localStorage when component loads (runs first)
  useEffect(() => {
    if (isClient) {
      try {
        const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        console.log('Step 10: Full localStorage data:', savedSelections);
        console.log('Step 10: Step10 data from localStorage:', savedSelections.step10);
        
        const savedAddons = savedSelections.step10;
        
        if (savedAddons && savedAddons.items && Array.isArray(savedAddons.items)) {
          console.log('Step 10: Restoring addons from localStorage:', savedAddons.items);
          const restoredAddons = {};
          savedAddons.items.forEach(addonId => {
            restoredAddons[addonId] = true;
          });
          
          // Also restore payment mode if saved
          if (savedAddons.paymentMode) {
            console.log('Step 10: Restoring payment mode:', savedAddons.paymentMode);
            setPaymentMode(savedAddons.paymentMode);
          }
          
          // Restore each addon's individual payment mode, with migration for recurring addons
          let restoredToggles = savedAddons.toggles || {};
          let needsUpdate = false;
          
          // Migrate: ensure recurring addons default to monthly if no toggle stored
          savedAddons.items.forEach(addonId => {
            if (!restoredToggles[addonId]) {
              const addonOption = getAddonOptions().find(opt => opt.id === addonId);
              if (addonOption?.recurring && !addonOption?.isPrimarilyOneTime) {
                restoredToggles[addonId] = 'monthly';
                needsUpdate = true;
              }
            }
          });
          
          console.log('Step 10: Restoring addon toggles:', restoredToggles);
          setAddonToggles(restoredToggles);
          
          // If we migrated any toggles, recalculate and save
          if (needsUpdate) {
            console.log('Step 10: Migrating addon toggles to correct defaults');
            let addonsCost = 0;
            let addonsMonthly = 0;
            savedAddons.items.forEach(addonId => {
              const addonOption = getAddonOptions().find(opt => opt.id === addonId);
              if (addonOption) {
                const addonMode = restoredToggles[addonId] || 'onetime';
                let price = addonOption.price;
                if (addonOption.hasToggle && addonOption.toggleOptions[addonMode]) {
                  price = addonOption.toggleOptions[addonMode].price;
                }
                const cost = parseInt(price.replace(/[^0-9]/g, '')) || 0;
                if (addonMode === 'monthly') {
                  addonsMonthly += cost;
                } else {
                  addonsCost += cost;
                }
              }
            });
            
            // Save migrated data
            const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
            currentSelections.step10 = {
              ...savedAddons,
              cost: addonsCost,
              monthly: addonsMonthly,
              toggles: restoredToggles
            };
            safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
            safeWindow().dispatchEvent(new Event('selections-updated'));
          }
          
          setSelectedAddons(restoredAddons);
          console.log('Step 10: Restored addons state:', restoredAddons);
        } else {
          console.log('Step 10: No valid addon data found in localStorage');
        }
      } catch (error) {
        console.warn('Error restoring addons from localStorage:', error);
      }
    }
  }, [isClient]);

  // Only use URL parameters if no addons were restored from localStorage
  useEffect(() => {
    // Skip if we already have addons selected
    if (Object.keys(selectedAddons).length > 0) {
      return;
    }
    
    console.log('Step 10: URL parameter useEffect - checking for initial addons');
    console.log('Step 10: URL parameter useEffect - router.query.addons:', router.query.addons);
    
    // Only use URL parameters if we have no addons at all
    if (router.query.addons) {
      console.log('Step 10: No addons from localStorage, using URL parameters');
      const selected = router.query.addons.split(',');
      const initialAddons = {};
      selected.forEach(addon => {
        if (addon) initialAddons[addon] = true;
      });
      setSelectedAddons(initialAddons);
      console.log('Step 10: Set addons from URL parameters:', initialAddons);
    }
    
    // Auto-select addons from bundle preselects (only if no addons already selected)
    if (bpAddons && bpAddons.length > 0) {
      console.log('Step 10: Auto-selecting bundle addons');
      const bpAddonsArray = bpAddons.split(',').filter(a => a.trim());
      if (bpAddonsArray.length > 0) {
        const initialAddons = {};
        bpAddonsArray.forEach(addon => {
          if (addon) initialAddons[addon] = true;
        });
        setSelectedAddons(initialAddons);
        console.log('Auto-selected addons from bundle:', bpAddonsArray);
      }
    }
  }, [router.query.addons, bpAddons]);  // Removed selectedAddons from dependencies
  
  // Check if an addon is locked by bundle
  const isAddonLockedByBundle = (addonId) => lockedAddons.includes(addonId);
  
  // Toggle addon with bundle lock respect
  const toggleAddon = (addonId) => {
    // Handle refresh case - re-save all selected addons
    if (addonId === 'refresh') {
      const selectedAddonIds = Object.keys(selectedAddons).filter(id => selectedAddons[id]);
      console.log('Step 10: Refreshing all selected addons:', selectedAddonIds);
      
      if (selectedAddonIds.length > 0) {
        // Re-save all selected addons with current payment mode
        if (isClient) {
          try {
            const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
            console.log('Step 10: Refreshing - Current selections before update:', currentSelections);
            let addonsCost = 0;
            let addonsMonthly = 0;
            
            selectedAddonIds.forEach(addonId => {
              const addonOption = getAddonOptions().find(opt => opt.id === addonId);
              if (addonOption && !isAddonLockedByBundle(addonId)) {
                // Safely get price - fallback to default price if toggle option doesn't exist for this mode
                let price = addonOption.price;
                if (addonOption.hasToggle && addonOption.toggleOptions[paymentMode]) {
                  price = addonOption.toggleOptions[paymentMode].price;
                } else if (addonOption.hasToggle) {
                  price = addonOption.toggleOptions.onetime?.price || 
                          addonOption.toggleOptions.monthly?.price || 
                          addonOption.price;
                }
                const cost = parseInt(price.replace(/[^0-9]/g, ''));
                
                // Use ONLY addonToggles to determine if monthly or one-time
                // For recurring services without a stored toggle, default to monthly
                const defaultMode = (addonOption.recurring && !addonOption.isPrimarilyOneTime) ? 'monthly' : paymentMode;
                const addonMode = addonToggles[addonId] || defaultMode;
                if (addonMode === 'monthly') {
                  addonsMonthly += cost;
                } else {
                  addonsCost += cost;
                }
              }
            });
            
            const allAddonsFromBundle = lockedAddons.length > 0 && selectedAddonIds.length > 0 &&
              selectedAddonIds.every(id => isAddonLockedByBundle(id));
            currentSelections.step10 = {
              step: 10,
              name: 'Add-ons',
              value: `${selectedAddonIds.length} selected`,
              items: selectedAddonIds,
              cost: addonsCost,
              monthly: addonsMonthly,
              paymentMode: paymentMode,
              toggles: addonToggles,
              includedInBundle: !!allAddonsFromBundle
            };
            safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
            console.log('Step 10: Refreshed all selections with new payment mode:', currentSelections);
            console.log('Step 10: Refreshed all addons with payment mode:', paymentMode);
            safeWindow().dispatchEvent(new Event('selections-updated'));
          } catch (error) {
            console.warn('Error refreshing addon selections:', error);
          }
        }
      }
      return;
    }
    
    // Check if this addon is locked by bundle (can't toggle off)
    if (isAddonLockedByBundle(addonId) && selectedAddons[addonId]) {
      return; // Can't toggle off bundle-included addons
    }
    
    const newSelections = {
      ...selectedAddons,
      [addonId]: !selectedAddons[addonId]
    };
    setSelectedAddons(newSelections);
    
    // Store this addon's payment mode when selected (so it doesn't change when switching global mode)
    if (!selectedAddons[addonId]) {
      // Addon is being selected - determine default mode based on addon type
      const addonOption = getAddonOptions().find(opt => opt.id === addonId);
      // For recurring services (not primarily one-time), default to monthly
      const defaultMode = (addonOption?.recurring && !addonOption?.isPrimarilyOneTime) ? 'monthly' : paymentMode;
      setAddonToggles(prev => ({
        ...prev,
        [addonId]: defaultMode
      }));
    }
    
    // Save to localStorage immediately when selected
    if (isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        const selectedAddonIds = Object.keys(newSelections).filter(id => newSelections[id]);
        console.log('Step 10: Selected addon IDs', selectedAddonIds);
        console.log('Step 10: Current selections before update:', currentSelections);
        
        // Get the updated toggles (include the newly selected addon's mode)
        // For recurring services, default to monthly; otherwise use global payment mode
        const addonOption = getAddonOptions().find(opt => opt.id === addonId);
        const defaultMode = (addonOption?.recurring && !addonOption?.isPrimarilyOneTime) ? 'monthly' : paymentMode;
        const updatedToggles = !selectedAddons[addonId] 
          ? { ...addonToggles, [addonId]: defaultMode }
          : addonToggles;
        
        if (selectedAddonIds.length > 0) {
          // Calculate actual cost for add-ons using EACH addon's stored payment mode
          let addonsCost = 0;
          let addonsMonthly = 0;
          selectedAddonIds.forEach(addonId => {
            const addonOption = getAddonOptions().find(opt => opt.id === addonId);
            if (addonOption && !isAddonLockedByBundle(addonId)) {
              // Use this addon's stored payment mode, not the global one
              const addonMode = updatedToggles[addonId] || paymentMode;
              
              // Safely get price - fallback to default price if toggle option doesn't exist for this mode
              let price = addonOption.price;
              if (addonOption.hasToggle && addonOption.toggleOptions[addonMode]) {
                price = addonOption.toggleOptions[addonMode].price;
              } else if (addonOption.hasToggle) {
                price = addonOption.toggleOptions.onetime?.price || 
                        addonOption.toggleOptions.monthly?.price || 
                        addonOption.price;
              }
              const cost = parseInt(price.replace(/[^0-9]/g, ''));
              
              // Use ONLY the addon's stored mode to determine if it's monthly or one-time
              // Don't use addonOption.recurring - that's just a default, user's choice overrides it
              if (addonMode === 'monthly') {
                addonsMonthly += cost;
              } else {
                addonsCost += cost;
              }
            }
          });
          
          const allAddonsFromBundle = lockedAddons.length > 0 && selectedAddonIds.length > 0 &&
            selectedAddonIds.every(id => isAddonLockedByBundle(id));
          currentSelections.step10 = {
            step: 10,
            name: 'Add-ons',
            value: `${selectedAddonIds.length} selected`,
            items: selectedAddonIds,
            cost: addonsCost,
            monthly: addonsMonthly,
            paymentMode: paymentMode,
            toggles: updatedToggles,  // Save each addon's individual payment mode
            includedInBundle: !!allAddonsFromBundle
          };
        } else {
          // Only remove step10 if no add-ons selected, keep all other steps
          delete currentSelections.step10;
        }
        
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 10: Saved all selections to localStorage', currentSelections);
        console.log('Step 10: Preserved steps:', Object.keys(currentSelections).filter(key => key.startsWith('step')));
        console.log('Step 10: Saved add-ons to localStorage', currentSelections.step10);
        
        // Trigger a custom event to notify MobileCostSummary of the change
        console.log('Step 10: Dispatching selections-updated event');
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving addon selections to localStorage:', error);
      }
    }
  };
  
  // Get the correct price based on payment mode
  const getAddonPrice = (addon) => {
    if (addon.hasToggle) {
      if (paymentMode === 'all') {
        // For "Others" mode, only show the custom package price
        return addon.toggleOptions.all?.price || addon.price;
      }
      return addon.toggleOptions[paymentMode]?.price || addon.price;
    }
    return addon.price;
  };
  
  // Get the correct description based on payment mode
  const getAddonDescription = (addon) => {
    if (addon.hasToggle && paymentMode === 'onetime') {
      // One-time descriptions
      const oneTimeDescriptions = {
        'seo-package': 'Complete SEO setup including keyword research, on-page optimization, technical audit, and initial rankings.',
        'content-writing': 'Professional content package including website copy, product descriptions, and foundational blog posts.',
        'social-media-management': 'Complete social media setup including profile creation, branding, and initial content strategy.',
        'email-marketing': 'Full email marketing system setup including templates, automation workflows, and initial campaigns.',
        'website-maintenance': 'Complete website setup including security configuration, performance optimization, and backup systems.',
        'analytics-setup': 'Comprehensive analytics setup including tracking implementation, dashboard creation, and conversion goals.',
        'security-package': 'Advanced security setup including SSL configuration, firewall setup, and security monitoring.',
        'speed-optimization': 'Complete performance optimization including image optimization, caching setup, and CDN configuration.'
      };
      return oneTimeDescriptions[addon.id] || addon.description;
    } else if (addon.hasToggle && paymentMode === 'all') {
      // Others (custom) descriptions
      const customDescriptions = {
        'seo-package': 'Custom SEO solution tailored to your specific business needs and goals.',
        'content-writing': 'Custom content strategy and creation package designed for your unique requirements.',
        'social-media-management': 'Custom social media solution with personalized strategy and implementation.',
        'email-marketing': 'Custom email marketing setup with personalized automation and campaigns.',
        'website-maintenance': 'Custom maintenance plan with personalized support and monitoring.',
        'analytics-setup': 'Custom analytics solution with tailored tracking and reporting.',
        'security-package': 'Custom security solution with personalized protection and monitoring.',
        'speed-optimization': 'Custom performance optimization with personalized improvements.'
      };
      return customDescriptions[addon.id] || addon.description;
    }
    return addon.description; // Return original description for monthly mode
  };
  
  // Get the correct features based on payment mode
  const getAddonFeatures = (addon) => {
    if (addon.hasToggle && paymentMode === 'onetime') {
      // One-time features
      const oneTimeFeatures = {
        'seo-package': ['Keyword Research', 'On-page SEO', 'Technical SEO Audit', 'Local SEO Setup', 'Content Strategy', 'Analytics Setup', 'Schema Markup', 'Initial Rankings'],
        'content-writing': ['Website Copywriting', 'Product Descriptions', 'SEO Optimized Content', 'Content Strategy', 'Foundational Blog Posts', 'Editing & Proofreading'],
        'social-media-management': ['Profile Creation', 'Profile Branding', 'Content Templates', 'Posting Guidelines', 'Analytics Setup', 'Integration Setup'],
        'email-marketing': ['Email Template Design', 'List Management Setup', 'Automation Workflows', 'Campaign Templates', 'Analytics Integration', 'Compliance Setup'],
        'website-maintenance': ['Security Setup', 'Performance Optimization', 'Backup Configuration', 'Monitoring Setup', 'SSL Certificate', 'Technical Support'],
        'analytics-setup': ['Google Analytics 4 Setup', 'Custom Dashboard', 'Conversion Tracking', 'Goal Setup', 'Event Tracking', 'ROI Analysis'],
        'security-package': ['SSL Certificate Setup', 'Security Audit', 'Malware Scanning Setup', 'Firewall Configuration', 'Security Monitoring', 'Emergency Support'],
        'speed-optimization': ['Page Speed Analysis', 'Image Optimization', 'Code Minification', 'Caching Setup', 'CDN Configuration', 'Database Optimization']
      };
      return oneTimeFeatures[addon.id] || addon.features;
    } else if (addon.hasToggle && paymentMode === 'all') {
      // Others (custom) features
      const customFeatures = {
        'seo-package': ['Custom Strategy', 'Personalized Keywords', 'Tailored Content Plan', 'Custom Analytics', 'Flexible Reporting', 'Ongoing Consultation'],
        'content-writing': ['Custom Content Strategy', 'Personalized Writing Style', 'Tailored Topics', 'Custom Publishing Schedule', 'Flexible Revisions', 'Brand Voice Development'],
        'social-media-management': ['Custom Strategy', 'Personalized Platforms', 'Tailored Content', 'Custom Posting Schedule', 'Flexible Campaigns', 'Brand-Specific Approach'],
        'email-marketing': ['Custom Automation', 'Personalized Templates', 'Tailored Campaigns', 'Custom Segmentation', 'Flexible Workflows', 'Brand-Specific Design'],
        'website-maintenance': ['Custom Support Plan', 'Personalized Monitoring', 'Tailored Updates', 'Flexible Schedule', 'Custom Security Setup', 'Personalized Backup Strategy'],
        'analytics-setup': ['Custom Tracking', 'Personalized Dashboard', 'Tailored Reports', 'Custom Goals', 'Flexible Metrics', 'Business-Specific Analytics'],
        'security-package': ['Custom Security Plan', 'Personalized Protection', 'Tailored Monitoring', 'Flexible Protocols', 'Custom Compliance', 'Business-Specific Security'],
        'speed-optimization': ['Custom Optimization', 'Personalized Improvements', 'Tailored Performance', 'Flexible Enhancements', 'Custom Monitoring', 'Business-Specific Speed Goals']
      };
      return customFeatures[addon.id] || addon.features;
    }
    return addon.features; // Return original features for monthly mode
  };
  
  // Get the correct price label based on payment mode
  const getAddonPriceLabel = (addon) => {
    if (addon.hasToggle) {
      return addon.toggleOptions[paymentMode]?.label || '';
    }
    return '';
  };

  // Filter add-ons based on payment mode
  const getFilteredAddons = () => {
    const allAddons = getAddonOptions();
    
    if (paymentMode === 'all') {
      // Only show addons that have 'all' toggle option (custom packages)
      return allAddons.filter(addon => addon.hasToggle && addon.toggleOptions.all);
    }
    
    // Show all add-ons in other modes - just change the pricing displayed
    // This prevents add-ons from disappearing when switching modes
    return allAddons;
  };

  // Get count for each payment mode
  const getMonthlyCount = () => {
    return getAddonOptions().filter(addon => {
      return addon.recurring && !addon.isPrimarilyOneTime;
    }).length;
  };

  const getOnetimeCount = () => {
    return getAddonOptions().filter(addon => {
      return !addon.recurring || addon.isPrimarilyOneTime;
    }).length;
  };

  const getAllCount = () => {
    return getAddonOptions().filter(addon => {
      return addon.hasToggle && addon.toggleOptions.all;
    }).length;
  };
  
  // Handle toggle option changes (global payment mode)
  const handlePaymentModeChange = (mode) => {
    console.log('Step 10: Payment mode changing from', paymentMode, 'to', mode);
    console.log('Step 10: Current selected addons before change:', selectedAddons);
    
    // Prevent setting the same mode twice
    if (paymentMode === mode) {
      console.log('Step 10: Payment mode is already', mode, '- not changing');
      return;
    }
    
    setPaymentMode(mode);
    
    // DON'T refresh addon prices - each addon keeps its original payment mode when selected
    // The global payment mode only affects NEW selections
    console.log('Step 10: Payment mode changed to:', mode, '- existing selections keep their original prices');
  };

  const handleSkipAll = () => {
    setSelectedAddons({});
    setAddonToggles({});

    if (isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        delete currentSelections.step10;
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error clearing addon selections:', error);
      }
    }

    router.push(`/step-11?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}${bundleParams}`);
  };
  
  // Refresh addons with a specific payment mode (used when payment mode changes)
  const refreshAddonsWithMode = (newMode) => {
    const selectedAddonIds = Object.keys(selectedAddons).filter(id => selectedAddons[id]);
    console.log('Step 10: Refreshing all selected addons with mode:', newMode, 'addons:', selectedAddonIds);
    
    if (selectedAddonIds.length > 0 && isClient) {
      try {
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        let addonsCost = 0;
        let addonsMonthly = 0;
        
        selectedAddonIds.forEach(addonId => {
          const addonOption = getAddonOptions().find(opt => opt.id === addonId);
          if (addonOption && !isAddonLockedByBundle(addonId)) {
            // Safely get price - fallback to default price if toggle option doesn't exist for this mode
            let price = addonOption.price;
            if (addonOption.hasToggle && addonOption.toggleOptions[newMode]) {
              price = addonOption.toggleOptions[newMode].price;
            } else if (addonOption.hasToggle) {
              // Fallback to onetime or monthly if the selected mode doesn't exist
              price = addonOption.toggleOptions.onetime?.price || 
                      addonOption.toggleOptions.monthly?.price || 
                      addonOption.price;
            }
            
            const cost = parseInt(price.replace(/[^0-9]/g, ''));
            
            // Use ONLY addonToggles to determine if monthly or one-time
            const addonMode = addonToggles[addonId] || newMode;
            if (addonMode === 'monthly') {
              addonsMonthly += cost;
            } else {
              addonsCost += cost;
            }
          }
        });
        
        const allAddonsFromBundle = lockedAddons.length > 0 && selectedAddonIds.length > 0 &&
          selectedAddonIds.every(id => isAddonLockedByBundle(id));
        currentSelections.step10 = {
          step: 10,
          name: 'Add-ons',
          value: `${selectedAddonIds.length} selected`,
          items: selectedAddonIds,
          cost: addonsCost,
          monthly: addonsMonthly,
          paymentMode: newMode,
          toggles: addonToggles,  // Preserve each addon's individual payment mode
          includedInBundle: !!allAddonsFromBundle
        };
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 10: Refreshed addons with new payment mode:', newMode);
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error refreshing addon selections:', error);
      }
    }
  };

  const getAddonOptions = () => {
    return [
      {
        id: 'seo-package',
        name: 'SEO Package',
        description: 'Complete search engine optimization setup and ongoing management',
        price: '+$199',
        features: ['Keyword Research', 'On-page SEO', 'Technical SEO Audit', 'Local SEO Setup', 'Content Strategy', 'Monthly Reporting', 'Google Analytics Setup', 'Schema Markup'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$199', label: 'Monthly SEO Service' },
          onetime: { price: '+$599', label: 'Initial SEO Setup Only' }
        }
      },
      {
        id: 'content-writing',
        name: 'Content Writing Service',
        description: 'Professional content creation for your website',
        price: '+$149',
        features: ['Blog Posts (2 per month)', 'Website Copywriting', 'Product Descriptions', 'SEO Optimized Content', 'Content Strategy', 'Editing & Proofreading'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$149', label: 'Monthly Content Service' },
          onetime: { price: '+$449', label: 'Initial Content Package' }
        }
      },
      {
        id: 'social-media-management',
        name: 'Social Media Management',
        description: 'Complete social media setup and ongoing management',
        price: '+$199',
        features: ['Platform Setup (3 platforms)', 'Content Creation', 'Post Scheduling', 'Community Management', 'Analytics & Reporting', 'Engagement Strategy', 'Ad Campaign Support'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$199', label: 'Monthly Management' },
          onetime: { price: '+$599', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'email-marketing',
        name: 'Email Marketing',
        description: 'Professional email marketing setup and campaign management',
        price: '+$129',
        features: ['Email Template Design', 'List Management', 'Campaign Setup', 'Automation Workflows', 'Analytics & Reporting', 'A/B Testing', 'Segmentation Strategy'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$129', label: 'Monthly Email Service' },
          onetime: { price: '+$389', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'website-maintenance',
        name: 'Website Maintenance',
        description: 'Ongoing website maintenance and support services',
        price: '+$79',
        features: ['Security Updates', 'Performance Monitoring', 'Bug Fixes', 'Content Updates', 'Backup Management', 'Uptime Monitoring', 'Technical Support'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$79', label: 'Monthly Maintenance' },
          onetime: { price: '+$239', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'analytics-setup',
        name: 'Analytics & Reporting',
        description: 'Comprehensive analytics setup and monthly reporting',
        price: '+$149',
        features: ['Google Analytics 4 Setup', 'Custom Dashboard', 'Conversion Tracking', 'Monthly Reports', 'Goal Setup', 'Event Tracking', 'ROI Analysis'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$149', label: 'Monthly Reporting' },
          onetime: { price: '+$449', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'security-package',
        name: 'Security Package',
        description: 'Advanced security setup and ongoing protection',
        price: '+$59',
        features: ['SSL Certificate', 'Security Audit', 'Malware Scanning', 'Firewall Setup', 'Security Monitoring', 'Backup Security', 'Emergency Support'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$59', label: 'Monthly Security' },
          onetime: { price: '+$179', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'speed-optimization',
        name: 'Speed Optimization',
        description: 'Website performance optimization and ongoing monitoring',
        price: '+$99',
        features: ['Page Speed Analysis', 'Image Optimization', 'Code Minification', 'Caching Setup', 'CDN Configuration', 'Database Optimization', 'Monthly Monitoring'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$99', label: 'Monthly Optimization' },
          onetime: { price: '+$299', label: 'Initial Optimization Only' }
        }
      },
      {
        id: 'social-media-setup',
        name: 'Social Media Setup',
        description: 'Social media profile creation and integration',
        price: '+$250',
        features: ['Profile Creation', 'Profile Branding', 'Integration Setup', 'Content Templates', 'Posting Guidelines', 'Analytics Setup'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$100', label: 'Monthly Management' },
          onetime: { price: '+$250', label: 'Initial Setup Only' },
          all: { price: '+$800', label: 'Complete Brand Package' }
        }
      },
      {
        id: 'logo-design',
        name: 'Logo Design Package',
        description: 'Professional logo design and brand identity',
        price: '+$450',
        features: ['Custom Logo Design', 'Brand Guidelines', 'Color Palette', 'Typography Selection', 'File Formats', 'Revisions', 'Brand Assets'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$200', label: 'Monthly Brand Updates' },
          onetime: { price: '+$450', label: 'Initial Design Package' },
          all: { price: '+$1,500', label: 'Complete Brand Identity' }
        }
      },
      {
        id: 'branding-package',
        name: 'Complete Branding Package',
        description: 'Full brand identity design and guidelines',
        price: '+$899',
        features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Letterhead Design', 'Social Media Templates', 'Email Signature', 'Brand Style Guide'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$400', label: 'Monthly Brand Management' },
          onetime: { price: '+$899', label: 'Initial Brand Package' },
          all: { price: '+$2,500', label: 'Full Brand Experience' }
        }
      },
      {
        id: 'hosting-setup',
        name: 'Website Hosting Setup',
        description: 'Professional hosting configuration and management',
        price: '+$100',
        features: ['Domain Registration', 'SSL Certificate', 'Email Accounts', 'Database Setup', 'Performance Optimization', 'Security Setup', 'Backup Configuration'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time setup service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$100', label: 'Monthly Hosting Service' },
          onetime: { price: '+$300', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'domain-registration',
        name: 'Domain Registration',
        description: 'Domain name registration and management',
        price: '+$25',
        features: ['Domain Name (1 year)', 'DNS Configuration', 'Privacy Protection', 'Auto-renewal Setup', 'Email Forwarding'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time setup service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$25', label: 'Monthly Registration' },
          onetime: { price: '+$75', label: 'Initial Registration (1 year)' }
        }
      },
      {
        id: 'maintenance-package',
        name: 'Website Maintenance',
        description: 'Ongoing website maintenance and support',
        price: '+$250',
        features: ['Monthly Updates', 'Security Monitoring', 'Performance Optimization', 'Bug Fixes', 'Content Updates', 'Technical Support', 'Backup Management'],
        recurring: true,
        isPrimarilyOneTime: false, // This is primarily a monthly service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$250', label: 'Monthly Maintenance' },
          onetime: { price: '+$750', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'email-marketing-setup',
        name: 'Email Marketing Setup',
        description: 'Email marketing system configuration',
        price: '+$400',
        features: ['Email Template Design', 'List Management', 'Automation Rules', 'Campaign Setup', 'Analytics Integration', 'Compliance Setup'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$150', label: 'Monthly Management' },
          onetime: { price: '+$400', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'google-ads-setup',
        name: 'Google Ads Setup',
        description: 'Google Ads campaign setup and optimization',
        price: '+$600',
        features: ['Campaign Creation', 'Keyword Research', 'Ad Copy Writing', 'Landing Page Optimization', 'Conversion Tracking', 'Analytics Setup', 'Budget Management'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time setup service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$600', label: 'Monthly Management' },
          onetime: { price: '+$1,800', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'facebook-ads-setup',
        name: 'Facebook Ads Setup',
        description: 'Facebook advertising campaign setup',
        price: '+$500',
        features: ['Campaign Creation', 'Audience Targeting', 'Ad Creative Design', 'Pixel Setup', 'Conversion Tracking', 'Analytics Integration'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time setup service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$500', label: 'Monthly Management' },
          onetime: { price: '+$1,500', label: 'Initial Setup Only' }
        }
      },
      {
        id: 'video-production',
        name: 'Video Production',
        description: 'Professional video creation for your website',
        price: '+$1,000',
        features: ['Script Writing', 'Video Production', 'Editing & Post-Production', 'Motion Graphics', 'Voice Over', 'Multiple Formats'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$300', label: 'Monthly Video Updates' },
          onetime: { price: '+$1,000', label: 'Initial Production' },
          all: { price: '+$2,500', label: 'Complete Video Package' }
        }
      },
      {
        id: 'photography',
        name: 'Professional Photography',
        description: 'High-quality photography for your website',
        price: '+$800',
        features: ['Product Photography', 'Team Photos', 'Location Shoot', 'Image Editing', 'Stock Photos', 'Photo Gallery Setup'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$250', label: 'Monthly Photo Updates' },
          onetime: { price: '+$800', label: 'Initial Photoshoot' },
          all: { price: '+$1,800', label: 'Complete Photography Package' }
        }
      },
      {
        id: 'copywriting',
        name: 'Professional Copywriting',
        description: 'Expert copywriting for website content',
        price: '+$400',
        features: ['Website Copy', 'Product Descriptions', 'Marketing Materials', 'SEO Content', 'Email Copy', 'Social Media Copy'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$150', label: 'Monthly Content Updates' },
          onetime: { price: '+$400', label: 'Initial Copy Package' }
        }
      },
      {
        id: 'translation-services',
        name: 'Translation Services',
        description: 'Professional translation for multiple languages',
        price: '+$350',
        features: ['Website Translation', 'Content Localization', 'Cultural Adaptation', 'Proofreading', 'Multiple Languages', 'SEO Translation'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$120', label: 'Monthly Translation Updates' },
          onetime: { price: '+$350', label: 'Initial Translation' }
        }
      },
      {
        id: 'accessibility-audit',
        name: 'Accessibility Audit',
        description: 'WCAG compliance audit and improvements',
        price: '+$500',
        features: ['Accessibility Audit', 'WCAG Compliance', 'Improvement Plan', 'User Testing', 'Documentation', 'Ongoing Support'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$200', label: 'Monthly Accessibility Support' },
          onetime: { price: '+$500', label: 'Initial Audit' }
        }
      },
      {
        id: 'performance-optimization',
        name: 'Performance Optimization',
        description: 'Website speed and performance optimization',
        price: '+$450',
        features: ['Speed Analysis', 'Image Optimization', 'Code Optimization', 'Caching Setup', 'CDN Configuration', 'Monitoring Setup'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$150', label: 'Monthly Performance Monitoring' },
          onetime: { price: '+$450', label: 'Initial Optimization' }
        }
      },
      {
        id: 'security-audit',
        name: 'Security Audit',
        description: 'Comprehensive security assessment and hardening',
        price: '+$600',
        features: ['Security Assessment', 'Vulnerability Scanning', 'Security Hardening', 'Penetration Testing', 'Security Documentation', 'Ongoing Monitoring'],
        recurring: false,
        isPrimarilyOneTime: true, // This is primarily a one-time service
        hasToggle: true,
        toggleOptions: {
          monthly: { price: '+$250', label: 'Monthly Security Monitoring' },
          onetime: { price: '+$600', label: 'Initial Security Audit' }
        }
      }
    ];
  };

  const calculateAddonCost = () => {
    let total = 0;
    getAddonOptions().forEach(addon => {
      // Skip bundle-locked addons - they're included free
      if (selectedAddons[addon.id] && !isAddonLockedByBundle(addon.id)) {
        total += parseInt(addon.price.replace(/[^0-9]/g, ''));
      }
    });
    return total;
  };

  const calculateRecurringCost = () => {
    let total = 0;
    getAddonOptions().forEach(addon => {
      // Skip bundle-locked addons - they're included free
      if (selectedAddons[addon.id] && addon.recurring && !isAddonLockedByBundle(addon.id)) {
        total += parseInt(addon.price.replace(/[^0-9]/g, ''));
      }
    });
    return total;
  };

  return (
    <>
      <Head>
        <title>Step 10: Extras & Add-ons - Mellow Quote</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          .slide-in {
            animation: slideIn 0.6s ease-out;
          }
          .addon-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .addon-card:hover {
            transform: translateY(-2px);
          }
          .feature-tag {
            transition: all 0.2s ease;
          }
          .feature-tag:hover {
            transform: scale(1.05);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-3 py-4 sm:p-4 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="hidden sm:block absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tl from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-2 sm:px-4">
          <div className="fade-in">
            {/* Header */}
            <div className="text-center mb-3 sm:mb-6">
              <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-2 sm:mb-4 shadow-lg">
                <svg className="w-3 h-3 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight">
                Mellow Quote
              </h1>
              <p className="text-xs sm:text-lg text-slate-600 max-w-2xl mx-auto mb-2 sm:mb-4">
                Step 10: Extras & Add-ons
              </p>
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm max-w-full overflow-hidden">
                <span className="text-blue-600 font-semibold flex-shrink-0">Extras</span>
                <span className="mx-1 text-slate-400 flex-shrink-0">•</span>
                <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">{websiteType === 'single' ? '📄 Single' : '📑 Multi'}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">{subcategory.charAt(0).toUpperCase() + subcategory.replace('-', ' ')}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">Backend: {backend === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">AI: {aiChoice === 'no' ? 'No' : 'Yes'}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">Store</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="flex-shrink-0 text-[10px] sm:text-xs">{websiteType === 'multi' ? 'Pages' : 'Sections'}</span>
                  <span className="text-slate-400 flex-shrink-0 text-[10px] sm:text-xs">→</span>
                  <span className="text-blue-600 font-semibold flex-shrink-0 text-[10px] sm:text-xs">Add-ons</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-4 md:p-6">
              {/* Bundle Selection Notice */}
              {fromPage === 'bundle' && lockedAddons.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-2 text-sm sm:text-lg">🎁</span>
                    <div>
                      <span className="text-purple-800 font-semibold text-sm sm:text-base">Bundle Add-ons Included!</span>
                      <span className="text-purple-600 text-xs sm:text-sm ml-2">Your bundle add-ons are automatically selected below.</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Introduction */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-slate-900">Enhance Your Website</h2>
                <div className="flex items-center justify-center bg-slate-100 rounded-full p-1">
                  <button
                    onClick={() => isClient ? handlePaymentModeChange('onetime') : null}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      paymentMode === 'onetime'
                        ? 'bg-green-600 text-white shadow-md ring-2 ring-green-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    disabled={!isClient}
                  >
                    One-Time ({getOnetimeCount()})
                  </button>
                  <button
                    onClick={() => isClient ? handlePaymentModeChange('monthly') : null}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      paymentMode === 'monthly'
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    disabled={!isClient}
                  >
                    Monthly ({getMonthlyCount()})
                  </button>
                  <button
                    onClick={() => isClient ? handlePaymentModeChange('all') : null}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      paymentMode === 'all'
                        ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    disabled={!isClient}
                  >
                    Custom Packages ({getAllCount()})
                  </button>
                </div>
                <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto px-2">
                  Professional services to elevate your website beyond core functionality.
                  {paymentMode === 'monthly' ? ' Pay monthly for ongoing services.' : 
                   paymentMode === 'onetime' ? ' Pay once for initial setup.' : 
                   ' Premium packages and comprehensive solutions.'}
                </p>
              </div>

              {/* Add-ons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8 max-h-72 sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
                {getFilteredAddons().length > 0 ? (
                  getFilteredAddons().map((addon, index) => (
                  <div
                    key={`${addon.id}-${paymentMode}`} // Key includes payment mode to force re-render
                    onClick={() => toggleAddon(addon.id)}
                    onMouseEnter={() => setHoveredAddon(addon.id)}
                    onMouseLeave={() => setHoveredAddon(null)}
                    className={`addon-card relative p-3 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer flex-shrink-0 ${
                      isAddonLockedByBundle(addon.id)
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md shadow-purple-500/20'
                        : selectedAddons[addon.id]
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md shadow-blue-500/20'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Bundle Lock Badge */}
                    {isAddonLockedByBundle(addon.id) && (
                      <div className="absolute -top-2 sm:-top-3 left-2 sm:left-4">
                        <span className="bg-purple-600 text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-bold shadow-md flex items-center gap-1">
                          🔒 Included in Bundle
                        </span>
                      </div>
                    )}
                    
                    {/* Selection Indicator */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isAddonLockedByBundle(addon.id)
                          ? 'border-purple-500 bg-purple-500 shadow-md shadow-purple-500/40'
                          : selectedAddons[addon.id]
                            ? 'border-blue-500 bg-blue-500 shadow-md shadow-blue-500/40'
                            : 'border-slate-300 bg-white'
                      }`}>
                        {selectedAddons[addon.id] && (
                          <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pr-6 sm:pr-6">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="text-xs sm:text-lg font-bold text-slate-900">{addon.name}</h3>
                            {addon.recurring && (
                              <span className={`ml-1 sm:ml-2 inline-flex items-center px-1 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium shadow-sm ${
                                paymentMode === 'monthly' 
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              }`}>
                                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {paymentMode === 'monthly' ? 'Monthly' : 'One-Time'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-sm text-slate-600 leading-relaxed mb-1 sm:mb-3">{getAddonDescription(addon)}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-1 sm:mb-3">
                        <div className="flex flex-wrap gap-0.5 sm:gap-1.5">
                          {getAddonFeatures(addon).slice(0, hoveredAddon === addon.id ? getAddonFeatures(addon).length : 2).map((item, idx) => (
                            <span key={idx} className="feature-tag inline-flex items-center px-1 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {item}
                            </span>
                          ))}
                          {getAddonFeatures(addon).length > 2 && hoveredAddon !== addon.id && (
                            <span className="inline-flex items-center px-1 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                              +{getAddonFeatures(addon).length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-lg font-bold">
                          {isAddonLockedByBundle(addon.id) ? (
                            <span className="text-purple-600 text-[10px] sm:text-sm">Included</span>
                          ) : (
                            <span className={`bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-[10px] sm:text-base`}>
                              {getAddonPrice(addon)}
                            </span>
                          )}
                        </div>
                        {selectedAddons[addon.id] && (
                          <div className="text-[8px] sm:text-xs font-medium text-green-600 flex items-center">
                            <svg className="w-1.5 h-1.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 011.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-slate-400 text-sm sm:text-base">
                      {paymentMode === 'monthly' 
                        ? 'No monthly services available. Try switching to One-Time or Custom Packages.'
                        : paymentMode === 'onetime'
                        ? 'No one-time services available. Try switching to Monthly or Custom Packages.'
                        : 'No custom packages available. Try switching to Monthly or One-Time services.'
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-8">
                <button
                  onClick={() => {
                    // Save current addon selections when going back
                    const selectedAddonIds = Object.keys(selectedAddons).filter(key => selectedAddons[key]);
                    router.push(`/step-9?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}&addons=${selectedAddonIds.join(',')}${bundleParams}`);
                  }}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 text-xs sm:text-base shadow-sm hover:shadow-md"
                >
                  ← Back
                </button>
                
                {/* Skip All Button - Always visible */}
                <button
                  onClick={handleSkipAll}
                  className="flex-1 bg-slate-100 text-slate-600 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 text-xs sm:text-base shadow-sm hover:shadow-md"
                >
                  Skip All →
                </button>
                
                {/* Continue Button - Only visible if add-ons selected */}
                {Object.keys(selectedAddons).some(key => selectedAddons[key]) && (
                  <button
                    onClick={() => {
                      router.push(`/step-11?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${pages.join(',')}&features=${features.join(',')}&addons=${Object.keys(selectedAddons).join(',')}${bundleParams}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-xs sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
