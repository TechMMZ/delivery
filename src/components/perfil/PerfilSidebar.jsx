import { ImageIcon, LogOut } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const PerfilSidebar = ({ user, selectedTab, setSelectedTab, openModal, tabs, handleProfilePicChange, profilePic }) => {
    return (
        <aside className="hidden md:flex w-64 bg-white shadow-xl p-6 flex-col justify-between">
            <div>
                <div className="text-center mb-8">
                    <div className="relative w-20 h-20 mx-auto">
                        <img
                            src={profilePic || (user?.photo_url ? `${API_URL}${user.photo_url}` : "/img/user.png")}
                            alt="Avatar"
                            className="w-20 h-20 border-4 border-blue-500 object-cover rounded-full"
                        />
                        <label
                            htmlFor="profile-pic-upload"
                            className="absolute bottom-1 right-1 bg-white p-1 shadow cursor-pointer hover:bg-blue-100 transition border border-gray-200 rounded-full"
                        >
                            <ImageIcon size={18} className="text-blue-600" />
                            <input
                                id="profile-pic-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePicChange}
                            />
                        </label>
                    </div>
                    <h2 className="mt-3 font-bold text-gray-800">
                        {user?.displayname || "Usuario"}
                    </h2>
                    <p className="text-sm text-gray-500">Mi cuenta</p>
                </div>

                <nav className="space-y-2">
                    {tabs.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => setSelectedTab(id)}
                            className={`flex items-center gap-3 w-full px-4 py-2 transition ${selectedTab === id
                                ? "text-blue-700 font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-8">
                <button
                    onClick={openModal}
                    className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition w-full"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default PerfilSidebar;
