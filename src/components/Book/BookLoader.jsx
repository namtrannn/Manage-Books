import { Col, Row, Skeleton } from 'antd';
import SkeletonButton from 'antd/es/skeleton/Button';

const BookLoader = () => {
    return (
        <>
            <div>
                <Row gutter={[20, 20]}>
                    <Col md={10} sm={0} xs={0}>
                        <Skeleton.Input active={true} block={true} style={{ width: '100%', height: '350px' }} />
                        <div
                            style={{
                                display: 'flex',
                                gap: 20,
                                marginTop: '20px',
                                overflow: 'hidden',
                                justifyContent: 'center',
                            }}
                        >
                            <Skeleton.Image active={true} />
                            <Skeleton.Image active={true} />
                            <Skeleton.Image active={true} />
                        </div>
                    </Col>
                    <Col md={14} sm={24}>
                        <Skeleton paragraph={{ row: 3 }} active={true} />
                        <br />
                        <br />
                        <Skeleton paragraph={{ row: 2 }} active={true} />
                        <br />
                        <br />
                        <div style={{ display: 'flex', gap: 20, marginTop: '20px', overflow: 'hidden' }}>
                            <Skeleton.Button active={true} style={{ width: '100%', padding: '0 50px' }} />
                            <Skeleton.Button active={true} style={{ width: '100%', padding: '0 50px' }} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BookLoader;
