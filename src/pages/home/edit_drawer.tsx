import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

const { Option } = Select;

interface Drawer {
  ID: number;
  Phone: string;
  Name: string;
  Limit: number;
  RequiresConfirmation: boolean;
  RequiresReason: boolean;
  CycleLimit: number;
  CycleType: string;
  CycleUsed: number;
}

interface EditDrawerProps {
  visible: boolean;
  drawer: Drawer | null;
  onClose: () => void;
}

const EditDrawer: React.FC<EditDrawerProps> = ({ visible, drawer, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
    const values = await form.validateFields();
    if (!form.isFieldsTouched(true)) {
      message.info('No changes detected.');
      return;
    }
      console.log('Updated drawer values:', { ...drawer, ...values });
      // TODO: Call API to save the updated drawer details
      message.success('Drawer updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update drawer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Edit ${drawer?.Name}`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          cycleLimit: drawer?.CycleLimit,
          limit: drawer?.Limit,
          cycleType: drawer?.CycleType,
        }}
      >
        <Form.Item
          name="limit"
          label="Limit"
          rules={[{ required: true, message: 'Please enter the limit' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="cycleLimit"
          label="Cycle Limit"
          rules={[
            { required: true, message: 'Please enter the cycle limit' },
            ({ getFieldValue }) => ({
              validator(_, value) {
            if (!value || value >= (drawer?.CycleUsed || 0)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Cycle Limit should not be less than Cycle Used'));
              },
            }),
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Cycle Type" name="cycleType" rules={[{ required: true }]}>
          <Select>
            <Option value="day">Day</Option>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDrawer;
