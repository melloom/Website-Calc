import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIsClient, safeLocalStorage, safeWindow } from '../utils/client-safe';
import { STORAGE_KEY, buildBundleParams } from '../utils/quote-storage';

export default function Step9() {
  const [selectedSections, setSelectedSections] = useState({});
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
  const storeOptions = router.query.storeOptions ? (Array.isArray(router.query.storeOptions) ? router.query.storeOptions.join(',') : router.query.storeOptions) : '';
  const pages = router.query.pages ? router.query.pages.split(',') : [];
  const features = router.query.features ? (Array.isArray(router.query.features) ? router.query.features.join(',') : router.query.features) : '';
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
  
  // For regular bundles, get sections from bundle definition
  const getRegularBundleSections = () => {
    if (!bundle || bundle.startsWith('budget-')) return [];
    
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
  
  // Get bundle-locked sections (can't be toggled off)
  // First from URL params, then from regular bundle definition if bundle is selected
  const getLockedSections = () => {
    let sections = bpSections ? bpSections.split(',').filter(s => s.trim()) : [];
    // For regular bundles, also get sections from bundle definition if bp_sections not set
    if (bundle && !bundle.startsWith('budget-') && sections.length === 0) {
      const regularBundleSections = getRegularBundleSections();
      sections = [...new Set([...sections, ...regularBundleSections])];
    }
    return sections;
  };
  
  const lockedSections = getLockedSections();

  useEffect(() => {
    console.log('Step 9 useEffect - bpSections:', bpSections, 'lockedSections:', lockedSections, 'fromPage:', fromPage);
    console.log('Step 9 - current selectedSections state:', selectedSections);
    
    // Try to restore from localStorage first (highest priority)
    if (isClient) {
      try {
        const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        const savedSections = savedSelections.step9?.items || [];
        const isSectionsData = savedSections.length > 0 && 
                          !savedSections.some(item => 
                            ['email-notifications', 'auto-responder', 'social-media-integration', 'lead-capture', 'analytics-integration', 'crm-integration'].includes(item)
                          );
        
        if (isSectionsData && savedSections.length > 0) {
          console.log('Restoring sections from localStorage:', savedSections);
          console.log('Before setting from localStorage, current state:', selectedSections);
          const restoredSections = {};
          savedSections.forEach(section => {
            restoredSections[section] = true;
          });
          console.log('Setting selectedSections to restoredSections:', restoredSections);
          setSelectedSections(restoredSections);
          console.log('After setting from localStorage, state should be:', restoredSections);
          
          // Don't continue with defaults since we restored from localStorage
          return;
        }
      } catch (error) {
        console.warn('Error checking sections from localStorage:', error);
      }
    }
    
    // Initialize with hero and contact sections as defaults for single page
    const defaults = {
      'hero': true,
      'contact': true
    };
    
    // ALWAYS apply bundle preselects first (these are locked and can't be removed)
    if (bpSections && bpSections.length > 0) {
      const bpSectionsArray = bpSections.split(',').filter(s => s.trim());
      bpSectionsArray.forEach(section => {
        defaults[section] = true;
      });
      console.log('Applied bundle sections (locked):', bpSectionsArray);
    }
    
    // Then restore any additional sections from URL if coming back
    if (pages && pages.length > 0 && pages[0] !== '') {
      pages.forEach(page => {
        if (page) defaults[page] = true;
      });
      console.log('Restored additional sections from URL:', pages);
    }
    
    // Only set defaults if no localStorage data was restored AND no current selections
    if (!Object.keys(selectedSections).some(key => selectedSections[key])) {
      console.log('No localStorage data found and no current selections, setting defaults:', defaults);
      setSelectedSections(defaults);
    }
  }, [router.query.pages, bpSections, isClient]);
  
  // Check if a section is locked by bundle
  const isSectionLockedByBundle = (sectionId) => lockedSections.includes(sectionId);

  // Debug state changes
  useEffect(() => {
    console.log('Step 9: selectedSections state changed:', selectedSections);
    const selectedSectionIds = Object.keys(selectedSections).filter(id => selectedSections[id]);
    console.log('Step 9: selectedSectionIds from state:', selectedSectionIds);
  }, [selectedSections]);

  // Listen for selections-updated event
  useEffect(() => {
    if (isClient) {
      const handleSelectionsUpdate = () => {
        console.log('Step 9: Received selections-updated event, checking for sections changes');
        const savedSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        const savedSections = savedSelections.step9?.items || [];
        
        if (savedSections.length > 0) {
          console.log('Step 9: Updating sections from event:', savedSections);
          const restoredSections = {};
          savedSections.forEach(section => {
            restoredSections[section] = true;
          });
          setSelectedSections(restoredSections);
        }
      };
      
      safeWindow().addEventListener('selections-updated', handleSelectionsUpdate);
      return () => safeWindow().removeEventListener('selections-updated', handleSelectionsUpdate);
    }
  }, [isClient]);
  
  const getSectionOptions = () => {
    // Base sections for all single-page websites
    const baseSections = [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Main landing section with compelling headline and call-to-action',
        price: 'Included',
        features: ['Eye-catching Headline', 'Call-to-Action Button', 'Background Visual', 'Navigation Anchor', 'Mobile Responsive'],
        required: true
      },
      {
        id: 'contact',
        name: 'Contact Section',
        description: 'Essential contact information and form',
        price: 'Included',
        features: ['Contact Form', 'Contact Information', 'Map Integration', 'Social Links', 'Email Integration'],
        required: true
      }
    ];

    // Category and subcategory-specific sections
    const categorySections = {
      business: {
        'consulting': [
          {
            id: 'about',
            name: 'About',
            description: 'Share your company story and build trust',
            price: '+$100',
            features: ['Company Story', 'Mission Statement', 'Team Introduction', 'Company Values', 'Business Timeline'],
            required: false
          },
          {
            id: 'services',
            name: 'Services',
            description: 'Showcase your business services and offerings',
            price: '+$150',
            features: ['Service Listings', 'Service Descriptions', 'Pricing Overview', 'Process Steps', 'Service Icons'],
            required: false
          },
          {
            id: 'portfolio',
            name: 'Portfolio',
            description: 'Display your work and projects',
            price: '+$200',
            features: ['Project Gallery', 'Case Studies', 'Work Samples', 'Project Details', 'Client Results'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'Testimonials',
            description: 'Build credibility with customer reviews',
            price: '+$100',
            features: ['Client Reviews', 'Star Ratings', 'Client Photos', 'Success Stories', 'Review Carousel'],
            required: false
          }
        ],
        'agency': [
          {
            id: 'about',
            name: 'About Agency',
            description: 'Showcase your agency capabilities and culture',
            price: '+$100',
            features: ['Agency Story', 'Company Values', 'Team Culture', 'Mission Statement', 'Awards Recognition'],
            required: false
          },
          {
            id: 'services',
            name: 'Agency Services',
            description: 'Display your full service offerings',
            price: '+$150',
            features: ['Service Portfolio', 'Service Descriptions', 'Process Workflow', 'Delivery Timeline', 'Pricing Packages'],
            required: false
          },
          {
            id: 'portfolio',
            name: 'Agency Portfolio',
            description: 'Showcase your best agency work',
            price: '+$200',
            features: ['Project Gallery', 'Client Work', 'Case Studies', 'Results Showcase', 'Industry Expertise'],
            required: false
          },
          {
            id: 'clients',
            name: 'Clientele',
            description: 'Display your notable clients',
            price: '+$100',
            features: ['Client Logos', 'Client Testimonials', 'Partnership Showcase', 'Industry Coverage', 'Success Stories'],
            required: false
          }
        ],
        'startup': [
          {
            id: 'about',
            name: 'About Startup',
            description: 'Share your startup vision and mission',
            price: '+$100',
            features: ['Startup Story', 'Mission Vision', 'Problem Statement', 'Solution Overview', 'Team Background'],
            required: false
          },
          {
            id: 'product',
            name: 'Product Demo',
            description: 'Showcase your startup product',
            price: '+$200',
            features: ['Product Features', 'Live Demo', 'Use Cases', 'Benefits Overview', 'Product Roadmap'],
            required: false
          },
          {
            id: 'team',
            name: 'Founding Team',
            description: 'Introduce your startup founders',
            price: '+$150',
            features: ['Founder Profiles', 'Team Expertise', 'Advisors', 'Investors', 'Company Culture'],
            required: false
          },
          {
            id: 'traction',
            name: 'Traction & Metrics',
            description: 'Show your startup growth and achievements',
            price: '+$150',
            features: ['Growth Metrics', 'User Statistics', 'Revenue Data', 'Milestones', 'Press Coverage'],
            required: false
          }
        ],
        'default': [
          {
            id: 'about',
            name: 'About Business',
            description: 'Tell your business story and build trust',
            price: '+$100',
            features: ['Company Story', 'Mission Statement', 'Team Introduction', 'Company Values', 'Business Timeline'],
            required: false
          },
          {
            id: 'services',
            name: 'Services Section',
            description: 'Showcase your business services and offerings',
            price: '+$150',
            features: ['Service Listings', 'Service Descriptions', 'Pricing Overview', 'Process Steps', 'Service Icons'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'Client Testimonials',
            description: 'Build credibility with customer reviews',
            price: '+$100',
            features: ['Client Reviews', 'Star Ratings', 'Client Photos', 'Success Stories', 'Review Carousel'],
            required: false
          },
          {
            id: 'portfolio',
            name: 'Portfolio/Projects',
            description: 'Display your business projects and work',
            price: '+$200',
            features: ['Project Gallery', 'Case Studies', 'Work Samples', 'Project Details', 'Client Results'],
            required: false
          },
          {
            id: 'team',
            name: 'Team Section',
            description: 'Introduce your business team members',
            price: '+$150',
            features: ['Team Member Profiles', 'Role Descriptions', 'Professional Photos', 'Contact Info', 'Expertise Areas'],
            required: false
          },
          {
            id: 'pricing',
            name: 'Pricing Section',
            description: 'Display clear service pricing tiers',
            price: '+$100',
            features: ['Pricing Tiers', 'Service Packages', 'Feature Comparison', 'Payment Options', 'FAQ Integration'],
            required: false
          },
          {
            id: 'faq',
            name: 'FAQ Section',
            description: 'Answer common customer questions',
            price: '+$75',
            features: ['Common Questions', 'Expandable Answers', 'Category Filters', 'Search Function', 'Contact Link'],
            required: false
          },
          {
            id: 'gallery',
            name: 'Photo Gallery',
            description: 'Showcase your work with stunning visuals',
            price: '+$125',
            features: ['Image Grid', 'Lightbox View', 'Category Filters', 'Captions', 'Before/After Slider'],
            required: false
          },
          {
            id: 'stats',
            name: 'Stats & Numbers',
            description: 'Highlight key business achievements',
            price: '+$75',
            features: ['Animated Counters', 'Key Metrics', 'Years Experience', 'Projects Completed', 'Clients Served'],
            required: false
          },
          {
            id: 'process',
            name: 'How It Works',
            description: 'Explain your business process step by step',
            price: '+$100',
            features: ['Step-by-Step Guide', 'Process Timeline', 'Visual Icons', 'Descriptions', 'CTA Integration'],
            required: false
          },
          {
            id: 'cta',
            name: 'Call-to-Action Banner',
            description: 'Drive conversions with compelling CTAs',
            price: '+$50',
            features: ['Bold Headlines', 'Action Buttons', 'Background Image', 'Urgency Elements', 'Contact Form'],
            required: false
          },
          {
            id: 'partners',
            name: 'Partners & Clients',
            description: 'Display trusted partners and client logos',
            price: '+$75',
            features: ['Logo Grid', 'Partner Descriptions', 'Trust Badges', 'Certifications', 'Industry Awards'],
            required: false
          },
          {
            id: 'blog-preview',
            name: 'Blog/News Preview',
            description: 'Show latest blog posts or news',
            price: '+$100',
            features: ['Recent Posts', 'Featured Articles', 'Category Tags', 'Read More Links', 'Author Info'],
            required: false
          },
          {
            id: 'newsletter',
            name: 'Newsletter Signup',
            description: 'Build your email list',
            price: '+$75',
            features: ['Email Capture', 'Lead Magnet', 'Privacy Policy', 'Thank You Message', 'Mailchimp Integration'],
            required: false
          },
          {
            id: 'video',
            name: 'Video Section',
            description: 'Engage visitors with video content',
            price: '+$100',
            features: ['Video Embed', 'Play Button', 'Thumbnail', 'Auto-play Option', 'Video Description'],
            required: false
          },
          {
            id: 'map',
            name: 'Location Map',
            description: 'Show your business location',
            price: '+$75',
            features: ['Interactive Map', 'Address Display', 'Directions Link', 'Multiple Locations', 'Hours Display'],
            required: false
          }
        ]
      },
      restaurant: {
        'fine-dining': [
          {
            id: 'about',
            name: 'About Restaurant',
            description: 'Fine dining experience and culinary philosophy',
            price: '+$100',
            features: ['Restaurant Story', 'Chef Philosophy', 'Cuisine Focus', 'Ambiance Description', 'Awards Recognition'],
            required: false
          },
          {
            id: 'menu',
            name: 'Tasting Menu',
            description: 'Showcase your fine dining tasting menu',
            price: '+$200',
            features: ['Tasting Menu', 'Wine Pairing', 'Seasonal Specials', 'Chef Specialties', 'Dietary Options'],
            required: false
          },
          {
            id: 'reservations',
            name: 'Reservations',
            description: 'Elegant reservation booking system',
            price: '+$250',
            features: ['Table Booking', 'Time Selection', 'Special Requests', 'Private Dining', 'Event Reservations'],
            required: false
          },
          {
            id: 'gallery',
            name: 'Gallery',
            description: 'Showcase restaurant ambiance and presentation',
            price: '+$200',
            features: ['Interior Design', 'Plating Presentation', 'Chef Table', 'Wine Cellar', 'Dining Atmosphere'],
            required: false
          }
        ],
        'casual': [
          {
            id: 'about',
            name: 'About Restaurant',
            description: 'Casual dining atmosphere and concept',
            price: '+$100',
            features: ['Restaurant Concept', 'Casual Atmosphere', 'Food Philosophy', 'Local Sourcing', 'Community Focus'],
            required: false
          },
          {
            id: 'menu',
            name: 'Menu',
            description: 'Display your casual dining menu',
            price: '+$150',
            features: ['Full Menu', 'Daily Specials', 'Kids Menu', 'Beverage Selection', 'Happy Hour'],
            required: false
          },
          {
            id: 'order-online',
            name: 'Order Online',
            description: 'Online ordering and pickup system',
            price: '+$200',
            features: ['Online Ordering', 'Menu Selection', 'Pickup Time', 'Payment Processing', 'Order Tracking'],
            required: false
          }
        ],
        'fast-food': [
          {
            id: 'about',
            name: 'About Brand',
            description: 'Fast food brand story and values',
            price: '+$100',
            features: ['Brand Story', 'Fast Service Promise', 'Quality Standards', 'Location History', 'Brand Values'],
            required: false
          },
          {
            id: 'menu',
            name: 'Menu',
            description: 'Quick service menu items',
            price: '+$150',
            features: ['Value Menu', 'Combos', 'Limited Time Offers', 'Nutrition Info', 'Drive-thru Menu'],
            required: false
          },
          {
            id: 'locations',
            name: 'Locations',
            description: 'Find nearest locations',
            price: '+$100',
            features: ['Store Locator', 'Hours of Operation', 'Drive-thru Info', 'Delivery Zones', 'Contact Info'],
            required: false
          }
        ],
        'cafe': [
          {
            id: 'about',
            name: 'About Cafe',
            description: 'Coffee shop atmosphere and philosophy',
            price: '+$100',
            features: ['Cafe Story', 'Coffee Philosophy', 'Artisan Approach', 'Community Hub', 'Sustainability'],
            required: false
          },
          {
            id: 'menu',
            name: 'Coffee & Menu',
            description: 'Coffee beverages and light fare',
            price: '+$150',
            features: ['Coffee Menu', 'Pastries', 'Light Meals', 'Specialty Drinks', 'Seasonal Offerings'],
            required: false
          },
          {
            id: 'events',
            name: 'Events & Space',
            description: 'Cafe events and community space',
            price: '+$150',
            features: ['Event Calendar', 'Live Music', 'Art Showcases', 'Workshop Space', 'Private Events'],
            required: false
          }
        ],
        'default': [
          {
            id: 'about',
            name: 'About Restaurant',
            description: 'Share your restaurant story and cuisine philosophy',
            price: '+$100',
            features: ['Restaurant Story', 'Chef Profile', 'Cuisine Philosophy', 'Restaurant History', 'Awards'],
            required: false
          },
          {
            id: 'menu',
            name: 'Menu Section',
            description: 'Display your food and beverage menu',
            price: '+$150',
            features: ['Food Menu', 'Drink Menu', 'Special Items', 'Pricing', 'Dietary Information'],
            required: false
          },
          {
            id: 'reservations',
            name: 'Reservations',
            description: 'Online table booking system',
            price: '+$200',
            features: ['Booking Form', 'Availability Calendar', 'Time Slots', 'Party Size Selection', 'Confirmation'],
            required: false
          },
          {
            id: 'gallery',
            name: 'Restaurant Gallery',
            description: 'Showcase your restaurant ambiance and dishes',
            price: '+$200',
            features: ['Interior Photos', 'Food Photography', 'Chef Action Shots', 'Event Photos', 'Atmosphere Gallery'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'Customer Reviews',
            description: 'Display diner reviews and ratings',
            price: '+$100',
            features: ['Customer Reviews', 'Star Ratings', 'Review Highlights', 'Social Proof', 'Recent Reviews'],
            required: false
          },
          {
            id: 'events',
            name: 'Events & Catering',
            description: 'Promote special events and catering services',
            price: '+$150',
            features: ['Event Calendar', 'Catering Menu', 'Private Events', 'Special Occasions', 'Event Inquiry'],
            required: false
          },
          {
            id: 'specials',
            name: 'Daily Specials',
            description: 'Highlight daily specials and promotions',
            price: '+$75',
            features: ['Daily Menu', 'Happy Hour', 'Weekend Specials', 'Seasonal Items', 'Chef Recommendations'],
            required: false
          },
          {
            id: 'chef',
            name: 'Meet the Chef',
            description: 'Introduce your culinary team',
            price: '+$100',
            features: ['Chef Bio', 'Culinary Background', 'Signature Dishes', 'Awards', 'Kitchen Team'],
            required: false
          },
          {
            id: 'order-online',
            name: 'Online Ordering',
            description: 'Enable online food ordering',
            price: '+$250',
            features: ['Menu Selection', 'Cart System', 'Pickup/Delivery', 'Payment Integration', 'Order Tracking'],
            required: false
          },
          {
            id: 'location',
            name: 'Location & Hours',
            description: 'Display location and operating hours',
            price: '+$75',
            features: ['Interactive Map', 'Business Hours', 'Parking Info', 'Directions', 'Multiple Locations'],
            required: false
          },
          {
            id: 'gift-cards',
            name: 'Gift Cards',
            description: 'Sell digital gift cards online',
            price: '+$150',
            features: ['Gift Card Purchase', 'Custom Amounts', 'E-Gift Cards', 'Balance Check', 'Redemption Info'],
            required: false
          },
          {
            id: 'social-feed',
            name: 'Social Media Feed',
            description: 'Display your Instagram/social posts',
            price: '+$100',
            features: ['Instagram Feed', 'Social Links', 'Hashtag Gallery', 'User Photos', 'Follow Buttons'],
            required: false
          }
        ]
      },
      portfolio: {
        'designer': [
          {
            id: 'about',
            name: 'About Designer',
            description: 'Personal design philosophy and background',
            price: '+$100',
            features: ['Design Philosophy', 'Creative Background', 'Design Process', 'Aesthetic Approach', 'Career Journey'],
            required: false
          },
          {
            id: 'portfolio',
            name: 'Design Portfolio',
            description: 'Showcase best design work',
            price: '+$200',
            features: ['Design Gallery', 'Project Case Studies', 'Design Process', 'Before/After', 'Client Results'],
            required: false
          },
          {
            id: 'services',
            name: 'Design Services',
            description: 'Design services offered',
            price: '+$150',
            features: ['Design Services', 'Design Process', 'Tools Used', 'Deliverables', 'Pricing'],
            required: false
          },
          {
            id: 'skills',
            name: 'Design Skills',
            description: 'Technical and creative design skills',
            price: '+$100',
            features: ['Design Software', 'Creative Skills', 'Technical Skills', 'Design Specializations', 'Certifications'],
            required: false
          }
        ],
        'developer': [
          {
            id: 'about',
            name: 'About Developer',
            description: 'Development background and expertise',
            price: '+$100',
            features: ['Dev Background', 'Coding Philosophy', 'Technical Expertise', 'Problem-solving Approach', 'Learning Path'],
            required: false
          },
          {
            id: 'projects',
            name: 'Code Projects',
            description: 'Showcase development projects',
            price: '+$200',
            features: ['Project Gallery', 'Code Samples', 'Tech Stack', 'GitHub Links', 'Live Demos'],
            required: false
          },
          {
            id: 'skills',
            name: 'Tech Skills',
            description: 'Programming languages and technologies',
            price: '+$100',
            features: ['Programming Languages', 'Frameworks', 'Tools', 'Databases', 'DevOps'],
            required: false
          },
          {
            id: 'services',
            name: 'Dev Services',
            description: 'Development services offered',
            price: '+$150',
            features: ['Web Development', 'App Development', 'Consulting', 'Code Review', 'Mentoring'],
            required: false
          }
        ],
        'photographer': [
          {
            id: 'about',
            name: 'About Photographer',
            description: 'Photography style and background',
            price: '+$100',
            features: ['Photography Style', 'Background Story', 'Equipment', 'Artistic Vision', 'Experience'],
            required: false
          },
          {
            id: 'gallery',
            name: 'Photo Gallery',
            description: 'Showcase photography portfolio',
            price: '+$200',
            features: ['Photo Gallery', 'Photo Categories', 'Featured Work', 'Behind Scenes', 'Photo Stories'],
            required: false
          },
          {
            id: 'services',
            name: 'Photography Services',
            description: 'Photography services offered',
            price: '+$150',
            features: ['Photo Sessions', 'Event Photography', 'Commercial Work', 'Photo Editing', 'Packages'],
            required: false
          },
          {
            id: 'equipment',
            name: 'Equipment',
            description: 'Photography equipment and gear',
            price: '+$100',
            features: ['Camera Gear', 'Lighting Equipment', 'Editing Setup', 'Special Equipment', 'Gear Reviews'],
            required: false
          }
        ],
        'default': [
          {
            id: 'about',
            name: 'About Me',
            description: 'Personal introduction and background',
            price: '+$100',
            features: ['Personal Story', 'Skills & Expertise', 'Background', 'Philosophy', 'Career Journey'],
            required: false
          },
          {
            id: 'portfolio',
            name: 'Portfolio Gallery',
            description: 'Showcase your best work and projects',
            price: '+$200',
            features: ['Project Gallery', 'Work Samples', 'Case Studies', 'Project Details', 'Results'],
            required: false
          },
          {
            id: 'services',
            name: 'Services Offered',
            description: 'Detail the services you provide',
            price: '+$150',
            features: ['Service List', 'Service Descriptions', 'Process Overview', 'Pricing', 'Deliverables'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'Client Testimonials',
            description: 'Show feedback from past clients',
            price: '+$100',
            features: ['Client Reviews', 'Project Feedback', 'Client Results', 'Recommendations', 'Success Stories'],
            required: false
          },
          {
            id: 'skills',
            name: 'Skills & Expertise',
            description: 'Highlight your technical and creative skills',
            price: '+$100',
            features: ['Technical Skills', 'Creative Skills', 'Tools & Software', 'Certifications', 'Experience Level'],
            required: false
          },
          {
            id: 'blog',
            name: 'Blog/Articles',
            description: 'Share your thoughts and expertise',
            price: '+$150',
            features: ['Article Display', 'Category Filtering', 'Search Function', 'Social Sharing', 'Comments'],
            required: false
          }
        ]
      },
      ecommerce: {
        'fashion': [
          {
            id: 'about',
            name: 'About Brand',
            description: 'Fashion brand story and values',
            price: '+$100',
            features: ['Brand Story', 'Fashion Philosophy', 'Design Inspiration', 'Sustainability', 'Brand Values'],
            required: false
          },
          {
            id: 'collections',
            name: 'Collections',
            description: 'Showcase fashion collections',
            price: '+$200',
            features: ['New Arrivals', 'Seasonal Collections', 'Lookbook', 'Trending Items', 'Exclusive Pieces'],
            required: false
          },
          {
            id: 'size-guide',
            name: 'Size Guide',
            description: 'Help customers find perfect fit',
            price: '+$100',
            features: ['Size Charts', 'Fit Guide', 'Measurement Tips', 'Size Calculator', 'Fit Recommendations'],
            required: false
          }
        ],
        'electronics': [
          {
            id: 'about',
            name: 'About Store',
            description: 'Electronics store expertise and background',
            price: '+$100',
            features: ['Store Background', 'Tech Expertise', 'Product Knowledge', 'Customer Service', 'Warranty Info'],
            required: false
          },
          {
            id: 'categories',
            name: 'Product Categories',
            description: 'Electronics product categories',
            price: '+$200',
            features: ['Product Categories', 'New Releases', 'Best Sellers', 'Tech Deals', 'Accessories'],
            required: false
          },
          {
            id: 'support',
            name: 'Tech Support',
            description: 'Technical support and help',
            price: '+$150',
            features: ['Product Support', 'Setup Guides', 'Troubleshooting', 'Warranty Service', 'Tech Help'],
            required: false
          }
        ],
        'default': [
          {
            id: 'about',
            name: 'About Brand',
            description: 'Tell your brand story and values',
            price: '+$100',
            features: ['Brand Story', 'Company Values', 'Mission Statement', 'Brand Philosophy', 'Team Introduction'],
            required: false
          },
          {
            id: 'products',
            name: 'Featured Products',
            description: 'Showcase your best-selling products',
            price: '+$200',
            features: ['Product Gallery', 'Product Highlights', 'New Arrivals', 'Best Sellers', 'Product Categories'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'Customer Reviews',
            description: 'Display product reviews and ratings',
            price: '+$100',
            features: ['Product Reviews', 'Customer Ratings', 'Review Photos', 'Testimonials', 'Social Proof'],
            required: false
          },
          {
            id: 'shipping',
            name: 'Shipping & Returns',
            description: 'Information about shipping and return policies',
            price: '+$100',
            features: ['Shipping Info', 'Delivery Times', 'Return Policy', 'Tracking', 'Shipping Options'],
            required: false
          },
          {
            id: 'faq',
            name: 'FAQ Section',
            description: 'Answer common customer questions',
            price: '+$100',
            features: ['Product FAQs', 'Order Questions', 'Shipping FAQs', 'Return Questions', 'Support Info'],
            required: false
          },
          {
            id: 'newsletter',
            name: 'Newsletter Signup',
            description: 'Build your customer email list',
            price: '+$75',
            features: ['Email Capture', 'Discount Offers', 'New Product Alerts', 'Exclusive Deals', 'Privacy Policy'],
            required: false
          },
          {
            id: 'trust-badges',
            name: 'Trust & Security',
            description: 'Build customer confidence',
            price: '+$50',
            features: ['Security Badges', 'Payment Icons', 'Money-back Guarantee', 'SSL Certificate', 'Trust Seals'],
            required: false
          },
          {
            id: 'collections',
            name: 'Shop Collections',
            description: 'Browse by collections and categories',
            price: '+$150',
            features: ['Collection Grid', 'Category Filters', 'Seasonal Collections', 'Sale Items', 'New Arrivals'],
            required: false
          }
        ]
      },
      blog: {
        'default': [
          {
            id: 'about',
            name: 'About Author',
            description: 'Introduce yourself and your blog',
            price: '+$100',
            features: ['Author Bio', 'Blog Mission', 'Background Story', 'Expertise Areas', 'Personal Photo'],
            required: false
          },
          {
            id: 'featured-posts',
            name: 'Featured Posts',
            description: 'Highlight your best articles',
            price: '+$150',
            features: ['Featured Articles', 'Editor Picks', 'Popular Posts', 'Trending Topics', 'Must-Read Content'],
            required: false
          },
          {
            id: 'categories',
            name: 'Blog Categories',
            description: 'Organize content by categories',
            price: '+$100',
            features: ['Category Grid', 'Topic Tags', 'Content Organization', 'Archive Access', 'Topic Exploration'],
            required: false
          },
          {
            id: 'newsletter',
            name: 'Newsletter Signup',
            description: 'Build your reader email list',
            price: '+$75',
            features: ['Email Subscription', 'Lead Magnet', 'Content Updates', 'Exclusive Content', 'Privacy Policy'],
            required: false
          },
          {
            id: 'social',
            name: 'Social Media Links',
            description: 'Connect with readers on social',
            price: '+$50',
            features: ['Social Icons', 'Follow Buttons', 'Share Buttons', 'Social Feed', 'Community Links'],
            required: false
          },
          {
            id: 'recent-posts',
            name: 'Recent Posts',
            description: 'Display latest blog articles',
            price: '+$100',
            features: ['Latest Articles', 'Post Previews', 'Publication Dates', 'Read Time', 'Author Info'],
            required: false
          },
          {
            id: 'comments',
            name: 'Comments Section',
            description: 'Enable reader engagement',
            price: '+$100',
            features: ['Comment System', 'Reply Threading', 'Moderation', 'User Profiles', 'Comment Notifications'],
            required: false
          },
          {
            id: 'search',
            name: 'Search Function',
            description: 'Help readers find content',
            price: '+$75',
            features: ['Search Bar', 'Auto-suggest', 'Search Results', 'Filters', 'Search Analytics'],
            required: false
          }
        ]
      },
      landing: {
        'default': [
          {
            id: 'value-prop',
            name: 'Value Proposition',
            description: 'Highlight your main offer',
            price: '+$100',
            features: ['Main Headline', 'Subheadline', 'Key Benefits', 'Unique Selling Points', 'Visual Support'],
            required: false
          },
          {
            id: 'features',
            name: 'Features Section',
            description: 'Detail product/service features',
            price: '+$150',
            features: ['Feature List', 'Feature Icons', 'Feature Descriptions', 'Benefit Highlights', 'Feature Comparison'],
            required: false
          },
          {
            id: 'social-proof',
            name: 'Social Proof',
            description: 'Build trust with testimonials',
            price: '+$100',
            features: ['Customer Testimonials', 'User Count', 'Trust Badges', 'Media Mentions', 'Case Studies'],
            required: false
          },
          {
            id: 'pricing',
            name: 'Pricing Table',
            description: 'Display pricing options',
            price: '+$125',
            features: ['Pricing Tiers', 'Feature Comparison', 'Popular Plan Highlight', 'CTA Buttons', 'Money-back Guarantee'],
            required: false
          },
          {
            id: 'cta',
            name: 'Call-to-Action',
            description: 'Drive conversions',
            price: '+$75',
            features: ['CTA Button', 'Form Integration', 'Urgency Elements', 'Benefit Reminder', 'Risk Reversal'],
            required: false
          },
          {
            id: 'faq',
            name: 'FAQ Section',
            description: 'Address common objections',
            price: '+$75',
            features: ['Common Questions', 'Objection Handling', 'Support Info', 'Expandable Answers', 'Contact Link'],
            required: false
          },
          {
            id: 'countdown',
            name: 'Countdown Timer',
            description: 'Create urgency with limited offers',
            price: '+$75',
            features: ['Countdown Display', 'Deadline Timer', 'Offer Expiry', 'Stock Counter', 'Limited Availability'],
            required: false
          },
          {
            id: 'video',
            name: 'Demo Video',
            description: 'Show your product in action',
            price: '+$100',
            features: ['Video Embed', 'Product Demo', 'Explainer Video', 'Testimonial Video', 'Play Button'],
            required: false
          },
          {
            id: 'comparison',
            name: 'Comparison Table',
            description: 'Compare with competitors',
            price: '+$100',
            features: ['Feature Comparison', 'Competitor Analysis', 'Advantage Highlights', 'Checkmark Grid', 'Winner Indicators'],
            required: false
          }
        ]
      },
      product: {
        'default': [
          {
            id: 'about',
            name: 'About Product',
            description: 'Detailed product overview',
            price: '+$100',
            features: ['Product Story', 'Problem Solved', 'Target Audience', 'Use Cases', 'Product Vision'],
            required: false
          },
          {
            id: 'features',
            name: 'Product Features',
            description: 'Showcase product capabilities',
            price: '+$150',
            features: ['Feature Grid', 'Feature Details', 'Feature Icons', 'Benefit Highlights', 'Feature Demos'],
            required: false
          },
          {
            id: 'how-it-works',
            name: 'How It Works',
            description: 'Explain the product process',
            price: '+$100',
            features: ['Step-by-Step', 'Process Flow', 'Visual Guide', 'Use Instructions', 'Getting Started'],
            required: false
          },
          {
            id: 'screenshots',
            name: 'Screenshots/Gallery',
            description: 'Visual product showcase',
            price: '+$125',
            features: ['Product Screenshots', 'Image Gallery', 'Zoom Feature', 'Feature Highlights', 'Before/After'],
            required: false
          },
          {
            id: 'pricing',
            name: 'Pricing Plans',
            description: 'Product pricing options',
            price: '+$125',
            features: ['Pricing Tiers', 'Plan Comparison', 'Free Trial', 'Annual/Monthly Toggle', 'Enterprise Option'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'User Testimonials',
            description: 'Customer success stories',
            price: '+$100',
            features: ['User Reviews', 'Case Studies', 'Success Metrics', 'User Photos', 'Company Logos'],
            required: false
          },
          {
            id: 'integrations',
            name: 'Integrations',
            description: 'Show compatible tools/platforms',
            price: '+$100',
            features: ['Integration Logos', 'Compatible Apps', 'API Info', 'Setup Guides', 'Partner Ecosystem'],
            required: false
          },
          {
            id: 'faq',
            name: 'Product FAQ',
            description: 'Answer product questions',
            price: '+$75',
            features: ['Common Questions', 'Technical FAQ', 'Billing FAQ', 'Support Info', 'Contact Options'],
            required: false
          },
          {
            id: 'download',
            name: 'Download/CTA',
            description: 'Product download or signup',
            price: '+$75',
            features: ['Download Button', 'Platform Options', 'App Store Links', 'System Requirements', 'Free Trial CTA'],
            required: false
          }
        ]
      },
      custom: {
        'default': [
          {
            id: 'about',
            name: 'About Section',
            description: 'Custom about section',
            price: '+$100',
            features: ['Custom Content', 'Flexible Layout', 'Brand Story', 'Mission Vision', 'Team Info'],
            required: false
          },
          {
            id: 'services',
            name: 'Services/Offerings',
            description: 'Showcase your services',
            price: '+$150',
            features: ['Service List', 'Service Details', 'Pricing Info', 'Process Steps', 'Deliverables'],
            required: false
          },
          {
            id: 'gallery',
            name: 'Media Gallery',
            description: 'Photos, videos, and media',
            price: '+$125',
            features: ['Image Gallery', 'Video Embed', 'Lightbox View', 'Media Categories', 'Captions'],
            required: false
          },
          {
            id: 'testimonials',
            name: 'Testimonials',
            description: 'Client/user feedback',
            price: '+$100',
            features: ['Reviews', 'Ratings', 'Success Stories', 'Client Photos', 'Video Testimonials'],
            required: false
          },
          {
            id: 'team',
            name: 'Team Section',
            description: 'Introduce your team',
            price: '+$125',
            features: ['Team Profiles', 'Roles', 'Photos', 'Bios', 'Contact Info'],
            required: false
          },
          {
            id: 'faq',
            name: 'FAQ Section',
            description: 'Frequently asked questions',
            price: '+$75',
            features: ['Q&A Format', 'Expandable Answers', 'Categories', 'Search', 'Contact Link'],
            required: false
          },
          {
            id: 'events',
            name: 'Events/Calendar',
            description: 'Upcoming events and dates',
            price: '+$150',
            features: ['Event List', 'Calendar View', 'Event Details', 'Registration', 'Reminders'],
            required: false
          },
          {
            id: 'resources',
            name: 'Resources/Downloads',
            description: 'Downloadable content',
            price: '+$100',
            features: ['File Downloads', 'Resource Library', 'Categories', 'Preview', 'Access Control'],
            required: false
          },
          {
            id: 'blog',
            name: 'Blog/News',
            description: 'Latest updates and articles',
            price: '+$125',
            features: ['Recent Posts', 'Categories', 'Author Info', 'Search', 'Social Share'],
            required: false
          },
          {
            id: 'newsletter',
            name: 'Newsletter',
            description: 'Email subscription',
            price: '+$75',
            features: ['Email Capture', 'Lead Magnet', 'Privacy Policy', 'Confirmation', 'Integration'],
            required: false
          },
          {
            id: 'map',
            name: 'Location/Map',
            description: 'Physical location display',
            price: '+$75',
            features: ['Interactive Map', 'Address', 'Directions', 'Hours', 'Contact Info'],
            required: false
          },
          {
            id: 'pricing',
            name: 'Pricing Table',
            description: 'Service/product pricing',
            price: '+$100',
            features: ['Pricing Tiers', 'Comparison', 'Features List', 'CTA Buttons', 'Custom Plans'],
            required: false
          }
        ]
      }
    };

    // Return base sections plus category/subcategory-specific sections
    const sections = [...baseSections];
    
    if (categorySections[category] && categorySections[category][subcategory]) {
      sections.push(...categorySections[category][subcategory]);
    } else if (categorySections[category] && categorySections[category].default) {
      sections.push(...categorySections[category].default);
    } else {
      // Default to business default sections if category not found
      sections.push(...categorySections.business.default);
    }
    
    return sections;
  };

  const toggleSection = (sectionId) => {
    const section = getSectionOptions().find(s => s.id === sectionId);
    if (section && section.required) return; // Can't toggle required sections
    
    // Check if this section is locked by bundle (can't toggle off)
    if (isSectionLockedByBundle(sectionId) && selectedSections[sectionId]) {
      return; // Can't toggle off bundle-included sections
    }
    
    console.log('Step 9: toggleSection called with:', sectionId);
    console.log('Step 9: current selectedSections before toggle:', selectedSections);
    
    // Direct toggle the section selection
    const newSelections = {
      ...selectedSections,
      [sectionId]: !selectedSections[sectionId]
    };
    console.log('Step 9: newSelections after toggle:', newSelections);
    setSelectedSections(newSelections);
    console.log('Step 9: After setSelectedSections, state should be updated to:', newSelections);
    
    // Update URL parameters immediately when section is selected
    const selectedSectionIds = Object.keys(newSelections).filter(id => newSelections[id]);
    console.log('Step 9: Updating URL with selected sections:', selectedSectionIds);
    
    // Update URL without page refresh
    const currentQuery = { ...router.query };
    currentQuery.pages = selectedSectionIds.join(',');
    
    router.replace(
      {
        pathname: router.pathname,
        query: currentQuery
      },
      undefined,
      { shallow: true }
    );
    
    saveSelections(newSelections);
  };

  const saveSelections = (newSelections) => {
    if (isClient) {
      try {
        // First, read what's currently in localStorage
        const currentSelections = JSON.parse(safeLocalStorage().getItem(STORAGE_KEY) || '{}');
        console.log('Step 9: Current localStorage before save:', Object.keys(currentSelections));
        console.log('Step 9: Current localStorage values:', currentSelections);
        
        const selectedSectionIds = Object.keys(newSelections).filter(id => newSelections[id]);
        console.log('Step 9: Selected section IDs', selectedSectionIds);
        
        // Check if there are automation features in localStorage that need to be preserved
        const hasAutomationFeatures = currentSelections.step14 && 
          currentSelections.step14.name === 'Automation Features';
        
        if (selectedSectionIds.length > 0) {
          // Calculate actual cost for sections
          let sectionsCost = 0;
          selectedSectionIds.forEach(sectionId => {
            const sectionOption = getSectionOptions().find(opt => opt.id === sectionId);
            if (sectionOption && !isSectionLockedByBundle(sectionId) && sectionOption.price !== 'Included') {
              sectionsCost += parseInt(sectionOption.price.replace(/[^0-9]/g, ''));
            }
          });
          
          // Sections only: step14 (automation) is written only in step-7; never overwrite it here
          const allSectionsFromBundle = lockedSections.length > 0 && selectedSectionIds.length > 0 &&
            selectedSectionIds.every(id => isSectionLockedByBundle(id));
          currentSelections.step9 = {
            step: 9,
            name: 'Sections/Pages',
            value: `${selectedSectionIds.length} selected`,
            items: selectedSectionIds,
            cost: sectionsCost,
            includedInBundle: !!allSectionsFromBundle
          };
          
          // Explicitly preserve all other step data when saving step9
          const allSteps = Object.keys(currentSelections).filter(key => key.startsWith('step'));
          console.log('Step 9: All step data being preserved:', allSteps);
          if (currentSelections.step10) {
            console.log('Step 9: Preserving step10 data during step9 save:', currentSelections.step10);
          }
        } else {
          // No sections selected - never touch step14 (automation is saved in step-7)
          // Don't delete step9 so we preserve previous section selection when navigating back
          
          // Explicitly preserve step10 data if it exists
          if (currentSelections.step10) {
            console.log('Step 9: Preserving step10 data:', currentSelections.step10);
          }
        }
        
        console.log('Step 9: Final selections before save:', currentSelections);
        console.log('Step 9: Keys being saved to localStorage:', Object.keys(currentSelections));
        
        // Explicitly preserve all step data to prevent data loss
        const allSteps = Object.keys(currentSelections).filter(key => key.startsWith('step'));
        console.log('Step 9: Preserving all step data:', allSteps);
        
        safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(currentSelections));
        console.log('Step 9: Saved sections to localStorage');
        
        // Trigger a custom event to notify MobileCostSummary of the change
        console.log('Step 9: Dispatching selections-updated event');
        safeWindow().dispatchEvent(new Event('selections-updated'));
      } catch (error) {
        console.warn('Error saving section selections to localStorage:', error);
      }
    }
  };

  const calculateSectionCost = () => {
    let total = 0;
    getSectionOptions().forEach(section => {
      // Only charge for sections that are: selected, not included by default, AND not locked by bundle
      if (selectedSections[section.id] && section.price !== 'Included' && !isSectionLockedByBundle(section.id)) {
        total += parseInt(section.price.replace(/[^0-9]/g, ''));
      }
    });
    return total;
  };

  return (
    <>
      <Head>
        <title>Step 9: Website Sections - Mellow Quote</title>
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
          .section-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .section-card:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-2 pt-12 pb-24 sm:pt-4 sm:pb-4 sm:p-4 relative overflow-hidden">
        {/* Subtle background elements - hidden on mobile */}
        <div className="hidden sm:block fixed top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="hidden sm:block fixed bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tl from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="fade-in">
            {/* Header - compact on mobile */}
            <div className="text-center mb-3 sm:mb-8">
              <div className="hidden sm:inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight">
                Step 9: {websiteType === 'multi' ? 'Pages' : 'Sections'}
              </h1>
              <p className="hidden sm:block text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                Website {websiteType === 'multi' ? 'Pages' : 'Sections'}
              </p>
              <div className="hidden sm:inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 shadow-sm max-w-full overflow-hidden">
                <span className="text-blue-600 font-semibold flex-shrink-0">Layout</span>
                <span className="mx-1.5 text-slate-400 flex-shrink-0">•</span>
                <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
                  <span className="flex-shrink-0">📄 Single</span>
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
                  <span className="text-blue-600 font-semibold flex-shrink-0">{websiteType === 'multi' ? 'Pages' : 'Sections'}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-3 sm:p-6 md:p-8">
              {/* Introduction - hidden on mobile */}
              <div className="hidden sm:block text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your {websiteType === 'multi' ? 'Pages' : 'Sections'}</h2>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                  {websiteType === 'multi' 
                    ? 'Select the pages for your multi-page website. Home and Contact pages are included automatically.'
                    : 'Select the sections for your single-page website. Hero and Contact sections are included automatically.'
                  }
                </p>
              </div>
              <p className="sm:hidden text-xs text-slate-500 text-center mb-2">Tap to select. Hero & Contact included.</p>

              {/* Bundle Included Sections Notice */}
              {lockedSections.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-purple-600 mr-3 text-xl">🔒</span>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-1">Bundle Included {websiteType === 'multi' ? 'Pages' : 'Sections'}</h4>
                      <p className="text-purple-700 text-sm mb-2">
                        The following {websiteType === 'multi' ? 'pages' : 'sections'} are included in your bundle and cannot be removed:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lockedSections.map(sectionId => (
                          <span key={sectionId} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium capitalize">
                            {sectionId.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="text-purple-600 text-xs mt-2">
                        You can add more {websiteType === 'multi' ? 'pages' : 'sections'} as add-ons below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sections Grid - compact on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
                {getSectionOptions().map((section, index) => (
                  <div
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`section-card relative p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 flex-shrink-0 ${
                      section.required
                        ? 'border-green-500 bg-green-50 opacity-75 cursor-default'
                        : isSectionLockedByBundle(section.id) && selectedSections[section.id]
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md shadow-purple-500/20 cursor-default'
                        : selectedSections[section.id]
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md shadow-blue-500/20 cursor-pointer'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        section.required
                          ? 'border-green-500 bg-green-500'
                          : isSectionLockedByBundle(section.id) && selectedSections[section.id]
                          ? 'border-purple-500 bg-purple-500 shadow-md shadow-purple-500/40'
                          : selectedSections[section.id]
                          ? 'border-blue-500 bg-blue-500 shadow-md shadow-blue-500/40'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {(section.required || selectedSections[section.id]) && (
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Bundle Included Badge - compact on mobile */}
                    {isSectionLockedByBundle(section.id) && selectedSections[section.id] && !section.required && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
                          🔒 <span className="hidden sm:inline">Bundle</span>
                        </span>
                      </div>
                    )}

                    {/* Required Badge - compact on mobile */}
                    {section.required && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
                          ✓
                        </span>
                      </div>
                    )}

                    {/* Content - compact on mobile */}
                    <div className="pr-4 sm:pr-6">
                      <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1 line-clamp-1">{section.name}</h3>
                      <p className="hidden sm:block text-sm text-slate-600 leading-relaxed mb-3">{section.description}</p>
                      <p className="sm:hidden text-[10px] text-slate-500 line-clamp-1 mb-1">{section.price}</p>
                    </div>

                    {/* Features - hidden on mobile */}
                    <div className="hidden sm:block mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        {section.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {feature}
                          </span>
                        ))}
                        {section.features.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                            +{section.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price - hidden on mobile, shown in card already */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className={`text-lg font-bold ${
                        section.price === 'Included' || section.required
                          ? 'text-green-600' 
                          : isSectionLockedByBundle(section.id)
                          ? 'text-purple-600'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                      }`}>
                        {isSectionLockedByBundle(section.id) && !section.required ? 'Included in Bundle' : section.price}
                      </div>
                      {selectedSections[section.id] && !section.required && !isSectionLockedByBundle(section.id) && (
                        <div className="text-xs font-medium text-green-600 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </div>
                      )}
                      {isSectionLockedByBundle(section.id) && !section.required && (
                        <div className="text-xs font-medium text-purple-600 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary - compact on mobile */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-slate-200">
                <div className="flex sm:flex-col items-center justify-between sm:justify-center">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 sm:mb-4 sm:text-center">Cost: <span className="text-blue-600">+${calculateSectionCost()}</span></h3>
                  <div className="hidden sm:block bg-white rounded-lg p-4 text-center shadow-sm w-full">
                    <div className="text-xs font-medium text-slate-600 mb-1">Additional {websiteType === 'multi' ? 'Pages' : 'Sections'} Cost</div>
                    <div className="text-2xl font-bold text-blue-600">
                      +${calculateSectionCost()}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {websiteType === 'multi' ? 'Home and Contact pages included free' : 'Hero and Contact sections included free'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-8 mb-16 sm:mb-0">
                <button
                  onClick={() => {
                    // Save current section selections when going back
                    const selectedSectionIds = Object.keys(selectedSections).filter(key => selectedSections[key]);
                    console.log('Step 9: Back button clicked - current selectedSections:', selectedSections);
                    console.log('Step 9: Back button - selectedSectionIds:', selectedSectionIds);
                    const storeOptions = router.query.storeOptions || '';
                    
                    // Check if we came from store options (store=yes-store and has store options)
                    if (fromPage === 'store-options' || (store === 'yes-store' && storeOptions)) {
                      // Go back to store options page
                      console.log('Step 9: Going back to store options with sections:', selectedSectionIds);
                      router.push(`/step-8-options?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&storeOptions=${storeOptions}&from=sections${bundleParams}`);
                    } else {
                      // Go back to store yes/no page
                      console.log('Step 9: Going back to store yes/no with sections:', selectedSectionIds);
                      router.push(`/step-8?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&pages=${selectedSectionIds.join(',')}&from=sections${bundleParams}`);
                    }
                  }}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                >
                  ← Back
                </button>
                
                {/* Continue Button - Always visible since hero and contact are required */}
                <button
                  onClick={() => {
                    const selectedSectionIds = Object.keys(selectedSections).filter(key => selectedSections[key]);
                    router.push(`/10?type=${websiteType}&category=${category}&subcategory=${subcategory}&backend=${backend}&ai=${aiChoice}&automation=${automation}&store=${store}&storeOptions=${storeOptions}&pages=${selectedSectionIds.join(',')}&features=${features}${bundleParams}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
