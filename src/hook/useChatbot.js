// /* eslint-disable no-empty */
// /* eslint-disable no-unused-vars */
// import { useState, useEffect, useRef } from "react";
// import Fuse from "fuse.js";
// import { useProducts } from "../services/useProducts";
// import * as api from "../services/ChatbotApi";
// const API_URL = import.meta.env.VITE_API_URL;

// const COLLECTIONS_LABELS = {
//     tecnologia: "Tecnología",
//     food: "Comida",
//     mascotas: "Mascotas",
//     farmacia: "Farmacia",
// };

// export default function useChatbot(user, addItem) {
//     const COLOR_PRIMARY = "#2563eb";
//     const [isAnimated, setIsAnimated] = useState(false);
//     const [showRobot, setShowRobot] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [step, setStep] = useState("menu");
//     const [categories, setCategories] = useState({});
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//     const [suggestions, setSuggestions] = useState([]);
//     const [searchResults, setSearchResults] = useState([]);
//     const [showBubble, setShowBubble] = useState(false);
//     const isCreatingRef = useRef(false);
//     const [products, setProducts] = useState([]);
//     const [bubbleShownOnce, setBubbleShownOnce] = useState(false);
//     const [currentChatId, setCurrentChatId] = useState(null);
//     const [chatHistory, setChatHistory] = useState([]);
//     const [showHistory, setShowHistory] = useState(false);
//     const [isLoadingChat, setIsLoadingChat] = useState(false);
//     const messagesEndRef = useRef(null);

//     // Cargar productos y categorías
//     useEffect(() => {
//         const fetchData = async () => {
//             const data = {};
//             const COLLECTIONS = ["tecnologia", "food", "mascotas", "farmacia"];
//             const apiMap = {
//                 tecnologia: 'tecnologia',
//                 food: 'comida',
//                 mascotas: 'mascota',
//                 farmacia: 'farmacia',
//             };
//             for (const colName of COLLECTIONS) {
//                 const apiRoute = apiMap[colName];
//                 const response = await fetch(`${API_URL}/api/${apiRoute}`);
//                 if (!response.ok) continue;
//                 const products = await response.json();
//                 for (const item of products) {
//                     const subcat = item.categoria || "Sin subcategoría";
//                     if (!data[colName]) data[colName] = {};
//                     if (!data[colName][subcat]) data[colName][subcat] = [];
//                     data[colName][subcat].push(item);
//                 }
//             }
//             setCategories(data);
//             // Aplanar productos
//             const allProducts = [];
//             for (const cat of Object.values(data)) {
//                 for (const subcat of Object.values(cat)) {
//                     allProducts.push(...subcat);
//                 }
//             }
//             setProducts(allProducts);
//         };
//         fetchData();
//     }, []);

//     // Cargar historial y chat actual
//     useEffect(() => {
//         if (!user) return;
//         const start = async () => {
//             if (isCreatingRef.current) return;
//             isCreatingRef.current = true;
//             try {
//                 const chats = await api.getChatHistory(user.id);
//                 setChatHistory(chats);
//                 if (chats.length === 0) {
//                     const newChat = await api.createChat(user);
//                     setCurrentChatId(newChat.chatId);
//                     await loadChat(newChat.chatId);
//                 } else {
//                     setCurrentChatId(chats[0].id);
//                     await loadChat(chats[0].id);
//                 }
//             } finally {
//                 isCreatingRef.current = false;
//             }
//         };
//         start();
//         return () => { isCreatingRef.current = false; };
//     }, [user]);

//     // Scroll automático
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     // Sugerencias
//     useEffect(() => {
//         if (step === "menu") {
//             const keys = Object.keys(categories);
//             const fuse = new Fuse(keys, { includeScore: true, threshold: 0.4 });
//             const results = fuse.search(input);
//             setSuggestions(results.map(r => r.item).slice(0, 5));
//         } else if (step === "subcategoria" && selectedCategory) {
//             const subcats = Object.keys(categories[selectedCategory]);
//             const fuse = new Fuse(subcats, { includeScore: true, threshold: 0.4 });
//             const results = fuse.search(input);
//             setSuggestions(results.map(r => r.item).slice(0, 5));
//         } else {
//             setSuggestions([]);
//         }
//     }, [input, step, selectedCategory, categories]);

//     // Funciones principales
//     const loadChat = async (chatId) => {
//         setIsLoadingChat(true);
//         try {
//             const msgs = await api.getChat(chatId);
//             setMessages(
//                 msgs.map(m => ({
//                     from: m.sender,
//                     text: m.text,
//                     timestamp: new Date(m.timestamp)
//                 }))
//             );
//             setCurrentChatId(chatId);
//         } finally {
//             setIsLoadingChat(false);
//         }
//     };

//     const handleUserInput = async (text) => {
//         const newUserMsg = { from: "user", text, timestamp: new Date() };
//         setMessages(prev => [...prev, newUserMsg]);
//         try {
//             const data = await api.getUserMessagesCount(currentChatId);
//             if (data.count === 0) {
//                 const newTitle = text.slice(0, 50);
//                 await api.updateChatTitle(currentChatId, newTitle);
//                 setChatHistory(prev =>
//                     prev.map(chat => (chat.id === currentChatId ? { ...chat, title: newTitle } : chat))
//                 );
//             }
//         } catch { }
//         await api.addMessage(currentChatId, "user", text);
//         const processingMsg = {
//             from: "bot",
//             text: "Procesando tu solicitud...",
//             timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, processingMsg]);
//         await api.addMessage(currentChatId, "bot", processingMsg.text);

//         const results = products.length > 0 ? buscarProductos(text, products) : [];
//         const maxToShow = 10;
//         const filteredMessages = prev => prev.filter(msg => msg !== processingMsg);

//         if (results.length === 0) {
//             const finalBotMsg = {
//                 from: "bot",
//                 text: `😕 No encontré resultados para la búsqueda relacionada con "${text}".`,
//                 timestamp: new Date(),
//             };
//             setMessages(prev => [...filteredMessages(prev), finalBotMsg]);
//             setSearchResults([]);
//             setStep("menu");
//             await api.addMessage(currentChatId, "bot", finalBotMsg.text);
//         } else {
//             let messageText = "";
//             if (results.length === 1) {
//                 messageText = `🔍 Encontré 1 producto relacionado con la búsqueda "${text}":`;
//             } else if (results.length > maxToShow) {
//                 messageText = `🔎 Se encontraron ${results.length} productos relacionados con "${text}". Mostrando los 10 más relevantes:`;
//             } else {
//                 messageText = `🔎 Estos son los ${results.length} productos más cercanos a la búsqueda relacionada con "${text}":`;
//             }
//             const resultBotMsg = {
//                 from: "bot",
//                 text: messageText,
//                 timestamp: new Date(),
//             };
//             setMessages(prev => [...filteredMessages(prev), resultBotMsg]);
//             setSearchResults(results.slice(0, maxToShow));
//             setStep("search_results");
//             await api.addMessage(currentChatId, "bot", resultBotMsg.text);
//         }
//     };

//     const buscarProductos = (text, productos) => {
//         const fuse = new Fuse(productos, {
//             keys: ['nombre', 'descripcion'],
//             threshold: 0.4,
//         });
//         return fuse.search(text).map(result => result.item);
//     };

//     const handleCategorySelect = (catKey) => {
//         setSelectedCategory(catKey);
//         setStep("subcategoria");
//     };

//     const handleSubcategorySelect = (subKey) => {
//         setSelectedSubcategory(subKey);
//         setStep("productos");
//     };

//     const addToCart = (p) => {
//         addItem(p, 1);
//     };

//     const handleSuggestionClick = (s) => {
//         setSuggestions([]);
//         if (step === "menu") {
//             handleCategorySelect(s);
//         } else if (step === "subcategoria") {
//             handleSubcategorySelect(s);
//         }
//     };

//     const handleNewChat = async () => {
//         const newChat = await api.createChat(user);
//         setCurrentChatId(newChat.chatId);
//         setChatHistory(prevChats => [{
//             id: newChat.chatId,
//             user_id: user.id,
//             user_email: user.email,
//             display_name: user.displayName || "Usuario",
//             photo_url: user.photoURL || "",
//             title: "Nueva conversación",
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//         }, ...prevChats]);
//         setSearchResults([]);
//         if (!showHistory) setShowHistory(true);
//         await loadChat(newChat.chatId);
//     };

//     const deleteChatHandler = async (chatId) => {
//         await api.deleteChat(chatId);
//         if (currentChatId === chatId) {
//             await handleNewChat();
//         }
//         const chats = await api.getChatHistory(user.id);
//         setChatHistory(chats);
//     };

//     return {
//         COLOR_PRIMARY,
//         isAnimated, setIsAnimated,
//         showRobot, setShowRobot,
//         loading, setLoading,
//         isOpen, setIsOpen,
//         messages, setMessages,
//         input, setInput,
//         step, setStep,
//         categories, setCategories,
//         selectedCategory, setSelectedCategory,
//         selectedSubcategory, setSelectedSubcategory,
//         suggestions, setSuggestions,
//         searchResults, setSearchResults,
//         showBubble, setShowBubble,
//         isCreatingRef,
//         products, setProducts,
//         bubbleShownOnce, setBubbleShownOnce,
//         currentChatId, setCurrentChatId,
//         chatHistory, setChatHistory,
//         showHistory, setShowHistory,
//         isLoadingChat, setIsLoadingChat,
//         messagesEndRef,
//         handleUserInput,
//         handleCategorySelect,
//         handleSubcategorySelect,
//         addToCart,
//         handleSuggestionClick,
//         handleNewChat,
//         deleteChatHandler,
//     };
// }