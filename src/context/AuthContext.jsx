/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    // Sincroniza token con localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Sincroniza user con localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Verifica sesión activa al cargar la app
    useEffect(() => {
        const checkSession = async () => {
            if (!token) return;

            try {
                const res = await fetch(`${API_URL}/api/users/verifyToken`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Token inválido");

                setUser(data.user); // Actualiza user desde backend por seguridad
            } catch (error) {
                logout(); // Si falla la validación, limpia sesión
            }
        };

        checkSession();
    }, [token]);

    // Login
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Error en login");

            setUser(data.user);
            setToken(data.token);

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Registro
    const register = async (email, password, displayname) => {
        try {
            const res = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, displayname, photo_url: "" }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Error en registro");

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const updateUserInContext = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, register, logout, updateUserInContext }}>
            {children}
        </AuthContext.Provider>
    );
}
