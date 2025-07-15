/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { CreditCard, Mail, MapPin, Phone, User } from "lucide-react";
import { useState, useEffect } from "react";
import useUser from "../../services/useUser";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "react-feather";

const PerfilDatosForm = () => {
    const { user, fetchUser, updateUser } = useUser();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState("");
    const [showNotif, setShowNotif] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [originalData, setOriginalData] = useState(null);
    const [touched, setTouched] = useState({
        name: false,
        phone: false,
        address: false,
        dni: false,
    });

    useEffect(() => {
        if (!user) fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            const original = {
                name: user.displayname || "",
                phone: user.phone || "",
                address: user.address || "",
                dni: user.dni || "",
            };
            setName(original.name);
            setPhone(original.phone);
            setAddress(original.address);
            setDni(original.dni);
            setEmail(user.email || "");
            setOriginalData(original);
        }
    }, [user]);

    useEffect(() => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
        if (!phone) newErrors.phone = "El teléfono es obligatorio.";
        else if (phone.length !== 9) newErrors.phone = "El teléfono debe tener 9 dígitos.";
        if (!address.trim()) newErrors.address = "La dirección es obligatoria.";
        if (!dni) newErrors.dni = "El DNI es obligatorio.";
        else if (dni.length !== 8) newErrors.dni = "El DNI debe tener 8 dígitos.";
        setErrors(newErrors);
    }, [name, phone, address, dni]);

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (Object.keys(errors).length > 0) {
            setSaving(false);
            return;
        }

        const { success, message } = await updateUser({
            displayname: name,
            phone,
            dni,
            address,
        });

        setSaving(false);

        if (success) {
            setShowNotif(true);
            setTimeout(() => setShowNotif(false), 1500);
            setOriginalData({ name, phone, address, dni }); // Actualizamos el original
        } else {
            alert(`Error al actualizar: ${message}`);
        }
    };

    // Detectar si hay cambios respecto a originalData
    const hasChanges =
        originalData &&
        (name !== originalData.name ||
            phone !== originalData.phone ||
            address !== originalData.address ||
            dni !== originalData.dni);

    return (
        <div className="space-y-6 w-full max-w-3xl mx-auto px-4">
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mx-auto mb-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 w-fit"
                    >
                        <CheckCircle className="text-green-300" size={22} />
                        Datos actualizados correctamente.
                    </motion.div>
                )}
            </AnimatePresence>

            <h2 className="text-2xl font-bold text-blue-700 text-center md:text-left">Información personal</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputWithIcon
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleBlur("name")}
                        icon={<User size={20} />}
                        placeholder="Nombre completo"
                        error={touched.name && errors.name}
                    />
                    <InputWithIcon
                        value={phone}
                        maxLength={9}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleBlur("phone")}
                        icon={<Phone size={20} />}
                        placeholder="Teléfono"
                        error={touched.phone && errors.phone}
                    />
                    <InputWithIcon
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={() => handleBlur("address")}
                        icon={<MapPin size={20} />}
                        placeholder="Dirección"
                        error={touched.address && errors.address}
                    />
                    <InputWithIcon
                        value={dni}
                        onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleBlur("dni")}
                        icon={<CreditCard size={20} />}
                        placeholder="DNI"
                        maxLength={8}
                        error={touched.dni && errors.dni}
                    />
                    <InputWithIcon
                        value={email}
                        icon={<Mail size={20} />}
                        placeholder="Correo electrónico"
                        readOnly
                        type="email"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold mt-4 transition disabled:opacity-50"
                    disabled={saving || Object.keys(errors).length > 0 || !hasChanges}
                >
                    {saving ? "Guardando..." : "Guardar cambios"}
                </button>
            </form>
        </div>
    );
};

const InputWithIcon = ({ value, onChange, icon, placeholder, readOnly, maxLength, type = "text", error, onBlur }) => (
    <div className="relative flex flex-col w-full">
        <div className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
            <span className="text-blue-500 ml-2 mr-3">{icon}</span>
            <input
                type={type}
                className={`w-full bg-transparent outline-none text-gray-800 py-2 px-1 text-base placeholder-gray-400 ${readOnly ? "cursor-not-allowed" : "focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    } rounded-xl`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                readOnly={readOnly}
                maxLength={maxLength}
            />
        </div>
        {error && <span className="text-red-500 text-sm mt-1 ml-3">{error}</span>}
    </div>
);

export default PerfilDatosForm;
