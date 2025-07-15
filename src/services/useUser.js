import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function useUser() {
    const { user, token, setUser, updateUserInContext } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/api/users/${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data.user);
        } catch (error) {
            console.error("Error al obtener usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updatedData) => {
        if (!user?.id) {
            return { success: false, message: "Usuario no disponible." };
        }
        try {
            const response = await axios.put(
                `${API_URL}/api/users/${user.id}`,
                {
                    ...updatedData,
                    photo_url: updatedData.photo_url ?? user.photo_url,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            const message = error.response?.data?.message || "Error al guardar cambios ❌";
            return { success: false, message };
        }
    };

    const updateProfilePic = async (file) => {
        if (!user?.id) {
            return { success: false, message: "Usuario no disponible." };
        }
        try {
            const formData = new FormData();
            formData.append("photo", file);

            const response = await axios.post(
                `${API_URL}/api/users/${user.id}/photo`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            updateUserInContext(response.data.user);

            return { success: true, newPhotoURL: response.data.user.photo_url };
        } catch (error) {
            console.error("Error al actualizar foto de perfil:", error);
            const message = error.response?.data?.message || "Error al actualizar foto";
            return { success: false, message };
        }
    };

    return { user, fetchUser, updateUser, updateProfilePic, loading };
}
