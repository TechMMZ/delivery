import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function useTecnologia() {
    const [tecnologia, setTecnologia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTecnologia() {
            try {
                const response = await axios.get(`${API_URL}/api/tecnologia`);
                setTecnologia(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al obtener productos de tecnología:', error);
                setError('No se pudieron cargar los productos de tecnología.');
            } finally {
                setLoading(false);
            }
        }
        fetchTecnologia();
    }, []);

    return { tecnologia, loading, error };
}
