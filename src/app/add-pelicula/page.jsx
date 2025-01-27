"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function AddPelicula() {
    const { data: session, status } = useSession();
    const [titulo, setTitulo] = useState("");
    const [imagenURI, setImagenURI] = useState(""); // URL de la imagen subida
    const router = useRouter();

    if (status === "loading") {
        return <p className="text-center text-pink-800 font-medium">Cargando...</p>;
    }

    // Función para manejar la subida de imágenes con Dropzone
    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        formData.append("imagenes", acceptedFiles[0]); // Solo subimos el primer archivo

        try {
            const response = await axios.post(`${BACKEND_BASE_API}/imagenes/subir`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200 && response.data.length > 0) {
                setImagenURI(response.data[0]); // Obtén la URL de la imagen
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Imagen subida correctamente.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al subir la imagen.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
        maxFiles: 1,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar campos obligatorios
        if (!titulo.trim() || !imagenURI.trim()) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, rellena todos los campos obligatorios.",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        // Crear el objeto con los datos de la película
        const data = {
            titulo,
            imagenURI,
        };

        try {
            const res = await axios.post(`${BACKEND_BASE_API}/peliculas`, data, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Película creada con éxito!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                router.push("/homePelis"); // Redirige a la lista de películas
            }
        } catch (error) {
            console.error("Error al crear la película:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al crear la película.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center py-8">
            {/* Botón de volver */}
            <button
                onClick={() => router.push("/homePelis")}
                className="fixed top-4 left-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition transform hover:scale-105"
                title="Volver"
            >
                ←
            </button>

            <h1 className="text-4xl font-bold text-pink-800 mb-6">Añadir Nueva Película</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-6"
            >
                {/* Campo de título */}
                <TextField
                    label="Título de la Película"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />

                {/* Dropzone para la imagen */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? "border-pink-500 bg-pink-50" : "border-gray-300"
                        }`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-pink-500">Suelta la imagen aquí...</p>
                    ) : (
                        <p className="text-gray-600">
                            Arrastra y suelta una imagen aquí o haz clic para seleccionar
                        </p>
                    )}
                </div>

                {/* Vista previa de la imagen */}
                {imagenURI && (
                    <img
                        src={imagenURI}
                        alt="Vista previa del cartel"
                        className="w-full h-auto rounded-lg mt-4"
                    />
                )}

                {/* Botón de enviar */}
                <Button
                    type="submit"
                    className="bg-pink-400 text-white rounded-full px-4 py-2 font-semibold shadow-md"
                >
                    Crear Película
                </Button>
            </form>
        </div>
    );
}
