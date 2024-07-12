import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Row, Rate, Tabs, Pagination, Spin } from 'antd';
import { IoMdRefresh } from 'react-icons/io';
import './index.scss';
import { useEffect, useState } from 'react';
import { callFetchCategory, callFetchListBook } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [sorterQuery, serSortQuery] = useState('sort=-sold');
    const [filter, setFilter] = useState('');
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [total, setTotal] = useState();
    const [dataCategory, setDataCategory] = useState([]);
    const [dataBook, setDataBook] = useState([]);
    const [isLoading, setIsLoading] = useState(null);

    const fetchListCategory = async () => {
        const res = await callFetchCategory();
        if (res && res.data) {
            const d = res.data.map((item) => {
                return { lable: item, value: item };
            });
            setDataCategory(d);
        }
    };

    const fetchListBook = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;

        if (sorterQuery) {
            query += `&${sorterQuery}`;
        }

        if (filter) {
            query += `&${filter}`;
        }
        console.log('>>>check query', query);

        setIsLoading(true);
        const res = await callFetchListBook(query);
        if (res && res.data) {
            setDataBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchListCategory();
        fetchListBook();
    }, [current, pageSize, sorterQuery, filter]);

    const handelPagination = (page, pageSize) => {
        if (page) {
            setCurrent(page);
        }

        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    const items = [
        {
            key: 'sort=-sold',
            label: 'Phổ biến',
            children: <></>,
        },
        {
            key: 'sort=updatedAt',
            label: 'Hàng mới',
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: 'Giá cao đến thấp',
            children: <></>,
        },
        {
            key: 'sort=price',
            label: 'Giá thấp đến cao',
            children: <></>,
        },
    ];

    const onFinish = (values) => {
        console.log('>>>check values', values);

        let f = '';

        if (values?.range?.from > 0 && values?.range?.to > 0) {
            f = `price>=${values.range.from}&price<=${values.range.to}`;
        }

        if (values?.category && values.category.length > 0) {
            const cate = values.category.join(',');
            if (f) {
                f += `&category=${cate}`;
            } else {
                f = `category=${cate}`;
            }
        }
        console.log('f', f);

        setFilter(f);
    };

    const handelChangeFilter = (changeValues, values) => {
        console.log('>>>Check changeValues,  value', changeValues, values);

        if (changeValues.category) {
            const cate = values.category;

            if (cate.length > 0) {
                const q = cate.join(',');
                console.log('>>>check cate', q);
                setFilter(`category=${q}`);
            } else {
                setFilter('');
            }
        }
    };

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/Đ/g, 'D');
        str = str.replace(/đ/g, 'd');
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
        //str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
        return str;
    };

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from =
            'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
        const to =
            'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str
            .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    };

    const handleRederectBook = (book) => {
        console.log('check item', book);
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`);
    };

    return (
        <>
            <div className="homepage-container">
                <Row gutter={[10, 20]}>
                    <Col className="custom-col" md={4} sm={0} xs={0}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '3px', padding: '10px 10px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Bộ lọc tìm kiếm</span>
                                <IoMdRefresh
                                    title="reset"
                                    style={{ cursor: 'pointer', fontSize: '15px' }}
                                    onClick={() => {
                                        form.resetFields();
                                        setFilter('');
                                        //fetchListBook();
                                    }}
                                />
                            </div>
                            <Divider />
                            <Form
                                form={form}
                                onValuesChange={(changeValues, values) => handelChangeFilter(changeValues, values)}
                                onFinish={onFinish}
                            >
                                <Form.Item name="category" label="Danh mục sản phẩm" labelCol={{ span: 24 }}>
                                    <Checkbox.Group>
                                        <Row>
                                            {dataCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{ padding: '10px 0' }}>
                                                        <Checkbox value={item.value}>{item.lable}</Checkbox>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <Form.Item name={['range', 'from']}>
                                            <InputNumber
                                                name="from"
                                                min={0}
                                                placeholder="đ Từ"
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            />
                                        </Form.Item>
                                        <span>-</span>
                                        <Form.Item name={['range', 'to']}>
                                            <InputNumber
                                                name="to"
                                                min={0}
                                                placeholder="đ Đến"
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div>
                                        <Button
                                            style={{ background: 'blue', width: '100%', color: '#fff' }}
                                            htmlType="sunmit" // mặc định khi click vào btn này hàm onFinish sẽ được chạy
                                            on
                                        >
                                            Áp dụng
                                        </Button>
                                    </div>
                                </Form.Item>
                                <Divider />
                                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                                    <div>
                                        <Rate
                                            value={5}
                                            disabled
                                            style={{
                                                color: '#ffce3d',
                                                fontSize: '15px',
                                                marginRight: '15px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <span className="rade-text">Trở lên </span>
                                    </div>
                                    <div>
                                        <Rate
                                            value={4}
                                            disabled
                                            style={{
                                                color: '#ffce3d',
                                                fontSize: '15px',
                                                marginRight: '15px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <span className="rade-text">Trở lên </span>
                                    </div>
                                    <div>
                                        <Rate
                                            value={3}
                                            disabled
                                            style={{
                                                color: '#ffce3d',
                                                fontSize: '15px',
                                                marginRight: '15px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <span className="rade-text">Trở lên </span>
                                    </div>
                                    <div>
                                        <Rate
                                            value={2}
                                            disabled
                                            style={{
                                                color: '#ffce3d',
                                                fontSize: '15px',
                                                marginRight: '15px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <span className="rade-text">Trở lên </span>
                                    </div>
                                    <div>
                                        <Rate
                                            value={1}
                                            disabled
                                            style={{
                                                color: '#ffce3d',
                                                fontSize: '15px',
                                                marginRight: '15px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <span className="rade-text">Trở lên </span>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col className="custom-col" md={20} sm={24} xs={24}>
                        <Spin spinning={isLoading} tip="Loading...">
                            <div style={{ backgroundColor: '#fff', borderRadius: '3px', padding: '10px 10px 0' }}>
                                <Row>
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={items}
                                        onChange={(value) => serSortQuery(value)}
                                    />
                                </Row>

                                <Row className="customize-row">
                                    {dataBook?.map((item, index) => {
                                        return (
                                            <div
                                                className="column"
                                                key={`book-${index}`}
                                                onClick={() => handleRederectBook(item)}
                                            >
                                                <div className="wrapper">
                                                    <div className="thumbnail">
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                                            alt="thumbnail book"
                                                        />
                                                    </div>
                                                    <div className="text">{item.mainText}</div>
                                                    <div className="price">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(item.price)}
                                                    </div>
                                                    <div className="rating">
                                                        <Rate
                                                            value={5}
                                                            disabled
                                                            style={{ color: '#ffce3d', fontSize: 10 }}
                                                        />
                                                        <span>{item.sold}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Row>
                                <Divider />
                                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        total={total}
                                        current={current}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={handelPagination}
                                        showSizeChanger
                                        showTotal={(total, range) => {
                                            return (
                                                <div>
                                                    {range[0]}-{range[1]} trên {total} rows
                                                </div>
                                            );
                                        }}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Home;
