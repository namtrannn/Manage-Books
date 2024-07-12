import React, { useEffect, useState } from 'react';
import './user.scss';
import { callDeleteUser, callFetchListUser } from '../../../services/api';
import { Button, Table, Form, Input, Popconfirm, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import UserViewDetail from './UserViewDetail';
import { FaFileImport } from 'react-icons/fa';
import { FaFileExport } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {
    openModalImportUser,
    openModalUpdateUser,
    openModalUserCreate,
} from '../../../redux/modalUserAdmin/modalUserAdminSlice';
import UserCreate from './UserCreate';
import UserImport from './UserImport';
import * as XLSX from 'xlsx';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import UserUpdate from './UserUpdate';

const User = () => {
    const [form] = useForm(); // Sử dụng Form.useForm() để truy cập form object
    const dispatch = useDispatch();

    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('sort=-updatedAt');
    const [openViewDetailUser, setOpenViewDetailUser] = useState(false);
    const [dataUserDetail, setDataUserDetail] = useState({});
    const [dataUpdateUser, setDataUpdateUser] = useState({});

    const fetchUser = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;

        if (searchFilter) {
            query += `&${searchFilter}`;
            console.log(query);
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        setIsLoading(true);
        const res = await callFetchListUser(query);
        setIsLoading(false);

        if (res && res.data) {
            setTotal(res.data.meta.total);
            setListUser(res.data.result);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, searchFilter, sortQuery]);

    const handelUpdateUser = () => {
        dispatch(openModalUpdateUser());
    };

    const handelDeleteUser = async (_id) => {
        const res = await callDeleteUser(_id);

        if (res && res?.data) {
            message.success('Xóa người dùng thành công');
            await fetchUser();
        } else {
            notification.error({
                message: 'Đã sảy ra lỗi :)',
                description: res.message,
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <>
                        <a
                            onClick={() => {
                                setOpenViewDetailUser(true);
                                setDataUserDetail(record);
                            }}
                        >
                            {record._id}
                        </a>
                    </>
                );
            },
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return <>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>;
            },
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            title="Xác nhận xóa User !"
                            description="Bạn có chắc chắn xóa User này"
                            trigger="click"
                            placement="topLeft"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={() => handelDeleteUser(record._id)}
                        >
                            <AiOutlineDelete
                                color="#f57800"
                                style={{
                                    fontSize: '25px',
                                    cursor: 'pointer',
                                    padding: '0 4px',
                                }}
                            />
                        </Popconfirm>
                        &nbsp;
                        <CiEdit
                            color="#f57800"
                            onClick={() => {
                                handelUpdateUser();
                                setDataUpdateUser(record);
                            }}
                            style={{
                                fontSize: '25px',
                                cursor: 'pointer',
                                padding: '0 4px',
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);

        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }

        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `-sort=${sorter.field}`;
            setSortQuery(q);
        }
    };

    const onFinish = (values) => {
        const { fullName, email, phone } = values;

        let query = '';

        if (values.fullName) {
            query += `fullName=/${values.fullName}/i`;
        }

        if (values.email) {
            query += `email=/${values.email}/i`;
        }

        if (values.phone) {
            query += `phone=/${values.phone}/i`;
        }

        if (query) {
            console.log(query);
            setSearchFilter(query);
        }
    };

    const onClear = () => {
        form.resetFields(); // Đặt lại các trường nhập liệu trong form về giá trị mặc định
        setSortQuery('');
        setSearchFilter('');
    };

    const renderHeader = () => {
        const handeModalCreateUser = () => {
            dispatch(openModalUserCreate());
        };

        const handelModalImportUser = () => {
            dispatch(openModalImportUser());
        };

        const handelExportUser = () => {
            if (listUser.length > 0) {
                const worksheet = XLSX.utils.json_to_sheet(listUser);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
                XLSX.writeFile(workbook, 'exportUser.csv');
            }
        };

        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Table list Users</span>
                    <span style={{ display: 'flex', gap: 15 }}>
                        <Button icon={<FaFileExport />} type="primary" onClick={handelExportUser}>
                            &nbsp; Export
                        </Button>

                        <Button type="primary" icon={<FaFileImport />} onClick={handelModalImportUser}>
                            &nbsp; Import
                        </Button>

                        <Button icon={<FaPlus />} type="primary" onClick={handeModalCreateUser}>
                            &nbsp;Thêm mới
                        </Button>

                        <Button
                            type="ghost"
                            onClick={() => {
                                setSearchFilter('');
                                setSortQuery('');
                            }}
                        >
                            <IoReload />
                        </Button>
                    </span>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="container">
                <div className="content">
                    <Form
                        className="sorts"
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form} // Truyền instance của form vào prop form
                    >
                        <div className="input-sort">
                            <Form.Item
                                className="sort-item"
                                labelCol={{ span: 24 }} //whole column
                                label="Tên đăng nhập"
                                name="fullName"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                className="sort-item"
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                className="sort-item"
                                labelCol={{ span: 24 }} //whole column
                                label="Số điện thoại"
                                name="phone"
                            >
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="sort-btn">
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="search-btn">
                                    Search
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" className="clear-btn" onClick={onClear}>
                                    Clear
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>

                <Table
                    title={renderHeader}
                    columns={columns}
                    dataSource={listUser}
                    onChange={onChange}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        current: current,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        total: total,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                />
            </div>

            <UserViewDetail
                openViewDetailUser={openViewDetailUser}
                setOpenViewDetailUser={setOpenViewDetailUser}
                dataUserDetail={dataUserDetail}
            />

            <UserCreate fetchUser={fetchUser} />

            <UserImport fetchUser={fetchUser} />

            <UserUpdate dataUpdateUser={dataUpdateUser} fetchUser={fetchUser} />
        </>
    );
};

export default User;
