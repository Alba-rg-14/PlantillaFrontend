"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import axios from "axios";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function PaginaLogs() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true); // Comienza el estado de carga
        if (session) {
          const response = await axios.get(`${BACKEND_BASE_API}/log`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          setLogs(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los logs:", error);
      } finally {
        setIsLoading(false); // Finaliza el estado de carga
      }
    };

    fetchLogs(); // Llamar a fetchLogs siempre para evitar inconsistencias
  }, [session]); // Este efecto se ejecutará siempre que cambie la sesión

  // Mensaje de carga
  if (status === "loading" || isLoading) {
    return <p className="text-center text-pink-800 font-medium">Cargando...</p>;
  }

  // Si no hay sesión, mostrar mensaje
  if (!session) {
    return (
      <p className="text-center text-pink-800 font-medium">
        No estás autenticado. Por favor, inicia sesión.
      </p>
    );
  }

  // Renderizar los logs
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-5xl font-bold text-pink-800 text-center mb-12">
          Logs del Sistema
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <h3 className="text-2xl font-semibold text-pink-800 mb-4 break-words">
                  Log ID: {log._id}
                </h3>
                <p className="text-lg text-gray-700">
                  <strong className="text-pink-600">Timestamp:</strong>{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="text-pink-600">Email:</strong> {log.email}
                </p>
                <p className="text-lg text-gray-700 break-words">
                  <strong className="text-pink-600">Token expirity:</strong> {log.tokenExpiry}
                </p>
                <p className="text-lg text-gray-700 break-words">
                  <strong className="text-pink-600">Token:</strong>{" "}
                  {log.token}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-xl font-medium text-gray-600">
              No hay logs para mostrar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
