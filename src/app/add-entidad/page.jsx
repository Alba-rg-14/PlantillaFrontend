"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import Swal from 'sweetalert2'


const MAPAS_BASE_API = process.env.NEXT_PUBLIC_MAPA_API;
const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Pagina() {
    const { data: session, status } = useSession();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenes, setImagenes] = useState([]);
    const router = useRouter();
    const Swal = require('sweetalert2')

    if (status === "loading") {
        return <p className="text-center text-pink-800 font-medium">Cargando...</p>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let latitud = null;
        let longitud = null;

        if (direccion.trim()) {
            try {
                const response = await axios.get(`${MAPAS_BASE_API}/${encodeURIComponent(direccion)}`);
                if (response.data) {
                    latitud = response.data.lat;
                    longitud = response.data.lon;
                } else {
                    alert("No se pudieron obtener coordenadas para la dirección.");
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "No se pudieron obtener coordenadas para esa dirección, prueba con otra dirección.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
            } catch (error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Hubo un problema al procesar la dirección.",
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
        }
        // Validar campos obligatorios
        if (!nombre.trim() || !direccion.trim() || !categoria.trim() || !descripcion.trim()) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, rellena todos los campos obligatorios.",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        // Subir imágenes al backend
        const formData = new FormData();
        imagenes.forEach((image) => {
            formData.append("imagenes", image); // image es el archivo
        });

        let imagenesSubidas = [];
        try {
            const response = await axios.post(`${BACKEND_BASE_API}/imagenes/subir`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            imagenesSubidas = response.data; // Array de URLs subidas
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Hubo un problema al subir las imágenes.",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const data = {
            nombre,
            direccion,
            coordenadas: { latitud, longitud },
            categoria,
            descripcion,
            imagenes: imagenesSubidas, // Enviar array de URLs
        };

        try {
            const res = await axios.post(`${BACKEND_BASE_API}/entidades/crear`, data, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Entidad creada con éxito!",
                    showConfirmButton: false,
                    timer: 1500
                });
                router.push("/home");
            }
        } catch (error) {
            console.error("Error al crear la entidad:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al crear la entidad.",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center py-8">
            <button
                onClick={() => window.history.back()} // Cambia esta función si necesitas un comportamiento diferente
                className="fixed top-4 left-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition transform hover:scale-105"
                title="Volver"
            >
                ←
            </button>

            <h1 className="text-4xl font-bold text-pink-800 mb-6">Añadir Nueva Entidad</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-6"
            >
                <TextField
                    label="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <TextField
                    label="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                />
                <TextField
                    label="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    multiline
                    required
                />
                <FormControl>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <MenuItem value="Categoria1">Categoria1</MenuItem>
                        <MenuItem value="Categoria2">Categoria2</MenuItem>
                        <MenuItem value="Categoria3">Categoria3</MenuItem>
                    </Select>
                </FormControl>
                <ImageUploader
                    onUploadComplete={(urls) => {
                        console.log("Imagenes subidas:", urls); // Verifica en consola
                        setImagenes(urls);
                    }}
                />
                <Button
                    type="submit"
                    className="bg-pink-400 text-white rounded-full px-4 py-2 font-semibold shadow-md"
                >
                    Crear
                </Button>
            </form>
        </div>
    );
}
