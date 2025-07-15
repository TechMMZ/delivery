import React, { useEffect, useState } from "react";

const RobotIntro = () => {
    const [showBubble, setShowBubble] = useState(false);
    const [showRobot, setShowRobot] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    useEffect(() => {
        // Moto avanza durante 2s, luego se detiene (sin desaparecer)
        const endTimer = setTimeout(() => {
            setAtEnd(true); // Moto llegó al final
            setShowBubble(true); // Aparece la burbuja

            // Después de 1s, desaparecen ambos
            const hideTimer = setTimeout(() => {
                setShowBubble(false);
                setShowRobot(false);
            }, 5000);

            return () => clearTimeout(hideTimer);
        }, 2000); // 2s de animación de avance

        return () => clearTimeout(endTimer);
    }, []);

    return (
        <>
            {showRobot && (
                <img
                    src="/img/chatrobot5.webp"
                    alt="Asistente chatbot"
                    className={
                        atEnd
                            ? "fixed bottom-4 right-[40px] z-50 w-48 pointer-events-none"
                            : "fixed bottom-4 left-0 z-50 w-48 pointer-events-none animate-ride-across"
                    }
                    style={{ transition: "opacity 0.5s" }}
                />
            )}
            {showBubble && (
                <div className="fixed bottom-[222px] right-[40px] z-50 bg-white text-gray-800 text-sm px-4 py-2 rounded-xl shadow-md animate-fadeIn transition-opacity duration-1000 w-64 text-center border border-black">
                    Bienvenido a la Página de <strong>QuickDelivery</strong>:<br />
                    <span className="text-blue-600 font-semibold">
                        Si presionas aquí, mi compañero; <strong>"ROBOTQUICK"</strong> te ayudará con tu pedido.
                    </span>
                    <div className="text-2xl mt-1 animate-wiggle">👉</div>
                </div>
            )}
        </>
    );
};

export default RobotIntro;