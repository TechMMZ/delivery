/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, User } from 'lucide-react';
import { FaLaptop, FaSearch } from 'react-icons/fa';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import Cart from '../../pages/Cart';
import MobileMenu from './MobileMenu';
import CerrarSesionModal from '../perfil/CerrarSesionModal';  // ✅ falta este 
import { Smartphone, Utensils, Pill, Dog } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const categories = [
    { label: '💻 Tecnología', path: '/tecnologia' },
    { label: '🍔 Comida', path: '/comida' },
    { label: '🐶 Mascotas', path: '/mascotas' },
    { label: '💊 Farmacia', path: '/farmacia' },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const openLogoutModal = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    useEffect(() => {
        setSearchQuery('');
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/busqueda?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
        return () => (document.body.style.overflow = 'auto');
    }, [menuOpen]);

    return (
        <header className="relative z-50 bg-[#2563eb] shadow-md">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
                <button onClick={toggleMenu} className='text-white hover:text-black'><Menu /></button>

                <Link to="/" className="text-xl md:text-2xl font-bold">
                    <span className="text-white">Quick</span>
                    <span className="text-black">Delivery</span>
                </Link>

                {/* Desktop search bar */}
                <motion.div
                    className="hidden md:flex items-center w-80 bg-white/10 rounded-full px-4 py-2 shadow-inner"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <form onSubmit={handleSearch} className="flex items-center w-full">
                        <FaSearch className="text-white cursor-pointer font-bold hover:text-gray-200" onClick={handleSearch} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar productos..."
                            className="bg-transparent w-full outline-none ml-2 text-white placeholder-white font-bold"
                        />
                    </form>
                </motion.div>

                {/* Mobile icons */}
                <div className="flex items-center space-x-4 md:hidden">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar..."
                            className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-white placeholder-white w-32 font-bold"
                        />
                    </form>
                    <Link to={user ? "/perfil" : "/login"}>
                        {user ? (
                            <img
                                src={user.photo_url ? `${API_URL}${user.photo_url}` : "/img/user.png"}
                                alt="Avatar"
                                className="w-7 h-7 rounded-full object-cover border border-white hover:border-black transition"
                            />
                        ) : (
                            <User className="w-5 h-5 text-white hover:text-black" />
                        )}
                    </Link>

                    <button onClick={() => setShowCart(true)}>
                        <ShoppingCart className="w-5 h-5 text-white hover:text-black" />
                    </button>
                </div>

                {/* Desktop navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="text-white font-semibold hover:text-black">Categorías</button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="z-50 bg-white shadow rounded p-2 space-y-1 text-sm">
                                {categories.map((cat) => (
                                    <DropdownMenu.Item
                                        key={cat.label}
                                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                        onSelect={() => navigate(cat.path)}
                                    >
                                        {cat.label}
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    <Link to={user ? "/perfil" : "/login"}>
                        {user ? (
                            <img
                                src={user.photo_url ? `${API_URL}${user.photo_url}` : "/img/user.png"}
                                alt="Avatar"
                                className="w-7 h-7 rounded-full object-cover border border-white hover:border-black transition"
                            />
                        ) : (
                            <User className="w-5 h-5 text-white font-semibold hover:text-black" />
                        )}
                    </Link>

                    <button onClick={() => setShowCart(true)}>
                        <ShoppingCart className="w-5 h-5 text-white font-semibold hover:text-black" />
                    </button>
                </nav>
            </div>

            <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
            <MobileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                categories={categories}
                user={user}
                handleLogout={openLogoutModal}
            />

            {/* ✅ Modal de cierre de sesión */}
            {showLogoutModal && (
                <CerrarSesionModal
                    onClose={closeLogoutModal}
                    onConfirm={async () => {
                        await logout();
                        closeLogoutModal();
                        setMenuOpen(false);
                        navigate("/");
                    }}
                />
            )}
        </header>
    );
};

export default Navbar;

