import { useState } from "react";
import { deleteChat } from "../services/ChatbotApi";

export default function useDeleteChat() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDeleteChat = async (chatId) => {
        setLoading(true);
        setError(null);
        try {
            await deleteChat(chatId);
        } catch (err) {
            setError("No se pudo eliminar el chat.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleDeleteChat, loading, error };
}