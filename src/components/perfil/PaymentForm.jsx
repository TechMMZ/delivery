import { useState, useContext } from "react";
import { CardsContext } from "../../context/CardsContext";
import { AuthContext } from "../../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentForm() {
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [saved, setSaved] = useState(false);
    const [cardType, setCardType] = useState("Visa");
    const [error, setError] = useState(null);

    const { addCard, loadCards } = useContext(CardsContext);
    const { user } = useContext(AuthContext);

    const handleSave = async (e) => {
        e.preventDefault();

        // Elimina espacios para validar solo los dígitos
        const numeroSinEspacios = cardNumber.replace(/\s+/g, '');

        // Validación de número de tarjeta (16 dígitos)
        if (!/^\d{16}$/.test(numeroSinEspacios)) {
            setError("El número de tarjeta debe tener 16 dígitos.");
            return;
        }

        // Validación de fecha (MM/YY)
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            setError("La fecha debe tener el formato MM/YY.");
            return;
        }

        // Validación de CVV (3 o 4 dígitos)
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    card_type: cardType.toLowerCase(),
                    card_number: numeroSinEspacios,
                    card_name: cardName,
                    expiry_date: expiry,
                    cvv: cvv,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al guardar la tarjeta");
            }

            const result = await response.json();

            // Actualizamos CardsContext en frontend (last4 se saca del número ingresado)
            addCard({
                id: result.id,
                type: cardType,
                name: cardName,
                last4: numeroSinEspacios.slice(-4),
                expiry,
            });

            await loadCards(); // recarga las tarjetas después de guardar

            setSaved(true);
            setCardName("");
            setCardNumber("");
            setExpiry("");
            setCvv("");
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Error al guardar tarjeta:", error);
        }
    };

    // Formatea el número de tarjeta mientras el usuario escribe
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 16);
        value = value.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(value);
    };

    return (
        <form className="space-y-6" onSubmit={handleSave} autoComplete="off">
            {/* Selección de tipo de tarjeta */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none ${cardType === "Visa"
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
                        : "bg-gray-50 border-gray-300"
                        }`}
                    onClick={() => setCardType("Visa")}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                        alt="Visa"
                        className="h-6 w-auto"
                    />
                    <span className="text-blue-700 font-semibold">Visa</span>
                </button>
                <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition shadow-sm focus:outline-none ${cardType === "Mastercard"
                        ? "bg-yellow-50 border-yellow-500 ring-2 ring-yellow-300"
                        : "bg-gray-50 border-gray-300"
                        }`}
                    onClick={() => setCardType("Mastercard")}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                        alt="Mastercard"
                        className="h-6 w-auto"
                    />
                    <span className="text-yellow-700 font-semibold">Mastercard</span>
                </button>
            </div>

            {/* Inputs */}
            <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                    Nombre en la tarjeta
                </label>
                <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Nombre completo"
                />
            </div>

            <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                    Número de tarjeta
                </label>
                <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={cardNumber}
                    maxLength={19} // 16 dígitos + 3 espacios
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                        Expiración
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={expiry}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, "");
                            if (value.length > 2) {
                                value = value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setExpiry(value.slice(0, 5));
                        }}
                        placeholder="MM/AA"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                        CVV
                    </label>
                    <input
                        type="password"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={cvv}
                        maxLength={3}
                        onChange={(e) =>
                            setCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
                        }
                        placeholder="123"
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-600 text-center">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
                Guardar método de pago
            </button>

            {saved && (
                <p className="text-green-600 text-center">
                    ¡Método de pago guardado!
                </p>
            )}
        </form>
    );
}
