/* eslint-disable no-unused-vars */
import { MapPinned, Truck, CheckCircle, StickyNote, CreditCard, Flag } from "lucide-react";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PedidoDetalleInline = ({ pedido }) => {
    const statusSteps = ["pending", "in_progress", "completed"];
    const statusIndex = statusSteps.indexOf(pedido.status);
    const position = pedido.lat && pedido.lng ? [pedido.lat, pedido.lng] : [-12.0464, -77.0428];

    return (
        <div className="p-4 bg-gray-50 rounded-lg border mt-2 space-y-4">
            <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Estado:</strong> {pedido.status}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleString()}</p>
                <p><strong>Dirección:</strong> {pedido.delivery_address}</p>
                <p><strong>Total:</strong> S/ {pedido.total || "0.00"}</p>
                <p className="flex items-center gap-1"><CreditCard size={14} /> <span>{pedido.payment_method || "Pago contra entrega"}</span></p>
                <p className="flex items-center gap-1"><StickyNote size={14} /> <span>{pedido.notes || "Sin notas"}</span></p>
            </div>

            {/* Seguimiento estilo pista */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-800">Seguimiento</h4>
                <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className="absolute h-2 bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${((statusIndex + 1) / statusSteps.length) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1 items-center">
                    <div className={`flex flex-col items-center ${statusIndex >= 0 ? "text-blue-600" : ""}`}>
                        <Flag size={18} />
                        <span>Preparando</span>
                    </div>
                    <div className={`flex flex-col items-center ${statusIndex >= 1 ? "text-blue-600" : ""}`}>
                        <Truck size={18} />
                        <span>En camino</span>
                    </div>
                    <div className={`flex flex-col items-center ${statusIndex >= 2 ? "text-green-600" : ""}`}>
                        <CheckCircle size={18} />
                        <span>Entregado</span>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            {/* <div className="w-full h-40 rounded-lg overflow-hidden">
                <MapContainer center={position} zoom={13} className="h-full w-full">
                    <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position}>
                        <Popup>{pedido.status === "completed" ? "Pedido entregado" : "Pedido en tránsito"}</Popup>
                    </Marker>
                </MapContainer>
            </div> */}
        </div>
    );
};

const PerfilPedidos = ({ orders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (!orders || orders.length === 0) {
        return <p>No tienes pedidos aún.</p>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700">Mis pedidos</h2>
            <ul className="space-y-4">
                {orders.map((pedido, index) => (
                    <li
                        key={pedido.id}
                        className="p-4 bg-white rounded-xl shadow-sm border flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">Pedido #{index + 1}</p>
                                <span className="text-sm text-gray-500 capitalize">{pedido.status || "Pendiente"}</span>
                            </div>
                            <button
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                                onClick={() =>
                                    setSelectedOrder(
                                        selectedOrder && selectedOrder.id === pedido.id ? null : pedido
                                    )
                                }
                            >
                                <MapPinned size={16} />
                                {selectedOrder && selectedOrder.id === pedido.id ? "Ocultar" : "Seguimiento"}
                            </button>
                        </div>

                        {selectedOrder && selectedOrder.id === pedido.id && (
                            <PedidoDetalleInline pedido={pedido} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PerfilPedidos;
