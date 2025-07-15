import { MapPin, User, CreditCard, QrCode } from "lucide-react";
import { useEffect, useCallback, useContext, useState } from "react";
import NewCardForm from "../../components/checkout/NewCardForm";
import { CardsContext } from "../../context/CardsContext";

const paymentMethods = [
    { id: 1, name: "Tarjeta", icon: <CreditCard size={22} /> },
    { id: 2, name: "Pago con QR", icon: <QrCode size={22} /> },
    { id: 3, name: "Efectivo", icon: <span className="inline-block w-5 h-5 bg-green-200 rounded-full" /> },
];

const CheckoutDatosEntrega = ({ formData, setFormData, paymentDetails, setPaymentDetails, user }) => {
    const { cards } = useContext(CardsContext);
    const [selectedCardId, setSelectedCardId] = useState("");

    const isValidPaymentMethod = (method) =>
        paymentMethods.some((m) => m.name === method);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                address: user.address || "",
                contact: {
                    name: user.displayname || "",
                    phone: user.phone || "",
                    dni: user.dni || "",
                    email: user.email || "",
                },
                payment: {
                    ...prev.payment,
                    method: isValidPaymentMethod(user.preferredPaymentMethod)
                        ? user.preferredPaymentMethod
                        : prev.payment?.method || "Efectivo",
                },
            }));
        }
    }, [user, setFormData]);

    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [setFormData]
    );

    const handleContactChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    [name]: value,
                },
            }));
        },
        [setFormData]
    );

    const handlePaymentDetailChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setPaymentDetails((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [setPaymentDetails]
    );

    const handlePaymentMethodSelect = useCallback(
        (methodName) => {
            setFormData((prev) => ({
                ...prev,
                payment: { ...(prev.payment || {}), method: methodName },
            }));
            if (methodName !== "Tarjeta") {
                setSelectedCardId("");
                setPaymentDetails({});
            }
        },
        [setFormData, setPaymentDetails]
    );

    const handleCardSelectChange = (e) => {
        const value = e.target.value;
        setSelectedCardId(value);
        if (value === "new") {
            setPaymentDetails({
                cardName: "",
                cardNumber: "",
                expiry: "",
                cvv: "",
            });
        } else {
            const selectedCard = cards.find((card) => card.id === parseInt(value));
            if (selectedCard) {
                setPaymentDetails({
                    cardName: selectedCard.name,
                    cardNumber: `•••• ${selectedCard.last4}`,
                    expiry: selectedCard.expiry,
                    cvv: "",
                });
            }
        }
    };

    return (
        <form className="flex flex-col gap-8 bg-slate-50 rounded-2xl shadow p-6 mb-6 w-full max-w-lg mx-auto">
            {/* Dirección */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-blue-700 mb-3">
                    <MapPin size={20} /> Dirección de entrega
                </h3>
                <input
                    type="text"
                    name="address"
                    placeholder="Calle, número, departamento"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500"
                    required
                />
            </div>

            {/* Contacto */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-blue-700 mb-3">
                    <User size={20} /> Contacto
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.contact?.name || ""}
                        onChange={handleContactChange}
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Teléfono"
                        value={formData.contact?.phone || ""}
                        onChange={handleContactChange}
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500"
                        required
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <input
                        type="text"
                        name="dni"
                        placeholder="DNI"
                        value={formData.contact?.dni || ""}
                        onChange={handleContactChange}
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.contact?.email || ""}
                        onChange={handleContactChange}
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500 cursor-no-drop"
                        readOnly
                    />
                </div>
            </div>

            {/* Método de pago */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-blue-700 mb-3">
                    <CreditCard size={20} /> Método de pago
                </h3>
                <div className="flex gap-4 mb-4">
                    {paymentMethods.map((method) => (
                        <button
                            type="button"
                            key={method.id}
                            aria-label={`Seleccionar método de pago ${method.name}`}
                            className={`flex flex-col items-center justify-center gap-1 px-6 py-3 rounded-lg border-2 transition-all ${formData.payment?.method === method.name
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 bg-white"
                                }`}
                            onClick={() => handlePaymentMethodSelect(method.name)}
                        >
                            {method.icon}
                            <span className="text-sm font-semibold">{method.name}</span>
                        </button>
                    ))}
                </div>

                {/* Tarjeta */}
                {formData.payment?.method === "Tarjeta" && (
                    <>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            Seleccioná una tarjeta guardada
                        </label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500 mb-4"
                            onChange={handleCardSelectChange}
                            value={selectedCardId}
                        >
                            <option value="" disabled>Seleccionar tarjeta</option>
                            {cards.map((card) => (
                                <option key={card.id} value={card.id}>
                                    {`${card.type.toUpperCase()} - ${card.name} (•••• ${card.last4})`}
                                </option>
                            ))}
                            <option value="new">Nueva tarjeta</option>
                        </select>

                        {selectedCardId === "new" ? (
                            <NewCardForm
                                onSuccess={() => {
                                    setSelectedCardId("");
                                }}
                                onCancel={() => setSelectedCardId("")}
                            />
                        ) : null}
                    </>
                )}

                {/* QR */}
                {formData.payment?.method === "Pago con QR" && (
                    <div className="flex flex-col items-center gap-2 mt-2">
                        <QrCode size={48} className="text-blue-500" />
                        <input
                            type="text"
                            name="qr"
                            placeholder="Referencia de pago (opcional)"
                            value={paymentDetails.qr || ""}
                            onChange={handlePaymentDetailChange}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Notas */}
            <div>
                <h3 className="font-bold text-blue-700 mb-2">Notas adicionales</h3>
                <textarea
                    name="notes"
                    placeholder="Ej: Sin cebolla, tocar timbre 3 veces..."
                    value={formData.notes || ""}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base min-h-[80px] focus:outline-blue-500"
                />
            </div>
        </form>
    );
};

export default CheckoutDatosEntrega;
