import React, { useEffect } from 'react';
import { Button, Input, Form, message, Card } from 'antd';
import { LoginForm } from '@ant-design/pro-components'; // Import LoginForm for styling
import { draweeWithdraw } from './service'; // Ensure the function is defined in service.ts
import PageTheme from '@/components/PageTheme';
import { history } from '@umijs/max';

const DraweeWithdraw: React.FC = () => {
  const stubId = history.location.pathname.split('/').pop(); // Extract stubId from URL
  const [form] = Form.useForm(); // Initialize form instance

  useEffect(() => {
    if (!stubId) {
      message.error('Stub ID is missing from the URL.');
    }
  }, [stubId]);

  const handleWithdraw = async (values: { amount: number; reason: string }) => {
    if (!stubId) {
      message.error('Stub ID is missing.');
      return;
    }

    const { amount, reason } = values;

    try {
      const result = await draweeWithdraw(stubId, amount, reason);
      if (result) {
        message.success(result.message);
      }
    } catch (error) {
    }
  };

  return (
    <PageTheme>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <LoginForm
            title="Withdraw"
            subTitle="You as a drawee can be funded after filling the form"
            onFinish={handleWithdraw} // Trigger handleWithdraw on form submission
            logo='/logo.svg'
            submitter={{
              searchConfig: {
                submitText: 'Withdraw',
              },
            }}
          >
            <Form.Item
              name="amount"
              label="Amount (KES)"
              rules={[{ required: true, message: 'Please enter a valid amount' }]}
            >
              <Input type="number" min={1} placeholder="Enter withdrawal amount" />
            </Form.Item>
            <Form.Item name="reason" label="Reason">
              <Input placeholder="Optional reason for withdrawal" />
            </Form.Item>
          </LoginForm>
      </div>
    </PageTheme>
  );
};

export default DraweeWithdraw;
