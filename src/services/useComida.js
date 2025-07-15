import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function useComida() {
    const [comida, setComida] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchComida() {
            try {
                const response = await axios.get(`${API_URL}/api/comida`);
                setComida(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al obtener productos de comida:', error);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        }
        fetchComida();
    }, []);

    return { comida, loading, error };
}
