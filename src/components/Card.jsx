import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Card({ title, subtitle, images = [], onDetailsClick, actions = [] }) {
    const settings = {
        dots: true,
        infinite: images.length > 1, // El carrusel no será infinito si hay una sola imagen
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Carrusel de imágenes */}
            {images && images.length > 0 ? (
                <Slider {...settings} className="relative w-full">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-48 object-cover"
                        />
                    ))}
                </Slider>
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Esta entidad no contiene imágenes
                </div>
            )}
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-600">{subtitle}</p>
                <div className="mt-4 flex justify-between items-center space-x-2">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`rounded-full px-4 py-2 font-medium shadow-md transition-transform transform hover:scale-105 ${action.label === "Eliminar"
                                    ? "bg-pink-500 text-white hover:bg-pink-600"
                                    : "bg-pink-300 text-pink-900"
                                }`}
                        >
                            {action.label}
                        </button>
                    ))}
                    <button
                        onClick={onDetailsClick}
                        className="bg-pink-300 text-pink-900 rounded-full px-4 py-2 font-medium shadow-md transition-transform transform hover:scale-105"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
}
