import React, { useEffect, useState } from 'react';
import {
  Input,
  Form,
  message,
  Typography,
  Card,
  Divider,
  Progress,
  Tag,
  Row,
  Col,
} from 'antd';
import { draweeWithdraw, getDraweeDetails } from './service';
import PageTheme from '@/components/PageTheme';
import { history } from '@umijs/max';
import { LoginForm } from '@ant-design/pro-components';
import {useIntl} from '@umijs/max';


const { Title, Text } = Typography;

const DraweeWithdraw: React.FC = () => {
  const stubId = history.location.pathname.split('/').pop();
  const [form] = Form.useForm();
  const [isReasonRequired, setIsReasonRequired] = useState(false);
  const [drawee, setDrawee] = useState<any | null>(null);
  const [isValidStubId, setIsValidStubId] = useState(true);
  const intl = useIntl();

  useEffect(() => {
    if (!stubId) {
      message.error('Stub ID is missing from the URL.');
      setIsValidStubId(false);
      return;
    }

    const validateDrawee = async () => {
      const draweeDetails = await getDraweeDetails(stubId);
      if (draweeDetails) {
        setDrawee(draweeDetails);
        setIsReasonRequired(draweeDetails.requires_reason);
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
      <div>
        {isValidStubId ? (
          drawee ? (
            <Row gutter={[24, 24]}>
              {/* Form Section */}
              <Col xs={24} md={9}>
                <LoginForm
                  logo={<img alt="logo" src="/logo.svg" />}
                  title="Wallet KE"
                  subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
                  onFinish={handleWithdraw}
                  submitter={{
                    searchConfig: {
                      submitText: 'Withdraw',
                    },
                  }}
                >
                  <Card>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <h3>Welcome, {drawee.name}!</h3>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={8}>
                        <strong>Cycle Type:</strong>{' '}
                        <Tag color="orange">{drawee.cycle_type}</Tag>
                      </Col>
                      <Col span={8}>
                        <Text>
                          <strong>Cycle Limit:</strong>
                          <Tag color="orange">KES {drawee.cycle_limit}</Tag>
                        </Text>
                      </Col>
                      <Col span={8}>
                        <Text>
                          <strong>Used:</strong>
                          <Tag color="orange">KES {drawee.cycle_used}</Tag>
                        </Text>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: '16px' }}>
                      <Col span={12}>
                        <Progress
                          percent={(drawee.cycle_used / drawee.cycle_limit) * 100}
                          status="active"
                          strokeColor="#FF8C00"
                          format={(percent) => `${percent?.toFixed(1)}% Used`}
                        />
                      </Col>
                      <Col span={12}>
                        <Progress
                          type="circle"
                          percent={(drawee.cycle_used / drawee.cycle_limit) * 100}
                          format={(percent) => `${drawee.cycle_used} / ${drawee.cycle_limit} KES`}
                          strokeColor="#FF8C00"
                          trailColor="#FFE4B3"
                          strokeWidth={10}
                          size={80}
                        />
                      </Col>
                    </Row>
                    <Divider style={{ margin: '8px 0', borderWidth: '1px' }} />
                    <Row>
                      <Col span={24}>
                        <Text>
                          <strong>Confirmation Required:</strong>{' '}
                          <Tag color="orange">
                            {drawee.requires_confirmation ? 'Yes' : 'No'}
                          </Tag>
                        </Text>
                      </Col>
                    </Row>
                  </Card>

                  <Form.Item
                    name="amount"
                    label="Amount (KES)"
                    rules={[
                      { required: true, message: 'Please enter a valid amount' },
                      {
                        validator: (_, value) =>
                          value >= 1
                            ? Promise.resolve()
                            : Promise.reject('Amount must be at least 1 KSH'),
                      },
                    ]}
                  >
                    <Input type="number" min={1} placeholder="Enter withdrawal amount" />
                  </Form.Item>
                  <Form.Item
                    name="reason"
                    label="Reason"
                    rules={[
                      { required: isReasonRequired, message: 'Please provide a reason' },
                    ]}
                  >
                    <Input placeholder="Optional reason for withdrawal" />
                  </Form.Item>
                </LoginForm>
              </Col>

              {/* Image Section */}
              <Col xs={24} md={15}>
                <img
                  src="/money_boy.jpg" // Replace with your actual image URL
                  alt="Drawee Illustration"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </Col>
            </Row>
          ) : (
            <center><Text>Loading drawee details...</Text></center>
          )
        ) : (
          <center><Text type="danger">Invalid Stub ID. Access to this page is denied.</Text></center>
        )}
      </div>
    </PageTheme>
  );
};

export default DraweeWithdraw;
