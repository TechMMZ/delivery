import { CheckCircle2, MapPin, User, CreditCard, StickyNote, FileText } from "lucide-react";

const CheckoutConfirmacion = ({ formData }) => {
    return (
        <div className="flex flex-col items-center text-center py-8">
            <CheckCircle2 size={56} className="text-green-500 mb-4" />

            <h2 className="text-2xl font-extrabold text-blue-700 mb-2">
                ¡Pedido confirmado!
            </h2>

            <p className="text-slate-600 mb-6">
                Gracias <span className="font-semibold">{formData.contact.name}</span>, tu pedido ha sido registrado correctamente.
            </p>
            <div className="w-full max-w-lg bg-slate-50 rounded-xl shadow p-6 mb-6 text-left">

                <h3 className="font-bold text-blue-700 mb-4">
                    Detalles del envío
                </h3>

                <div className="flex items-center gap-2 mb-2 text-slate-700">
                    <MapPin size={18} /> <span><strong>Dirección:</strong> {formData.address}</span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-slate-700">
                    <User size={18} /> <span><strong>Contacto:</strong> {formData.contact.phone}</span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-slate-700">
                    <CreditCard size={18} /> <span><strong>Pago:</strong> {formData.payment.method}</span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-slate-700">
                    <FileText size={18} /> <span><strong>Notas:</strong> {formData.notes || "Ninguna"}</span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-lg">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                    onClick={() => window.location.href = "/"}
                >
                    Hacer nuevo pedido
                </button>
                <button
                    className="w-full bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 rounded-lg transition"
                    onClick={() => window.location.href = "/perfil"}
                >
                    Rastrear pedido
                </button>
            </div>
        </div>
    );
};

export default CheckoutConfirmacion;
