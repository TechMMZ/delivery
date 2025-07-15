const API_URL = import.meta.env.VITE_API_URL;

export async function createChat(user) {
    try {
        const res = await fetch(`${API_URL}/api/chats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                userEmail: user.email,
                displayName: user.displayName || "Usuario",
                photoURL: user.photoURL || ""
            }),
        });
        return await res.json();
    } catch (error) {
        console.error("Error creando chat:", error);
        throw error;
    }
}

export async function getChatHistory(userId) {
    try {
        const res = await fetch(`${API_URL}/api/chats?userId=${userId}`);
        return await res.json();
    } catch (error) {
        console.error("Error obteniendo el historial de chats:", error);
        throw error;
    }
}

export async function getChat(chatId) {
    try {
        const res = await fetch(`${API_URL}/api/chats/${chatId}`);
        return await res.json();
    } catch (error) {
        console.error("Error obteniendo el chat:", error);
        throw error;
    }
}

export async function addMessage(chatId, sender, text) {
    try {
        await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender, text })
        });
    } catch (error) {
        console.error("Error añadiendo mensaje:", error);
        throw error;
    }
}

export async function deleteChat(chatId) {
    try {
        await fetch(`${API_URL}/api/chats/${chatId}`, { method: "DELETE" });
    } catch (error) {
        console.error("Error eliminando chat:", error);
        throw error;
    }
}

export async function updateChatTitle(chatId, title) {
    try {
        await fetch(`${API_URL}/api/chats/${chatId}/title`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
    } catch (error) {
        console.error("Error actualizando título del chat:", error);
        throw error;
    }
}

export async function getUserMessagesCount(chatId) {
    try {
        const res = await fetch(`${API_URL}/api/chats/${chatId}/user-messages-count`);
        return await res.json();
    } catch (error) {
        console.error("Error obteniendo el conteo de mensajes del usuario:", error);
        throw error;
    }
}

export async function getBestCategoryFromGPT(userText) {
    try {
        const res = await fetch(`${API_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userText }),
        });
        const data = await res.json();
        return data.category; // Asegúrate de que la respuesta tenga el campo 'category'
    } catch (error) {
        console.error("Error obteniendo la mejor categoría de GPT:", error);
        throw error;
    }
}