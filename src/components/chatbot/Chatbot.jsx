/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { FaRobot, FaHistory, FaTrash } from "react-icons/fa";
import Fuse from "fuse.js";
import useProducts from "../../services/useProducts";
import RobotIntro from "./RobotIntro";
import {
    createChat,
    getChatHistory,
    getChat,
    addMessage,
    deleteChat as deleteChatApi,
    updateChatTitle as updateChatTitleApi,
    getUserMessagesCount,
    getBestCategoryFromGPT
} from "../../services/ChatbotApi";

const API_URL = import.meta.env.VITE_API_URL;

const Chatbot = () => {
    const COLOR_PRIMARY = "#2563eb";
    const { user } = useContext(AuthContext);
    const { addItem } = useCart();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showRobotIntro, setShowRobotIntro] = useState(false); // NUEVO
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [step, setStep] = useState("menu");
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const isCreatingRef = useRef(false);
    const [products, setProducts] = useState([]);

    // Estados para el historial de chats
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoadingChat, setIsLoadingChat] = useState(false);

    const messagesEndRef = useRef(null);
    const COLLECTIONS = ["tecnologia", "food", "mascotas", "farmacia"];
    const COLLECTIONS_LABELS = {
        tecnologia: "Tecnología",
        food: "Comida",
        mascotas: "Mascotas",
        farmacia: "Farmacia",
    };

    // Mensaje inicial del bot
    const INITIAL_BOT_MESSAGE = {
        from: "bot",
        text: "¡Hola! Soy ROBOTQUICK, este es nuestro chat, te puedo a ayudar a realizar tu pedido de manera mas rapida y eficiente ¿Qué categoría te interesa? Puedes escribir o seleccionar una.",
        timestamp: new Date()
    };

    // Función para crear un nuevo chat
    const createNewChat = async () => {
        if (!user) return null;
        console.log("createNewChat llamada para usuario:", user.id);
        try {
            const data = await createChat(user);
            console.log("Nuevo chat creado con ID:", data.chatId);

            setCurrentChatId(data.chatId);

            // Cargar mensajes reales
            await loadChat(data.chatId);

            return data.chatId;
        } catch (err) {
            console.error("Error creando chat:", err);
            return null;
        }
    };

    // Función para cargar historial
    const loadChatHistory = async () => {
        if (!user) return;
        try {
            const chats = await getChatHistory(user.id);
            setChatHistory(chats);
        } catch (err) {
            console.error("Error al cargar historial:", err);
        }
    };

    // Función para cargar un chat específico
    const loadChat = async (chatId) => {
        setIsLoadingChat(true);
        try {
            const msgs = await getChat(chatId);

            setMessages(
                msgs.map(m => ({
                    from: m.sender,
                    text: m.text,
                    timestamp: new Date(m.timestamp)
                }))
            );
            setCurrentChatId(chatId);
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        } finally {
            setIsLoadingChat(false);
        }
    };

    // Función para enviar mensajes al backend
    const addMessageToChat = async (sender, text) => {
        if (!currentChatId) return;
        try {
            await addMessage(currentChatId, sender, text);
        } catch (err) {
            console.error("Error guardando mensaje:", err);
        }
    };

    // Función para eliminar un chat
    const deleteChat = async (chatId) => {
        try {
            await deleteChatApi(chatId);
            if (currentChatId === chatId) {
                await createNewChat();
            }
            await loadChatHistory();
        } catch (err) {
            console.error("Error al eliminar chat:", err);
        }
    };

    // Cargar datos de productos
    useEffect(() => {
        const fetchData = async () => {
            const data = {};

            for (const colName of COLLECTIONS) {
                const apiMap = {
                    tecnologia: 'tecnologia',
                    food: 'comida',
                    mascotas: 'mascota',
                    farmacia: 'farmacia',
                };

                const apiRoute = apiMap[colName];
                const response = await fetch(`${API_URL}/api/${apiRoute}`);

                if (!response.ok) {
                    console.error(`Error al cargar ${colName}`);
                    continue;
                }

                const products = await response.json();

                for (const item of products) {
                    const subcat = item.categoria || "Sin subcategoría";
                    if (!data[colName]) data[colName] = {};
                    if (!data[colName][subcat]) data[colName][subcat] = [];

                    data[colName][subcat].push({
                        id: item.id,
                        nombre: item.nombre,
                        descripcion: item.descripcion,
                        precio: item.precio,
                        stock: item.stock,
                        imgUrl: item.imgUrl,
                    });
                }
            }

            setCategories(data);

            // Aplanar todos los productos en un solo array
            const allProducts = [];
            for (const cat of Object.values(data)) {
                for (const subcat of Object.values(cat)) {
                    allProducts.push(...subcat);
                }
            }

            setProducts(allProducts);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!user) return;

        const start = async () => {
            if (isCreatingRef.current) return;

            isCreatingRef.current = true;

            try {
                const res = await fetch(`${API_URL}/api/chats?userId=${user.id}`);
                const chats = await res.json();

                setChatHistory(chats);

                if (chats.length === 0) {
                    await createNewChat();
                } else {
                    setCurrentChatId(chats[0].id);
                    await loadChat(chats[0].id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                isCreatingRef.current = false;
            }
        };

        start();

        return () => {
            isCreatingRef.current = false;
        };
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Actualizar título del chat
    const updateChatTitle = async (chatId, title) => {
        try {
            await updateChatTitleApi(chatId, title);
            console.log('Título actualizado:', title);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (step === "menu") {
            const keys = Object.keys(categories);
            const fuse = new Fuse(keys, { includeScore: true, threshold: 0.4 });
            const results = fuse.search(input);
            const matches = results.map((r) => r.item).slice(0, 5);
            setSuggestions(matches);
        } else if (step === "subcategoria" && selectedCategory) {
            const subcats = Object.keys(categories[selectedCategory]);
            const fuse = new Fuse(subcats, { includeScore: true, threshold: 0.4 });
            const results = fuse.search(input);
            const matches = results.map((r) => r.item).slice(0, 5);
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    }, [input, step, selectedCategory]);

    const sendMessage = (from, text) => {
        const newMessage = {
            from,
            text,
            timestamp: new Date()
        };
        setMessages((msgs) => [...msgs, newMessage]);
    };

    const getAllProducts = () => {
        const products = [];
        for (const category in categories) {
            for (const subcat in categories[category]) {
                for (const product of categories[category][subcat]) {
                    products.push({
                        name: product.nombre,
                        category,
                        subcat,
                        productData: product
                    });
                }
            }
        }
        return products;
    };

    const performIntelligentSearch = (searchText) => {
        const allProducts = getAllProducts();
        const categoryKeys = Object.keys(categories);
        const subcategoryKeys = categoryKeys.flatMap(cat =>
            Object.keys(categories[cat] || {})
        );

        // 1. BÚSQUEDA EXACTA EN PRODUCTOS (prioridad máxima)
        const exactProductMatches = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        );

        // 2. BÚSQUEDA EXACTA EN SUBCATEGORÍAS
        const exactSubcategoryMatches = subcategoryKeys.filter(subcat =>
            subcat.toLowerCase().includes(searchText.toLowerCase())
        );

        // 3. BÚSQUEDA EXACTA EN CATEGORÍAS
        const exactCategoryMatches = categoryKeys.filter(cat =>
            (COLLECTIONS_LABELS[cat] || cat).toLowerCase().includes(searchText.toLowerCase())
        );

        // 4. Si no hay coincidencias exactas, buscar aproximadas con Fuse.js
        let fuzzyProductMatches = [];
        let fuzzySubcategoryMatches = [];
        let fuzzyCategoryMatches = [];

        if (exactProductMatches.length === 0 && exactSubcategoryMatches.length === 0 && exactCategoryMatches.length === 0) {
            // Búsqueda aproximada en productos
            const productFuse = new Fuse(allProducts, {
                keys: ['name'],
                includeScore: true,
                threshold: 0.4,
                ignoreLocation: true,
                minMatchCharLength: 2,
            });
            fuzzyProductMatches = productFuse.search(searchText).slice(0, 5);

            // Búsqueda aproximada en subcategorías
            const subcatFuse = new Fuse(subcategoryKeys, {
                includeScore: true,
                threshold: 0.4,
                ignoreLocation: true,
                minMatchCharLength: 2,
            });
            fuzzySubcategoryMatches = subcatFuse.search(searchText).slice(0, 3);

            // Búsqueda aproximada en categorías
            const catFuse = new Fuse(categoryKeys, {
                includeScore: true,
                threshold: 0.4,
                ignoreLocation: true,
                minMatchCharLength: 2,
            });
            fuzzyCategoryMatches = catFuse.search(searchText).slice(0, 3);
        }

        return {
            exactProducts: exactProductMatches,
            exactSubcategories: exactSubcategoryMatches,
            exactCategories: exactCategoryMatches,
            fuzzyProducts: fuzzyProductMatches,
            fuzzySubcategories: fuzzySubcategoryMatches,
            fuzzyCategories: fuzzyCategoryMatches
        };
    };

    function showProductResults(results) {
        const maxResults = 10;
        const shown = results.slice(0, maxResults);

        let text = `🔍 Encontré ${results.length} coincidencia${results.length > 1 ? 's' : ''}:\n\n`;

        shown.forEach((item, index) => {
            const p = item;
            text += `${index + 1}. **${p.nombre || "Producto sin nombre"}**\n`;
            text += `💰 S/ ${p.precio || "0"} | 📦 Stock: ${p.stock || 0}\n`;
            text += `📂 Categoría: ${p.categoria || "No especificada"}\n\n`;
        });

        if (results.length > maxResults) {
            text += `... y ${results.length - maxResults} resultados más.`;
        }

        return text;
    }

    const handleUserInput = async (text) => {
        const newUserMsg = { from: "user", text, timestamp: new Date() };
        setMessages(prev => [...prev, newUserMsg]);

        // Ejemplo: obtener la mejor categoría sugerida por GPT
        try {
            const categoriaSugerida = await getBestCategoryFromGPT(text);
            if (categoriaSugerida) {
                setSelectedCategory(categoriaSugerida);
                setStep("subcategoria");
                sendMessage("bot", `¿Te refieres a la categoría **${COLLECTIONS_LABELS[categoriaSugerida] || categoriaSugerida}**?`);
                // Aquí puedes continuar tu lógica...
                return;
            }
        } catch (error) {
            console.error("Error obteniendo la mejor categoría:", error);
        }

        try {
            const data = await getUserMessagesCount(currentChatId);

            if (data.count === 0) {
                const newTitle = text.slice(0, 50);
                await updateChatTitle(currentChatId, newTitle);
                setChatHistory(prev =>
                    prev.map(chat => (chat.id === currentChatId ? { ...chat, title: newTitle } : chat))
                );
            }
        } catch (err) {
            console.error("Error consultando o actualizando título:", err);
        }

        await addMessageToChat("user", text);

        const processingMsg = {
            from: "bot",
            text: "Procesando tu solicitud...",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, processingMsg]);
        await addMessageToChat("bot", processingMsg.text);

        // Buscar productos solo si products ya están cargados
        const searchResults = performIntelligentSearch(text);
        const results = searchResults.exactProducts.length
            ? searchResults.exactProducts
            : searchResults.fuzzyProducts.map(r => r.item);
        const maxToShow = 10;
        const filteredMessages = prev => prev.filter(msg => msg !== processingMsg);

        if (results.length === 0) {
            const finalBotMsg = {
                from: "bot",
                text: `😕 No encontré resultados para la búsqueda relacionada con "${text}".`,
                timestamp: new Date(),
            };

            setMessages(prev => [...filteredMessages(prev), finalBotMsg]);
            setSearchResults([]);
            setStep("menu");

            await addMessageToChat("bot", finalBotMsg.text);
        } else {
            let messageText = "";

            if (results.length === 1) {
                messageText = `🔍 Encontré 1 producto relacionado con la búsqueda "${text}":`;
            } else if (results.length > maxToShow) {
                messageText = `🔎 Se encontraron ${results.length} productos relacionados con "${text}". Mostrando los 10 más relevantes:`;
            } else {
                messageText = `🔎 Estos son los ${results.length} productos más cercanos a la búsqueda relacionada con "${text}":`;
            }

            const resultBotMsg = {
                from: "bot",
                text: messageText,
                timestamp: new Date(),
            };

            setMessages(prev => [...filteredMessages(prev), resultBotMsg]);
            setSearchResults(results.slice(0, maxToShow));
            setStep("search_results");

            await addMessageToChat("bot", resultBotMsg.text);
        }

        window.__updateCount = (window.__updateCount || 0) + 1;
        console.log("handleUserInput ejecutado", window.__updateCount);
    };

    const handleSuggestionClick = (s) => {
        setSuggestions([]);
        if (step === "menu") {
            handleCategorySelect(s);
        } else if (step === "subcategoria") {
            handleSubcategorySelect(s);
        }
    };

    const handleCategorySelect = (catKey) => {
        setSelectedCategory(catKey);
        setStep("subcategoria");
        sendMessage("bot", `Has seleccionado la categoría **${COLLECTIONS_LABELS[catKey] || catKey}**. Aquí están las subcategorías disponibles:`);
    };

    const handleSubcategorySelect = (subKey) => {
        setSelectedSubcategory(subKey);
        setStep("productos");
        sendMessage("bot", `Subcategoría: ${subKey}. Aquí están los productos:`);
    };

    const addToCart = (p) => {
        addItem(p, 1);
        sendMessage("bot", `✅ "${p.nombre}" añadido al carrito.`);
    };

    const handleNewChat = async () => {
        const newChatId = await createNewChat();
        if (!newChatId) return;

        const newChat = {
            id: newChatId,
            user_id: user.id,
            user_email: user.email,
            display_name: user.displayName || "Usuario",
            photo_url: user.photoURL || "",
            title: "Nueva conversación",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setChatHistory(prevChats => [newChat, ...prevChats]);
        setCurrentChatId(newChatId);
        setSearchResults([]);
        if (!showHistory) setShowHistory(true);
        await loadChat(newChatId);
    };

    const renderChatHistory = () => (
        <div className="absolute bottom-full right-0 mb-2 w-80 max-h-[22rem] bg-white shadow-lg rounded-lg border flex flex-col overflow-hidden">
            <div className="p-3 bg-gray-100 border-b font-semibold text-sm flex justify-between items-center">
                <span>📝 Historial de Chats</span>
                <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {chatHistory.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No hay conversaciones previas
                    </div>
                ) : (
                    chatHistory.map((chat) => (
                        <div
                            key={chat.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer text-sm ${currentChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                            onClick={() => {
                                loadChat(chat.id);
                                setShowHistory(false);
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 truncate">
                                        {chat.title || "Conversación sin título"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {chat.updated_at
                                            ? new Date(chat.updated_at).toLocaleString("es-PE", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })
                                            : "Fecha no disponible"}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                    className="text-red-400 hover:text-red-600 ml-2"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    )))
                }
            </div>
            <div className="p-2 border-t bg-gray-50">
                <button
                    onClick={() => {
                        handleNewChat();
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                >
                    ➕ Nueva Conversación
                </button>
            </div>
        </div>
    );

    const renderCategoryButtons = () => (
        <div className="flex flex-wrap gap-2 justify-center mt-2">
            {Object.keys(categories).map(cat => (
                <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="px-3 py-1 text-sm rounded-full text-white font-semibold transition-colors hover:bg-blue-900"
                    style={{ backgroundColor: COLOR_PRIMARY }}
                >
                    {COLLECTIONS_LABELS[cat] || cat}
                </button>
            ))}
        </div>
    );

    const renderSubcategoryButtons = () => {
        if (!selectedCategory) return null;
        return (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
                <button
                    onClick={() => {
                        setStep("menu");
                        setSelectedCategory(null);
                        setSuggestions([]);
                    }}
                    className="px-3 py-1 text-sm rounded-full text-blue-600 font-semibold border border-blue-600 hover:bg-blue-100 transition"
                >
                    🔙 Volver a categorías
                </button>
                {Object.keys(categories[selectedCategory]).map(sub => (
                    <button
                        key={sub}
                        onClick={() => handleSubcategorySelect(sub)}
                        className="px-3 py-1 text-sm rounded-full text-white font-semibold transition-colors hover:bg-blue-900"
                        style={{ backgroundColor: COLOR_PRIMARY }}
                    >
                        {sub}
                    </button>
                ))}
            </div>
        );
    };

    const renderProductCards = () => {
        if (!selectedCategory || !selectedSubcategory) return null;
        const productos = categories[selectedCategory][selectedSubcategory] || [];
        return (
            <div className="max-h-64 overflow-y-auto grid grid-cols-1 gap-2 px-1 mt-2">
                {productos.map(p => (
                    <div key={p.id} className="flex items-center gap-2 border rounded-md p-2 bg-white shadow-sm text-sm">
                        <img src={p.imgUrl} alt={p.nombre} className="w-12 h-12 rounded object-cover border" />
                        <div className="flex-1">
                            <p className="font-semibold">{p.nombre}</p>
                            <p className="text-xs text-gray-600">S/ {p.precio} | Stock: {p.stock}</p>
                            <button
                                onClick={() => addToCart(p)}
                                className="text-xs text-blue-600 hover:underline mt-1"
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => {
                        setStep("subcategoria");
                        setSelectedSubcategory(null);
                        setSuggestions([]);
                    }}
                    className="px-3 py-1 text-sm rounded-full text-blue-600 font-semibold border border-blue-600 hover:bg-blue-100 transition"
                >
                    🔙 Volver a subcategorías
                </button>
            </div>
        );
    };

    const renderSearchResults = () => {
        if (!searchResults.length) return null;

        return (
            <div className="max-h-64 overflow-y-auto grid grid-cols-1 gap-2 px-1 mt-2">
                {searchResults.map((productObj, index) => {
                    const p = productObj.productData || productObj;
                    return (
                        <div key={p.id || index} className="flex items-center gap-2 border rounded-md p-2 bg-white shadow-sm text-sm">
                            <img src={p.imgUrl} alt={p.nombre} className="w-12 h-12 rounded object-cover border" />
                            <div className="flex-1">
                                <p className="font-semibold">{p.nombre}</p>
                                <p className="text-xs text-gray-600">S/ {p.precio} | Stock: {p.stock}</p>
                                <p className="text-xs text-blue-600">{COLLECTIONS_LABELS[productObj.category] || productObj.category}</p>
                                <button
                                    onClick={() => addToCart(p)}
                                    className="text-xs text-blue-600 hover:underline mt-1"
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    );
                })}
                <button
                    onClick={() => {
                        setStep("menu");
                        setSearchResults([]);
                        setSuggestions([]);
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                    }}
                    className="px-3 py-1 text-sm rounded-full text-blue-600 font-semibold border border-blue-600 hover:bg-blue-100 transition"
                >
                    🔙 Volver al menú principal
                </button>
            </div>
        );
    };

    const renderSuggestions = () => {
        return suggestions.length ? (
            <div className="mt-2">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                    >
                        👉 {s}
                    </button>
                ))}
            </div>
        ) : null;
    };

    // Detectar cierre del chatbot para mostrar la animación
    const prevIsOpen = useRef(isOpen);
    useEffect(() => {
        if (prevIsOpen.current && !isOpen) {
            // Se cerró el chat, mostrar animación
            setShowRobotIntro(true);
            // Ocultar animación después de 3.5s (ajusta según tu animación)
            const timer = setTimeout(() => setShowRobotIntro(false), 3500);
            return () => clearTimeout(timer);
        }
        prevIsOpen.current = isOpen;
    }, [isOpen]);

    // Si el usuario no está autenticado, mostrar mensaje
    if (!user && !loading) {
        return (
            <>
                {/* BOTÓN FLOTA DEL CHAT */}
                <button
                    onClick={() => {
                        setIsOpen(o => !o);
                    }}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg animate-bounce"
                >
                    <FaRobot className="text-white text-2xl" />
                </button>
                {isOpen && (
                    <div className="fixed bottom-24 right-6 w-80 max-h-[90vh] bg-white shadow-2xl rounded-xl flex flex-col z-40 border border-blue-200">
                        <div
                            className="p-3 font-bold text-white text-center rounded-t-xl"
                            style={{ backgroundColor: COLOR_PRIMARY }}
                        >
                            🤖 "CHAT CON ROBOTQUICK"
                        </div>
                        <div className="flex-1 p-6 text-center">
                            <FaRobot className="text-6xl text-blue-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                ¡Inicia sesión para chatear!
                            </h3>
                            <p className="text-sm text-gray-600">
                                Para usar el chatbot y guardar tus conversaciones, necesitas iniciar sesión en tu cuenta.
                            </p>
                        </div>
                    </div>
                )}
                {/* Animación de la moto SOLO cuando se cierra el chat */}
                {showRobotIntro && <RobotIntro />}
            </>
        );
    }

    return (
        <>
            {/* BOTÓN FLOTA DEL CHAT */}
            <div className="fixed bottom-2 right-2 z-50 flex flex-col items-end gap-2">
                {isOpen && (
                    <div className="relative">
                        {showHistory && renderChatHistory()}
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="absolute w-12 h-12 rounded-full flex items-center justify-center 
            bg-gray-600 hover:bg-gray-700 shadow-lg transition-colors 
            -translate-x-29 translate-y-2"
                            style={{ left: '-115px' }}
                            title="Ver historial"
                        >
                            <FaHistory className="text-white text-lg" />
                        </button>
                    </div>
                )}
                <button
                    onClick={() => {
                        setIsOpen(o => !o);
                        setShowHistory(false);
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg animate-bounce"
                >
                    <FaRobot className="text-white text-2xl" />
                </button>
            </div>

            {/* Animación de la moto y burbuja SOLO cuando se cierra el chat */}
            {showRobotIntro && <RobotIntro />}

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 max-h-[60vh] bg-white shadow-2xl rounded-xl flex flex-col z-40 border border-blue-200">
                    <div
                        className="p-3 font-bold text-white text-center rounded-t-xl flex justify-between items-center"
                        style={{ backgroundColor: COLOR_PRIMARY }}
                    >
                        <span>🤖 "CHAT CON ROBOTQUICK"</span>
                        {user && (
                            <div className="flex items-center gap-2">
                                {user.photoURL && (
                                    <img
                                        src={user.photoURL}
                                        alt="Avatar"
                                        className="w-6 h-6 rounded-full border border-white"
                                    />
                                )}
                                <span className="text-xs">
                                    {user.displayName || "Usuario"}
                                </span>
                            </div>
                        )}
                    </div>

                    {isLoadingChat ? (
                        <div className="flex-1 p-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Cargando conversación...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"} mb-2`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-3 rounded-lg shadow-md text-sm whitespace-pre-line ${msg.from === "bot"
                                                ? "bg-blue-100 text-gray-800 rounded-bl-none"
                                                : "bg-green-100 text-gray-900 rounded-br-none"
                                                }`}
                                        >
                                            {msg.text}
                                            {msg.timestamp && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div ref={messagesEndRef} />

                                {step === "menu" && renderCategoryButtons()}
                                {step === "subcategoria" && renderSubcategoryButtons()}
                                {step === "productos" && renderProductCards()}
                                {step === "search_results" && renderSearchResults()}
                                {renderSuggestions()}
                            </div>

                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    if (!input.trim()) return;
                                    handleUserInput(input);
                                    setInput("");
                                }}
                                className="flex border-t border-gray-300 p-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Escribe tu consulta..."
                                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="ml-2 bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 transition"
                                >
                                    Enviar
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Chatbot;