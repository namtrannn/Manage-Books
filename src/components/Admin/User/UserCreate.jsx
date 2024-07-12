import React, { useState } from 'react';
import { Divider, Modal, Input, Form, message, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalUserCreate } from '../../../redux/modalUserAdmin/modalUserAdminSlice';
import { callCreateUser } from '../../../services/api';

const UserCreate = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const isModalOpen = useSelector((state) => state.userAdmin.isModalOpen);
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = () => {
        dispatch(closeModalUserCreate());
    };

    const onFinish = async (values) => {
        const { fullName, password, email, phone } = values;

        setIsLoading(true);
        const res = await callCreateUser(fullName, password, email, phone);

        if (res && res?.data) {
            message.success('Tạo mới User thành công :>>');
            form.resetFields();
            dispatch(closeModalUserCreate());
            await props.fetchUser();
        } else {
            notification.error({
                message: 'Đã xảy ra lỗi !',
                description: res.message,
            });
        }
        setIsLoading(false);
    };
    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={isModalOpen}
                onOk={() => {
                    form.submit();
                }} // liên kết modal với form
                okText="Tạo mới"
                onCancel={handleCancel}
                cancelText="Hủy"
                confirmLoading={isLoading}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    //onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserCreate;
