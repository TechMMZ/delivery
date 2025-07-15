import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Páginas
import Home from "../pages/Home";
import Comida from "../pages/Comida";
import ProductDetails from "../pages/ProductDetails";
import Tecnologia from "../pages/Tecnologia";
import Farmacia from "../pages/Farmacia";
import Mascotas from "../pages/Mascotas";
import Perfil from "../pages/Perfil";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import { Bus } from "lucide-react";
import Busqueda from "../components/layout/Busqueda";
import Checkout from "../pages/Checkout";

function AppRoutes() {
    const { user } = useContext(AuthContext);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comida" element={<Comida />} />
            <Route path="/tecnologia" element={<Tecnologia />} />
            <Route path="/farmacia" element={<Farmacia />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mascotas" element={<Mascotas />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/busqueda" element={<Busqueda />} />
            <Route path="/products/:categoria/:id" element={<ProductDetails />} />
            <Route
                path="/perfil"
                element={
                    user ? <Perfil /> : <Navigate to="/login" />
                }
            />
            <Route
                path="/checkout"
                element={
                    user ? <Checkout /> : <Navigate to="/login" />
                }
            />
        </Routes>
    );
}

export default AppRoutes;
