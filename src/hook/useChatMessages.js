import { useState, useCallback } from "react";
import { getChat } from "../services/ChatbotApi";

export default function useChatMessages(chatId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMessages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getChat(chatId);
            setMessages(data.messages || []);
        } catch (err) {
            setError("No se pudieron cargar los mensajes.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    return { messages, loading, error, loadMessages };
}