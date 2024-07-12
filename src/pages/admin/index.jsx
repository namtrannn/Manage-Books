import { useEffect, useState } from 'react';
import { callDashboard } from '../../services/api';
import { Card, Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';
const AdminPage = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
    });

    useEffect(() => {
        const initDashboard = async () => {
            const res = await callDashboard();
            if (res && res.data) setDataDashboard(res.data);
        };

        initDashboard();
    }, []);

    const formatter = (value) => <CountUp end={value} separator="," />;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={10}>
                        <Card
                            title=""
                            bordered={false}
                            style={{
                                minWidth: 300,
                            }}
                        >
                            <Statistic title="Tổng User" value={dataDashboard.countUser} formatter={formatter} />
                        </Card>
                    </Col>

                    <Col xs={24} md={10}>
                        <Card
                            title=""
                            bordered={false}
                            style={{
                                minWidth: 300,
                            }}
                        >
                            <Statistic title="Tổng đơn hàng" value={dataDashboard.countOrder} formatter={formatter} />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default AdminPage;
