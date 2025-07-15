/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../product/ProductCard";
import { useEffect, useState } from "react";
import useProducts from "../../services/useProducts";
import Footer from "./Footer";
import { useCart } from "../../context/CartContext"; // 👉 importa CartContext
import { CheckCircle } from "lucide-react";

function Busqueda() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const [searchInput, setSearchInput] = useState(query || "");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const allProducts = useProducts();
    const { addItem } = useCart(); // 👉 usa addItem

    const [showNotif, setShowNotif] = useState(false);

    // Búsqueda de productos
    useEffect(() => {
        if (query) {
            fetchResults(query);
        }
    }, [query, allProducts]);

    const fetchResults = (searchTerm) => {
        setLoading(true);
        setError(null);
        try {
            const filtered = allProducts.filter((product) =>
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filtered);
        } catch (err) {
            setError("Error al cargar los resultados");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = searchInput.trim();
        if (searchTerm) {
            navigate(`/busqueda?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const clearSearch = () => {
        setSearchInput("");
        setResults([]);
        navigate("/busqueda");
    };

    const handleAddToCart = (product) => {
        addItem(product);
        setShowNotif(true);

        setTimeout(() => {
            setShowNotif(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Barra de búsqueda */}
                    <div className="mb-10">
                        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                            <div className="flex shadow-sm rounded-lg overflow-hidden">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="flex-grow px-5 py-3 focus:outline-none border border-gray-300 rounded-l-lg"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <FaSearch className="inline mr-2" />
                                    Buscar
                                </button>
                            </div>
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-32 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label="Limpiar búsqueda"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Resultados */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center">
                                <FaSpinner className="animate-spin mr-3 text-blue-600 text-2xl" />
                                <span className="text-gray-600">Buscando productos...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : query ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                                Resultados para: <span className="text-blue-600">"{query}"</span>
                            </h1>

                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onAddToCart={() => handleAddToCart(product)} // 👈 pasa handler real
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                                        No se encontraron resultados para "{query}"
                                    </h3>
                                    <p className="text-gray-500">
                                        Intenta con diferentes términos de búsqueda
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                Busca productos en nuestro catálogo
                            </h3>
                            <p className="text-gray-500">
                                Escribe en la barra de búsqueda para encontrar lo que necesitas
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Notificación */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                    >
                        <CheckCircle className="text-green-300" size={22} />
                        ¡Agregado al carrito!
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

export default Busqueda;
