import React from 'react';
import { Button, Checkbox, Col, Form, Input, Row, message, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { callChangePassword } from '../../services/api';

const ChangePassword = (props) => {
    const { setModalAccount } = props;
    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const user = useSelector((state) => state.account.user);
    console.log('user', user);

    const onFinish = async (values) => {
        const email = user.email;
        const { oldPass, newPass } = values;

        const res = await callChangePassword(email, oldPass, newPass);

        if (res && res.data) {
            console.log('check res', res.data);
            message.success('Cập nhật mật khẩu thành công');
            setModalAccount(false);
            form.resetFields();
        } else {
            notification.error({
                message: 'Đã xảy ra lỗi',
            });
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <Row gutter={[30, 30]}>
                <Col xs={24} md={12}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            email: user.email,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item label="Email" name="email">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="oldPass"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Nhập mật khẩu mới"
                            name="newPass"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu mới!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 0,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ChangePassword;
