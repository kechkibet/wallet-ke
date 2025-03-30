import { request } from '@umijs/max';
import { message } from 'antd';

import { startRegistration, startAuthentication,  } from '@simplewebauthn/browser';

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

  export const handleWebAuthnRegistration = async () => {
    try {
      const response = await request('/secured/webauthn/register/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || "" },
        body: JSON.stringify({ token: localStorage.getItem('token') }),
      });
      if (!response) {
        message.error('Failed to edit drawee');
        throw new Error('Failed to edit drawee');
      }
      console.log(response);
      const attestation = await startRegistration({optionsJSON: response.publicKey});

      console.log(attestation);

      const finishResponse = await request('/secured/webauthn/register/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || "" },
        data: JSON.stringify(attestation),
      });
      console.log(finishResponse);

      if (finishResponse) {
        message.success('WebAuthn registration successful!');
      } else {
        message.error('WebAuthn registration failed.');
      }
    } catch (error) {
      console.log(error);
      message.error('An error occurred during WebAuthn registration.');
    }
  };

  export const handleWebAuthnLogin = async () => {
    try {
      const response = await request('/webauthn/login/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || "" },
        data: JSON.stringify({ token: localStorage.getItem('token') }),
      });
      if (!response) {
        console.log('Failed to start WebAuthn login');
        return;
      }
      const sessionId = response.sessionId;

      const assertion = await startAuthentication({optionsJSON: response.options.publicKey});

      const finishResponse = await request(`/webauthn/login/finish?sessionId=${encodeURIComponent(sessionId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(assertion),
      });

      if (finishResponse) {
        message.success('Login successful!');
        localStorage.setItem('token', finishResponse.token);
        window.location.href = '/';
      } else {
        message.error('Login failed.');
      }
    } catch (error) {
      console.log(error);
      message.error('Could not login via Biometrics: ' + error.message);
    }
  };