import { FaChevronRight } from "react-icons/fa";

const NextArrow = ({ onClick }) => (
    <button
        onClick={onClick}
        aria-label="Siguiente"
        className="absolute right-0 z-10 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700 transition"
    >
        <FaChevronRight />
    </button>
);

export default NextArrow;
