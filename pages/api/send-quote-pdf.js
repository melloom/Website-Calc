// Generate PDF as base64 for email attachment
import jsPDF from 'jspdf';

// Section descriptions
const getSectionDescription = (id) => {
  const descriptions = {
    'hero': 'Main landing section with compelling headline and call-to-action',
    'about': 'Company story, mission, and team introduction',
    'services': 'Detailed description of services offered',
    'portfolio': 'Showcase of previous work and projects',
    'testimonials': 'Customer reviews and success stories',
    'faq': 'Frequently asked questions and answers',
    'team': 'Team member profiles and expertise',
    'pricing': 'Service pricing and package options',
    'contact': 'Contact form and business location',
    'menu': 'Restaurant menu items and pricing',
    'reservations': 'Online booking system for tables',
    'gallery': 'Visual portfolio of food/environment',
    'blog': 'Blog posts and articles',
    'newsletter': 'Email subscription signup',
    'cta': 'Call-to-action sections',
    'video': 'Video content showcase',
    'stats': 'Business statistics and achievements',
    'partners': 'Partner and client logos',
    'features': 'Key feature highlights',
    'reviews': 'Customer review section',
    'product': 'Product showcase and details',
    'specials': 'Daily specials and promotions',
    'chef': 'Chef profile and specialties',
    'order-online': 'Online ordering system',
    'gift-cards': 'Gift card purchase options',
    'events': 'Events and catering information',
    'location-hours': 'Business location and operating hours',
    'collections': 'Product or service collections',
    'skills': 'Skills and expertise showcase',
    'process': 'How it works/process explanation'
  };
  return descriptions[id] || '';
};

// Addon descriptions
const getAddonDescription = (id) => {
  const descriptions = {
    'seo-package': 'Complete SEO optimization including meta tags, sitemap, and search engine submission',
    'content-writing': 'Professional copywriting for all website sections and pages',
    'logo-design': 'Custom logo design with multiple format options and brand guidelines',
    'branding-package': 'Complete brand identity including logo, colors, fonts, and style guide',
    'social-media-setup': 'Setup and optimization of social media profiles and integration',
    'email-marketing': 'Email marketing system setup with templates and automation',
    'google-ads-setup': 'Google Ads campaign setup with keyword research and ad creation',
    'photography': 'Professional photography session for products, team, or location',
    'video-production': 'Professional video production for website and marketing use'
  };
  return descriptions[id] || '';
};

// Backend descriptions
const getBackendDescription = (id) => {
  const descriptions = {
    'basic-auth': 'User authentication system with secure login and password management',
    'auth-storage': 'Advanced authentication with user data storage and profile management',
    'secure-system': 'Enterprise-grade security system with encryption and access control',
    'full-system': 'Complete backend system with all features and custom functionality',
    'content-system': 'Content management system for easy website updates and blog posts',
    'custom-system': 'Fully custom backend solution tailored to specific business needs',
    'nodejs': 'Node.js backend with RESTful API and real-time capabilities',
    'python': 'Python backend with Django/Flask framework and database integration',
    'php': 'PHP backend with Laravel/WordPress integration and custom development',
    'headless': 'Headless CMS integration with flexible content delivery',
    'serverless': 'Serverless architecture with auto-scaling and pay-per-use pricing'
  };
  return descriptions[id] || '';
};

// AI feature descriptions
const getAIFeatureDescription = (id) => {
  const descriptions = {
    'ai-chatbot': 'AI-powered chatbot for customer support and instant responses',
    'content-generation': 'AI content generation for blog posts, product descriptions, and marketing copy',
    'smart-analytics': 'AI-driven analytics with predictive insights and automated reporting',
    'personalization': 'AI-powered personalization engine for customized user experiences',
    'workflow-automation': 'AI workflow automation for repetitive tasks and process optimization'
  };
  return descriptions[id] || '';
};

// Automation descriptions
const getAutomationDescription = (id) => {
  const descriptions = {
    'email-notifications': 'Automated email notifications for form submissions and updates',
    'auto-responder': 'Instant auto-reply system for customer inquiries',
    'social-media-integration': 'Connect and automate social media posting',
    'lead-capture': 'Advanced lead capture with tracking and scoring',
    'analytics-integration': 'Google Analytics and tracking setup',
    'crm-integration': 'CRM integration with automated data sync',
    'workflow-automation': 'Custom workflow automation for business processes',
    'form-automation': 'Smart form handling with conditional logic',
    'scheduled-reports': 'Automated scheduled reporting system',
    'data-sync': 'Real-time data synchronization across platforms',
    'api-integration': 'Third-party API integration and automation',
    'basic-automation': 'Basic automation for form submissions and email notifications',
    'advanced-automation': 'Advanced automation workflows with multi-step processes',
    'email-automation': 'Email marketing automation with drip campaigns and personalization',
    'crm-automation': 'CRM integration with automated lead scoring and follow-up sequences'
  };
  return descriptions[id] || '';
};

// Store option descriptions
const getStoreOptionDescription = (id) => {
  const descriptions = {
    'basic-products': 'Basic product catalog with images and descriptions',
    'shopping-cart': 'Full-featured shopping cart with saved items',
    'payment-processing': 'Secure payment gateway integration',
    'order-management': 'Order tracking and management system',
    'inventory-tracking': 'Real-time inventory tracking',
    'shipping-calculator': 'Automatic shipping rate calculation',
    'customer-accounts': 'Customer account portal with order history',
    'tax-calculator': 'Automatic tax calculation by region',
    'discount-coupons': 'Coupon and discount code system',
    'product-reviews': 'Customer review and rating system',
    'analytics-dashboard': 'Sales analytics and reporting dashboard',
    'wishlist-favorites': 'Customer wishlist functionality',
    'subscription-products': 'Recurring subscription product support'
  };
  return descriptions[id] || '';
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const quoteData = req.body;
    
    // Check if this is a budget bundle
    const isBudgetBundle = () => {
      const bundleId = quoteData.bundleId || '';
      const budgetBundleIds = [
        'budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'
      ];
      return budgetBundleIds.includes(bundleId);
    };
    
    // Create PDF
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
    addText(`Generated: ${quoteData.generatedDate}`, margin, currentY, 9, 'normal', [107, 114, 128]);
    addText(`Quote ID: ${quoteData.quoteId}`, pageWidth - margin, currentY, 9, 'normal', [107, 114, 128], 'right');
    currentY += 5;
    
    // Bundle info if applicable
    if (quoteData.bundle) {
      currentY += 5;
      pdf.setFillColor(...purpleColor);
      pdf.rect(margin, currentY, contentWidth, 12, 'F');
      addText(`BUNDLE: ${quoteData.bundle}`, pageWidth / 2, currentY + 8, 11, 'bold', white, 'center');
      currentY += 18;
    }
    
    // ==================== PAYMENT OPTIONS ====================
    currentY += 5;
    
    if (isBudgetBundle()) {
      // Budget bundles - only show one-time payment
      addText('PAYMENT OPTION', margin, currentY, 14, 'bold');
      currentY += 8;
      
      pdf.setFillColor(...primaryColor);
      pdf.rect(margin, currentY, contentWidth, 45, 'F');
      addText('ONE-TIME PAYMENT ONLY', margin + 5, currentY + 8, 10, 'bold', white);
      addText(`Development: $${quoteData.developmentCost?.toLocaleString()}`, margin + 5, currentY + 18, 9, 'normal', white);
      addText(`Monthly Services: $${quoteData.monthlyCost}/mo`, margin + 5, currentY + 26, 9, 'normal', white);
      addText(`First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}`, margin + 5, currentY + 38, 11, 'bold', white);
      
      currentY += 55;
      
      // Add note about budget bundle payment requirement
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
      pdf.rect(margin, currentY, contentWidth / 2 - 3, 45, 'F');
      addText('OPTION 1: ONE-TIME', margin + 5, currentY + 8, 10, 'bold', white);
      addText(`Development: $${quoteData.developmentCost?.toLocaleString()}`, margin + 5, currentY + 18, 9, 'normal', white);
      addText(`Monthly Services: $${quoteData.monthlyCost}/mo`, margin + 5, currentY + 26, 9, 'normal', white);
      addText(`First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}`, margin + 5, currentY + 38, 11, 'bold', white);
      
      // Option 2: Monthly Payment
      const option2X = margin + contentWidth / 2 + 3;
      pdf.setFillColor(...secondaryColor);
      pdf.rect(option2X, currentY, contentWidth / 2 - 3, 45, 'F');
      addText('OPTION 2: MONTHLY', option2X + 5, currentY + 8, 10, 'bold', white);
      addText(`Deposit (${quoteData.starterFeePercent || 20}%): $${quoteData.starterFee?.toLocaleString()}`, option2X + 5, currentY + 18, 9, 'normal', white);
      addText(`Then: $${quoteData.monthlyPayment?.toLocaleString()}/mo x 12`, option2X + 5, currentY + 26, 9, 'normal', white);
      addText(`+ Services: $${quoteData.monthlyCost}/mo`, option2X + 5, currentY + 34, 9, 'normal', white);
      addText(`To Start: $${quoteData.starterFee?.toLocaleString()}`, option2X + 5, currentY + 42, 10, 'bold', white);
    }
    
    currentY += 55;
    
    // ==================== PROJECT DETAILS ====================
    addText('PROJECT DETAILS', margin, currentY, 14, 'bold');
    currentY += 10;
    
    // Info grid
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, currentY, contentWidth, 25, 'F');
    
    addText(`Type: ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'}`, margin + 5, currentY + 8, 9);
    addText(`Category: ${quoteData.category}`, margin + 5, currentY + 16, 9);
    addText(`Subcategory: ${quoteData.subcategory || 'N/A'}`, pageWidth / 2, currentY + 8, 9);
    addText(`E-commerce: ${quoteData.store === 'yes-store' ? 'Yes' : 'No'}`, pageWidth / 2, currentY + 16, 9);
    
    currentY += 32;
    
    // ==================== SECTIONS ====================
    if (quoteData.sections?.length > 0) {
      checkNewPage(40);
      addText(`WEBSITE SECTIONS (${quoteData.sections.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      const sectionItems = quoteData.sections.map(id => {
        const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
        const description = getSectionDescription(id);
        return { name, description };
      });
      
      // Display sections with descriptions
      sectionItems.forEach((item, i) => {
        checkNewPage(25);
        addText(`• ${item.name}`, margin, currentY, 9, 'bold');
        currentY += 6;
        if (item.description) {
          addText(`  ${item.description}`, margin + 5, currentY, 8, 'normal', [107, 114, 128]);
          currentY += 5;
        }
        currentY += 3;
      });
      currentY += 8;
    }
    
    // ==================== ADD-ONS ====================
    if (quoteData.addons?.length > 0) {
      checkNewPage(30);
      addText(`ADD-ONS (${quoteData.addons.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      quoteData.addons.forEach((id, i) => {
        checkNewPage(25);
        const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
        const description = getAddonDescription(id);
        addText(`• ${name}`, margin, currentY, 9, 'bold');
        currentY += 6;
        if (description) {
          addText(`  ${description}`, margin + 5, currentY, 8, 'normal', [107, 114, 128]);
          currentY += 5;
        }
        currentY += 3;
      });
      currentY += 5;
    }
    
    // ==================== BACKEND ====================
    if (quoteData.backend && quoteData.backend !== 'no') {
      checkNewPage(30);
      const backendItems = quoteData.backend.split(',').filter(b => b.trim());
      addText(`BACKEND (${backendItems.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      backendItems.forEach((id) => {
        checkNewPage(25);
        const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
        const description = getBackendDescription(id);
        addText(`• ${name}`, margin, currentY, 9, 'bold');
        currentY += 6;
        if (description) {
          addText(`  ${description}`, margin + 5, currentY, 8, 'normal', [107, 114, 128]);
          currentY += 5;
        }
        currentY += 3;
      });
      currentY += 5;
    }
    
    // ==================== AI FEATURES ====================
    if (quoteData.aiFeatures?.length > 0) {
      checkNewPage(30);
      addText(`AI FEATURES (${quoteData.aiFeatures.length})`, margin, currentY, 12, 'bold');
      currentY += 8;
      
      quoteData.aiFeatures.forEach((id) => {
        checkNewPage(25);
        const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
        const description = getAIFeatureDescription(id);
        addText(`• ${name}`, margin, currentY, 9, 'bold');
        currentY += 6;
        if (description) {
          addText(`  ${description}`, margin + 5, currentY, 8, 'normal', [107, 114, 128]);
          currentY += 5;
        }
        currentY += 3;
      });
      currentY += 5;
    }
    
    // ==================== AUTOMATION ====================
    if (quoteData.automation && quoteData.automation !== 'no') {
      checkNewPage(30);
      addText('AUTOMATION', margin, currentY, 12, 'bold');
      currentY += 8;
      
      const automationItems = quoteData.automation.split(',').filter(a => a.trim() && a !== 'yes-automation');
      automationItems.forEach((id) => {
        checkNewPage(25);
        const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
        const description = getAutomationDescription(id);
        addText(`• ${name}`, margin, currentY, 9, 'bold');
        currentY += 6;
        if (description) {
          addText(`  ${description}`, margin + 5, currentY, 8, 'normal', [107, 114, 128]);
          currentY += 5;
        }
        currentY += 3;
      });
      currentY += 5;
    }
    
    // ==================== E-COMMERCE ====================
    if (quoteData.store === 'yes-store') {
      checkNewPage(30);
      addText('E-COMMERCE STORE', margin, currentY, 12, 'bold');
      currentY += 8;
      
      addText(`• Online Store Enabled ($${quoteData.storeCost || 800})`, margin, currentY, 9, 'bold');
      currentY += 6;
      
      if (quoteData.storeOptions?.length > 0) {
        quoteData.storeOptions.forEach((option) => {
          checkNewPage(20);
          const name = option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ');
          const description = getStoreOptionDescription(option);
          addText(`• ${name}`, margin, currentY, 9, 'bold');
          currentY += 6;
          if (description) {
            addText(`  ${description}`, margin + 5, currentY, 8, 'normal', [107, 114, 128]);
            currentY += 5;
          }
          currentY += 3;
        });
      }
      currentY += 5;
    }
    
    // ==================== DOMAIN ====================
    if (quoteData.domain && quoteData.domainCost > 0) {
      checkNewPage(20);
      addText('DOMAIN', margin, currentY, 12, 'bold');
      currentY += 8;
      const domainName = quoteData.domain === 'new-domain' ? 'Register New Domain' : 
                         quoteData.domain === 'existing-domain' ? 'Use Existing Domain' : 
                         quoteData.domain === 'subdomain' ? 'Free Subdomain' : quoteData.domain;
      addText(`• ${domainName} ($${quoteData.domainCost}/year)`, margin, currentY, 9);
      currentY += 10;
    }
    
    // ==================== ONGOING SERVICES ====================
    checkNewPage(40);
    addText('ONGOING MONTHLY SERVICES', margin, currentY, 12, 'bold');
    currentY += 8;
    
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, currentY, contentWidth, 20, 'F');
    
    const hostingName = quoteData.hosting?.charAt(0).toUpperCase() + quoteData.hosting?.slice(1).replace(/-/g, ' ') || 'None';
    const hostingCost = quoteData.hostingCost || 0;
    addText(`Hosting: ${hostingName}`, margin + 5, currentY + 7, 9);
    addText(hostingCost > 0 ? `$${hostingCost}/mo` : 'Not Selected', pageWidth - margin - 5, currentY + 7, 9, 'normal', hostingCost > 0 ? textColor : [107, 114, 128], 'right');
    
    const maintName = quoteData.maintenance?.charAt(0).toUpperCase() + quoteData.maintenance?.slice(1).replace(/-/g, ' ') || 'None';
    const maintCost = quoteData.maintenanceCost || 0;
    addText(`Maintenance: ${maintName}`, margin + 5, currentY + 15, 9);
    addText(maintCost > 0 ? `$${maintCost}/mo` : 'Not Selected', pageWidth - margin - 5, currentY + 15, 9, 'normal', maintCost > 0 ? textColor : [107, 114, 128], 'right');
    
    currentY += 28;
    
    // ==================== TOTAL SUMMARY ====================
    checkNewPage(50);
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, currentY, contentWidth, 35, 'F');
    
    addText('TOTAL SUMMARY', margin + 5, currentY + 10, 12, 'bold', white);
    addText(`One-Time Development: $${quoteData.developmentCost?.toLocaleString()}`, margin + 5, currentY + 20, 10, 'normal', white);
    addText(`Monthly Services: $${quoteData.monthlyCost}/mo`, margin + 5, currentY + 28, 10, 'normal', white);
    addText(`First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}`, pageWidth - margin - 5, currentY + 24, 14, 'bold', white, 'right');
    
    currentY += 45;
    
    // ==================== FOOTER ====================
    addText('Thank you for choosing Mellow Quote!', pageWidth / 2, currentY, 10, 'bold', textColor, 'center');
    addText('Contact us to get started on your project.', pageWidth / 2, currentY + 6, 9, 'normal', [107, 114, 128], 'center');
    
    // Convert PDF to base64
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    
    return res.status(200).json({ 
      success: true, 
      pdfBase64: pdfBase64,
      filename: `mellow-quote-${quoteData.quoteId}.pdf`
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
}
