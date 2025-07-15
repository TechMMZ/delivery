import { useState } from "react";
import { createChat } from "../services/ChatbotApi";

export default function useCreateChat() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateChat = async (user) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createChat(user);
            return data;
        } catch (err) {
            setError("No se pudo crear el chat.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateChat, loading, error };
}