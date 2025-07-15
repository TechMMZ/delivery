/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

export const CardsContext = createContext();

export function CardsProvider({ children }) {
    const [cards, setCards] = useState([]);
    const { user } = useContext(AuthContext);

    const addCard = (card) => {
        setCards((prev) => [
            ...prev,
            { ...card, main: prev.length === 0 },
        ]);
    };

    const loadCards = async () => {
        if (!user) return;

        try {
            const response = await fetch(`${API_URL}/api/cards/${user.id}`);
            if (!response.ok) {
                throw new Error("Error al cargar tarjetas");
            }

            const data = await response.json();
            setCards(
                data.map((card) => ({
                    id: card.id,
                    type: card.card_type,
                    name: card.card_name,
                    last4: card.last4,
                    expiry: card.expiry_date, // <-- asegúrate de incluirlo si lo necesitas
                    main: false,
                }))
            );
        } catch (error) {
            console.error("Error cargando tarjetas:", error);
        }
    };

    const deleteCard = async (id) => {
        try {
            await fetch(`${API_URL}/api/cards/${id}`, {
                method: "DELETE",
            });
            setCards((prev) => prev.filter((card) => card.id !== id));
        } catch (error) {
            console.error("Error eliminando tarjeta:", error);
        }
    };

    useEffect(() => {
        loadCards();
    }, [user]);

    return (
        <CardsContext.Provider value={{ cards, setCards, addCard, deleteCard, loadCards }}>
            {children}
        </CardsContext.Provider>
    );
}
