"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Swal from "sweetalert2";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function PaginaPeliculas() {
    const { data: session, status } = useSession();
    const [peliculas, setPeliculas] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            fetchPeliculas(); // Llamada solo si hay sesión
        }
    }, [session]);

    const fetchPeliculas = useCallback(async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_API}/peliculas`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            setPeliculas(response.data);
        } catch (error) {
            console.error("Error al obtener las películas:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al cargar las películas.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }, [session]);

    const navigateAddPelicula = () => {
        router.push("/add-pelicula"); // Redirigir al formulario de creación de películas
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BACKEND_BASE_API}/peliculas/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Película eliminada con éxito",
                showConfirmButton: false,
                timer: 1500,
            });
            fetchPeliculas(); // Recargar las películas
        } catch (error) {
            console.error("Error al eliminar la película:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al eliminar la película.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleUpdate = async (id) => {
        router.push(`/editar-pelicula/${id}`); // Redirigir al formulario de edición
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto p-8 space-y-8">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-pink-800">Películas Disponibles:</h1>
                    <Button
                        onClick={navigateAddPelicula}
                        className="bg-pink-300 text-pink-900 rounded-full px-4 py-2 font-semibold hover:scale-105 transition-transform"
                    >
                        Añadir Película
                    </Button>
                </div>

                {/* Lista de películas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {peliculas.length === 0 ? (
                        <p className="text-center text-gray-600 col-span-full">
                            No hay películas disponibles en este momento.
                        </p>
                    ) : (
                        peliculas.map((pelicula) => (
                            <Card
                                key={pelicula._id}
                                title={pelicula.titulo}
                                image={pelicula.imagenURI}
                                onDetailsClick={() => router.push(`/detalles-pelicula/${pelicula._id}`)}
                                actions={[
                                    {
                                        label: "Editar",
                                        onClick: () => handleUpdate(pelicula._id),
                                    },
                                    {
                                        label: "Eliminar",
                                        onClick: () => handleDelete(pelicula._id),
                                    },
                                ]}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
