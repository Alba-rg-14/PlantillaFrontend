"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    await signOut({ redirect: false }); // No redirigir automáticamente
    router.push("/"); // Redirigir a la página principal después de cerrar sesión
  };

  // Redirigir a la página principal si no hay sesión
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirige a la página principal si el usuario no está autenticado
    }
  }, [status, router]); // Ejecutar cuando cambie el estado de la sesión

  // Obtener el primer nombre del usuario
  const firstName = session?.user?.name?.split(" ")[0]; // Toma solo el primer nombre

  return (
    <nav className="bg-pink-200 shadow-lg py-4">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        {/* Logo o título de la app */}
        <h1 className="text-3xl font-bold text-pink-800 flex-1 text-left">Parcial 3 Alba Ruiz Gutiérrez</h1>

        {/* Menú de navegación */}
        <div className="flex space-x-4">
          <Button
            onClick={() => router.push("/home")}
            className="bg-white text-pink-800 border border-pink-300 rounded-full px-4 py-2 font-bold shadow transform transition-transform hover:scale-105"
          >
            Home
          </Button>
          <Button
            onClick={() => router.push("/pagina3")}
            className="bg-white text-pink-800 border border-pink-300 rounded-full px-4 py-2 font-bold shadow transform transition-transform hover:scale-105"
          >
            Filtrar con mapa
          </Button>
          <Button
            onClick={() => router.push("/logsAuth")}
            className="bg-white text-pink-800 border border-pink-300 rounded-full px-4 py-2 font-bold shadow transform transition-transform hover:scale-105"
          >
            Logs
          </Button>

          {/* Botón de cerrar sesión */}
          {session ? (
            <Button
              onClick={handleLogout}
              className="bg-white text-pink-800 border border-pink-300 rounded-full px-4 py-2 font-bold shadow transform transition-transform hover:scale-105"
            >
              {firstName}, cerrar sesión
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="bg-white text-pink-800 border border-pink-300 rounded-full px-4 py-2 font-bold shadow transform transition-transform hover:scale-105"
            >
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
