import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function useArchivedOrders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(() => {
        if (!user) return;
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/orders/user/${user.id}/archived`)
            .then(res => {
                if (!res.ok) throw new Error('No se pudieron cargar tus pedidos archivados.');
                return res.json();
            })
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                setOrders([]);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, reloadOrders: fetchOrders };
}