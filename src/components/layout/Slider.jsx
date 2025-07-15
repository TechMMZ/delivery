/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSliderImages from '../../hook/useSliderImagen';

const Slider = () => {
    const images = useSliderImages();
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState(false);

    // Precargar imágenes
    useEffect(() => {
        if (images.length === 0) return;

        let loadedCount = 0;
        const totalImages = images.length;

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Error loading image: ${src}`);
                    setLoadingError(true);
                    reject();
                };
                img.src = src;
            });
        };

        const loadAllImages = async () => {
            try {
                await Promise.all(images.map(img => loadImage(img.url)));
            } catch (error) {
                console.error('Error loading images:', error);
                setLoadingError(true);
            }
        };

        loadAllImages();
    }, [images]);

    const nextSlide = () => {
        if (isTransitioning || !imagesLoaded) return;
        setIsTransitioning(true);
        setCurrent((prev) => (prev + 1) % images.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        if (isTransitioning || !imagesLoaded) return;
        setIsTransitioning(true);
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Auto slide cada 7s
    useEffect(() => {
        if (!imagesLoaded) return;

        const interval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 7000);
        return () => clearInterval(interval);
    }, [isTransitioning, imagesLoaded]);

    if (images.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden h-[300px] md:h-[450px] transition-all duration-700 bg-gradient-to-br from-gray-100 via-white to-gray-50">
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent z-10" />

            {/* Gradientes laterales */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-300/90 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-300/90 to-transparent z-10" />

            {/* Estado de carga */}
            {!imagesLoaded && !loadingError && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
                </div>
            )}

            {/* Mensaje de error */}
            {loadingError && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center p-4">
                        <p className="text-gray-700">Error al cargar las imágenes</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {/* Imagen actual */}
            <div className="relative w-full h-full flex items-center justify-center">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-500 transform ${index === current && imagesLoaded
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                            }`}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={image.url}
                                alt={image.title || `Imagen ${index + 1}`}
                                className="max-w-full max-h-full object-contain"
                                onError={() => setLoadingError(true)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Botones de navegación */}
            {imagesLoaded && !loadingError && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-gray-700 bg-white/80 hover:bg-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-gray-200 shadow-sm"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-gray-700 bg-white/80 hover:bg-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-gray-200 shadow-sm"
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (!isTransitioning) {
                                        setIsTransitioning(true);
                                        setCurrent(index);
                                        setTimeout(() => setIsTransitioning(false), 500);
                                    }
                                }}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index
                                    ? 'bg-gray-700 scale-125'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Ir a slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Slider;