import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Upload, Col, Row, Button, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callUpdateAvatar, callUpdateInfo } from '../../services/api';
import { doUpdateUserInfoActio, doUploadAvatarAction } from '../../redux/account/accountSlice';

const UserInfo = (props) => {
    const { setModalAccount } = props;

    const user = useSelector((state) => state.account.user);
    console.log(user);
    const tempAvatar = useSelector((state) => state.account.tempAvatar);

    const dispatch = useDispatch();

    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? '');
    const [isSubmit, setIsSubmit] = useState(false);

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${tempAvatar || user?.avatar}`;

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await callUpdateAvatar(file);
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            dispatch(doUploadAvatarAction({ avatar: newAvatar }));
            setUserAvatar(newAvatar);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi upload File');
        }
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success('Upload file thành công');
            } else if (info.file.status === 'error') {
                message.error('Upload file thất bại');
            }
        },
    };

    const onFinish = async (values) => {
        const _id = user.id;
        console.log('id', _id);
        const { fullName, phone } = values;
        console.log('value', values);
        setIsSubmit(true);

        const res = await callUpdateInfo(_id, phone, fullName, userAvatar);

        if (res && res.data) {
            //update redux
            dispatch(doUpdateUserInfoActio({ avatar: userAvatar, phone, fullName }));
            message.success('Cập nhật thông tin User thành công');
            //force renew token
            localStorage.removeItem('access_token');
            setModalAccount(false);
        } else {
            notification.error({
                message: 'Đã sảy ra lỗi',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div style={{ minHeight: 400 }}>
                <Row>
                    <Col sm={24} md={12}>
                        <Row gutter={[30, 30]}>
                            <Col span={24}>
                                <Space direction="vertical" size={16}>
                                    <Space wrap size={16}>
                                        <Avatar
                                            src={urlAvatar}
                                            size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                            icon={<UserOutlined />}
                                        />
                                    </Space>
                                </Space>
                            </Col>
                            <Col span={24}>
                                <Upload {...propsUpload}>
                                    <Button style={{ width: '160px' }} icon={<UploadOutlined />}>
                                        Upload Avatar
                                    </Button>
                                </Upload>
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={24} md={12}>
                        <div style={{ width: '100%' }}>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                style={{
                                    maxWidth: 600,
                                    width: '100%',
                                }}
                                initialValues={{
                                    email: user.email, // Đặt giá trị ban đầu của email từ user
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    style={{ width: '100%' }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập EmailEmail!',
                                        },
                                    ]}
                                >
                                    <Input style={{ width: '100%' }} disabled />
                                </Form.Item>

                                <Form.Item
                                    style={{ width: '100%' }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    label="Tên hiển thị"
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên hiển thị!',
                                        },
                                    ]}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    style={{ width: '100%' }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại!',
                                        },
                                    ]}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 0,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        {isSubmit ? 'Đang cập nhật...' : 'Cập nhật'}
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

export default UserInfo;
