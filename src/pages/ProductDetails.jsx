/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../services/useProducts';
import RelatedProducts from '../components/product/RelatedProducts';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const navigate = useNavigate();
    const { categoria, id } = useParams();
    const products = useProducts();
    const { addItem } = useCart();
    const [showNotif, setShowNotif] = useState(false);

    if (products.length === 0)
        return (
            <p className="text-center text-gray-500 mt-10 animate-pulse">
                Cargando producto...
            </p>
        );

    const product = products.find(p => p.id === Number(id) && p.categoria === categoria);

    if (!product)
        return (
            <p className="text-center text-gray-600 mt-10">Producto no encontrado 😥</p>
        );

    const handleAddToCart = () => {
        addItem(product);
        setShowNotif(true);

        setTimeout(() => {
            setShowNotif(false);
        }, 2000);
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-10"
                >
                    <ArrowLeft size={20} />
                </button>

                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow">
                    Nuevo
                </span>

                <img
                    src={product.imgurl}
                    alt={product.nombre}
                    className="w-full max-w-md h-80 object-contain rounded-2xl mb-6 mx-auto"
                    style={{ maxHeight: '320px' }}
                />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.nombre}</h1>
            <p className="text-indigo-600 text-2xl font-semibold mb-6">S/ {product.precio}</p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">{product.descripcion}</p>

            <button
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow active:scale-95 mb-4"
                onClick={handleAddToCart}
            >
                Agregar al carrito 🛒
            </button>

            <RelatedProducts
                products={products}
                currentCategory={product.categoria}
                currentProductId={product.id}
            />

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
        </motion.div>
    );
};

export default ProductDetails;
