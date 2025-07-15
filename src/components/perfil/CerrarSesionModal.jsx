import { AlertTriangle } from "lucide-react";

const CerrarSesionModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <AlertTriangle size={48} className="mx-auto text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">¿Cerrar sesión?</h2>
            <p className="text-gray-600">Esta acción finalizará tu sesión actual.</p>
            <div className="flex justify-center gap-4 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                    Cancelar
                </button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
);

export default CerrarSesionModal;
