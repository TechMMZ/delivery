/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, User, LogOut, Home, HelpCircle, Facebook } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

const CategoriesList = ({ categories, onClose, currentPath }) => (
    <div className="mt-2">
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
            Categorías
        </h3>
        {categories.map((cat) => (
            <Link
                key={cat.label}
                to={cat.path}
                onClick={onClose}
                className={`flex items-center gap-3 pl-5 px-4 py-3 rounded-lg transition-colors ${currentPath === cat.path ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-700'
                    }`}
            >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.label}
            </Link>
        ))}
    </div>
);

const MobileMenu = ({ open, onClose, user, handleLogout, categories, profilePic }) => {
    const menuRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            <motion.div
                ref={menuRef}
                className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col overflow-y-auto"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Header */}
                <div className="p-5 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                            {user ? (
                                <img
                                    src={profilePic || (user.photo_url ? `${API_URL}${user.photo_url}` : "/img/user.png")}
                                    alt="Avatar"
                                    className="w-10 h-10 object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-gray-600" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium pl-5">{user ? `Hola, ${user.displayname || 'Usuario'}` : 'Bienvenido'}</p>
                            {user ? (
                                <p className="text-xs pl-5 text-gray-500 text-center">{user.email}</p>
                            ) : (
                                <Link to="/login" onClick={onClose} className="text-xs text-blue-600 hover:underline">
                                    Inicia sesión
                                </Link>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-0 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-8 text-gray-900" />
                    </button>
                </div>

                {/* Menu Links */}
                <div className="p-4 space-y-1">
                    <Link
                        to="/"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        <Home className="w-5 h-5" /> Inicio
                    </Link>

                    {/* Categorías */}
                    <CategoriesList categories={categories} onClose={onClose} currentPath={location.pathname} />

                    {/* Cuenta */}
                    <div className="mt-2">
                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                            Mi cuenta
                        </h3>
                        {user ? (
                            <>
                                <Link
                                    to="/perfil"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                                >
                                    <User className="w-5 h-5" /> Mi Perfil
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                                >
                                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                            >
                                <User className="w-5 h-5" /> Iniciar Sesión
                            </Link>
                        )}
                    </div>

                    {/* Ayuda */}
                    <div className="mt-2">
                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                            Ayuda
                        </h3>
                        <button
                            type="button"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 w-full cursor-default"
                            disabled
                        >
                            <HelpCircle className="w-5 h-5" /> Centro de ayuda
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t mt-auto bg-gray-50">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition-colors">
                            <FaInstagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors">
                            <FaWhatsapp className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="text-center text-xs text-gray-500 space-y-1">
                        <p>© {new Date().getFullYear()} QuickDelivery</p>
                        <div className="flex justify-center space-x-3">
                            <Link to="/terminos" onClick={onClose} className="hover:underline">Términos</Link>
                            <Link to="/privacidad" onClick={onClose} className="hover:underline">Privacidad</Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default MobileMenu;
