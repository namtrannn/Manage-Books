import { useLocation } from 'react-router-dom';
import ViewDetail from '../../components/Book/ViewDetail';
import { callGetBookById } from '../../services/api';
import { useEffect, useState } from 'react';
import { original } from '@reduxjs/toolkit';

const BookPage = () => {
    const [dataBook, setDataBook] = useState([]);
    let location = useLocation();

    let param = new URLSearchParams(location.search);
    const id = param?.get('id'); //book id

    // console.log('book id', id);
    // console.log('check databook', dataBook);

    useEffect(() => {
        fetchBook(id);
    }, [id]);

    const fetchBook = async (id) => {
        const res = await callGetBookById(id);
        if (res && res.data) {
            console.log('check res', res.data);
            let raw = res.data;
            raw.items = getImages(raw);

            setTimeout(() => {
                setDataBook(raw);
            }, 500);
        }
    };

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
                originalClass: 'original-image',
                thumbnailClass: 'thumbnail-image',
            });
        }
        if (raw.slider) {
            raw.slider?.map((item) => {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image',
                });
            });
        }
        return images;
    };

    return (
        <>
            <ViewDetail dataBook={dataBook} />
        </>
    );
};

export default BookPage;
