"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";

const MAPAS_BASE_API = process.env.NEXT_PUBLIC_MAPA_API;
const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function ActualizarEntidad() {
    const { data: session, status } = useSession();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const router = useRouter();
    const { id } = useParams();
    const Swal = require("sweetalert2");

    useEffect(() => {
        if (!id) return;

        const fetchEntidad = async () => {
            try {
                const response = await axios.get(`${BACKEND_BASE_API}/entidades/${id}`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                const entidad = response.data;

                setNombre(entidad.nombre);
                setDireccion(entidad.direccion);
                setDescripcion(entidad.descripcion);
                setCategoria(entidad.categoria);
            } catch (error) {
                console.error("Error al obtener la entidad:", error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "No se pudo cargar la entidad.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        };

        fetchEntidad();
    }, [id, session]);

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
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "No se pudieron obtener coordenadas para la dirección.",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    return;
                }
            } catch (error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Hubo un problema al procesar la dirección.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
        }

        if (!nombre.trim() || !direccion.trim() || !categoria.trim() || !descripcion.trim()) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, rellena todos los campos obligatorios.",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        const data = {
            nombre,
            direccion,
            coordenadas: { latitud, longitud },
            categoria,
            descripcion,
        };

        try {
            const res = await axios.put(`${BACKEND_BASE_API}/entidades/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Entidad actualizada con éxito!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                router.push("/home");
            }
        } catch (error) {
            console.error("Error al actualizar la entidad:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al actualizar la entidad.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center py-8">
            <button
                onClick={() => window.history.back()}
                className="fixed top-4 left-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition transform hover:scale-105"
                title="Volver"
            >
                ←
            </button>

            <h1 className="text-4xl font-bold text-pink-800 mb-6">Actualizar Entidad</h1>
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

                <Button
                    type="submit"
                    className="bg-pink-400 text-white rounded-full px-4 py-2 font-semibold shadow-md"
                >
                    Actualizar
                </Button>
            </form>
        </div>
    );
}
