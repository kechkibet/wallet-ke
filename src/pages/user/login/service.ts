import { request } from '@umijs/max';
import { message } from 'antd';

// API endpoints (base URLs are not included, assuming they'll be added in the main configuration)
const SEND_OTP_URL = '/sendOtp';
const VERIFY_OTP_URL = '/verifyOtp';

/**
 * Sends an OTP to the specified phone number.
 * @param phone The phone number to send the OTP to.
 * @returns A promise that resolves with the response containing the correlationId and message.
 */
export async function sendOtp(phone: string): Promise<{ correlationId: string, message: string }> {
  try {
    const response = await request(SEND_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { phone },
    });

    if (response?.correlationId) {
      return response;
    } else {
      message.error(response?.message || 'Failed to send OTP');
      throw new Error('Failed to send OTP');
    }
  } catch (error) {
    message.error('Network error occurred while sending OTP');
    throw error;
  }
}

/**
 * Verifies the OTP using the correlation ID and OTP code.
 * @param correlationId The correlation ID from the OTP send response.
 * @param code The OTP code to verify.
 * @returns A promise that resolves with the verification response.
 */
export async function verifyOtp(correlationId: string, code: string): Promise<any> {
  try {
    const response = await request(VERIFY_OTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { correlationId, code },
    });
    return response;
  } catch (error) {
    message.error(error.message ||'Network error occurred while verifying OTP');
    throw error;
  }
}
