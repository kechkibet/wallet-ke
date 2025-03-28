import React from 'react';
import { Table, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks'; // Import useRequest
import { getDraweeTransactions } from './service';
import { format } from 'date-fns'; // Use date-fns for date formatting

const { Title } = Typography;

const DraweeStatement: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the Drawee ID from the route

    const { data, loading } = useRequest(async () => await getDraweeTransactions(id || ""), {
        refreshDeps: [id], // Refresh data when id changes
    });

    const columns = [
        {
            title: 'Transaction Date',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (text: string) => format(new Date(text), 'yyyy-MM-dd HH:mm:ss'), // Format date
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
            render: (value: number) => `KES ${value.toFixed(2)}`, // Format as currency
        },
        {
            title: 'Drawee Balance',
            dataIndex: 'DraweeBalance',
            key: 'DraweeBalance',
            render: (value: number) => `KES ${value.toFixed(2)}`, // Format as currency
        },
        {
            title: 'Main Balance',
            dataIndex: 'MainBalance',
            key: 'MainBalance',
            render: (value: number) => `KES ${value.toFixed(2)}`, // Format as currency
        },
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <Title level={3} className="text-orange-800">Drawee Statement</Title>
            <Table 
                columns={columns} 
                dataSource={data || []} 
                rowKey="ID" 
                loading={loading} 
            />
        </div>
    );
};

export default DraweeStatement;
