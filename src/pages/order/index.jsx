import { Result, Steps } from 'antd';
import { useState } from 'react';
import ViewOrder from '../../components/order/ViewOrder';
import './index.scss';
import Pay from '../../components/order/Pay';
import OrderResult from '../../components/order/Result';

const OrderPage = () => {
    const [currentSteps, setCurrentSteps] = useState(0);

    console.log('current', currentSteps);

    return (
        <>
            <div style={{ backgroundColor: '#efefef', padding: '20px 0' }}>
                <div className="order-container">
                    <div className="order-steps">
                        <Steps
                            style={{
                                backgroundColor: '#fff',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '40px',
                                padding: '20px',
                            }}
                            current={currentSteps}
                            size="small"
                            status="finish"
                            items={[
                                {
                                    title: 'Đơn hàng',
                                },
                                {
                                    title: 'Đặt hàng',
                                },
                                {
                                    title: 'Thanh toán',
                                },
                            ]}
                        />
                        {currentSteps == 0 && <ViewOrder setCurrentSteps={setCurrentSteps} />}
                        {currentSteps == 1 && <Pay setCurrentSteps={setCurrentSteps} />}
                        {currentSteps == 2 && <OrderResult />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
