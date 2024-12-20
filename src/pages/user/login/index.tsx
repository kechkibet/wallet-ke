import { sendOtp, verifyOtp } from './service';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { Helmet, useIntl} from '@umijs/max';
import { message, Tabs,Row,Col } from 'antd';
import React, { useRef,useState } from 'react';
import Settings from '../../../../config/defaultSettings';
import PageTheme from '@/components/PageTheme';

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('mobile');
  const [correlationId, setCorrelationId] = useState<string | null>(null); // Correlation ID for OTP verification
  const intl = useIntl();
  const formRef = useRef<any>(null); // Reference to the form
  
  const handleSubmit = async (values: { mobile: string; otp: string }) => {
    try {
      // Verify OTP
      if (!correlationId) {
        message.error('Please send OTP first!');
        return;
      }

      const result = await verifyOtp(correlationId, values.otp);

      if (result.token) {
        // Save the token to local storage
        localStorage.setItem('token', result.token);
        message.success(intl.formatMessage({ id: 'pages.login.success', defaultMessage: 'Login successful!' }));
        // Redirect after successful login
        window.location.href = '/';
      } else {
        setUserLoginState({ status: 'error', type: 'mobile' });
        message.error('Invalid OTP or Correlation ID');
      }
    } catch (error) {
      
    }
  };

  const handleSendOtp = async (phone: string) => {
    try {
      if(phone === '')
      {
        message.error('Phone is required to send');
        return
      }
    
      const result = await sendOtp(phone);

      if (result?.correlationId) {
        message.success('OTP sent successfully!');
        setCorrelationId(result.correlationId); // Save the correlation ID for OTP verification
      } else {
        message.error('Failed to send OTP.');
      }
    } catch (error) {
      message.error('Failed to send OTP, please try again.');
    }
  };

  const { status } = userLoginState;

  return (
    <PageTheme>
      <div>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'menu.login', defaultMessage: 'Login' })} - {Settings.title}
          </title>
        </Helmet>
        <Row gutter={[24, 24]}>
              {/* Form Section */}
          <Col xs={24} md={9}>
            <LoginForm
              formRef={formRef}
              contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
              }}
              logo={<img alt="logo" src="/logo.svg" />}
              title="Wallet KE"
              subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
              onFinish={handleSubmit}
            >
              <Tabs activeKey={type} onChange={setType} centered>
                <Tabs.TabPane
                  tab={intl.formatMessage({ id: 'pages.login.phoneLogin.tab', defaultMessage: 'Phone Login' })}
                  key="mobile"
                />
              </Tabs>

              {status === 'error' && <div>OTP verification failed!</div>}

              <ProFormText
                fieldProps={{ size: 'large', prefix: <MobileOutlined /> }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: 'Phone Number',
                })}
                rules={[
                  { required: true, message: 'Please enter your phone number!' },
                  { pattern: /^\d{10}$/, message: 'Must be 10 digits!' },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                captchaProps={{ size: 'large' }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: 'Enter OTP',
                })}
                name="otp"
                rules={[
                  { required: true, message: 'Please enter the OTP!' },
                ]}
                onGetCaptcha={async () => {
                  // Extract the latest phone number from the form
                  const formValues = await formRef.current?.validateFields(['mobile']);
                  const phone = formValues?.mobile;

                  if (phone) {
                    await handleSendOtp(phone);
                  } else {
                    message.error('Please enter a valid phone number before sending OTP.');
                  }
                }}
                captchaTextRender={(timing, count) =>
                  timing ? `${count}` : 'Send OTP'
                }
              />
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
      </div>
    </PageTheme>
  );
};

export default Login;
