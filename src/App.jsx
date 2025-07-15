import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
// import Chatbot from "./components/chatbot/Chatbot";
import './App.css';
// import RobotIntro from "./components/chatbot/RobotIntro";

export default function App() {
  const location = useLocation();

  // Rutas donde NO queremos mostrar Navbar y Footer
  const noNavbarFooterRoutes = ["/login"];

  // Validamos si la ruta actual está en la lista
  const hideNavbarFooter = noNavbarFooterRoutes.includes(location.pathname);

  return (
    <>
      {/* Componente para hacer scroll al inicio en cada cambio de ruta */}
      <ScrollToTop />

      {/* Navbar y Footer solo se muestran si la ruta no está en la lista */}
      {!hideNavbarFooter && <Navbar />}
      <AppRoutes />
      {!hideNavbarFooter && (
        <>
          <Footer />
          {/* <RobotIntro /> */}
          {/* {location.pathname === "/" && <Chatbot />} */}
        </>)}
    </>
  );
}
