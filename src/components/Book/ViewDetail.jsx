import React, { useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import './Book.scss';
import { Row, Col, Rate, Divider, message } from 'antd';
import { BsCart4 } from 'react-icons/bs';
import ModalDetail from './ModalDetail';
import BookLoader from './BookLoader';
import { useDispatch, useSelector } from 'react-redux';
import { doAddBookActions } from '../../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';

const ViewDetail = (props) => {
    const { dataBook } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const refGallery = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [count, setCount] = useState(1);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    console.log('databook', dataBook);
    const images = dataBook?.items ?? [];

    const handleOnClickImage = () => {
        setIsModalOpen(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    };

    const handleIncrease = () => {
        if (count < dataBook.quantity) setCount(count + 1);
    };

    const handleDecrease = () => {
        if (count < 1) return;
        setCount(count - 1);
    };

    const handleInput = (value) => {
        // console.log('check value', value);
        // console.log('check databook', dataBook.quantity);
        if (typeof value === 'number' && value <= dataBook.quantity) setCount(value);
    };

    const hanldeBuy = (quantity, dataBook) => {
        dispatch(doAddBookActions({ quantity, detail: dataBook }));
        navigate('/order');
    };

    const handleAddToCart = (quantity, dataBook) => {
        //console.log('count', quantity, dataBook);
        dispatch(doAddBookActions({ quantity, detail: dataBook }));
        message.success('Thêm sản phẩm đã được thêm vào giỏ hàng');
    };

    return (
        <>
            <div style={{ background: '#efefef', padding: '20px 0' }}>
                <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    {dataBook && dataBook._id ? (
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick={handleOnClickImage}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        items={images}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        renderLeftNav={() => <></>}
                                        renderRightNav={() => <></>}
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className="author">
                                        Tác giả: <p style={{ color: 'blue', marginLeft: '10px' }}>{dataBook.author}</p>
                                    </div>
                                    <div className="title">{dataBook.mainText}</div>
                                    <div className="rating">
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <Divider type="vertical" />
                                        <span className="sold">Đã bán {dataBook.sold}</span>
                                    </div>
                                    <div className="price">
                                        <span>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(dataBook?.price ?? 0)}
                                        </span>
                                    </div>
                                    <div className="delivery">
                                        <div>
                                            <span style={{ color: '#757575', marginRight: '10px', fontSize: '16px' }}>
                                                Vận chuyển
                                            </span>
                                            <span style={{ color: '#000', fontSize: '16px' }}>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className="quantity">
                                        <div className="list-btn">
                                            <span>Số lượng</span>

                                            <span style={{ display: 'flex', margin: '0 34px' }}>
                                                <button className="btn" onClick={handleDecrease}>
                                                    -
                                                </button>
                                                <input
                                                    className="input-btn"
                                                    style={{ textAlign: 'center', width: '60px' }}
                                                    value={count}
                                                    onChange={(e) => handleInput(+e.target.value)}
                                                />
                                                <button className="btn" onClick={handleIncrease}>
                                                    +
                                                </button>
                                            </span>

                                            <span style={{ marginRight: '40px', color: '#757575' }}>
                                                {dataBook.quantity}
                                                <span style={{ marginLeft: '10px' }}>sản phẩm có sẵn</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <button
                                            className="btn-add-cart"
                                            onClick={() => handleAddToCart(count, dataBook)}
                                        >
                                            <span style={{ marginRight: '16px', fontSize: '24px' }}>
                                                <BsCart4 />
                                            </span>
                                            <span style={{ fontSize: '14px' }}>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button className="btn-buy" onClick={() => hanldeBuy(count, dataBook)}>
                                            Mua ngay
                                        </button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    ) : (
                        <BookLoader />
                    )}
                </div>
            </div>

            <ModalDetail
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                images={images}
                currentIndex={currentIndex}
                title="How Psychology Works - Hiểu Hết Về Tâm Lý Học"
            />
        </>
    );
};

export default ViewDetail;
