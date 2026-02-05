const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const quoteData = JSON.parse(event.body);

    if (!quoteData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Quote data is required' })
      };
    }

    // Generate HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0;
      padding: 20px;
    }
    .container { 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    .header { 
      background: linear-gradient(135deg, #22c55e, #10b981); 
      color: white; 
      padding: 30px; 
      border-radius: 10px 10px 0 0; 
      text-align: center; 
    }
    .content { 
      background: #f8fafc; 
      padding: 30px; 
      border: 1px solid #e2e8f0; 
    }
    .section { 
      background: white; 
      padding: 20px; 
      margin: 15px 0; 
      border-radius: 8px; 
      border-left: 4px solid #3b82f6; 
    }
    .section h3 { 
      margin: 0 0 15px 0; 
      color: #1e40af; 
    }
    .pricing { 
      background: white; 
      padding: 20px; 
      margin: 15px 0; 
      border-radius: 8px; 
    }
    .pricing-option { 
      display: inline-block; 
      width: 48%; 
      vertical-align: top; 
      padding: 20px; 
      margin: 1%; 
      border-radius: 8px; 
    }
    .option-1 { 
      background: linear-gradient(135deg, #22c55e, #16a34a); 
      color: white; 
    }
    .option-2 { 
      background: linear-gradient(135deg, #3b82f6, #2563eb); 
      color: white; 
    }
    .total { 
      font-size: 28px; 
      font-weight: bold; 
      margin-top: 15px; 
    }
    .footer { 
      text-align: center; 
      padding: 20px; 
      color: #64748b; 
      font-size: 12px; 
    }
    .badge { 
      display: inline-block; 
      background: #e0e7ff; 
      color: #3730a3; 
      padding: 5px 12px; 
      border-radius: 15px; 
      margin: 3px; 
      font-size: 12px; 
    }
    .quote-id {
      background: #fef3c7;
      color: #92400e;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      font-weight: bold;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Website Quote</h1>
      <p>Mellow Quote Calculator</p>
    </div>
    
    <div class="quote-id">
      Quote ID: ${quoteData.quoteId} | ${quoteData.generatedDate}
    </div>
    
    <div class="content">
      <div class="section">
        <h3>📋 Project Details</h3>
        <p><strong>Type:</strong> ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'}</p>
        <p><strong>Category:</strong> ${quoteData.category}</p>
        <p><strong>Subcategory:</strong> ${quoteData.subcategory || 'N/A'}</p>
        ${quoteData.bundle ? `<p><strong>Bundle:</strong> ${quoteData.bundle} ($${quoteData.bundlePrice?.toLocaleString()})</p>` : '<p><strong>Bundle:</strong> None (À la carte)</p>'}
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
      
      ${quoteData.aiFeatures?.length > 0 ? `
      <div class="section">
        <h3>🤖 AI Features</h3>
        <p>${quoteData.aiFeatures.map(f => `<span class="badge">${f}</span>`).join(' ')}</p>
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
            <h4>Option 1: One-Time Payment</h4>
            <p>Development: $${quoteData.developmentCost?.toLocaleString()}</p>
            <p>Monthly Services: $${quoteData.monthlyCost}/mo</p>
            <div class="total">$${quoteData.firstYearTotal?.toLocaleString()}</div>
            <small>First Year Total</small>
          </div>
          <div class="pricing-option option-2">
            <h4>Option 2: Monthly Payment Plan</h4>
            <p>Deposit (20%): $${quoteData.starterFee?.toLocaleString()}</p>
            <p>Monthly Development: $${quoteData.monthlyPayment?.toLocaleString()}/mo × 12</p>
            <p>Monthly Services: $${quoteData.monthlyCost}/mo</p>
            <div class="total">$${quoteData.starterFee?.toLocaleString()}</div>
            <small>To Start Today</small>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <p>Mellow Quote Calculator | Contact us for questions about this quote</p>
    </div>
  </div>
</body>
</html>
    `;

    // Launch browser
    let browser;
    try {
      browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      });
    } catch (browserError) {
      console.error('Failed to launch browser:', browserError);
      // Fallback to basic browser launch
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Convert to base64
    const pdfBase64 = pdfBuffer.toString('base64');
    const filename = `quote-${quoteData.quoteId}.pdf`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        filename: filename,
        pdfBase64: pdfBase64
      })
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate PDF',
        details: error.message
      })
    };
  }
};
