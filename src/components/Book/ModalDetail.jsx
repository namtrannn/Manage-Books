import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Image } from 'antd';
import ImageGallery from 'react-image-gallery';
import './Book.scss';

const ModalDetail = (props) => {
    const { isModalOpen, setIsModalOpen, images, currentIndex, title } = props;
    const [activeIndex, setActiveIndex] = useState(currentIndex);
    const galleryRef = useRef();

    useEffect(() => {
        if (isModalOpen) {
            setActiveIndex(currentIndex);
            galleryRef.current.slideToIndex(currentIndex);
        }
    }, [isModalOpen, currentIndex]);

    const handleOk = () => {};

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleThumbnailClick = (index) => {
        setActiveIndex(index);
        galleryRef.current.slideToIndex(index);
    };

    return (
        <>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={'50vw'}>
                <div className="view-detail-book">
                    <Row gutter={[20, 20]}>
                        <Col span={16}>
                            <ImageGallery
                                ref={galleryRef}
                                items={images}
                                showFullscreenButton={false}
                                showPlayButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                showThumbnails={false}
                                startIndex={activeIndex}
                            />
                        </Col>
                        <Col span={8}>
                            <div>{title}</div>
                            <div>
                                <Row gutter={[20, 20]}>
                                    {images?.map((item, index) => (
                                        <Col key={`images-${index}`} style={{ cursor: 'pointer' }}>
                                            <Image
                                                wrapperClassName={'img-normal'}
                                                width={100}
                                                height={100}
                                                src={item.original}
                                                preview={false}
                                                onClick={() => handleThumbnailClick(index)}
                                            />
                                            <div className={activeIndex === index ? 'active' : ''}></div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};

export default ModalDetail;
