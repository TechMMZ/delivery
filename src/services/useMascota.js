import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function useMascota() {
    const [mascota, setMascota] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMascota() {
            try {
                const response = await axios.get(`${API_URL}/api/mascota`);
                setMascota(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al obtener productos de mascota:', error);
                setError('No se pudieron cargar los productos de mascota.');
            } finally {
                setLoading(false);
            }
        }
        fetchMascota();
    }, []);

    return { mascota, loading, error };
}
