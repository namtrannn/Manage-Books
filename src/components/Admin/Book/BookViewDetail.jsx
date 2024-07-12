import React, { useEffect, useState } from 'react';
import { Drawer, Badge, Descriptions, Divider, Image, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalDetailBook } from '../../../redux/modalBookAdmin/modalBookAdminSlice';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';

const BookViewDetail = (props) => {
    const { dataBookDetail, setDataBookDetail } = props;
    const isModalDetail = useSelector((state) => state.bookAdmin.isModalDetail);
    const dispatch = useDispatch();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const onClose = () => {
        dispatch(closeModalDetailBook());
        setDataBookDetail({});
    };

    useEffect(() => {
        if (('data', dataBookDetail)) {
            let imgThumbnail = {},
                imgSlider = [];
            if (dataBookDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataBookDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBookDetail.thumbnail}`,
                };
                console.log(imgThumbnail);
            }
            if (dataBookDetail.slider && dataBookDetail.slider.length > 0) {
                dataBookDetail.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    });
                });
            }
            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [dataBookDetail]);

    //----------------upload --------------------

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const handleCancel = () => {
        setPreviewOpen(false);
    };

    return (
        <>
            <Drawer title="Chức năng xem chi tiết" onClose={onClose} open={isModalDetail} width={'50vw'}>
                <Divider orientation="left">Thông tin chi tiết sách</Divider>
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="ID">{dataBookDetail._id}</Descriptions.Item>

                    <Descriptions.Item label="Tên sách">{dataBookDetail.mainText}</Descriptions.Item>

                    <Descriptions.Item label="Tác giả">{dataBookDetail.author}</Descriptions.Item>

                    <Descriptions.Item label="Giá tiền">{dataBookDetail.price}</Descriptions.Item>

                    <Descriptions.Item label="Số lượng">{dataBookDetail.quantity}</Descriptions.Item>

                    <Descriptions.Item label="Đã bán">{dataBookDetail.sold}</Descriptions.Item>

                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataBookDetail.category} />
                    </Descriptions.Item>

                    <Descriptions.Item label="createdAt">
                        {moment(dataBookDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>

                    <Descriptions.Item label="updatedAt">
                        {moment(dataBookDetail.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Ảnh sách</Divider>

                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{
                        showRemoveIcon: false,
                    }}
                ></Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage}></img>
                </Modal>
            </Drawer>
        </>
    );
};

export default BookViewDetail;
