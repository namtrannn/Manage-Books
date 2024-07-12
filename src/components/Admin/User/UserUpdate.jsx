import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Divider, message, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalUpdateUser } from '../../../redux/modalUserAdmin/modalUserAdminSlice';
import { callUpdateUser } from '../../../services/api';

const UserUpdate = (props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { dataUpdateUser, fetchUser } = props;

    const isModaUpdate = useSelector((state) => state.userAdmin.isModaUpdate);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue(dataUpdateUser);
    }, [dataUpdateUser]);

    const handleCancel = () => {
        dispatch(closeModalUpdateUser());
    };

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;

        setIsLoading(true);
        const res = await callUpdateUser(_id, fullName, phone);
        setIsLoading(false);
        if (res && res?.data) {
            message.success('Cập nhật user thành công !');
            dispatch(closeModalUpdateUser());
            await fetchUser();
        } else {
            notification.error({
                message: 'Đã sảy ra lỗi',
                description: res.message,
            });
        }
    };

    return (
        <>
            <Modal
                title="Update User"
                open={isModaUpdate}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                confirmLoading={isLoading}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    //onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden
                        label="Id"
                        name="_id"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Id!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your fullName!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Phone number!',
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

export default UserUpdate;
