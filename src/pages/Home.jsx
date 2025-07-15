/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import Slider from '../components/layout/Slider';
import { motion } from 'framer-motion';
import { FaLaptop, FaHamburger, FaDog, FaPills } from 'react-icons/fa';
import TestimoniosCarousel from '../components/testimonios/TestimoniosCarousel';

const Home = () => {
    const categories = [
        {
            name: "Tecnología",
            icon: <FaLaptop />,
            path: "/tecnologia",
            description: "Encuentra los mejores gadgets y dispositivos electrónicos.",
            emoji: "💻",
            title: "Vanguardia Digital",
            desc: "Innovación en tus manos. Tecnología que transforma tu día."
        },
        {
            name: "Comida",
            icon: <FaHamburger />,
            path: "/comida",
            description: "Disfruta de los mejores platos y comida de calidad.",
            emoji: "🍔",
            title: "Sabor Imparable",
            desc: "Comidas rápidas, sabrosas y perfectas para cualquier momento."
        },
        {
            name: "Mascotas",
            icon: <FaDog />,
            path: "/mascotas",
            description: "Todo lo necesario para tus amigos peludos.",
            emoji: "🐾",
            title: "Mimos Peludos",
            desc: "Todo lo que tus mascotas necesitan para vivir felices y saludables."
        },
        {
            name: "Farmacia",
            icon: <FaPills />,
            path: "/farmacia",
            description: "Productos de salud y bienestar para ti y tu familia.",
            emoji: "💊",
            title: "Salud a Un Clic",
            desc: "Bienestar instantáneo para ti y tu familia, sin complicaciones."
        }
    ];

    const benefits = [
        {
            icon: "🚚",
            title: "Envío Rápido",
            desc: "Tu pedido llega en tiempo récord, sin complicaciones.",
        },
        {
            icon: "📦",
            title: "Empaque Seguro",
            desc: "Nos aseguramos de que todo llegue en perfectas condiciones.",
        },
        {
            icon: "⭐",
            title: "Clientes Felices",
            desc: "Nuestra prioridad es tu satisfacción y confianza.",
        },
    ];

    const faqs = [
        {
            question: "¿Cómo realizar un pedido?",
            answer: "Selecciona la categoría de productos que deseas, agrega los productos a tu carrito y sigue el proceso de pago."
        },
        {
            question: "¿Puedo devolver un producto?",
            answer: "Sí, si el producto no cumple con tus expectativas o está defectuoso, puedes devolverlo siguiendo nuestra política de devoluciones."
        },
        {
            question: "¿Cuánto tiempo tarda el envío?",
            answer: "Los envíos pueden tardar entre 1 y 5 días hábiles, dependiendo de tu ubicación."
        }
    ];

    return (
        <div className="w-full">

            {/* Slider */}
            <section className="mb-12">
                <Slider />
            </section>

            {/* Sección Introductoria Destacada */}
            <section className="mt-16 mb-4 px-6 bg-white text-center">
                <motion.h1
                    className="text-5xl font-extrabold mb-6 text-slate-900"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Pide lo que quieras sin salir, con un solo click, te va a venir.
                </motion.h1>
                <motion.p
                    className="text-lg max-w-3xl mx-auto text-slate-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Explora todos los productos que tenemos disponibles para ti: tecnología, comida, mascotas, salud ¡y más!
                </motion.p>
            </section>

            {/* Categorías Mejoradas */}
            <section className="py-8 px-6 bg-[#f0f4ff]" id="categorias">
                <motion.h2
                    className="text-4xl font-extrabold text-center text-black mb-14"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Explora nuestras experiencias
                </motion.h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-stretch">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -8 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="h-full" // <-- Asegura que el motion.div ocupe toda la altura disponible
                        >
                            <Link
                                to={category.path}
                                className="rounded-3xl p-8 border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all transform text-center h-full flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-6xl mb-4 animate-bounce">{category.emoji}</div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-800">{category.title}</h3>
                                    <p className="text-slate-600">{category.desc}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Sección de Beneficios */}
            <section className="py-20 px-6 bg-[#fef8f3]" id="beneficios">
                <motion.h2
                    className="text-4xl font-extrabold text-center text-black mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    ¿Por qué elegirnos?
                </motion.h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-8 text-center"
                            whileHover={{ scale: 1.03 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold text-black mb-2">{item.title}</h3>
                            <p className="text-gray-700">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <TestimoniosCarousel />

            {/* FAQs Mejoradas */}
            <section className="py-20 px-6 bg-[#fffaf4]" id="faq">
                <motion.h2
                    className="text-4xl font-bold text-center text-black mb-14"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Preguntas Frecuentes
                </motion.h2>
                <div className="max-w-3xl mx-auto space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white border border-black rounded-xl shadow transition hover:shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <details className="group p-5 cursor-pointer open:bg-blue-50 transition-all duration-300">
                                <summary className="flex justify-between items-center font-semibold text-black text-lg">
                                    {faq.question}
                                    <span className="text-black group-open:rotate-180 transition-transform duration-300">
                                        ▼
                                    </span>
                                </summary>
                                <p className="mt-3 text-gray-700">{faq.answer}</p>
                            </details>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
