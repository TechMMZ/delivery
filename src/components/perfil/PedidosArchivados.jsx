import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useArchivedOrders from "../../services/useArchivedOrders";
import { MapPinned } from "lucide-react";

// Corregir íconos default de Leaflet en React (opcional)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PedidoArchivadoDetalle = ({ pedido }) => (
    <div className="p-4 bg-gray-50 rounded-lg border mt-2 space-y-4">
        <p className="text-sm text-gray-600">
            <strong>Estado:</strong> {pedido.status}
        </p>
        <p className="text-sm text-gray-600">
            <strong>Fecha:</strong> {new Date(pedido.created_at).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
            <strong>Dirección:</strong> {pedido.delivery_address}
        </p>
        <div className="w-full h-32 rounded-lg overflow-hidden">
            <MapContainer
                center={[-12.0464, -77.0428]}
                zoom={13}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[-12.0464, -77.0428]}>
                    <Popup>Pedido archivado</Popup>
                </Marker>
            </MapContainer>
        </div>
    </div>
);

const PedidosArchivados = () => {
    const { orders, loading, error } = useArchivedOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (loading) return <p>Cargando pedidos archivados...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!orders || orders.length === 0)
        return <p>No tienes pedidos archivados.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700">Pedidos archivados</h2>
            <ul className="space-y-4">
                {orders.map((pedido, index) => (
                    <li
                        key={pedido.id}
                        className="p-4 bg-white rounded-xl shadow border flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">
                                    Pedido archivado #{index + 1}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {pedido.status || "Pendiente"}
                                </p>
                            </div>
                            <button
                                className="text-green-600 hover:text-blue-800 flex text-sm"
                                onClick={() =>
                                    setSelectedOrder(
                                        selectedOrder && selectedOrder.id === pedido.id
                                            ? null
                                            : pedido
                                    )
                                }
                            >
                                <MapPinned size={16} />
                                {selectedOrder && selectedOrder.id === pedido.id
                                    ? "Ocultar"
                                    : "Ver detalle"}
                            </button>
                        </div>
                        {selectedOrder && selectedOrder.id === pedido.id && (
                            <PedidoArchivadoDetalle pedido={pedido} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PedidosArchivados;