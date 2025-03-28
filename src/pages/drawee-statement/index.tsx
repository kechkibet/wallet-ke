import React from 'react';
import { Table, Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const DraweeStatement: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the Drawee ID from the route

    const columns = [
        {
            title: 'Transaction Date',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
        },
        {
            title: 'Reason',
            dataIndex: 'Reason',
            key: 'Reason',
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            key: 'Amount',
        },
        {
            title: 'Drawee Balance',
            dataIndex: 'DraweeBalance',
            key: 'DraweeBalance',
        },

        {
            title: 'Main Balance',
            dataIndex: 'MainBalance',
            key: 'MainBalance',
        },

    ];

    const data = []; // Placeholder for table data

    return (
        <div className="max-w-3xl mx-auto">
            <Title level={3} className="text-orange-800">Drawee Statement</Title>
            <Table columns={columns} dataSource={data} rowKey="ID" />
        </div>
    );
};

export default DraweeStatement;
