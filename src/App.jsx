import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BookPage from './pages/book';
import ContactPage from './pages/contact';
import LoginPage from './pages/login';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import User from './components/Admin/User/User';
import './styles/reset.scss';
import './styles/global.scss';
import Book from './components/Admin/Book/Book';
import OrderPage from './pages/order';
import HistoryPage from './pages/history';
import ManageOrder from './components/Admin/ManageOrder/ManageOrder';

const Layout = () => {
    return (
        <div className="layout-container">
            <Header />
            <div className="content-container">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.account.isLoading);

    const getAccount = async () => {
        if (window.location.pathname === '/login' || window.location.pathname === '/register') return;

        const res = await callFetchAccount();

        if (res && res.data) {
            dispatch(doGetAccountAction(res.data));
        }
    };

    useEffect(() => {
        getAccount();
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: 'contact',
                    element: <ContactPage />,
                },
                {
                    path: 'book/:slug',
                    element: <BookPage />,
                },

                {
                    path: 'order',
                    element: <OrderPage />,
                },
                {
                    path: 'history',
                    element: <HistoryPage />,
                },
            ],
        },

        {
            path: '/admin',
            element: <LayoutAdmin />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'user',
                    element: <User />,
                },
                {
                    path: 'book',
                    element: <Book />,
                },
                {
                    path: '/admin/order',
                    element: <ManageOrder />,
                },
            ],
        },

        {
            path: '/login',
            element: <LoginPage />,
        },

        {
            path: '/register',
            element: <RegisterPage />,
        },
    ]);

    return (
        <>
            {isLoading === false ||
            window.location.pathname === '/login' ||
            window.location.pathname === '/register' ||
            window.location.pathname === '/' ? (
                <RouterProvider router={router} />
            ) : (
                <Loading />
            )}
        </>
    );
}
