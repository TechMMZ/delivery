// ChatHistoryList.jsx
const ChatHistoryList = ({
    chatHistory,
    currentChatId,
    setCurrentChatId,
    deleteChat,
    createNewChat,
    loading,
    error
}) => (
    <div style={{ width: 120, borderRight: "1px solid #eee", paddingRight: 8 }}>
        <h4 style={{ fontSize: 14, margin: "8px 0" }}>Historial</h4>
        {loading && <p style={{ fontSize: 12 }}>Cargando...</p>}
        {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {chatHistory.map(chat => (
                <li key={chat._id}>
                    <button
                        style={{
                            width: "100%",
                            background: chat._id === currentChatId ? "#e0e7ff" : "transparent",
                            border: "none",
                            textAlign: "left",
                            padding: "6px 4px",
                            fontWeight: chat._id === currentChatId ? "bold" : "normal",
                            cursor: "pointer"
                        }}
                        onClick={() => setCurrentChatId(chat._id)}
                    >
                        {chat.title || "Chat sin título"}
                    </button>
                    <button
                        onClick={() => deleteChat(chat._id)}
                        style={{
                            color: "red",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            marginLeft: 4
                        }}
                        title="Eliminar chat"
                    >
                        ×
                    </button>
                </li>
            ))}
        </ul>
        <button
            onClick={createNewChat}
            style={{
                marginTop: 8,
                width: "100%",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 0",
                cursor: "pointer",
                fontSize: 13
            }}
        >
            + Nuevo chat
        </button>
    </div>
);

export default ChatHistoryList;