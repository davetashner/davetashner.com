const { handler } = require('./index');

// Mock the AWS SES client
jest.mock('@aws-sdk/client-ses', () => {
  const mockSend = jest.fn();
  return {
    SESClient: jest.fn(() => ({
      send: mockSend,
    })),
    SendEmailCommand: jest.fn((params) => params),
    __mockSend: mockSend,
  };
});

const { __mockSend: mockSend } = require('@aws-sdk/client-ses');

describe('Contact Form Lambda Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: SES succeeds
    mockSend.mockResolvedValue({ MessageId: 'test-message-id' });
  });

  /**
   * Helper to create API Gateway HTTP API event
   */
  const createEvent = (body, method = 'POST') => ({
    requestContext: {
      http: {
        method,
      },
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

  describe('Successful form submission', () => {
    it('sends email and returns 200 with success message', async () => {
      const event = createEvent({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message.',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.message).toContain('Thank you');
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('includes correct email parameters in SES command', async () => {
      const event = createEvent({
        name: 'Jane Smith',
        email: 'jane@test.org',
        message: 'Testing the contact form.',
      });

      await handler(event);

      const { SendEmailCommand } = require('@aws-sdk/client-ses');
      expect(SendEmailCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ReplyToAddresses: ['jane@test.org'],
          Message: expect.objectContaining({
            Subject: expect.objectContaining({
              Data: expect.stringContaining('Jane Smith'),
            }),
          }),
        })
      );
    });

    it('returns CORS headers', async () => {
      const event = createEvent({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.headers).toMatchObject({
        'Access-Control-Allow-Origin': expect.any(String),
        'Access-Control-Allow-Headers': expect.stringContaining('Content-Type'),
        'Access-Control-Allow-Methods': expect.stringContaining('POST'),
        'Content-Type': 'application/json',
      });
    });
  });

  describe('Honeypot spam rejection', () => {
    it('returns silent success when honeypot is filled', async () => {
      const event = createEvent({
        name: 'Spammer',
        email: 'spam@bot.com',
        message: 'Buy my products!',
        honeypot: 'I am a bot',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      // Should NOT send email
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('allows submission when honeypot is empty string', async () => {
      const event = createEvent({
        name: 'Real User',
        email: 'real@example.com',
        message: 'Legitimate message',
        honeypot: '',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('allows submission when honeypot is whitespace only', async () => {
      const event = createEvent({
        name: 'Real User',
        email: 'real@example.com',
        message: 'Legitimate message',
        honeypot: '   ',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('allows submission when honeypot is not provided', async () => {
      const event = createEvent({
        name: 'Real User',
        email: 'real@example.com',
        message: 'Legitimate message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('Missing required fields returns 400', () => {
    it('returns error when name is missing', async () => {
      const event = createEvent({
        email: 'test@example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.errors).toContain('Name is required');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns error when email is missing', async () => {
      const event = createEvent({
        name: 'Test User',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.errors).toContain('Email is required');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns error when message is missing', async () => {
      const event = createEvent({
        name: 'Test User',
        email: 'test@example.com',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.errors).toContain('Message is required');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns multiple errors when multiple fields are missing', async () => {
      const event = createEvent({});

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.errors).toHaveLength(3);
      expect(body.errors).toContain('Name is required');
      expect(body.errors).toContain('Email is required');
      expect(body.errors).toContain('Message is required');
    });

    it('returns error when name is empty string', async () => {
      const event = createEvent({
        name: '',
        email: 'test@example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.errors).toContain('Name is required');
    });

    it('returns error when name is only whitespace', async () => {
      const event = createEvent({
        name: '   ',
        email: 'test@example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.errors).toContain('Name is required');
    });
  });

  describe('Invalid email format returns 400', () => {
    it('returns error for email without @', async () => {
      const event = createEvent({
        name: 'Test User',
        email: 'invalidemail.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.errors).toContain('Please provide a valid email address');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('returns error for email without domain', async () => {
      const event = createEvent({
        name: 'Test User',
        email: 'test@',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.errors).toContain('Please provide a valid email address');
    });

    it('returns error for email without TLD', async () => {
      const event = createEvent({
        name: 'Test User',
        email: 'test@example',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.errors).toContain('Please provide a valid email address');
    });

    it('returns error for email with spaces', async () => {
      const event = createEvent({
        name: 'Test User',
        email: 'test @example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.errors).toContain('Please provide a valid email address');
    });

    it('accepts valid email formats', async () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'plus+tag@example.com',
        'user@subdomain.example.com',
      ];

      for (const email of validEmails) {
        mockSend.mockClear();
        const event = createEvent({
          name: 'Test User',
          email,
          message: 'Test message',
        });

        const result = await handler(event);
        expect(result.statusCode).toBe(200);
      }
    });
  });

  describe('OPTIONS request returns CORS headers', () => {
    it('returns 200 with CORS headers for OPTIONS request', async () => {
      const event = createEvent({}, 'OPTIONS');

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.headers).toMatchObject({
        'Access-Control-Allow-Origin': expect.any(String),
        'Access-Control-Allow-Headers': expect.stringContaining('Content-Type'),
        'Access-Control-Allow-Methods': expect.stringContaining('POST'),
        'Access-Control-Allow-Methods': expect.stringContaining('OPTIONS'),
      });
      const body = JSON.parse(result.body);
      expect(body.message).toBe('OK');
      // Should NOT attempt to send email
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('SES failure returns 500', () => {
    it('returns 500 when SES send fails', async () => {
      mockSend.mockRejectedValue(new Error('SES error: Email quota exceeded'));

      const event = createEvent({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error).toContain('error occurred');
    });

    it('returns 500 with generic error message (not exposing internal details)', async () => {
      mockSend.mockRejectedValue(new Error('Internal SES configuration error'));

      const event = createEvent({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      const body = JSON.parse(result.body);
      // Should not expose internal error details
      expect(body.error).not.toContain('Internal SES');
      expect(body.error).toContain('try again later');
    });
  });

  describe('Invalid JSON handling', () => {
    it('returns 400 for invalid JSON body', async () => {
      const event = {
        requestContext: {
          http: {
            method: 'POST',
          },
        },
        body: 'not valid json {',
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error).toContain('Invalid JSON');
    });

    it('handles null body gracefully', async () => {
      const event = {
        requestContext: {
          http: {
            method: 'POST',
          },
        },
        body: null,
      };

      const result = await handler(event);

      // Should return 400 for missing fields, not crash
      expect(result.statusCode).toBe(400);
    });

    it('handles undefined body gracefully', async () => {
      const event = {
        requestContext: {
          http: {
            method: 'POST',
          },
        },
      };

      const result = await handler(event);

      // Should return 400 for missing fields, not crash
      expect(result.statusCode).toBe(400);
    });
  });

  describe('Input sanitization', () => {
    it('trims whitespace from inputs', async () => {
      const event = createEvent({
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  Hello world  ',
      });

      const result = await handler(event);

      // Should succeed even with leading/trailing whitespace
      expect(result.statusCode).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('handles very long inputs by truncating', async () => {
      const longMessage = 'a'.repeat(10000);
      const event = createEvent({
        name: 'Test User',
        email: 'test@example.com',
        message: longMessage,
      });

      const result = await handler(event);

      // Should still succeed but with truncated input
      expect(result.statusCode).toBe(200);
    });
  });
});
