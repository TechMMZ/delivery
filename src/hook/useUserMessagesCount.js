import { useState, useCallback } from "react";
import { getUserMessagesCount } from "../services/ChatbotApi";

export default function useUserMessagesCount(chatId) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCount = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserMessagesCount(chatId);
            setCount(data.count || 0);
        } catch (err) {
            setError("No se pudo obtener el conteo.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    return { count, loading, error, loadCount };
}