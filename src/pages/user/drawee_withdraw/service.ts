import { request } from '@umijs/max';
import { message } from 'antd';

// API endpoints (base URLs are not included, assuming they'll be added in the main configuration)
const DRAWEE_WITHDRAW_URL = '/draweeDraw';

export async function draweeWithdraw(stubId: string,amount: number,reason: string) {
  try {
    const response = await request(DRAWEE_WITHDRAW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        stubId: stubId,
        amount: amount,
        reason: reason || 'No reason provided',
      },
    });

    if (response) {
      return response;
    }
  } catch (error) {
    message.error('Withdrawal failed');
    throw error;
  }
}