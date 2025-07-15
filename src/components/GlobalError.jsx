import React from "react";

export default function GlobalError({ error, onClose }) {
    if (!error) return null;
    return (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50">
            <span>{error}</span>
            <button className="ml-4" onClick={onClose}>Cerrar</button>
        </div>
    );
}