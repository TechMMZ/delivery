import SwitchSetting from "./SwitchSetting";
// import SavedCardsList from "./SavedCardsList";
import PaymentForm from "./PaymentForm";
import CardsList from "./CardsList";

const PerfilConfiguracion = () => (
    <div>
        <h2 className="text-xl font-semibold text-blue-700">Configuración</h2>
        <p className="text-gray-600 mt-2 mb-6">Aquí puedes personalizar tus preferencias.</p>
        <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1 space-y-6">
                <SwitchSetting label="Recibir SMS" />
                <SwitchSetting label="Notificaciones push" />
                <SwitchSetting label="Método de pago guardado" />
                <CardsList />
                {/* <SavedCardsList /> */}
            </div>
            <div className="flex-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Método de pago</h3>
                    <PaymentForm />
                </div>
            </div>
        </div>
    </div>
);

export default PerfilConfiguracion;
