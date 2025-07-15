import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CardsProvider } from "../context/CardsContext";
import PerfilSidebar from "../components/perfil/PerfilSidebar";
import PerfilHeader from "../components/perfil/PerfilHeader";
import PerfilDatosForm from "../components/perfil/PerfilDatosForm";
import PerfilConfiguracion from "../components/perfil/PerfilConfiguracion";
import PerfilPedidos from "../components/perfil/PerfilPedidos";
import PedidosArchivados from "../components/perfil/PedidosArchivados";
import CerrarSesionModal from "../components/perfil/CerrarSesionModal";
import { Settings, ShoppingBag, User, Archive } from "lucide-react";
import useUser from "../services/useUser";

const API_URL = import.meta.env.VITE_API_URL;

const Perfil = () => {
    const { user, logout } = useContext(AuthContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("perfil");
    const [profilePic, setProfilePic] = useState("/img/user.png");
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { updateProfilePic } = useUser();

    const tabs = [
        { id: "perfil", label: "Perfil", icon: <User size={18} /> },
        { id: "configuracion", label: "Configuración", icon: <Settings size={18} /> },
        { id: "pedidos", label: "Pedidos", icon: <ShoppingBag size={18} /> },
        { id: "archivados", label: "Archivados", icon: <Archive size={18} /> }
    ];

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const result = await updateProfilePic(file);
            if (result.success) {
                const newPic = `${API_URL}${result.newPhotoURL}`;
                setProfilePic(newPic);
            } else {
                console.error(result.message);
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isModalOpen]);

    useEffect(() => {
        const pic = user?.photo_url ? `${API_URL}${user.photo_url}` : "/img/user.png";
        setProfilePic(pic);
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            fetch(`${API_URL}/api/orders/user/${user.id}`)
                .then(res => res.json())
                .then(data => setOrders(data))
                .catch(err => console.error("Error al cargar pedidos:", err));
        }
    }, [user]);

    return (
        <CardsProvider>
            <div className="min-h-screen bg-gray-100 flex font-sans">
                <PerfilSidebar
                    user={user}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    openModal={() => setModalOpen(true)}
                    tabs={tabs}
                    handleProfilePicChange={handleProfilePicChange}
                    profilePic={profilePic}
                />

                <main className="flex-1 p-10">
                    <PerfilHeader
                        displayname={user?.displayname}
                        user={user}
                        profilePic={profilePic}
                        handleProfilePicChange={handleProfilePicChange}
                    />
                    {selectedTab === "perfil" && <PerfilDatosForm />}
                    {selectedTab === "configuracion" && <PerfilConfiguracion />}
                    {selectedTab === "pedidos" && <PerfilPedidos orders={orders} />}
                    {selectedTab === "archivados" && <PedidosArchivados />}
                </main>

                {isModalOpen && (
                    <CerrarSesionModal
                        onClose={() => setModalOpen(false)}
                        onConfirm={async () => {
                            await logout();
                            navigate("/");
                        }}
                    />
                )}
            </div>

            {/* Barra inferior mobile */}
            <div className="md:hidden fixed bottom-0 w-full bg-white border-t flex justify-around p-2 z-50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`flex flex-col items-center ${selectedTab === tab.id ? "text-blue-600" : "text-gray-500"
                            }`}
                    >
                        {tab.icon}
                        <span className="text-xs">{tab.label}</span>
                    </button>
                ))}
            </div>
        </CardsProvider>
    );
};

export default Perfil;
