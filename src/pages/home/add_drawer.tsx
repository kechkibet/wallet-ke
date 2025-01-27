import React, { useState } from 'react';
import { Modal, Input, Button, Form, Checkbox, message, Select } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { addDrawee } from './service';

const { Option } = Select;

interface AddDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const AddDrawer: React.FC<AddDrawerProps> = ({ visible, onClose }) => {
  const [drawerData, setDrawerData] = useState({
    phone: '',
    cycleLimit: 0,
    limit: 0,
    requiresConfirmation: false,
    requiresReason: false,
    cycleType: 'month',
    name: '',
  });

  const [loading, setLoading] = useState(false); // Loading state for button

  const handleAddDrawer = async () => {
    try {
      setLoading(true);
      const result = await addDrawee(drawerData);
      if (result) {
        message.success(`Add Drawee Success`);
        onClose();
      }
    } catch (error) {
      message.error('Failed to add drawee');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle Contact Picker
  const handleContactPicker = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const contacts = await (navigator as any).contacts.select(
          ['name', 'tel'], // Fields to request
          { multiple: false } // Single selection
        );
        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          const phone = contact.tel?.[0] || '';
          setDrawerData({ ...drawerData, phone });
        }
      } catch (error) {
        message.error('Contact Picker API not supported or canceled by the user.');
      }
    } else {
      message.error('Contact Picker API is not supported on this device or browser.');
    }
  };

  return (
    <Modal title="Add Drawer" open={visible} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={handleAddDrawer}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
          <Input onChange={(e) => setDrawerData({ ...drawerData, name: e.target.value })} />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: 'Please enter phone' },
            { pattern: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' },
          ]}
        >
          <Input
            addonAfter={
              <Button
                type="text"
                icon={<PhoneOutlined />}
                onClick={handleContactPicker}
                style={{ padding: 0 }}
              />
            }
            value={drawerData.phone}
            onChange={(e) => setDrawerData({ ...drawerData, phone: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Cycle Type" name="cycleType" rules={[{ required: true }]}>
          <Select onChange={(value) => setDrawerData({ ...drawerData, cycleType: value })}>
            <Option value="day">Day</Option>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Cycle Limit"
          name="cycleLimit"
          rules={[
            { required: true, message: 'Please enter a cycle limit' },
            {
              validator: (_, value) =>
                value >= 10 ? Promise.resolve() : Promise.reject('Cycle limit must be at least 10 KSH'),
            },
          ]}
        >
          <Input
            type="number"
            min={10}
            onChange={(e) => setDrawerData({ ...drawerData, cycleLimit: Number(e.target.value) })}
          />
        </Form.Item>
        <Form.Item label="Limit" name="limit" rules={[{ required: true, message: 'Please enter a limit' }]}>
          <Input
            type="number"
            min={1}
            onChange={(e) => setDrawerData({ ...drawerData, limit: Number(e.target.value) })}
          />
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading} block>
            {loading ? 'Adding...' : 'Add Drawer'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDrawer;
