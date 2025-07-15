import { ImageIcon } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const PerfilHeader = ({ displayname, user, profilePic, handleProfilePicChange }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">

        {/* ✅ Solo avatar en mobile */}
        <div className="text-center md:hidden">
            <div className="relative w-20 h-20 mx-auto mb-2">
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
        </div>

        {/* ✅ Saludo */}
        <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Hola, {displayname || "Usuario"}
            </h1>
            <p className="text-gray-500">¿Listo para gestionar tu cuenta?</p>
        </div>

    </div>
);

export default PerfilHeader;
