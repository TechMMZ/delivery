import { FaChevronLeft } from "react-icons/fa";

const PrevArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        aria-label="Anterior"
        className="absolute left-0 z-10 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700 transition"
    >
        <FaChevronLeft />
    </button>
);

export default PrevArrow;
