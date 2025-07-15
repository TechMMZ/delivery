import { useState } from "react";

const ChatInput = ({ onSend }) => {
    const [input, setInput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            await onSend(input.trim());
            setInput("");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                style={{ flex: 1 }}
            />
            <button type="submit" disabled={!input.trim()}>Enviar</button>
        </form>
    );
};

export default ChatInput;