import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { callHistory } from '../../services/api';

const HistoryPage = () => {
    const [dataHistory, setDataHistory] = useState([]);

    const calllApiHistory = async () => {
        const res = await callHistory();

        if (res && res.data) {
            setDataHistory(res.data);
        } else return;
    };

    useEffect(() => {
        calllApiHistory();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index) => <a>{index}</a>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleString('vi-VN'),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: 'Trạng thái',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Chi tiết',
            key: 'detail',
        },
    ];
    // console.log('dataHistory', dataHistory);

    const data = dataHistory.map((item, index) => {
        return {
            STT: index + 1,
            createdAt: item.createdAt,
            totalPrice: (
                <>
                    <span style={{ color: 'red', fontSize: '16px' }}>
                        {' '}
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(item.totalPrice)}
                    </span>
                </>
            ),
            tags: ['Thành công'],
            detail: item,
        };
    });

    return (
        <>
            <div style={{ padding: '20px 40px', backgroundColor: '#efefef' }}>
                <h4 style={{ marginBottom: '20px' }}>Lịch sử đặt hàng</h4>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </>
    );
};

export default HistoryPage;
