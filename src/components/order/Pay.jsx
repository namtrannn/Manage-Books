import React from 'react';
import { Col, Row, Form, Empty, Button, Radio, Input, Divider, InputNumber, message, notification } from 'antd';
import './order.scss';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { doDeleteProduct, doPlaceOrderActions, doUpdateBookActions } from '../../redux/order/orderSlice.js';
import { callPlaceOrder } from '../../services/api.js';

const Pay = (props) => {
    const { setCurrentSteps } = props;

    const account = useSelector((state) => state.account.user);
    const carts = useSelector((state) => state.order.carts);

    // console.log('account', account);
    // console.log('carts', carts);

    const totalPrice = () => {
        let totalPrice = 0;
        carts.filter((item) => {
            return (totalPrice = item.quantity * item.detail.price);
        });
        return totalPrice;
    };

    const onFinish = async (values) => {
        //console.log('Success:', values);

        const orderDetail = carts.map((cart) => {
            return {
                bookName: cart.detail.mainText,
                quantity: cart.quantity,
                _id: cart._id,
            };
        });

        const data = {
            name: values.fullName,
            phone: values.phone,
            address: values.address,
            totalPrice: totalPrice(),
            detail: orderDetail,
        };

        console.log('data', data);

        const res = await callPlaceOrder(data);

        if (res && res.data) {
            message.success('Bạn đã đặt hàng thành công');

            dispatch(doPlaceOrderActions());
            setCurrentSteps(2);
        } else {
            notification.error({
                message: 'Có lỗi !',
                description: 'Đặt hàng không thành công',
            });
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const dataCarts = useSelector((state) => state.order.carts);
    const quantityProduct = useSelector((state) => state.order.quantityProduct);
    console.log('carts', dataCarts);

    const dispatch = useDispatch();

    const handleOnchangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateBookActions({ quantity: value, detail: book }));
        }
    };

    const hadleDeleteProduct = (book) => {
        console.log('book', book);
        dispatch(doDeleteProduct(book));
    };

    return (
        <>
            <div className="container">
                <Row gutter={[20, 20]}>
                    <Col md={16} sm={24} xs={24}>
                        {dataCarts.length === 0 ? (
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    minHeight: '400px',
                                    borderRadius: '5px',
                                    padding: '20px',
                                    fontSize: '16px',
                                    color: '#000',
                                    fontWeight: '400',
                                }}
                            >
                                <Empty description="Không có sản phẩm nào trong giỏ hàng" />
                            </div>
                        ) : (
                            dataCarts.map((book, index) => {
                                return (
                                    <>
                                        <div style={{ paddingBottom: ' 10px' }}>
                                            <div className="book-item">
                                                <img
                                                    className="book-img"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`}
                                                />

                                                <span className="book-header">{book.detail.mainText}</span>

                                                <span className="book-quantity">
                                                    {' '}
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(book.detail.price)}
                                                </span>

                                                <InputNumber
                                                    value={book.quantity}
                                                    onChange={(value) => handleOnchangeInput(value, book)}
                                                />

                                                <div>
                                                    <span>Tổng :</span>
                                                    <span className="total-price">
                                                        {' '}
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(book.quantity * book.detail.price)}
                                                    </span>
                                                </div>

                                                <button className="book-btn" onClick={() => hadleDeleteProduct(book)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })
                        )}
                    </Col>

                    <Col md={8} sm={24} xs={24}>
                        <div className="pay-order">
                            <Form
                                style={{ width: '100%' }}
                                name="basic"
                                labelCol={{
                                    span: 24,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                initialValues={{
                                    fullName: account.fullName,
                                    phone: account.phone,
                                }}
                            >
                                <Form.Item
                                    label="Tên người nhận"
                                    name="fullName"
                                    labelCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên người nhận không được để trống !',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    labelCol={{ span: 24 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống !',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ nhận hàng"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Địa chỉ nhận hàng không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input.TextArea style={{ width: '100%' }} autoSize={{ minRows: 3, maxRows: 6 }} />
                                </Form.Item>

                                <Form.Item label="Phương thức thanh toán" name="paymentMethod" labelCol={{ span: 24 }}>
                                    <Radio.Group>
                                        <Radio value="cod" autoFocus>
                                            Thanh toán khi nhận hàng
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Divider />

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Tổng tiền:</span>
                                    <span style={{ color: 'red', fontSize: '18px' }}>
                                        {' '}
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(totalPrice())}
                                    </span>
                                </div>

                                <Divider />

                                <Form.Item
                                    wrapperCol={{
                                        offset: 4,
                                        span: 16,
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            width: '100%',
                                            backgroundColor: 'red',
                                            color: '#fff',
                                            padding: '20px 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        Đặt hàng
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Pay;
