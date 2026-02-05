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

  try {
    const { email, quoteData } = JSON.parse(event.body);

    if (!email || !quoteData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and quote data are required' })
      };
    }

    // Create email content for customer
    const emailContent = `
      <h2>Your Website Quote - Mellow Quote</h2>
      
      <h3>Project Summary</h3>
      <p><strong>Type:</strong> ${quoteData.websiteType === 'single' ? 'Single Page' : 'Multi Page'}</p>
      <p><strong>Category:</strong> ${quoteData.category}</p>
      <p><strong>Subcategory:</strong> ${quoteData.subcategory || 'N/A'}</p>
      
      <h3>Cost Breakdown</h3>
      <p><strong>Development Cost:</strong> $${quoteData.developmentCost?.toLocaleString()}</p>
      <p><strong>Monthly Cost:</strong> $${quoteData.monthlyCost}/mo</p>
      <p><strong>First Year Total:</strong> $${quoteData.firstYearTotal?.toLocaleString()}</p>
      
      <h3>Payment Options</h3>
      <p><strong>Option 1 - One-Time:</strong> $${quoteData.firstYearTotal?.toLocaleString()}</p>
      <p><strong>Option 2 - Monthly Plan:</strong> $${quoteData.starterFee?.toLocaleString()} to start, then $${quoteData.monthlyPayment?.toLocaleString()}/mo × 12</p>
      
      <h3>Selected Features</h3>
      ${quoteData.backend && quoteData.backend !== 'no' ? `<p><strong>Backend:</strong> ${quoteData.backend}</p>` : ''}
      ${quoteData.aiFeatures?.length > 0 ? `<p><strong>AI Features:</strong> ${quoteData.aiFeatures.join(', ')}</p>` : ''}
      ${quoteData.store === 'yes-store' ? '<p><strong>E-commerce Store:</strong> Yes</p>' : ''}
      
      ${quoteData.sections?.length > 0 ? `
      <h4>Sections:</h4>
      <ul>
        ${quoteData.sections.map(section => `<li>${section}</li>`).join('')}
      </ul>
      ` : ''}
      
      ${quoteData.addons?.length > 0 ? `
      <h4>Add-ons:</h4>
      <ul>
        ${quoteData.addons.map(addon => `<li>${addon}</li>`).join('')}
      </ul>
      ` : ''}
      
      <p><strong>Hosting:</strong> ${quoteData.hosting || 'Not selected'}</p>
      <p><strong>Maintenance:</strong> ${quoteData.maintenance || 'Not selected'}</p>
      
      <hr>
      <p>Thank you for using Mellow Quote! We'll contact you soon to discuss your project.</p>
      <p>Quote ID: ${quoteData.quoteId}</p>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Website Quote - ${quoteData.quoteId}`,
      html: emailContent
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Customer quote sent successfully!' 
      })
    };

  } catch (error) {
    console.error('Error sending customer email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send customer email',
        details: error.message 
      })
    };
  }
};
