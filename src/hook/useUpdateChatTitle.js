import { useState } from "react";
import { updateChatTitle } from "../services/ChatbotApi";

export default function useUpdateChatTitle() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdateTitle = async (chatId, title) => {
        setLoading(true);
        setError(null);
        try {
            await updateChatTitle(chatId, title);
        } catch (err) {
            setError("No se pudo actualizar el título.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdateTitle, loading, error };
}