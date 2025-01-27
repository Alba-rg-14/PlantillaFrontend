"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import MapWithMarkers from "@/components/MapWithMarkers";
import CardSala from "@/components/CardSala";
import Swal from 'sweetalert2'


const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Pagina() {
  const { data: session, status } = useSession();
  const [salas, setSalas] = useState([]);
  const [markers, setMarkers] = useState([]);
  const router = useRouter();
  const Swal = require('sweetalert2')

  // Si la sesión aún está cargando, retorna un mensaje de carga
  useEffect(() => {
    if (session) {
      fetchSalas();  // Llamada solo si hay sesión
    }
  }, [session]); // Reaccionar cuando session cambie

  const fetchSalas = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_API}/salas`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const salasData = response.data;
      setSalas(salasData);

      // Extraer las coordenadas para los marcadores
      const markersData = salasData.map((e) => ({
        lat: e.coordenadas.latitud,
        lon: e.coordenadas.longitud,
        nombre: e.nombre,
      }));
      setMarkers(markersData);
    } catch (error) {
      console.error("Error al obtener las salas:", error);
    }
  }, [session]);

  const navigateAddSala = () => {
    router.push("/add-sala");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_BASE_API}/salas/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "La sala se ha eliminado con éxito",
        showConfirmButton: false,
        timer: 1500
      });
      fetchSalas();
    } catch (error) {
      console.error("Error al eliminar la sala:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al eliminar xxx",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleUpdate = async (id) => {
    router.push(`/editar-sala/${id}`);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Mapa fijo con botón */}
        <div className="relative bg-white p-6 rounded-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-pink-800">Estas son las salas disponibles:</h1>
            <Button
              onClick={navigateAddSala}
              className="bg-pink-300 text-pink-900 rounded-full px-4 py-2 font-semibold hover:scale-105 transition-transform"
            >
              Crear Nueva Sala
            </Button>
          </div>
          <MapWithMarkers markers={markers} defaultZoom={5} />
        </div>

        {/* Lista de salas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {salas.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No hay salas disponibles en este momento.
            </p>
          ) : (
            salas.map((e) => (
              <CardSala
                key={e._id}
                title={e.nombre}
                subtitle={e.direccion}
                onDetailsClick={() => router.push(`/detalles/${e._id}`)}
                actions={[
                  {
                    label: "Editar",
                    onClick: () => handleUpdate(e._id),
                  },
                  {
                    label: "Eliminar",
                    onClick: () => handleDelete(e._id),
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
