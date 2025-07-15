import React from "react";
import { Receipt } from "lucide-react";

const CheckoutTotales = ({ total }) => (
    <div className="bg-slate-50 rounded-2xl shadow p-6 mb-6 w-full max-w-lg mx-auto">
        <h3 className="flex items-center gap-2 font-bold text-lg text-blue-700 mb-4">
            <Receipt size={20} /> Detalle de pago
        </h3>
        <div className="flex justify-between text-base text-slate-700 mb-3">
            <span>Subtotal</span>
            <span>S/ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base text-slate-700 mb-3">
            <span>Envío</span>
            <span>S/ 3.99</span>
        </div>
        <div className="border-t border-slate-200 my-4" />
        <div className="flex justify-between font-bold text-lg">
            <span>Total a pagar</span>
            <span className="text-blue-700">S/ {(total + 3.99).toFixed(2)}</span>
        </div>
    </div>
);

export default CheckoutTotales;
