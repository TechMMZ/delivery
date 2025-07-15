import { useState, useCallback } from "react";
import { getChatHistory } from "../services/ChatbotApi";

export default function useChatHistory(userId) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getChatHistory(userId);
            setHistory(data);
        } catch (err) {
            setError("No se pudo cargar el historial.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    return { history, loading, error, loadHistory };
}