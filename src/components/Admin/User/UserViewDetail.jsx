import React, { useState } from 'react';
import { Drawer, Descriptions, Badge } from 'antd';
import moment from 'moment/moment';

const UserViewDetail = (props) => {
    const { openViewDetailUser, setOpenViewDetailUser, dataUserDetail } = props;

    const onClose = () => {
        setOpenViewDetailUser(false);
    };

    return (
        <>
            <Drawer onClose={onClose} open={openViewDetailUser} width={'50vw'}>
                <Descriptions title="Thông tin User" bordered column={2}>
                    <Descriptions.Item label="ID">
                        {dataUserDetail?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">
                        {dataUserDetail?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {dataUserDetail?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        {dataUserDetail?.phone}
                    </Descriptions.Item>

                    <Descriptions.Item label="Rule" span={2}>
                        <Badge
                            status="processing"
                            text={dataUserDetail?.role}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="createdAt">
                        {moment(dataUserDetail?.createdAt).format(
                            'DD-MM-YYYY HH:mm:ss',
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="updatedAt">
                        {moment(dataUserDetail?.updatedAt).format(
                            'DD-MM-YYYY HH:mm:ss',
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserViewDetail;
