import axios from 'axios';
import { useState, useContext } from 'react';
import CheckoutResumenPedido from '../components/checkout/CheckoutResumenPedido';
import CheckoutDatosEntrega from '../components/checkout/CheckoutDatosEntrega';
import CheckoutConfirmacion from '../components/checkout/CheckoutConfirmacion';
import CheckoutTotales from '../components/checkout/CheckoutTotales';
import CheckoutBotones from '../components/checkout/CheckoutBotones';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, ShoppingCart, User } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

function Checkout() {
    const { cartItems, removeItem, updateItemQuantity, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        address: "",
        notes: "",
        payment: { method: "", details: {} },
        contact: { name: "", phone: "", email: "" }
    });
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        cvv: "",
        expiry: "",
        email: "",
        qr: ""
    });

    const total = cartItems.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

    // 👉 AQUÍ: función para enviar orden al backend
    const handlePlaceOrder = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/orders`, {
                user_id: user.id, // suponiendo que tu contexto de auth tiene user.id
                total: total,
                delivery_address: formData.address,
                contact_name: formData.contact.name,
                contact_phone: formData.contact.phone,
                contact_email: formData.contact.email,
                payment_method: formData.payment.method,
                notes: formData.notes,
                items: cartItems
            });

            console.log('Orden creada:', response.data);
            clearCart();
            setStep(3);

        } catch (error) {
            console.error('Error al crear orden:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="flex flex-col items-center py-8">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">

                    {/* Pasos del checkout */}
                    <div className="flex justify-center mb-8 gap-6">

                        {/* Paso 1 */}
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
                                <ShoppingCart size={20} />
                            </div>
                            <span className={`mt-1 text-sm ${step >= 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>Pedido</span>
                        </div>

                        {/* Línea entre pasos */}
                        <div className={`h-1 w-12 rounded self-center ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>

                        {/* Paso 2 */}
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
                                <User size={20} />
                            </div>
                            <span className={`mt-1 text-sm ${step >= 2 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>Datos</span>
                        </div>

                        {/* Línea entre pasos */}
                        <div className={`h-1 w-12 rounded self-center ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>

                        {/* Paso 3 */}
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step === 3 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'}`}>
                                <CheckCircle size={18} />
                            </div>
                            <span className={`mt-1 text-sm ${step === 3 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>Confirmar</span>
                        </div>
                    </div>

                    {/* Contenido dinámico */}
                    <div className="mb-8">
                        {step === 1 && (
                            <CheckoutResumenPedido
                                cartItems={cartItems}
                                updateItemQuantity={updateItemQuantity}
                                removeItem={removeItem}
                            />
                        )}
                        {step === 2 && (
                            <CheckoutDatosEntrega
                                formData={formData}
                                setFormData={setFormData}
                                paymentDetails={paymentDetails}
                                setPaymentDetails={setPaymentDetails}
                                user={user}
                            />
                        )}
                        {step === 3 && (
                            <CheckoutConfirmacion
                                formData={formData}
                                cartItems={cartItems}
                                total={total}
                            />
                        )}
                    </div>

                    {/* Totales y botones */}
                    {step !== 3 && (
                        <CheckoutTotales total={total} />
                    )}
                    <CheckoutBotones
                        step={step}
                        setStep={setStep}
                        isStep1Valid={cartItems.length > 0}
                        isStep2Valid={formData.address && formData.contact.name && formData.contact.phone && formData.payment.method}
                        clearCart={clearCart}
                        handlePlaceOrder={handlePlaceOrder}
                    />
                </div>
            </div>
        </div>
    );
}

export default Checkout;