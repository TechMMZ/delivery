import { useState, useContext } from "react";
import { CardsContext } from "../../context/CardsContext";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const NewCardForm = ({ onSuccess, onCancel }) => {
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState("Visa");
    const [error, setError] = useState(null);

    const { addCard, loadCards } = useContext(CardsContext);
    const { user } = useContext(AuthContext);

    const handleSave = async () => {
        const numeroSinEspacios = cardNumber.replace(/\s+/g, "");

        if (!/^\d{16}$/.test(numeroSinEspacios)) {
            setError("El número de tarjeta debe tener 16 dígitos.");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            setError("La fecha debe tener formato MM/AA.");
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            setError("El CVV debe tener 3 dígitos.");
            return;
        }

        setError(null);

        if (!user) {
            alert("Debes iniciar sesión para guardar una tarjeta.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    card_type: cardType.toLowerCase(),
                    card_number: numeroSinEspacios,
                    card_name: cardName,
                    expiry_date: expiry,
                    cvv,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al guardar la tarjeta");
            }

            const result = await response.json();

            addCard({
                id: result.id,
                type: cardType,
                name: cardName,
                last4: numeroSinEspacios.slice(-4),
                expiry,
            });

            await loadCards();

            onSuccess?.(); // callback opcional cuando se guarda
        } catch (error) {
            console.error("Error al guardar tarjeta:", error);
            setError("Hubo un error al guardar la tarjeta.");
        }
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 16);
        value = value.replace(/(.{4})/g, "$1 ").trim();
        setCardNumber(value);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${cardType === "Visa"
                        ? "bg-blue-50 border-blue-500"
                        : "bg-gray-50 border-gray-300"
                        }`}
                    onClick={() => setCardType("Visa")}
                >
                    <span>Visa</span>
                </button>
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${cardType === "Mastercard"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-gray-50 border-gray-300"
                        }`}
                    onClick={() => setCardType("Mastercard")}
                >
                    <span>Mastercard</span>
                </button>
            </div>

            <input
                type="text"
                placeholder="Titular de la tarjeta"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
            />
            <input
                type="text"
                placeholder="Número de tarjeta"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full border p-3 rounded-lg"
                required
            />
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={(e) => {
                        let v = e.target.value.replace(/[^0-9]/g, "");
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                        setExpiry(v.slice(0, 5));
                    }}
                    className="flex-1 border p-3 rounded-lg"
                    required
                />
                <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) =>
                        setCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))
                    }
                    className="flex-1 border p-3 rounded-lg"
                    required
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                >
                    Guardar tarjeta
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    );
}

export default NewCardForm;
