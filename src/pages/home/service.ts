import { request } from '@umijs/max';
import { message } from 'antd';

// API endpoints (base URLs will be added in the main configuration)
const GET_DRAWEES_URL = '/secured/viewDrawees';
const ADD_DRAWEE_URL = '/secured/addDrawee';
const EDIT_DRAWEE_URL = '/secured/editDrawee';
const REMOVE_DRAWEE_URL = '/secured/removeDrawee';
const TOPUP_URL = '/secured/topup';

/**
 * Gets the list of drawees.
 * @returns A promise that resolves with the list of drawees.
 */
export async function getDrawees(): Promise<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await request(GET_DRAWEES_URL, {
      method: 'GET',
      headers: {
        'Authorization': token,
      },
    });

    if (response) {
      return response.drawees;
    } else {
      message.error('Failed to fetch drawees');
      throw new Error('Failed to fetch drawees');
    }
  } catch (error) {
    message.error('Network error occurred while fetching drawees');
    throw error;
  }
}

/**
 * Adds a new drawee.
 * @param draweeData The drawee data including phone, limit, cycleType, requiresConfirmation, and requiresReason.
 * @returns A promise that resolves with the response of the API call.
 */
export async function addDrawee(draweeData: {
  phone: string;
  limit: number;
  cycleType: string;
  requiresConfirmation: boolean;
  requiresReason: boolean;
}): Promise<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await request(ADD_DRAWEE_URL, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      data: draweeData,
    });

    if (response) {
      return response;
    } else {
      message.error('Failed to add drawee');
      throw new Error('Failed to add drawee');
    }
  } catch (error) {
    message.error('Network error occurred while adding drawee');
    throw error;
  }
}

/**
 * Edits an existing drawee.
 * @param draweeData The drawee data including cycleLimit, cycleType, and limit.
 * @returns A promise that resolves with the response of the API call.
 */
export async function editDrawee(draweeData: {
  cycleLimit: number;
  cycleType: string;
  limit: number;
}): Promise<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await request(EDIT_DRAWEE_URL, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      data: draweeData,
    });

    if (response) {
      return response;
    } else {
      message.error('Failed to edit drawee');
      throw new Error('Failed to edit drawee');
    }
  } catch (error) {
    message.error('Network error occurred while editing drawee');
    throw error;
  }
}

/**
 * Removes a drawee by ID.
 * @param draweeId The ID of the drawee to remove.
 * @returns A promise that resolves with the response of the API call.
 */
export async function removeDrawee(draweeId: string): Promise<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await request(REMOVE_DRAWEE_URL, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      data: { draweeId },
    });

    if (response) {
      return response;
    } else {
      message.error('Failed to remove drawee');
      throw new Error('Failed to remove drawee');
    }
  } catch (error) {
    message.error('Network error occurred while removing drawee');
    throw error;
  }
}

export async function topup(amount: number): Promise<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }

  try {
    const response = await request(TOPUP_URL, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      data: {'amount': amount },
    });

    if (response) {
      return response;
    } else {
      message.error('Topup failed');
      throw new Error('Topup failed');
    }
  } catch (error) {
    message.error('Network error occurred on topup');
    throw error;
  }
}
