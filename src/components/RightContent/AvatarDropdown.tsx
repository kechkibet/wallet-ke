import { outLogin,updateName } from '@/services/ant-design-pro/api';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Spin, Modal, Button, message, Input } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import React, { useCallback,useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name == '' ? "UPDATE NAME": currentUser?.name}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */

  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }

    /// wipe token
    localStorage.setItem('token','');
  };


  /// update name 
  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await updateName(newName);
      message.success('Name updated successfully');
      setInitialState((s) => ({
        ...s,
        currentUser: { ...s.currentUser, name: newName },
      }));
      setShowUpdateNameModal(false);
    } catch (error) {
      message.error('Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: any) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      if (key === 'update name') {
        setShowUpdateNameModal(true);
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );


  if (!initialState) {
    return (
      <span className={styles.action}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }

  const { currentUser } = initialState;

  if (!currentUser) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
     
    currentUser.name !='' ? null: {
      key: 'update name',
      icon: <UserOutlined />,
      label: 'Update Name',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <>
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>

    {/* Update Name Modal */}
    <Modal
        title="Update Name"
        open={showUpdateNameModal}
        onCancel={() => setShowUpdateNameModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowUpdateNameModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleUpdateName}>
            Update
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter new name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={loading}
        />
      </Modal>
    </>
  );
};
