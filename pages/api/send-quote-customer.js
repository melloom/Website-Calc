// API endpoint to send quote to customer email
// Uses Hostinger SMTP via Nodemailer
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.hostinger.com';
  const EMAIL_PORT = process.env.EMAIL_PORT || 587;
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
  const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Mellow Quote';
  
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('Email credentials not configured');
    return res.status(500).json({ error: 'Email configuration error' });
  }

  try {
    const quoteData = req.body;
    const customerEmail = quoteData.email;
    
    if (!customerEmail || !customerEmail.includes('@')) {
      return res.status(400).json({ error: 'Invalid customer email' });
    }
    
    // Check if this is a budget bundle
    const isBudgetBundle = () => {
      const bundleId = quoteData.bundleId || '';
      const budgetBundleIds = [
        'budget-starter', 'budget-essential', 'budget-starter-mp', 'budget-essential-mp'
      ];
      return budgetBundleIds.includes(bundleId);
    };
    
    // Build email content
    const emailSubject = `Your Website Quote - ${quoteData.quoteId}`;
    
    const emailBody = `
YOUR WEBSITE QUOTE
==================

Quote ID: ${quoteData.quoteId}
Date: ${quoteData.generatedDate}
${isBudgetBundle() ? 'Package: Budget Bundle (Full payment required)' : ''}

Dear Customer,

Thank you for your interest in our website development services! 
Below is your personalized quote based on your selections.

PROJECT DETAILS
---------------
Type: ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'} Website
Category: ${quoteData.category}
${quoteData.subcategory ? `Subcategory: ${quoteData.subcategory}` : ''}
Bundle: ${quoteData.bundleName || 'Custom build'}
${quoteData.bundlePrice ? `Bundle Price: $${quoteData.bundlePrice.toLocaleString()}` : ''}

SELECTED FEATURES
-----------------
${quoteData.backend ? `Backend: ${quoteData.backend}` : ''}
${quoteData.ai ? `AI Features: ${quoteData.ai}` : ''}
${quoteData.automation ? `Automation: ${quoteData.automation}` : ''}
${quoteData.store ? `Store: ${quoteData.store}` : ''}
${quoteData.pages ? `Pages/Sections: ${quoteData.pages}` : ''}
${quoteData.addons ? `Add-ons: ${quoteData.addons}` : ''}

HOSTING & MAINTENANCE
---------------------
Hosting: ${quoteData.hosting || 'Not selected'}
Maintenance: ${quoteData.maintenance || 'Not selected'}

${isBudgetBundle() ? 
`PAYMENT TERMS (Budget Bundle)
==============================
Development Cost: $${quoteData.developmentCost?.toLocaleString()}
Monthly Services: $${quoteData.monthlyCost}/mo (hosting, maintenance)
First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}

💰 Budget Bundle Payment Terms:
- Full payment required for development
- Monthly payment options not available for budget packages
- This allows us to offer you the best possible price` :

`PAYMENT OPTIONS
===============

OPTION 1: ONE-TIME PAYMENT
--------------------------
Development Cost: $${quoteData.developmentCost?.toLocaleString()}
Monthly Services: $${quoteData.monthlyCost}/mo (hosting, maintenance)
First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}

OPTION 2: MONTHLY PAYMENT PLAN
------------------------------
Deposit (20%): $${quoteData.starterFee?.toLocaleString()} - Pay today to start
Monthly Development: $${quoteData.monthlyPayment?.toLocaleString()}/mo × 12 months
Monthly Services: $${quoteData.monthlyCost}/mo
Total Monthly Payment: $${(quoteData.monthlyPayment + quoteData.monthlyCost).toLocaleString()}/mo`
}

NEXT STEPS
----------
To get started with your project, simply reply to this email or call us at the number below. 
We'll be happy to answer any questions and schedule a consultation to discuss your project in detail.

${isBudgetBundle() ? 
`Payment for budget bundles is due in full before project commencement.` :
`You can choose to pay the full amount upfront or start with just the 20% deposit.`}

Thank you for choosing us for your website project!

Best regards,
The Mellow Team
========================
Sent from Mellow Quote Calculator
    `.trim();

    // HTML version for better formatting
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #8b5cf6; }
    .section h3 { margin: 0 0 15px 0; color: #7c3aed; }
    .pricing { background: white; padding: 20px; margin: 15px 0; border-radius: 10px; }
    .pricing-option { display: inline-block; width: 48%; vertical-align: top; padding: 20px; margin: 1%; border-radius: 10px; }
    .option-1 { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
    .option-2 { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
    .total { font-size: 28px; font-weight: bold; margin-top: 15px; }
    .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 5px 15px; border-radius: 20px; margin: 3px; font-size: 13px; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
    .cta { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; display: inline-block; margin: 10px 5px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 32px;">🎯 Your Website Quote</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px;">Quote ID: ${quoteData.quoteId} | ${quoteData.generatedDate}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h3>📋 Project Details</h3>
      <p><strong>Type:</strong> ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'} Website</p>
      <p><strong>Category:</strong> ${quoteData.category}</p>
      ${quoteData.subcategory ? `<p><strong>Subcategory:</strong> ${quoteData.subcategory}</p>` : ''}
      ${quoteData.bundle ? `<p><strong>Bundle:</strong> <span style="color: #7c3aed; font-weight: bold;">${quoteData.bundle}</span> ($${quoteData.bundlePrice?.toLocaleString()})</p>` : '<p><strong>Configuration:</strong> Custom Build</p>'}
    </div>
    
    <div class="section">
      <h3>📄 Selected Sections (${quoteData.sections?.length || 0})</h3>
      <p>${quoteData.sections?.map(s => `<span class="badge">${s}</span>`).join(' ') || 'None'}</p>
    </div>
    
    ${quoteData.addons?.length > 0 ? `
    <div class="section">
      <h3>✨ Add-ons (${quoteData.addons.length})</h3>
      <p>${quoteData.addons.map(a => `<span class="badge">${a}</span>`).join(' ')}</p>
    </div>
    ` : ''}
    
    ${quoteData.backend && quoteData.backend !== 'no' ? `
    <div class="section">
      <h3>⚙️ Backend</h3>
      <p><span class="badge">${quoteData.backend}</span></p>
    </div>
    ` : ''}
    
    <div class="section">
      <h3>🖥️ Hosting & Maintenance</h3>
      <p><strong>Hosting:</strong> ${quoteData.hosting || 'Not selected'}</p>
      <p><strong>Maintenance:</strong> ${quoteData.maintenance || 'Not selected'}</p>
    </div>
    
    <div class="pricing">
      <h3 style="text-align: center; color: #1e293b; margin-bottom: 20px;">💰 Payment Options</h3>
      ${isBudgetBundle() ? 
        `<div style="text-align: center;">
          <div class="pricing-option option-1" style="width: 100%; margin: 0 auto;">
            <h4>One-Time Payment (Budget Bundle)</h4>
            <p>Development: $${quoteData.developmentCost?.toLocaleString()}</p>
            <p>Monthly Services: $${quoteData.monthlyCost}/mo</p>
            <div class="total">$${quoteData.firstYearTotal?.toLocaleString()}</div>
            <small>First Year Total</small>
            <div style="margin-top: 10px; padding: 8px; background: #fef3c7; border-radius: 4px; font-size: 12px; color: #92400e;">
              💰 Budget Bundle: Full payment required
            </div>
          </div>
        </div>` :
        `<div style="text-align: center;">
          <div class="pricing-option option-1">
            <h4>Option 1: One-Time</h4>
            <p>Development: $${quoteData.developmentCost?.toLocaleString()}</p>
            <p>Monthly Services: $${quoteData.monthlyCost}/mo</p>
            <div class="total">$${quoteData.firstYearTotal?.toLocaleString()}</div>
            <small>First Year Total</small>
          </div>
          <div class="pricing-option option-2">
            <h4>Option 2: Monthly</h4>
            <p>Deposit: $${quoteData.starterFee?.toLocaleString()}</p>
            <p>Then: $${quoteData.monthlyPayment?.toLocaleString()}/mo × 12</p>
            <div class="total">$${quoteData.starterFee?.toLocaleString()}</div>
            <small>To Start Today</small>
          </div>
        </div>`
      }
    </div>
    
    <div class="section">
      <h3>📞 Contact Us to Get Started</h3>
      <p>${isBudgetBundle() ? 
        'Ready to begin your project? Contact us to proceed with your budget bundle!' :
        'Ready to begin your project? Choose your preferred payment option and contact us to proceed!'}</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="mailto:${EMAIL_FROM}" class="cta">📧 Email Us</a>
        <a href="tel:6672009784" class="cta">📱 Call Us</a>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p><strong>Mellow Quote</strong></p>
    <p>📧 ${EMAIL_FROM} | 📱 667-200-9784</p>
    <p style="margin-top: 10px; font-size: 12px;">Thank you for choosing Mellow Quote! We look forward to working with you.</p>
  </div>
</body>
</html>
    `.trim();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      secure: false, // false for 587 (STARTTLS), true for 465 (SSL)
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();

    // Generate PDF for attachment
      let pdfAttachment = null;
      try {
        const pdfResponse = await fetch(`${process.env.URL || 'http://localhost:3000'}/api/send-quote-pdf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quoteData)
        });
        
        const pdfData = await pdfResponse.json();
        if (pdfData.success) {
          pdfAttachment = {
            filename: pdfData.filename,
            content: Buffer.from(pdfData.pdfBase64, 'base64')
          };
        }
      } catch (pdfError) {
        console.error('Failed to generate PDF attachment for customer:', pdfError);
        // Continue without PDF attachment
      }

      const mailOptions = {
        from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
        to: customerEmail,
        subject: emailSubject,
        text: emailBody,
        html: htmlBody,
        attachments: pdfAttachment ? [pdfAttachment] : []
      };

      const info = await transporter.sendMail(mailOptions);
    console.log('Customer quote email sent:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Quote sent to customer successfully' + (pdfAttachment ? ' with PDF attachment' : ''),
      sentTo: customerEmail,
      quoteId: quoteData.quoteId,
      messageId: info.messageId,
      pdfAttached: !!pdfAttachment
    });

  } catch (error) {
    console.error('Error sending customer quote:', error);
    return res.status(500).json({ error: 'Failed to send quote', details: error.message });
  }
}
