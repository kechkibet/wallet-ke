// src/pages/add_drawer.tsx
import React, { useState } from 'react';
import { Modal, Input, Button, Form, Checkbox,message, Select} from 'antd';
import {addDrawee} from './service';

interface AddDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const AddDrawer: React.FC<AddDrawerProps> = ({ visible, onClose }) => {
  const [drawerData, setDrawerData] = useState({
    phone: '',
    cycleLimit: 0,
    requiresConfirmation: false,
    requiresReason: false,
    cycleType: 'month'
  });

  const handleAddDrawer = async () => {
    try {
        const result = await addDrawee(drawerData);
        if(result)
        message.success(`Add Drawee Success`);
        onClose();
    } catch (error) {
    }
    // API call to add drawer
    onClose();
  };

  return (
    <Modal title="Add Drawer" open={visible} onCancel={onClose} footer={null}>
      <Form onFinish={handleAddDrawer}>
        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter phone' },
            {
                pattern: /^\d{10}$/,
                message: 'Phone number must be exactly 10 digits',
            },
        ]}>
          <Input onChange={(e) => setDrawerData({ ...drawerData, phone: e.target.value })} />
        </Form.Item>
        <Form.Item label="Cycle Type" name="cycleType" rules={[{ required: true }]}>
          <Select
            onChange={(value) => setDrawerData({ ...drawerData, cycleType: value })}
          >
            <Option value="day">Day</Option>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Cycle Limit" name="cycleLimit"
        rules={[
            { required: true, message: 'Please enter a cycle limit' },
            {
              validator: (_, value) =>
                value >= 10 ? Promise.resolve() : Promise.reject('Cycle limit must be at least 10 KSH'),
            },
        ]}
        >
          <Input type="number" defaultValue={drawerData.cycleLimit} onChange={(e) => setDrawerData({ ...drawerData, cycleLimit: Number(e.target.value) })} />
        </Form.Item>
        <Form.Item name="requiresConfirmation" valuePropName="checked">
          <Checkbox onChange={(e) => setDrawerData({ ...drawerData, requiresConfirmation: e.target.checked })}>
            Requires Confirmation
          </Checkbox>
        </Form.Item>
        <Form.Item name="requiresReason" valuePropName="checked">
          <Checkbox onChange={(e) => setDrawerData({ ...drawerData, requiresReason: e.target.checked })}>
            Requires Reason
          </Checkbox>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Drawer
        </Button>
      </Form>
    </Modal>
  );
};

export default AddDrawer;
