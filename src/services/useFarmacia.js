import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function useFarmacia() {
    const [farmacia, setFarmacia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFarmacia() {
            try {
                const response = await axios.get(`${API_URL}/api/farmacia`);
                setFarmacia(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al obtener productos de farmacia:', error);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        }
        fetchFarmacia();
    }, []);

    return { farmacia, loading, error };
}
