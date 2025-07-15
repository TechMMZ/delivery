import React from "react";
import { Trash2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutBotones = ({
    step,
    setStep,
    isStep1Valid,
    isStep2Valid,
    clearCart,
    handlePlaceOrder,
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            {step === 1 && (
                <>
                    <Link to="/">
                        <button
                            className="flex items-center gap-2 bg-blue-50 border border-blue-300 text-blue-700 font-semibold py-2 px-6 rounded-xl shadow-sm transition hover:bg-blue-100 hover:border-blue-400"
                            type="button"
                        >
                            <ArrowLeft size={18} /> Volver al inicio
                        </button>
                    </Link>
                    <button
                        className="flex items-center gap-2 bg-white border border-red-500 text-red-600 font-semibold py-2 px-6 rounded-xl shadow-sm transition hover:bg-red-50"
                        onClick={clearCart}
                        type="button"
                    >
                        <Trash2 size={18} /> Vaciar carrito
                    </button>
                    <button
                        className={`flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl shadow-sm transition hover:bg-blue-700 ${!isStep1Valid ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={() => setStep(2)}
                        type="button"
                        disabled={!isStep1Valid}
                    >
                        Siguiente <ArrowRight size={18} />
                    </button>
                </>
            )}
            {step === 2 && (
                <>
                    <button
                        className="flex items-center gap-2 bg-blue-50 border border-blue-300 text-blue-700 font-semibold py-2 px-6 rounded-xl shadow-sm transition hover:bg-blue-100 hover:border-blue-400"
                        onClick={() => setStep(1)}
                        type="button"
                    >
                        <ArrowLeft size={18} /> Atrás
                    </button>
                    <button
                        className={`flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-sm transition hover:bg-green-700 ${!isStep2Valid ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handlePlaceOrder}
                        type="button"
                        disabled={!isStep2Valid}
                    >
                        Confirmar compra <CheckCircle size={18} />
                    </button>
                </>
            )}
        </div>
    );
};

export default CheckoutBotones;
