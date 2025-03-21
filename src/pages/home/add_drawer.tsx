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
  const [form] = Form.useForm(); // Form instance for better control
  const [loading, setLoading] = useState(false); // Loading state for button

  const handleAddDrawer = async (values: any) => {
    try {
      setLoading(true);
      // Convert limit and cycleLimit to numbers
      const processedValues = {
        ...values,
        limit: Number(values.limit),
        cycleLimit: Number(values.cycleLimit)
      };
      const result = await addDrawee(processedValues);
      if (result) {
        message.success(`Add Drawee Success`);
        onClose();
        form.resetFields(); // Reset the form after successful submission
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
          const phone = contact.tel?.[0].replace(/\s+/g, '').replace(/^\+254/, '0') || '';
          const name = Array.isArray(contact.name) ? contact.name.join(' ') : contact.name || '';
          // Update the form fields with the selected contact
          form.setFieldsValue({ phone, name });
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddDrawer}
        initialValues={{
          phone: '',
          cycleLimit: 10,
          limit: 1,
          requiresConfirmation: false,
          requiresReason: false,
          cycleType: 'month',
          name: '',
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="Enter name" />
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
            placeholder="Enter phone"
            addonAfter={
              <Button
                type="text"
                icon={<PhoneOutlined />}
                onClick={handleContactPicker}
                style={{ padding: 0 }}
              />
            }
          />
        </Form.Item>
        <Form.Item label="Cycle Type" name="cycleType" rules={[{ required: true }]}>
          <Select>
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
          <Input type="number" min={10} placeholder="Enter cycle limit" />
        </Form.Item>
        <Form.Item
          label="Limit"
          name="limit"
          rules={[{ required: true, message: 'Please enter a limit' }]}
        >
          <Input type="number" min={1} placeholder="Enter limit" />
        </Form.Item>
        <Form.Item name="requiresConfirmation" valuePropName="checked">
          <Checkbox>Requires Confirmation</Checkbox>
        </Form.Item>
        <Form.Item name="requiresReason" valuePropName="checked">
          <Checkbox>Requires Reason</Checkbox>
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
