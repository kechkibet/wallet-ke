// src/pages/topup.tsx
import React, { useState } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import { topup } from './service';

interface TopUpProps {
  visible: boolean;
  onClose: () => void;
}

const TopUp: React.FC<TopUpProps> = ({ visible, onClose }) => {
  const [amount, setAmount] = useState<number | undefined>();
  const [loading, setLoading] = useState(false); // loading state for button

  const handleTopUp = async () => {
    if (!amount) {
      message.error('Please enter an amount');
      return;
    }

    try {
      setLoading(true); // Set loading to true when the submission starts
      const result = await topup(amount);
      if (result) {
        message.success(`${result.message}`);
        onClose();
      }
    } catch (error) {
      message.error('Failed to top up');
    } finally {
      setLoading(false); // Reset loading state after submission completes
    }
  };

  return (
    <Modal title="Top Up Wallet" open={visible} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={handleTopUp}>
        <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
          <Input
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={loading} // Disable input during loading
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TopUp;
