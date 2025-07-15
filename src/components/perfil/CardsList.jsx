import { useContext, useState } from "react";
import { CardsContext } from "../../context/CardsContext";
import { Trash2, Pencil, Save } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function CardsList() {
    const { cards, deleteCard, setCards } = useContext(CardsContext);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("");

    const startEdit = (card) => {
        setEditingId(card.id);
        setEditName(card.name);
        setEditType(card.type);
    };

    const saveEdit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/cards/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    card_type: editType,
                    card_name: editName,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar tarjeta");
            }

            setCards((prev) =>
                prev.map((card) =>
                    card.id === id ? { ...card, type: editType, name: editName } : card
                )
            );

            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };

    if (cards.length === 0) {
        return <p className="text-gray-500 text-center">No tienes tarjetas guardadas.</p>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Tus métodos de pago</h2>
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl shadow hover:bg-gray-50 transition"
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                            src={
                                card.type === "visa"
                                    ? "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                                    : "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                            }
                            alt={card.type}
                            className="h-6 w-auto flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            {editingId === card.id ? (
                                <>
                                    {/* <input
                                        className="border p-1 rounded w-28 mb-1 text-sm"
                                        value={editType}
                                        onChange={(e) => setEditType(e.target.value)}
                                    /> */}
                                    <input
                                        className="border p-1 rounded w-36 text-sm"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* <p className="font-medium text-gray-800 truncate">{card.type}</p> */}
                                    <p className="text-sm text-gray-500 truncate">{card.name}</p>
                                </>
                            )}
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                                •••• {card.last4}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                        {editingId === card.id ? (
                            <button
                                onClick={() => saveEdit(card.id)}
                                className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition"
                            >
                                <Save className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick={() => startEdit(card)}
                                className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition"
                            >
                                <Pencil className="h-5 w-5" />
                            </button>
                        )}

                        <button
                            onClick={() => deleteCard(card.id)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
