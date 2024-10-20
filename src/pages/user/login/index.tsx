import { sendOtp, verifyOtp } from './service';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { Helmet, useIntl} from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import Settings from '../../../../config/defaultSettings';
import PageTheme from '@/components/PageTheme';

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('mobile');
  const [correlationId, setCorrelationId] = useState<string | null>(null); // Correlation ID for OTP verification
  const intl = useIntl();

  const handleSubmit = async (values: { mobile: string; otp: string }) => {
    try {
      // Verify OTP
      if (!correlationId) {
        message.error('Please send OTP first!');
        return;
      }

      const result = await verifyOtp(correlationId, values.otp);

      if (result.code === 200) {
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
      <div style={{ flex: '1', padding: '32px 0' }}>
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'menu.login', defaultMessage: 'Login' })} - {Settings.title}
          </title>
        </Helmet>
        <LoginForm
          contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Orange Wallet"
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
              { pattern: /^254\d{9}$/, message: 'Invalid phone number format!' },
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
            onGetCaptcha={async (phone) => handleSendOtp(phone)}
            captchaTextRender={(timing, count) =>
              timing ? `${count}` : 'Send OTP'
            }
          />
        </LoginForm>
      </div>
    </PageTheme>
  );
};

export default Login;
