import { Modal, Tabs } from 'antd';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';
import { useState } from 'react';

const ManageAccount = (props) => {
    const { modalAccount, setModalAccount } = props;

    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children: <UserInfo setModalAccount={setModalAccount} />,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <ChangePassword setModalAccount={setModalAccount} />,
        },
    ];

    return (
        <>
            <div>
                <Modal
                    title="Quản lý tài khoản"
                    open={modalAccount}
                    onCancel={() => setModalAccount(false)}
                    width={'60vw'}
                    footer={null}
                    maskClosable={true}
                >
                    <div>
                        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default ManageAccount;
