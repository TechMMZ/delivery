const ChatMessages = ({
    messages,
    isLoading,
    error,
    initialBotMessage,
    messagesEndRef
}) => (
    <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eee", padding: 8 }}>
        {isLoading && <p>Cargando mensajes...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {messages && messages.length > 0 ? (
            messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                    <b>{msg.from === "bot" ? "Bot" : "Tú"}:</b> {msg.text}
                </div>
            ))
        ) : (
            <div>
                <b>Bot:</b> {initialBotMessage}
            </div>
        )}
        <div ref={messagesEndRef} />
    </div>
);

export default ChatMessages;