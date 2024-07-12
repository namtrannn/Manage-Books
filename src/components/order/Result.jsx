import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const OrderResult = () => {
    const navigate = useNavigate();

    const handleDetailProduct = () => {
        navigate('/history');
    };

    return (
        <>
            <div style={{ width: '100%', height: '100%' }}>
                <Result
                    icon={<SmileOutlined />}
                    title="Đơn hàng đã được đặt hàng thành công!"
                    extra={
                        <Button onClick={handleDetailProduct} type="primary">
                            Xem lịch sử
                        </Button>
                    }
                />
            </div>
        </>
    );
};

export default OrderResult;
