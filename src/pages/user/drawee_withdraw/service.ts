import { request } from '@umijs/max';
import { message } from 'antd';

const DRAWEE_WITHDRAW_URL = '/draweeDraw';
const GET_DRAWEE_DETAILS_URL = '/drawee'; // Endpoint for getting drawee details

export async function draweeWithdraw(stubId: string, amount: number, reason: string) {
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

export async function getDraweeDetails(stubId: string) {
  try {
    const response = await request(`${GET_DRAWEE_DETAILS_URL}/${stubId}`, {
      method: 'GET',
    });

    if (response) {
      return response;
    }
  } catch (error) {
    message.error('Failed to retrieve drawee details');
    return null;
  }
}
