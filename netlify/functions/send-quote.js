const nodemailer = require('nodemailer');

// Configure email transporter using environment variables
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const OWNER_EMAIL = process.env.OWNER_EMAIL;
  
  if (!OWNER_EMAIL) {
    console.error('OWNER_EMAIL environment variable not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email configuration error' })
    };
  }

  try {
    const quoteData = JSON.parse(event.body);

    // Build email content for owner
    const emailSubject = `🎯 New Quote Request - ${quoteData.quoteId}`;
    
    const emailBody = `
NEW WEBSITE QUOTE REQUEST
========================

Quote ID: ${quoteData.quoteId}
Date: ${quoteData.generatedDate}
Customer Email: ${quoteData.customerEmail || 'Not provided'}

PROJECT DETAILS
---------------
Type: ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'}
Category: ${quoteData.category}
Subcategory: ${quoteData.subcategory || 'N/A'}
${quoteData.bundle ? `Bundle: ${quoteData.bundle} ($${quoteData.bundlePrice?.toLocaleString()})` : 'Bundle: None (À la carte)'}

SECTIONS (${quoteData.sections?.length || 0})
---------------
${quoteData.sections?.join(', ') || 'None'}

ADD-ONS (${quoteData.addons?.length || 0})
---------------
${quoteData.addons?.join(', ') || 'None'}

BACKEND
---------------
${quoteData.backend && quoteData.backend !== 'no' ? quoteData.backend : 'None'}

AI FEATURES
---------------
${quoteData.aiFeatures?.length > 0 ? quoteData.aiFeatures.join(', ') : 'None'}

HOSTING & MAINTENANCE
---------------
Hosting: ${quoteData.hosting || 'Not selected'}
Maintenance: ${quoteData.maintenance || 'Not selected'}

PRICING SUMMARY
===============

OPTION 1: ONE-TIME PAYMENT
--------------------------
Development Cost: $${quoteData.developmentCost?.toLocaleString()}
Monthly Services: $${quoteData.monthlyCost}/mo
First Year Total: $${quoteData.firstYearTotal?.toLocaleString()}

OPTION 2: MONTHLY PAYMENT PLAN
------------------------------
Deposit (20%): $${quoteData.starterFee?.toLocaleString()}
Monthly Development: $${quoteData.monthlyPayment?.toLocaleString()}/mo × 12
Monthly Services: $${quoteData.monthlyCost}/mo
To Start Today: $${quoteData.starterFee?.toLocaleString()}

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
        <div style="text-align: center;">
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
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Sent from Mellow Quote Calculator</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Generate PDF for attachment
    let pdfAttachment = null;
    try {
      // Call the PDF generation function
      const pdfResponse = await fetch(`${process.env.URL}/.netlify/functions/send-quote-pdf`, {
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

    // Send email to owner
    const mailOptions = {
      from: `Mellow Quote <${process.env.EMAIL_USER}>`,
      to: OWNER_EMAIL,
      subject: emailSubject,
      text: emailBody,
      html: htmlBody,
      attachments: pdfAttachment ? [pdfAttachment] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Quote sent successfully to owner' + (pdfAttachment ? ' with PDF attachment' : ''),
        sentTo: OWNER_EMAIL,
        quoteId: quoteData.quoteId,
        messageId: info.messageId,
        pdfAttached: !!pdfAttachment
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};
