import { useEffect } from 'react';
import { callManageOrder } from '../../../services/api';
import { Table, Pagination } from 'antd';
import { useState } from 'react';
import moment from 'moment';

const ManageOrder = () => {
    const [dataOrder, setDataOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState();

    useEffect(() => {
        const getManageOrder = async () => {
            const res = await callManageOrder(current, pageSize);

            if (res && res.data) {
                setDataOrder(res.data.result);
                console.log(res.data);
                setTotal(res.data.meta.total);
            }
        };

        getManageOrder();
    }, [current, pageSize]);

    const onChange = (pagination, filters, sorter, extra) => {
        // các tham số ( phân trang, bộ lọc , xắp xếp, bổ xung) khi thực hiện thanh ở dưới table
        console.log('params', pagination, filters, sorter, extra);

        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
        }
    };

    console.log('data', dataOrder);

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'Name',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return <>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>;
            },
        },
    ];

    const data = dataOrder.map((item) => {
        return {
            _id: item._id,
            name: item.name,
            address: item.address,
            phone: item.phone,
            updatedAt: item.updatedAt,
        };
    });

    return (
        <>
            <div style={{ padding: '20px' }}>
                <Table
                    onChange={onChange}
                    columns={columns}
                    dataSource={data}
                    pagination={{ current: current, pageSize: pageSize, showSizeChanger: true, total: total }}
                />
            </div>
        </>
    );
};

export default ManageOrder;
