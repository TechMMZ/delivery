import { useState } from "react";
import { addMessage } from "../services/ChatbotApi";

export default function useAddMessage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddMessage = async (chatId, sender, text) => {
        setLoading(true);
        setError(null);
        try {
            await addMessage(chatId, sender, text);
        } catch (err) {
            setError("No se pudo enviar el mensaje.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleAddMessage, loading, error };
}