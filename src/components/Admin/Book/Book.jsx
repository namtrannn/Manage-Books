import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Input, Popconfirm, message, notification } from 'antd';
import './book.scss';
import { callDeleteBook, callFetchListBook } from '../../../services/api';
import moment from 'moment';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { FaFileExport, FaPlus } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import {
    openModalCreateBook,
    openModalDetailBook,
    openModalUpdate,
} from '../../../redux/modalBookAdmin/modalBookAdminSlice';
import BookViewDetail from './BookViewDetail';
import BookCreate from './BookCreate';
import BookUpdate from './BookUpdate';

const Book = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState();
    const [sorterQuery, serSortQuery] = useState('sort=-updatedAt');
    const [filterQuery, setFilterQuery] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const [dataBookDetail, setDataBookDetail] = useState({});
    const [dataUpdate, setDataUpdate] = useState({});

    const fetchBook = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filterQuery) {
            query += `&${filterQuery}`;
        }

        if (sorterQuery) {
            query += `&${sorterQuery}`;
        }

        setIsLoading(true);
        const res = await callFetchListBook(query);

        if (res && res?.data) {
            console.log('>>>check res', res.data);
            setTotal(res.data.meta.total);
            setListBook(res.data.result);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filterQuery, sorterQuery]);

    const onFinish = (values) => {
        const { mainText, author, category } = values;
        let query = '';

        if (values.mainText) {
            query += `mainText=/${values.mainText}/i`;
        }

        if (values.author) {
            query += `author=/${values.author}/i`;
        }

        if (values.category) {
            query += `category=/${values.category}/i`;
        }

        if (query) {
            setFilterQuery(query);
            console.log(query);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        // các tham số ( phân trang, bộ lọc , xắp xếp, bổ xung) khi thực hiện thanh ở dưới table
        console.log('params', pagination, filters, sorter, extra);

        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
        }

        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `-sort=${sorter.field}`;
            serSortQuery(q);
        }
    };

    const handleBookDetail = (record) => {
        console.log('book');
        dispatch(openModalDetailBook());
    };

    const handleUpdate = () => {
        dispatch(openModalUpdate());
    };

    const handelDeleteBook = async (_id) => {
        setIsLoading(true);
        const res = await callDeleteBook(_id);
        if (res && res.data) {
            message.success('Xoá thành công :v');
            await fetchBook();
            setIsLoading(false);
        } else {
            notification.error({
                message: 'Có lỗi !',
                description: 'Xóa Sách không thành công !',
            });
        }
    };

    const columns = [
        {
            title: ' Id',
            dataIndex: '_id',
            key: '_id',
            render: (text, record, index) => {
                return (
                    <>
                        <a
                            onClick={() => {
                                handleBookDetail(), setDataBookDetail(record);
                            }}
                        >
                            {record._id}
                        </a>
                    </>
                );
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            key: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
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
        {
            title: 'Action',
            with: '100px',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <>
                        <div style={{ display: 'flex' }}>
                            <Popconfirm
                                title="Xác nhận xóa Sách !"
                                description="Bạn có chắc chắn xóa Sách này"
                                trigger="click"
                                placement="topLeft"
                                okText="Xác nhận"
                                cancelText="Hủy"
                                onConfirm={() => handelDeleteBook(record._id)}
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
                                onClick={() => {
                                    handleUpdate();
                                    setDataUpdate(record);
                                }}
                                color="#f57800"
                                style={{
                                    fontSize: '25px',
                                    cursor: 'pointer',
                                    padding: '0 4px',
                                }}
                            />
                        </div>
                    </>
                );
            },
        },
    ];

    const handleCreate = () => {
        dispatch(openModalCreateBook());
    };

    const handelExportUser = () => {
        if (listBook.length > 0) {
            //console.log('>>>Check listbook', listBook);
            const book = listBook.map((item) => {
                return {
                    mainText: item.mainText,
                    author: item.author,
                    category: item.category,
                    price: item.price,
                    sold: item.sold,
                    quantity: item.quantity,
                };
            });
            //console.log('>>>Check book', book);
            const worksheet = XLSX.utils.json_to_sheet(book);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
            XLSX.writeFile(workbook, 'exportUser.csv');
        }
    };

    const renderHeader = () => {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Table list Books</span>
                    <span style={{ display: 'flex', gap: 15 }}>
                        <Button onClick={handelExportUser} icon={<FaFileExport />} type="primary">
                            &nbsp; Export
                        </Button>

                        <Button icon={<FaPlus />} type="primary" onClick={handleCreate}>
                            &nbsp;Thêm mới
                        </Button>

                        <Button type="ghost">
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
                <div className="container-sort">
                    <Form form={form} name="basic" labelCol={{ span: 24 }} onFinish={onFinish} autoComplete="off">
                        <div className="input-sort">
                            <Form.Item className="sort-item" label="Tên sách" name="mainText">
                                <Input />
                            </Form.Item>

                            <Form.Item className="sort-item" label="Tác giả" name="author">
                                <Input />
                            </Form.Item>

                            <Form.Item className="sort-item" label="Thể loại" name="category">
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="btn-sort">
                            <Form.Item
                                className="btn-item"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Search
                                </Button>
                            </Form.Item>

                            <Form.Item
                                className="btn-item"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="" style={{ background: 'red' }}>
                                    Clear
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>

                <div>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        dataSource={listBook}
                        columns={columns}
                        onChange={onChange}
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
            </div>
            <BookViewDetail dataBookDetail={dataBookDetail} setDataBookDetail={setDataBookDetail} />

            <BookCreate fetchBook={fetchBook} />
            <BookUpdate fetchBook={fetchBook} dataUpdate={dataUpdate} />
        </>
    );
};

export default Book;
