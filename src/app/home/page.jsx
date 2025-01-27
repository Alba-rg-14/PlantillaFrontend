"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import MapWithMarkers from "@/components/MapWithMarkers";
import Card from "@/components/Card";
import Swal from 'sweetalert2'


const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Pagina() {
  const { data: session, status } = useSession();
  const [entidades, setEntidades] = useState([]);
  const [markers, setMarkers] = useState([]);
  const router = useRouter();
  const Swal = require('sweetalert2')

  // Si la sesión aún está cargando, retorna un mensaje de carga
  useEffect(() => {
    if (session) {
      fetchEntidades();  // Llamada solo si hay sesión
    }
  }, [session]); // Reaccionar cuando session cambie

  const fetchEntidades = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_API}/entidades/todas`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const entidadesData = response.data;
      setEntidades(entidadesData);

      // Extraer las coordenadas para los marcadores
      const markersData = entidadesData.map((e) => ({
        lat: e.coordenadas.latitud,
        lon: e.coordenadas.longitud,
        nombre: e.nombre,
      }));
      setMarkers(markersData);
    } catch (error) {
      console.error("Error al obtener las entidades:", error);
    }
  }, [session]);

  const navigateAddEntidad = () => {
    router.push("/add-entidad");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_BASE_API}/entidades/borrar/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "xxx se ha eliminado con éxito",
        showConfirmButton: false,
        timer: 1500
      });
      fetchEntidades();
    } catch (error) {
      console.error("Error al eliminar el restaurante:", error);
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
    router.push(`/editar-entidad/${id}`);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Mapa fijo con botón */}
        <div className="relative bg-white p-6 rounded-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-pink-800">Mapa de Entidades</h1>
            <Button
              onClick={navigateAddEntidad}
              className="bg-pink-300 text-pink-900 rounded-full px-4 py-2 font-semibold hover:scale-105 transition-transform"
            >
              Crear Nueva Entidad
            </Button>
          </div>
          <MapWithMarkers markers={markers} defaultZoom={5} />
        </div>

        {/* Lista de entidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entidades.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No hay entidades disponibles en este momento.
            </p>
          ) : (
            entidades.map((e) => (
              <Card
                key={e._id}
                title={e.nombre}
                subtitle={e.direccion}
                images={e.imagenes}
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
