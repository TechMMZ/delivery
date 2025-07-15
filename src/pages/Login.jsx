/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GiScooter } from "react-icons/gi";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "react-feather";

export default function AuthFlip() {
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [regError, setRegError] = useState("");
    const [regDisplayName, setRegDisplayName] = useState("");
    const { login, register } = useContext(AuthContext);
    const [showNotif, setShowNotif] = useState(false);
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);

    const toggleFlip = () => {
        setLoginError("");
        setRegError("");
        setIsFlipped(!isFlipped);
    };

    const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");
        setShowLoginSuccess(false);

        if (!validateEmail(loginEmail)) return setLoginError("Email inválido");
        if (loginPassword.length < 6) return setLoginError("Contraseña muy corta");

        const response = await login(loginEmail, loginPassword);
        if (response.success) {
            setShowLoginSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 1200);
        } else {
            setLoginError(response.message);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegError("");
        if (!validateEmail(regEmail)) return setRegError("Email inválido");
        if (regPassword.length < 6) return setRegError("Contraseña muy corta");
        if (regPassword !== regConfirmPassword) return setRegError("Las contraseñas no coinciden");
        if (!regDisplayName.trim()) return setRegError("El nombre es obligatorio");

        const response = await register(regEmail, regPassword, regDisplayName);
        if (!response.success) {
            setRegError(response.message);
        } else {
            setShowNotif(true);
            setTimeout(() => {
                setShowNotif(false);
                // limpiar campos del registro
                setRegEmail("");
                setRegPassword("");
                setRegConfirmPassword("");
                setRegDisplayName("");
                toggleFlip();
            }, 1500); // 1.5 segundos de notificación antes de girar
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Lado izquierdo: imagen + promo */}
            <div
                className="w-full md:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: "url('/img/img.png')" }}
            >
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center p-6">
                    <div className="text-black text-center">
                        <img src="/img/img4.png" alt="Logo" className="mx-auto mb-6 w-24" />
                        <h2 className="text-5xl font-extrabold mb-4">
                            Inicia sesión y lleva el control total de tus pedidos.
                        </h2>
                        <p className="text-lg font-medium">!Rastreos en vivo, historial de entregas*</p>
                        <p className="text-sm font-medium mt-2">*Y todo con tu medio de pago preferido!</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row min-h-screen">
                <Link
                    to="/"
                    className="fixed left-4 bottom-4 bg-transparent hover:bg-gray-100 text-blue-600 px-5 py-3 rounded-xl font-bold text-lg z-50 flex items-center gap-2 shadow-none border-none"
                    style={{ boxShadow: "none" }}
                >
                    <ArrowLeft className="w-6 h-6" />
                    Volver al Menú Principal
                </Link>
            </div>

            {/* Lado derecho: flip de formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-600 from-blue-500 via-blue-200 to-blue-100 p-6">
                <AnimatePresence>
                    {showLoginSuccess && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-green-600 border border-green-500 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
                        >
                            <CheckCircle size={20} />
                            Inicio de sesión exitoso
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="relative w-full max-w-md h-[480px] perspective">
                    <div
                        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""
                            }`}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Login */}
                        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl px-8 py-10 backface-hidden flex flex-col justify-center" style={{ backfaceVisibility: "hidden" }}>
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 p-4 rounded-full shadow-md">
                                <GiScooter className="text-white text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-center text-blue-600 mt-8 mb-4">Iniciar Sesión</h2>
                            {loginError && <p className="text-red-500 text-center text-sm mb-2">{loginError}</p>}
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <input type="email" placeholder="Correo electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" required />
                                <input type="password" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" required />
                                <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition">Entrar</button>
                            </form>
                            <p className="text-center text-sm mt-5 text-gray-600">
                                ¿No tienes cuenta?{" "}
                                <button onClick={toggleFlip} className="text-blue-500 hover:underline font-medium">Regístrate</button>
                            </p>
                        </div>

                        {/* Registro */}
                        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl px-8 py-10 backface-hidden rotate-y-180 flex flex-col justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 p-4 rounded-full shadow-md">
                                <GiScooter className="text-white text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-center text-blue-600 mt-8 mb-4">Crear Cuenta</h2>
                            {/* Notificación encima del formulario */}
                            <AnimatePresence>
                                {showNotif && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="mx-auto mb-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                                    >
                                        <CheckCircle className="text-green-300" size={22} />
                                        ¡Registro exitoso!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {regError && <p className="text-red-500 text-center text-sm mb-2">{regError}</p>}
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <input type="text" placeholder="Nombre de usuario" value={regDisplayName} onChange={(e) => setRegDisplayName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" required />
                                <input type="email" placeholder="Correo electrónico" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" required />
                                <input type="password" placeholder="Contraseña" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" required />
                                <input type="password" placeholder="Confirmar contraseña" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" required />
                                <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition">Registrarse</button>
                            </form>
                            <p className="text-center text-sm mt-5 text-gray-600">
                                ¿Ya tienes una cuenta?{" "}
                                <button onClick={toggleFlip} className="text-blue-500 hover:underline font-medium">Inicia sesión</button>
                            </p>
                        </div>
                    </div>
                </div>

                <style>{`
                    .perspective { perspective: 1000px; }
                    .transform-style-preserve-3d { transform-style: preserve-3d; }
                    .backface-hidden { backface-visibility: hidden; }
                    .rotate-y-180 { transform: rotateY(180deg); }
                `}</style>
            </div>
        </div>
    );
}
