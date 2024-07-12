import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Col,
    Row,
    Upload,
    Select,
    notification,
    message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalCreateBook } from '../../../redux/modalBookAdmin/modalBookAdminSlice';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    callCreateBook,
    callFetchCategory,
    callUploadBookImg,
} from '../../../services/api';

const BookCreate = (props) => {
    const { fetchBook } = props;
    const [form] = Form.useForm();
    const isModalCreate = useSelector((state) => state.bookAdmin.isModalCreate);

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState();
    const [previewTitle, setPreviewTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const fetchCategory = async () => {
        const res = await callFetchCategory();
        if (res && res.data) {
            const q = res.data.map((item) => {
                return { value: item, label: item };
            });
            setListCategory(q);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleCancel = () => {
        dispatch(closeModalCreateBook());
        setDataSlider([]);
        setDataThumbnail([]);
        form.resetFields();
    };

    const onFinish = async (values) => {
        // console.log('Success:', values);
        // console.log('dataThumbnial', dataThumbnail);
        // console.log('dataSlider', dataSlider);

        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh Thumbnail !',
            });
            return;
        }

        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh Slider !',
            });
            return;
        }

        const { author, category, mainText, price, quantity, sold } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);

        setIsLoading(true);
        const res = await callCreateBook(
            thumbnail,
            slider,
            mainText,
            author,
            price,
            sold,
            quantity,
            category,
        );
        setIsLoading(false);

        if (res && res.data) {
            message.success('Tạo mới sách thành công :)');
            setDataSlider([]);
            setDataThumbnail([]);
            form.resetFields();
            dispatch(closeModalCreateBook());
            await fetchBook();
        } else {
            notification.error({
                message: 'Thêm mới không thành công !',
                description: 'Vui lòng kiểm tra lại',
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            console.log('>>>check res', res.data);
            setDataThumbnail([
                {
                    name: res.data.fileUploaded,
                    uid: file.uid,
                },
            ]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi sảy ra !');
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataSlider((dataSlider) => [
                ...dataSlider,
                {
                    name: res.data.fileUploaded,
                    uid: file.uid,
                },
            ]);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi sảy ra !');
        }
    };

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
            );
        });
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    };

    return (
        <>
            <Modal
                title="Thêm mới sách"
                width={'50vw'}
                open={isModalCreate}
                okText="Tạo mới"
                cancelText="Hủy"
                onOk={() => {
                    form.submit(); // tạo liên kết modal với form
                }}
                onCancel={handleCancel}
                confirmLoading={isLoading}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sách !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên tác giả !',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={15}>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                width="100%"
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá tiền !',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    addonAfter="VND"
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn thể loại !',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch={true}
                                    allowClear={true}
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng !',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Vui lòng nhập số lượng đã bán !',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    onRemove={(file) =>
                                        handleRemoveFile(file, 'thumbnail')
                                    }
                                >
                                    <div>
                                        {loading ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    multiple //Thuộc tính này cho phép tải lên nhiều tệp cùng một lúc.
                                    name="slider"
                                    listType="picture-card" //Xác định kiểu hiển thị của danh sách các tệp đã tải lên. Có các giá trị như text, picture, và picture-card.
                                    className="avatar-uploader"
                                    customRequest={handleUploadFileSlider} //Hàm tùy chỉnh để xử lý yêu cầu tải lên
                                    beforeUpload={beforeUpload} //Hàm kiểm tra trước khi tải lên. Bạn có thể sử dụng hàm này để xác thực tệp trước khi tải lên (ví dụ: kiểm tra định dạng hoặc kích thước tệp)
                                    onChange={(info) =>
                                        handleChange(info, 'slider')
                                    } //Hàm callback được gọi khi trạng thái tải lên thay đổi, ví dụ: bắt đầu tải lên, tải lên thành công, hoặc thất bại
                                    onPreview={handlePreview} // Hàm callback được gọi khi người dùng nhấp vào xem trước tệp đã tải lên
                                    onRemove={(file) =>
                                        handleRemoveFile(file, 'slider')
                                    } //Hàm callback được gọi khi người dùng xóa tệp đã tải lên
                                >
                                    <div>
                                        {loadingSlider ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                ></img>
            </Modal>
        </>
    );
};

export default BookCreate;
