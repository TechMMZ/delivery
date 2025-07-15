import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const useSliderImages = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/slider`);
                setImages(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchImages();
    }, []);

    return images;
};

export default useSliderImages;
