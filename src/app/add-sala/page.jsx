"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const MAPAS_BASE_API = process.env.NEXT_PUBLIC_MAPA_API;
const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function AddSala() {
    const { data: session, status } = useSession();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const router = useRouter();

    if (status === "loading") {
        return <p className="text-center text-pink-800 font-medium">Cargando...</p>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Obtener coordenadas desde la dirección
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

        // Validar campos obligatorios
        if (!nombre.trim() || !direccion.trim()) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, rellena todos los campos obligatorios.",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        // Crear el objeto con los datos, incluyendo el propietarioEmail de la sesión
        const data = {
            nombre,
            direccion,
            coordenadas: { latitud, longitud },
            propietarioEmail: session.user.email, // Asigna el email del usuario autenticado
        };

        try {
            const res = await axios.post(`${BACKEND_BASE_API}/salas`, data, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Sala creada con éxito!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                router.push("/home");
            }
        } catch (error) {
            console.error("Error al crear la sala:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al crear la sala.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center py-8">
            {/* Botón de volver */}
            <button
                onClick={() => router.push("/home")}
                className="fixed top-4 left-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition transform hover:scale-105"
                title="Volver"
            >
                ←
            </button>

            <h1 className="text-4xl font-bold text-pink-800 mb-6">Añadir Nueva Sala</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-6"
            >
                {/* Campo de nombre */}
                <TextField
                    label="Nombre de la Sala"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                {/* Campo de dirección */}
                <TextField
                    label="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                />
                {/* Botón de enviar */}
                <Button
                    type="submit"
                    className="bg-pink-400 text-white rounded-full px-4 py-2 font-semibold shadow-md"
                >
                    Crear Sala
                </Button>
            </form>
        </div>
    );
}
