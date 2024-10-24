import React, { useEffect, useState } from 'react';
import { Card, Tabs, Button, List, Avatar, Tag, Typography, Space, Row, Col, Dropdown, Menu } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CreditCardOutlined,
  ArrowUpOutlined,
  SendOutlined,
  FileTextOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { getDrawees, addDrawee, removeDrawee } from './service'; // Import APIs
import { currentUser as queryCurrentUser } from '../../services/ant-design-pro/api';
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface Drawer {
  ID: number;
  Phone: string;
  Limit: number,
  RequiresConfirmation: boolean,
  RequiresReason: boolean,
  CycleLimit: 500,
  CycleType: string,
  CycleUsed: number
}

interface Account {
  id: number;
  name: string;
  balance: number;
  maxAmount: number;
  requiresConfirmation: boolean;
  requiresReason: boolean;
  avatar: string;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState<'drawers' | 'accounts'>('drawers');
  const [drawers, setDrawers] = useState<Drawer[]>([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: 'Checking Account', balance: 5000, maxAmount: 1000, requiresConfirmation: true, requiresReason: false, avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'Savings Account', balance: 10000, maxAmount: 2000, requiresConfirmation: true, requiresReason: true, avatar: '/placeholder.svg?height=40&width=40' },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await queryCurrentUser();
      setUser(userInfo);
    };
    fetchUser();
  }, []);

   // Fetch drawees from the API
   useEffect(() => {
    const fetchDrawees = async () => {
      setLoading(true);
      try {
        const draweesData = await getDrawees();
        setDrawers(draweesData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDrawees();
  }, []);

  /// draweers
  // Add new drawer using API
  const handleAddDrawer = async () => {
    const newDrawer = {
      phone: '0728474740',
      cycleLimit: 500,
      cycleType: 'day',
      requiresConfirmation: true,
      requiresReason: true,
    };

    try {
      const addedDrawer = await addDrawee(newDrawer);
      setDrawers([...drawers, addedDrawer]);
    } catch (error) {
    }
  };

  // Remove drawer using API
  const handleRemoveDrawer = async (id: number) => {
    try {
      await removeDrawee(id.toString());
      setDrawers(drawers.filter(drawer => drawer.ID !== id));
    } catch (error) {
    }
  };

  const handleViewStatement = (id: number) => {
    console.log(`View statement for drawee with id: ${id}`);
  };

  const handleEditDrawer = (id: number) => {
    console.log(`Edit drawer with id: ${id}`);
  };

  const handleWithdraw = (id: number) => {
    console.log(`Withdraw from account with id: ${id}`);
  };

  const handleTopUp = () => {
    console.log('Top up wallet');
  };

  const handleSend = () => {
    console.log('Send money from wallet');
  };

  const handleViewWalletStatement = () => {
    console.log('View wallet statement');
  };

  const RequirementTag = ({ label }: { label: string }) => (
    <Tag color="orange">{label}</Tag>
  );

  const drawerActionMenu = (drawer: Drawer) => (
    <Menu>
      <Menu.Item key="1" icon={<FileTextOutlined />} onClick={() => handleViewStatement(drawer.ID)}>
        View Statement
      </Menu.Item>
      <Menu.Item key="2" icon={<EditOutlined />} onClick={() => handleEditDrawer(drawer.ID)}>
        Edit
      </Menu.Item>
      <Menu.Item key="3" icon={<DeleteOutlined />} onClick={() => handleRemoveDrawer(drawer.ID)} danger>
        Remove
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-4 border border-orange-200" style={{ padding: 16}}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Space size="middle">
              <Avatar size={48} src="/placeholder.svg?height=48&width=48" className="border-2 border-orange-300" />
              <div>
                <Title level={4} className="text-orange-800 m-0">My Wallet</Title>
                <Text className="text-orange-600">{user.phone}</Text>
              </div>
            </Space>
          </Col>
        </Row>
        <Row gutter={[16, 16]} align="middle" className="mt-4">
          <Col xs={24} sm={12}>
          <Title level={3} className="text-orange-600 m-0">
            KES {(user.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Title>

          </Col>
          <Col xs={24} sm={12} className="text-right">
            <Space>
            <Button
              icon={<FileTextOutlined />}
              onClick={handleViewWalletStatement}
              type="text"
              className="text-orange-600 hover:bg-orange-100"
            />
              <Button type="primary" icon={<ArrowUpOutlined />} onClick={handleTopUp} className="bg-orange-500 hover:bg-orange-600">
                Top Up
              </Button>
              <Button icon={<SendOutlined />} onClick={handleSend} className="bg-orange-400 text-white hover:bg-orange-500">
                Send
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <Card className="border border-orange-200" style={{ padding: 16 ,marginTop: 10}}>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'drawers' | 'accounts')}>
          <TabPane tab="Drawers" key="drawers">
            <List
              dataSource={drawers}
              renderItem={drawer => (
                <List.Item
                  key={drawer.ID}
                  actions={[
                    <Dropdown overlay={drawerActionMenu(drawer)} trigger={['click']}>
                      <Button icon={<MoreOutlined />} type="text" />
                    </Dropdown>,
                  ]}
                  className="bg-orange-50 rounded-lg border border-orange-200 mb-2 p-2"
                >
                  <List.Item.Meta
                    avatar={<Avatar src={''} className="border border-orange-300" />}
                    title={<Text strong className="text-orange-800">{drawer.Phone}</Text>}
                    description={
                      <>
                        <Text className="text-orange-600">Max: KES {drawer.CycleLimit}</Text>
                        <br />
                        <Text className="text-orange-600">Limit: KES {drawer.Limit}</Text>
                        <br />
                        {drawer.RequiresConfirmation && <RequirementTag label="Confirmation" />}
                        {drawer.RequiresReason && <RequirementTag label="Reason" />}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
            <Button icon={<PlusOutlined />} onClick={handleAddDrawer} type="dashed" block className="mt-2">
              Add drawer
            </Button>
          </TabPane>
          <TabPane tab="Accounts" key="accounts">
            <List
              dataSource={accounts}
              renderItem={account => (
                <List.Item
                  key={account.id}
                  className="bg-orange-50 rounded-lg border border-orange-200 mb-2 p-2"
                >
                  <Row gutter={[16, 16]} align="middle" style={{ width: '100%' }}>
                    <Col xs={24} sm={16}>
                      <List.Item.Meta
                        avatar={<Avatar src={account.avatar} className="border border-orange-300" />}
                        title={<Text strong className="text-orange-800">{account.name}</Text>}
                        description={
                          <>
                            <Text className="text-orange-600">Balance: KES {account.balance.toFixed(2)}</Text>
                            <br />
                            <Text className="text-orange-600">Max: KES {account.maxAmount}</Text>
                            <br />
                            {account.requiresConfirmation && <RequirementTag label="Confirmation" />}
                            {account.requiresReason && <RequirementTag label="Reason" />}
                          </>
                        }
                      />
                    </Col>
                    <Col xs={24} sm={8} className="text-right">
                      <Button 
                        type="primary" 
                        icon={<CreditCardOutlined />} 
                        onClick={() => handleWithdraw(account.id)} 
                        className="bg-orange-400 text-white hover:bg-orange-500 w-full sm:w-auto"
                      >
                        Withdraw
                      </Button>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default HomePage;