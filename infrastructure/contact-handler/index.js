const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({});

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'davetashner@gmail.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'hello@davetashner.com';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://davetashner.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes input to prevent injection
 * @param {string} input
 * @returns {string}
 */
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 5000);
}

/**
 * Creates JSON response with CORS headers
 * @param {number} statusCode
 * @param {object} body
 * @returns {object}
 */
function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

/**
 * Lambda handler for contact form submissions
 * @param {object} event - API Gateway HTTP API event
 * @returns {object} - API Gateway response
 */
exports.handler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return response(200, { message: 'OK' });
  }

  try {
    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return response(400, {
        success: false,
        error: 'Invalid JSON in request body',
      });
    }

    const { name, email, message, honeypot } = body;

    // Spam check: honeypot field should be empty
    if (honeypot && honeypot.trim() !== '') {
      // Silently reject spam but return success to not reveal the check
      console.log('Spam detected: honeypot field was filled');
      return response(200, {
        success: true,
        message: 'Thank you for your message!',
      });
    }

    // Validate required fields
    const errors = [];

    if (!name || sanitize(name).length === 0) {
      errors.push('Name is required');
    }

    if (!email || sanitize(email).length === 0) {
      errors.push('Email is required');
    } else if (!isValidEmail(sanitize(email))) {
      errors.push('Please provide a valid email address');
    }

    if (!message || sanitize(message).length === 0) {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      return response(400, {
        success: false,
        errors,
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedMessage = sanitize(message);

    // Prepare email content
    const emailSubject = `Contact Form: Message from ${sanitizedName}`;
    const emailBody = `
New contact form submission from davetashner.com

Name: ${sanitizedName}
Email: ${sanitizedEmail}

Message:
${sanitizedMessage}

---
Sent from the contact form at davetashner.com
    `.trim();

    // Send email via SES
    const sendEmailCommand = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: [RECIPIENT_EMAIL],
      },
      ReplyToAddresses: [sanitizedEmail],
      Message: {
        Subject: {
          Data: emailSubject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    await sesClient.send(sendEmailCommand);

    console.log(`Contact form email sent successfully from ${sanitizedEmail}`);

    return response(200, {
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
    });
  } catch (error) {
    console.error('Error processing contact form:', error);

    return response(500, {
      success: false,
      error:
        'An error occurred while sending your message. Please try again later.',
    });
  }
};
