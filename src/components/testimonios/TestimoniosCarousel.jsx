/* eslint-disable no-unused-vars */
import ReactSlick from "react-slick";
import { motion } from "framer-motion";
import PrevArrow from "./PrevArrow";
import NextArrow from "./NextArrow";

const testimonios = [
    {
        name: "Lucía Martínez",
        image: "/img/img-testimonios/persona2.jpg",
        text: "¡Increíble servicio! Mi pedido llegó en menos de una hora y en perfecto estado.",
    },
    {
        name: "Carlos Torres",
        image: "/img/img-testimonios/persona1.jpg",
        text: "Me encantó la variedad de productos. Todo fue rápido, seguro y confiable.",
    },
    {
        name: "Ana González",
        image: "/img/img-testimonios/persona3.jpg",
        text: "Mis mascotas ahora reciben sus productos a domicilio sin estrés. ¡Gracias!",
    },
    {
        name: "Javier Huamán",
        image: "/img/img-testimonios/persona4.jpg",
        text: "Servicio 10/10. Repetiré sin duda. Muy recomendado.",
    },
    {
        name: "Franco López",
        image: "/img/img-testimonios/persona5.jpg",
        text: "Gran atención y productos de calidad. ¡Felicitaciones al equipo!",
    },
];

const TestimoniosCarousel = () => {
    return (
        <section className="py-20 px-6 bg-[#f0f4ff] relative" id="testimonios">
            <motion.h2
                className="text-4xl font-extrabold text-center text-black mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Clientes Felices
            </motion.h2>

            <div className="max-w-6xl mx-auto relative">
                <ReactSlick
                    dots={true}
                    infinite={true}
                    autoplay={true}
                    speed={800}
                    autoplaySpeed={5000}
                    slidesToShow={3}
                    slidesToScroll={1}
                    arrows={true}
                    prevArrow={<PrevArrow />}
                    nextArrow={<NextArrow />}
                    responsive={[
                        { breakpoint: 1024, settings: { slidesToShow: 2 } },
                        { breakpoint: 640, settings: { slidesToShow: 1 } },
                    ]}
                >
                    {testimonios.map((item, i) => (
                        <div key={i} className="px-4">
                            <motion.div
                                className="bg-white border border-gray-300 rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg h-full"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-600"
                                />
                                <p className="text-gray-700 italic mb-4">"{item.text}"</p>
                                <p className="font-semibold text-indigo-700">{item.name}</p>
                            </motion.div>
                        </div>
                    ))}
                </ReactSlick>
            </div>
        </section>
    );
};

export default TestimoniosCarousel;
