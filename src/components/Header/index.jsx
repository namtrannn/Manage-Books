import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Popover } from 'antd';
import { useNavigate } from 'react-router';
import { callHistory, callLogout } from '../../services/api';
import './header.scss';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';
import ManageAccount from '../UpdateUser/ManageAccount';

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const user = useSelector((state) => state.account.user);
    const currentProduct = useSelector((state) => state.order.quantityProduct);
    const [modalAccount, setModalAccount] = useState(false);

    const dataCarts = useSelector((state) => state.order.carts);

    console.log('dataCarts', dataCarts);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        console.log('>>>check logout', res);
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };

    const handleHistory = async () => {
        navigate('/history');
    };

    let items = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => setModalAccount(true)}>
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleHistory()}>
                    Lịch sử mua hàng
                </label>
            ),
            key: 'history',
        },
    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        });
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const handleToCart = () => {
        navigate('order');
    };

    const contentPopover = () => {
        return (
            <>
                <Divider />
                {dataCarts ? (
                    dataCarts.map((item, index) => {
                        return (
                            <>
                                <div className="container-carts">
                                    <div className="book">
                                        <div>
                                            <img
                                                className="img-book"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                                            />
                                        </div>

                                        <div
                                            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                        >
                                            <div>
                                                <span className="book-header">{item.detail.mainText}</span>
                                            </div>
                                            <div className="price">
                                                <span>
                                                    {' '}
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(item.detail.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })
                ) : (
                    <></>
                )}
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>Tổng số sản phẩm : {dataCarts.length}</span>
                    <button
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: '#ee4d2d',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            color: '#fff',
                        }}
                        onClick={handleToCart}
                    >
                        Xem giỏ hàng
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div
                            className="page-header__toggle"
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>

                        <div className="page-header__logo">
                            <span className="logo">
                                <FaReact className="rotate icon-react" /> Book management
                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input className="input-search" type={'text'} placeholder="Bạn tìm gì hôm nay" />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    rootClassName="popover-carts"
                                    title={'Sản phẩm mới thêm'}
                                    content={contentPopover}
                                    arrow={true}
                                    placement="bottomRight"
                                    overlayStyle={{ minWidth: '500px' }} //Thêm tùy chìnhĐặt chiều rộng nhỏ nhất
                                >
                                    <Badge count={currentProduct} size={'small'} showZero>
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar} />
                                                {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer title="Menu chức năng" placement="left" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <q>Quản lý tài khoản</q>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>

            <ManageAccount modalAccount={modalAccount} setModalAccount={setModalAccount} />
        </>
    );
};

export default Header;
