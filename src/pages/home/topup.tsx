// src/pages/topup.tsx
import React, { useState } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import {topup } from './service';

interface TopUpProps {
  visible: boolean;
  onClose: () => void;
}

const TopUp: React.FC<TopUpProps> = ({ visible, onClose }) => {
  const [amount, setAmount] = useState<number | undefined>();

  const handleTopUp = async () => {
    if (!amount) {
      message.error('Please enter an amount');
      return;
    }

    // Here, you would send the amount to the API for top-up
    try {
        const result = await topup(amount);
        if(result)
        message.success(`${result.message}`);

        onClose();
    } catch (error) {
    }
  };

  return (
    <Modal title="Top Up Wallet" open={visible} onCancel={onClose} footer={null}>
      <Form onFinish={handleTopUp}>
        <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
          <Input type="number" onChange={(e) => setAmount(Number(e.target.value))} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default TopUp;
