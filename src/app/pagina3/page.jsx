"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import axios from "axios";
import MapWithMarkers from "@/components/MapWithMarkers";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [entidad, setEntidad] = useState([]);
  const [campoFiltro, setCampoFiltro] = useState("");
  const [markers, setMarkers] = useState([]); // Marcadores del mapa
  const router = useRouter();

  // No usar condicionales en hooks, siempre deben ejecutarse
  useEffect(() => {
    if (status === "loading") return; // Evitar que la app intente hacer algo si la sesión aún se está cargando.
  }, [status]);

  const fetchEntidades = async (campoFiltro) => {
    setLoading(true);
    console.log("Filtro enviado al backend:", campoFiltro); // Verifica qué se envía
    try {
      const response = await axios.get(`${BACKEND_BASE_API}/entidades/nombre/${campoFiltro}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setEntidad(response.data);
      // Generar marcadores para el mapa
      const nuevosMarkers = response.data.map((e) => ({
        lat: e.coordenadas.latitud,
        lon: e.coordenadas.longitud,
        nombre: e.nombre,
      }));
      setMarkers(nuevosMarkers);
    } catch (error) {
      console.error("Error al obtener las entidades:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-5xl font-bold text-pink-800 text-center mb-8">Filtra las entidades</h1>

        {/* Filtro y mapa */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <input
              type="text"
              value={campoFiltro}
              onChange={(e) => setCampoFiltro(e.target.value)}
              placeholder="Buscar entidades por nombre"
              className="border border-gray-300 rounded-lg px-4 py-2 w-80"
            />
            <Button
              onClick={() => fetchEntidades(campoFiltro)}
              className="bg-pink-300 text-pink-900 rounded-full px-4 py-2 font-semibold hover:scale-105 transition-transform"
            >
              Buscar
            </Button>
          </div>

          <MapWithMarkers
            markers={markers}
            defaultCenter={[40.416775, -3.703790]}
            defaultZoom={5}
          />
        </div>

        {/* Lista de entidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-pink-800 font-medium">Cargando datos...</p>
          ) : entidad.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No se encontraron entidades con ese filtro.</p>
          ) : (
            entidad.map((r) => (
              <Card
                key={r._id}
                title={r.nombre}
                subtitle={r.direccion}
                images={r.imagenes}
                onDetailsClick={() => router.push(`/detalles/${r._id}`)} // Lógica para el botón "Ver detalles"
                actions={[]}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
