"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import MapWithMarkers from "@/components/MapWithMarkers";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Detalles() {
    const params = useParams();
    const router = useRouter(); // Para manejar la navegación
    const { id } = params;
    const [entidad, setEntidades] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchEntidades = async () => {
            try {
                const response = await axios.get(`${BACKEND_BASE_API}/entidades/${id}`);
                setEntidades(response.data);
            } catch (error) {
                console.error("Error al obtener los detalles de la entidad:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntidades();
    }, [id]);

    if (loading) return <p className="text-center text-xl mt-10 text-pink-500">Cargando...</p>;

    if (!entidad) return <p className="text-center text-xl mt-10 text-pink-500">No se encontró la entidad.</p>;

    // Define las imágenes aquí
    const images = entidad.imagenes;

    // Configuración del carrusel
    const settings = {
        dots: true,
        infinite: images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };


    return (
        <div className="min-h-screen bg-pink-50 p-6 relative">
            {/* Botón para volver */}
            <button
                onClick={() => router.push("/home")}
                className="absolute top-4 left-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition"
                title="Volver"
            >
                ←
            </button>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-4xl font-extrabold text-pink-600 mb-6">{entidad.nombre}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de la entidad */}
                    <div className="space-y-4">
                        <div>
                            <span className="text-lg font-semibold text-pink-600">Dirección:</span>
                            <p className="text-gray-700">{entidad.direccion}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Descripción:</span>
                            <p className="text-gray-700">{entidad.descripcion || "No disponible"}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Creador:</span>
                            <p className="text-gray-700">{entidad.creador || "No disponible"}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Categoría:</span>
                            <p className="text-gray-700">{entidad.categoria}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Fecha de creación:</span>
                            <p className="text-gray-700">{entidad.createdAt.toLocaleString()}</p>
                        </div>

                        {/*<div>
                            <span className="text-lg font-semibold text-pink-600">Visitado:</span>
                            <p className="text-gray-700">
                                {entidad.visitado
                                    ? "¡Has visitado este restaurante!"
                                    : "Aún no has visitado este restaurante."}
                            </p>
                        </div>*/}
                    </div>

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
                </div>

                {/* Mapa con el marcador */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-600">Ubicación:</h2>
                    <MapWithMarkers
                        markers={[
                            {
                                lat: entidad.coordenadas.latitud,
                                lon: entidad.coordenadas.longitud,
                                nombre: entidad.nombre,
                            },
                        ]}
                        defaultCenter={[entidad.coordenadas.latitud, entidad.coordenadas.longitud]} // Centro en el restaurante
                        defaultZoom={15} // Zoom para ver el marcador de cerca
                    />
                </div>
            </div>
        </div>
    );
}
