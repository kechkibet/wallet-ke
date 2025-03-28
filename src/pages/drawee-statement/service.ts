import { request } from '@umijs/max';
import { message } from 'antd';
/**
 * Gets the transactions for a specific drawee by ID.
 * @param draweeId The ID of the drawee.
 * @returns A promise that resolves with the list of transactions.
 */
export async function getDraweeTransactions(draweeId: string): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
  
    try {
      const response = await request(`/secured/drawee/${draweeId}/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });
  
      if (response) {
        return response.transactions;
      } else {
        message.error('Failed to fetch drawee transactions');
        throw new Error('Failed to fetch drawee transactions');
      }
    } catch (error) {
      message.error('Network error occurred while fetching drawee transactions');
      throw error;
    }
  }
  