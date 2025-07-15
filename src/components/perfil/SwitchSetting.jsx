import { useState } from "react";

export default function SwitchSetting({ label }) {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
            <span className="text-gray-800 font-medium">{label}</span>
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setEnabled(!enabled)}
                aria-pressed={enabled}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
}
