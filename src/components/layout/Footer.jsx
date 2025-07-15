import React from 'react';
import {
    Instagram,
    Facebook,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    Clock,
    Truck,
    Star,
    ChevronRight
} from 'lucide-react';

const Footer = ({ categories = [] }) => {
    const year = new Date().getFullYear();

    const handleLinkClick = (path) => {
        console.log(`Navigate to: ${path}`);
        // Aquí puedes manejar la navegación según tu router
    };

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-500 rounded-full blur-2xl"></div>
            </div>

            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4 animate-pulse">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                QuickDelivery
                            </h2>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Entregamos tus productos favoritos de forma rápida y segura.
                            Tu satisfacción es nuestra prioridad número uno.
                        </p>
                        <div className="flex items-center space-x-2 text-emerald-400 mb-4">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-300 ml-2">4.9/5 (2,450+ reseñas)</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400">Entregas hoy</p>
                                    <p className="text-2xl font-bold text-emerald-400">1,247</p>
                                </div>
                                <div className="text-emerald-400">
                                    <Truck className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6 text-white relative">
                            Enlaces rápidos
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => handleLinkClick('/')}
                                    className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 group w-full text-left"
                                >
                                    <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                                    Inicio
                                </button>
                            </li>
                            {categories && categories.length > 0 && (
                                categories.map((cat, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleLinkClick(cat.path || '/')}
                                            className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 group w-full text-left"
                                        >
                                            <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                                            {cat.label || cat}
                                        </button>
                                    </li>
                                ))
                            )}
                            <li>
                                <button
                                    onClick={() => handleLinkClick('/login')}
                                    className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 group w-full text-left"
                                >
                                    <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                                    Iniciar sesión
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleLinkClick('/about')}
                                    className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 group w-full text-left"
                                >
                                    <ChevronRight className="w-4 h-4 mr-2 text-blue-400 group-hover:text-blue-300" />
                                    Sobre nosotros
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6 text-white relative">
                            Contacto
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center group cursor-pointer">
                                <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <a
                                        href="mailto:contacto@quickdelivery.com"
                                        className="text-gray-300 hover:text-white transition-colors text-sm"
                                    >
                                        contacto@quickdelivery.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center group cursor-pointer">
                                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-colors">
                                    <Phone className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <a
                                        href="tel:+1234567890"
                                        className="text-gray-300 hover:text-white transition-colors text-sm"
                                    >
                                        +1 234 567 890
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start group cursor-pointer">
                                <div className="bg-purple-500/20 p-2 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Av. Principal 123<br />
                                        Lima, Perú
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center group">
                                <div className="bg-orange-500/20 p-2 rounded-lg mr-3 group-hover:bg-orange-500/30 transition-colors">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Lun - Dom: 8:00 - 23:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media & Newsletter */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6 text-white relative">
                            Síguenos
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </h3>
                        <div className="flex space-x-4 mb-6">
                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="group relative"
                            >
                                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl transform group-hover:scale-110 transition-transform duration-200 shadow-lg group-hover:shadow-pink-500/25">
                                    <Instagram className="w-5 h-5 text-white" />
                                </div>
                            </a>
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="group relative"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl transform group-hover:scale-110 transition-transform duration-200 shadow-lg group-hover:shadow-blue-500/25">
                                    <Facebook className="w-5 h-5 text-white" />
                                </div>
                            </a>
                            <a
                                href="https://wa.me/1234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="group relative"
                            >
                                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl transform group-hover:scale-110 transition-transform duration-200 shadow-lg group-hover:shadow-green-500/25">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                            </a>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                            <h4 className="text-sm font-medium text-white mb-2">📧 Newsletter</h4>
                            <p className="text-xs text-gray-400 mb-3">Recibe ofertas exclusivas y novedades</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="flex-1 bg-slate-700 text-white text-sm px-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                />
                                <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
                                    Suscribir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700 mb-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between text-sm space-y-4 md:space-y-0">
                    <div className="text-gray-400">
                        &copy; {year} QuickDelivery. Todos los derechos reservados.
                    </div>
                    <div className="flex flex-wrap items-center space-x-6 text-gray-400">
                        <button onClick={() => handleLinkClick('/privacy')} className="hover:text-white transition-colors">
                            Política de Privacidad
                        </button>
                        <button onClick={() => handleLinkClick('/terms')} className="hover:text-white transition-colors">
                            Términos de Servicio
                        </button>
                        <button onClick={() => handleLinkClick('/cookies')} className="hover:text-white transition-colors">
                            Cookies
                        </button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t border-slate-700">
                    <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
                        <div className="text-xs text-gray-400 flex items-center bg-slate-800/30 px-3 py-2 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            🔒 SSL Seguro
                        </div>
                        <div className="text-xs text-gray-400 flex items-center bg-slate-800/30 px-3 py-2 rounded-full">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                            ✅ Entrega Garantizada
                        </div>
                        <div className="text-xs text-gray-400 flex items-center bg-slate-800/30 px-3 py-2 rounded-full">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                            🎧 Soporte 24/7
                        </div>
                        <div className="text-xs text-gray-400 flex items-center bg-slate-800/30 px-3 py-2 rounded-full">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                            💳 Pago Seguro
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;