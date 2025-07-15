import React from "react";
import { ShoppingCart } from "lucide-react";

const CheckoutResumenPedido = ({ cartItems, updateItemQuantity, removeItem }) => {
    return (
        <div className="bg-slate-50 rounded-2xl shadow p-6 mb-6 w-full max-w-lg mx-auto">
            <h3 className="flex items-center gap-2 font-bold text-lg text-blue-700 mb-4">
                <ShoppingCart size={20} /> Resumen del pedido
            </h3>

            {cartItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-medium">
                    Tu carrito está vacío
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center bg-white rounded-xl shadow p-4 gap-4 relative"
                        >
                            {item.imgurl && (
                                <img
                                    src={item.imgurl}
                                    alt={item.nombre}
                                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                                />
                            )}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center mb-1">
                                    <button
                                        onClick={() => updateItemQuantity(item.key, item.cantidad - 1)}
                                        className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-blue-700 font-bold text-lg flex items-center justify-center mr-2"
                                    >
                                        -
                                    </button>
                                    <span className="min-w-[28px] text-center font-semibold text-base">
                                        {item.cantidad || 1}
                                    </span>
                                    <button
                                        onClick={() => updateItemQuantity(item.key, item.cantidad + 1)}
                                        className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-blue-700 font-bold text-lg flex items-center justify-center ml-2"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="font-bold text-base text-slate-800">
                                    {item.nombre}
                                </div>
                                <div className="text-slate-500 text-sm">S/ {item.precio} c/u</div>
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                <span className="font-bold text-blue-700 text-base">
                                    S/ {(item.precio * item.cantidad).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeItem(item.key)}
                                    className="text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center"
                                    title="Eliminar"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CheckoutResumenPedido;
