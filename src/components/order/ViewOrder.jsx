import { Col, Divider, Row, Form, InputNumber, Empty } from 'antd';
import './order.scss';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { doDeleteProduct, doUpdateBookActions } from '../../redux/order/orderSlice.js';
import { useNavigate } from 'react-router-dom';

const ViewOrder = (props) => {
    const { setCurrentSteps } = props;

    const dataCarts = useSelector((state) => state.order.carts);
    const quantityProduct = useSelector((state) => state.order.quantityProduct);
    console.log('carts', dataCarts);

    const dispatch = useDispatch();

    const handleOnchangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateBookActions({ quantity: value, detail: book }));
        }
    };

    const hadleDeleteProduct = (book) => {
        console.log('book', book);
        dispatch(doDeleteProduct(book));
    };

    const getTotal = () => {
        let totalQuantity = 0;
        let totalPrice = 0;
        dataCarts.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.detail.price;
        });
        return { totalPrice, totalQuantity };
    };

    const { totalPrice, totalQuantity } = getTotal();

    const handlePayment = () => {
        setCurrentSteps(1);
    };

    return (
        <>
            <div className="container">
                <Row gutter={[20, 20]}>
                    <Col md={18} sm={24} xs={24}>
                        {dataCarts.length === 0 ? (
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    minHeight: '400px',
                                    borderRadius: '5px',
                                    padding: '20px',
                                    fontSize: '16px',
                                    color: '#000',
                                    fontWeight: '400',
                                }}
                            >
                                <Empty description="Không có sản phẩm nào trong giỏ hàng" />
                            </div>
                        ) : (
                            dataCarts.map((book, index) => {
                                return (
                                    <>
                                        <div style={{ paddingBottom: ' 10px' }}>
                                            <div className="book-item">
                                                <img
                                                    className="book-img"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`}
                                                />

                                                <span className="book-header">{book.detail.mainText}</span>

                                                <span className="book-quantity">
                                                    {' '}
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(book.detail.price)}
                                                </span>

                                                <InputNumber
                                                    value={book.quantity}
                                                    onChange={(value) => handleOnchangeInput(value, book)}
                                                />

                                                <div>
                                                    <span>Tổng :</span>
                                                    <span className="total-price">
                                                        {' '}
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(book.quantity * book.detail.price)}
                                                    </span>
                                                </div>

                                                <button className="book-btn" onClick={() => hadleDeleteProduct(book)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })
                        )}
                    </Col>

                    <Col md={6} sm={24} xs={24}>
                        <div className="total">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tạm số sách :</span>
                                <span style={{ color: 'red', fontSize: '16px' }}>{totalQuantity} quyển </span>
                            </div>
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tổng tiền :</span>
                                <span style={{ color: 'red', fontSize: '16px' }}>
                                    {' '}
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider />

                            <button
                                style={{
                                    padding: '10px',
                                    margin: '15px 0',
                                    backgroundColor: '#ee4d2d',
                                    border: 'none',
                                    borderRadius: '3px',
                                    width: '100%',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontSize: '16px',
                                }}
                                onClick={handlePayment}
                            >
                                Mua hàng ({quantityProduct})
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ViewOrder;
