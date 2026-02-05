// API endpoint to send quote to owner (OWNER_EMAIL from Netlify env)
// Uses Hostinger SMTP via Nodemailer
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OWNER_EMAIL = process.env.OWNER_EMAIL;
  const SMTP_HOST = process.env.EMAIL_HOST || 'smtp.hostinger.com';
  const SMTP_PORT = process.env.EMAIL_PORT || 587;
  const SMTP_USER = process.env.EMAIL_USER;
  const SMTP_PASSWORD = process.env.EMAIL_PASS;
  
  if (!OWNER_EMAIL) {
    console.error('OWNER_EMAIL environment variable not set');
    return res.status(500).json({ error: 'Email configuration error' });
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
    
    // Build email content
    const emailSubject = `🎯 New Quote Request - ${quoteData.quoteId}`;
    
    const emailBody = `
NEW WEBSITE QUOTE REQUEST
========================

Quote ID: ${quoteData.quoteId}
Generated: ${quoteData.generatedDate}
Bundle: ${quoteData.bundleName || 'Custom'}
${isBudgetBundle() ? 'Type: Budget Bundle (Full payment required)' : ''}

CLIENT INFORMATION
==================
Name: ${quoteData.name || 'Not provided'}
Email: ${quoteData.email || 'Not provided'}
Phone: ${quoteData.phone || 'Not provided'}

PROJECT DETAILS
===============
Website Type: ${quoteData.websiteType || 'Not selected'}
Category: ${quoteData.category || 'Not selected'}
${quoteData.subcategory ? `Subcategory: ${quoteData.subcategory}` : ''}
Bundle: ${quoteData.bundleName || 'Custom build'}
${quoteData.bundlePrice ? `Bundle Price: $${quoteData.bundlePrice.toLocaleString()}` : ''}

FEATURES SELECTED
================
Backend: ${quoteData.backend || 'Not selected'}
AI Features: ${quoteData.ai || 'None'}
Automation: ${quoteData.automation || 'None'}
Store: ${quoteData.store || 'Not selected'}
Sections/Pages: ${quoteData.pages || 'None selected'}
Add-ons: ${quoteData.addons || 'None selected'}

HOSTING & MAINTENANCE
=====================
Hosting: ${quoteData.hosting || 'Not selected'}
Maintenance: ${quoteData.maintenance || 'Not selected'}

PRICING SUMMARY
===============

${isBudgetBundle() ? 
`ONE-TIME PAYMENT (Budget Bundle)
---------------------------------
Development Cost: $${quoteData.developmentCost?.toLocaleString()}
Monthly Services: $${quoteData.monthlyCost}/mo
First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}

💰 Budget Bundle Terms: Full payment required. Monthly payment options not available.` :
`OPTION 1: ONE-TIME PAYMENT
--------------------------
Development Cost: $${quoteData.developmentCost?.toLocaleString()}
Monthly Services: $${quoteData.monthlyCost}/mo
First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}

OPTION 2: MONTHLY PAYMENT PLAN
------------------------------
Deposit (20%): $${quoteData.starterFee?.toLocaleString()}
Monthly Development: $${quoteData.monthlyPayment?.toLocaleString()}/mo × 12
Monthly Services: $${quoteData.monthlyCost}/mo
To Start Today: $${quoteData.starterFee?.toLocaleString()}`
}

========================
Sent from Mellow Quote Calculator
    `.trim();

    // HTML version for better formatting
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #22c55e, #10b981); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
    .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
    .section h3 { margin: 0 0 10px 0; color: #1e40af; }
    .pricing { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .pricing-option { display: inline-block; width: 48%; vertical-align: top; padding: 15px; margin: 1%; border-radius: 8px; }
    .option-1 { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
    .option-2 { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
    .total { font-size: 24px; font-weight: bold; margin-top: 10px; }
    .footer { text-align: center; padding: 15px; color: #64748b; font-size: 12px; }
    .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 15px; margin: 2px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 New Quote Request</h1>
      <p>Quote ID: ${quoteData.quoteId} | ${quoteData.generatedDate}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h3>📋 Project Details</h3>
        <p><strong>Type:</strong> ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'}</p>
        <p><strong>Category:</strong> ${quoteData.category}</p>
        <p><strong>Subcategory:</strong> ${quoteData.subcategory || 'N/A'}</p>
        ${quoteData.bundle ? `<p><strong>Bundle:</strong> <span style="color: #7c3aed;">${quoteData.bundle}</span> ($${quoteData.bundlePrice?.toLocaleString()})</p>` : '<p><strong>Bundle:</strong> None (À la carte)</p>'}
        ${quoteData.customerEmail ? `<p><strong>Customer Email:</strong> ${quoteData.customerEmail}</p>` : ''}
      </div>
      
      <div class="section">
        <h3>📄 Sections (${quoteData.sections?.length || 0})</h3>
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
        <p>${quoteData.backend}</p>
      </div>
      ` : ''}
      
      <div class="section">
        <h3>🖥️ Hosting & Maintenance</h3>
        <p><strong>Hosting:</strong> ${quoteData.hosting || 'Not selected'}</p>
        <p><strong>Maintenance:</strong> ${quoteData.maintenance || 'Not selected'}</p>
      </div>
      
      <div class="pricing">
        <h3 style="text-align: center; color: #1e293b;">💰 Payment Options</h3>
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
              <p>Monthly: $${quoteData.monthlyCost}/mo</p>
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
    </div>
    
    <div class="footer">
      <p>Sent from Mellow Quote Calculator</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Use Hostinger SMTP if credentials are set
    if (SMTP_USER && SMTP_PASSWORD) {
      console.log('Attempting to send email via Hostinger SMTP...');
      console.log('SMTP Config:', {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        to: OWNER_EMAIL
      });

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: false, // false for 587 (STARTTLS), true for 465 (SSL)
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates
        },
        debug: true, // Enable debug output
        logger: true // Log to console
      });

      // Verify connection
      try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (verifyError) {
        console.error('SMTP verification failed:', verifyError);
        throw new Error(`SMTP verification failed: ${verifyError.message}`);
      }

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
        console.error('Failed to generate PDF attachment:', pdfError);
        // Continue without PDF attachment
      }

      const mailOptions = {
        from: `Mellow Quote <${SMTP_USER}>`,
        to: OWNER_EMAIL,
        subject: emailSubject,
        text: emailBody,
        html: htmlBody,
        attachments: pdfAttachment ? [pdfAttachment] : []
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Quote sent successfully via Hostinger' + (pdfAttachment ? ' with PDF attachment' : ''),
        sentTo: OWNER_EMAIL,
        quoteId: quoteData.quoteId,
        messageId: info.messageId,
        pdfAttached: !!pdfAttachment
      });
    } else {
      console.error('Missing SMTP credentials:', {
        hasUser: !!SMTP_USER,
        hasPassword: !!SMTP_PASSWORD
      });
    }
    
    // Fallback: Log the quote data (for development/testing)
    console.log('='.repeat(50));
    console.log('NEW QUOTE TO SEND TO:', OWNER_EMAIL);
    console.log('SMTP credentials not configured - logging quote instead');
    console.log('='.repeat(50));
    console.log(emailBody);
    console.log('='.repeat(50));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Quote logged (configure SMTP_USER and SMTP_PASSWORD for email sending)',
      sentTo: OWNER_EMAIL,
      quoteId: quoteData.quoteId
    });

  } catch (error) {
    console.error('Error sending quote:', error);
    return res.status(500).json({ error: 'Failed to send quote', details: error.message });
  }
}
