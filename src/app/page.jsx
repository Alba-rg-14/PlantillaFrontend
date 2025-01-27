"use client";
import { Button } from "@/components/ui/button"; // Botón reutilizable
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Navegación de Next.js
import { useState, useEffect } from "react";

export default function Landing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  const handleGitHubLogin = () => {
    signIn("github");
  };

  const handleLogout = () => {
    signOut();
  };

  const navigateToHome = () => {
    router.push("/home");
  };

  if (isLoading) {
    return <p className="text-center text-pink-800 font-medium">Cargando...</p>;
  }

  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, #ffe4e6, #ffffff)", // Fondo degradado
      }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center ">
        <h1 className="text-5xl font-extrabold text-pink-700 mb-6 drop-shadow-lg">
          Parcial 3
        </h1>
        <h2 className="text-2xl font-semibold text-pink-800 mb-8">
          Alba Ruiz Gutiérrez
        </h2>
        {!session ? (
          <div className="space-y-6">
            <Button
              onClick={handleGitHubLogin}
              className="w-full bg-black text-white rounded-full px-5 py-3 font-semibold text-lg transition-transform transform hover:scale-110 shadow-md"
            >
              Iniciar sesión con GitHub
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-pink-800 font-medium text-lg">
              Hola, {session.user.email}. Estás autenticado.
            </p>
            <Button
              onClick={navigateToHome}
              className="w-full bg-pink-300 text-pink-900 rounded-full px-5 py-3 font-semibold text-lg transition-transform transform hover:scale-110 shadow-md"
            >
              Ir a Home
            </Button>
            <Button
              onClick={handleLogout}
              className="w-full bg-pink-400 text-white rounded-full px-5 py-3 font-semibold text-lg transition-transform transform hover:scale-110 shadow-md"
            >
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
