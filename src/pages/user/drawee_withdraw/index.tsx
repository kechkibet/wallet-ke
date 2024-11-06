import React, { useEffect, useState } from 'react';
import { Button, Input, Form, message, Typography } from 'antd';
import { LoginForm } from '@ant-design/pro-components';
import { draweeWithdraw, getDraweeDetails } from './service';
import PageTheme from '@/components/PageTheme';
import { history } from '@umijs/max';

const { Text } = Typography;

const DraweeWithdraw: React.FC = () => {
  const stubId = history.location.pathname.split('/').pop(); // Extract stubId from URL
  const [form] = Form.useForm();
  const [isReasonRequired, setIsReasonRequired] = useState(false);
  const [drawer, setDrawer] = useState<{ name: string; requiresReason: boolean } | null>(null);
  const [isValidStubId, setIsValidStubId] = useState(true); // Track if stubId is valid
  const [welcomeMessage,setWelcomeMessage] = useState('')

  useEffect(() => {
    if (!stubId) {
      message.error('Stub ID is missing from the URL.');
      setIsValidStubId(false);
      return;
    }

    // Validate stubId by fetching drawee details
    const validateDrawee = async () => {
      const drawee = await getDraweeDetails(stubId);
      if (drawee) {
        setDrawer(drawee); // Store drawer details
        setIsReasonRequired(drawee.requires_reason); // Assuming response has `requiresReason` boolean
        setWelcomeMessage(
          "Welcome ".concat(drawee.name)
            .concat(", You can be funded by filling out the form below. ")
            .concat("Your current funding cycle type is '")
            .concat(drawee.cycle_type)
            .concat("', with cycle limit of KES ")
            .concat(drawee.cycle_limit.toString())
            .concat(" . You have used ")
            .concat(drawee.cycle_used.toString())
            .concat(" cycles. Your available limit is KES ")
            .concat(drawee.limit.toString())
            .concat(" . Please note that ")
            .concat(drawee.requires_confirmation ? "confirmation is required" : "no confirmation is needed")
            .concat(" for your withdrawals, and ")
            .concat(drawee.requires_reason ? "a reason is required" : "a reason is optional")
            .concat(" for each transaction.")
        );
        } else {
        message.error('Invalid or missing drawee details.');
        setIsValidStubId(false);
      }
    };

    validateDrawee();
  }, [stubId]);

  const handleWithdraw = async (values: { amount: number; reason: string }) => {
    if (!stubId) {
      message.error('Stub ID is missing.');
      return;
    }

    const { amount, reason } = values;

    try {
      const result = await draweeWithdraw(stubId, Number(amount), reason);
      if (result) {
        message.success(result.message);
      }
    } catch (error) {
      message.error('Withdrawal failed.');
    }
  };

  return (
    <PageTheme>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {isValidStubId ? (
          drawer ? (
            <>
              <LoginForm
                title="Withdraw"
                subTitle= {welcomeMessage}
                onFinish={handleWithdraw}
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
                <Form.Item
                  name="reason"
                  label="Reason"
                  rules={[{ required: isReasonRequired, message: 'Please provide a reason' }]}
                >
                  <Input placeholder="Optional reason for withdrawal" />
                </Form.Item>
              </LoginForm>
            </>
          ) : (
            <Text>Loading drawer details...</Text>
          )
        ) : (
          <Text type="danger">Invalid Stub ID. Access to this page is denied.</Text>
        )}
      </div>
    </PageTheme>
  );
};

export default DraweeWithdraw;
