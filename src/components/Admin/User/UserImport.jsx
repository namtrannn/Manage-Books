import React, { useState } from 'react';
import { Table, Modal, Divider, Upload, message, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalImportUser } from '../../../redux/modalUserAdmin/modalUserAdminSlice';
import * as XLSX from 'xlsx';
import { callBulkCreateUser } from '../../../services/api';
import TemplateFile from './import.xlsx?url';

const UserImport = (props) => {
    const { Dragger } = Upload;

    const [dataExcel, setDataExcel] = useState([]);

    const isModalImport = useSelector((state) => state.userAdmin.isModalImport);
    const dispatch = useDispatch();

    const dummyResque = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        customRequest: dummyResque,

        onChange(info) {
            console.log('>>>check info:', info);
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info?.fileList && info?.fileList?.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1, // skips header row
                        });

                        if (json && json.length > 0) setDataExcel(json);
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleOk = async () => {
        const data = dataExcel.map((item) => {
            item.password = '123456';
            return item;
        });
        const res = await callBulkCreateUser(data);
        console.log('>>>check res', res.data);
        if (res?.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess} , Error: ${res.data.countError}`,
                message: 'Up load thành công',
            });
            dispatch(closeModalImportUser());
            setDataExcel([]);
            props.fetchUser();
        } else {
            notification.error({
                description: res.message,
                message: 'Đã có lỗi xảy ra',
            });
        }
    };

    const handleCancel = () => {
        dispatch(closeModalImportUser());
        setDataExcel([]);
    };

    const columns = [
        { title: 'Tên hiển thị', dataIndex: 'fullName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone' },
    ];

    return (
        <>
            <Modal
                width={'50vw'}
                title="Import data User"
                open={isModalImport}
                onOk={handleOk}
                okText="Import data"
                onCancel={handleCancel}
                okButtonProps={{
                    disabled: dataExcel.length < 1 ? true : false,
                }}
                //maskClosable={false} click ra ben ngoai modal khong dong
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Only accept .csv, .xls, .xlsx &nbsp;
                        <a onClick={(e) => e.stopPropagation()} href={TemplateFile}>
                            Dowload Template file xample
                        </a>
                    </p>
                </Dragger>

                <Divider />
                <div>
                    <Table title={() => <span>Dữ liệu upload:</span>} columns={columns} dataSource={dataExcel} />
                </div>
            </Modal>
        </>
    );
};

export default UserImport;
