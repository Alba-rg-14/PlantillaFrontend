import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";

// Función para guardar el log en el backend
async function guardarLog(primaryEmail, tokenExpiry, token) {
  const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

  try {
    const res = await axios.post(`${BACKEND_BASE_API}/log`, {
      timestamp: new Date(), // Fecha y hora actual
      email: primaryEmail,   // Correo del usuario
      tokenExpiry,           // Fecha de expiración del token
      token                  // Token de acceso
    });

    if (res.status === 201) {
      console.log("Log creado en el backend:", res.data);
      return res.data; // Retorna el log creado
    } else {
      throw new Error("Error al crear el log en el backend");
    }
  } catch (error) {
    console.error("Error al guardar el log:", error.message);
    return null; // Manejo de error opcional
  }
}

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Este callback se ejecuta al crear o actualizar un JWT
      if (account && user) {
        const primaryEmail = user.email || "No disponible";
        const tokenExpiry = new Date();

        // Guardamos el log en el backend
        const log = await guardarLog(primaryEmail, tokenExpiry, account.access_token);
        if (log) {
          console.log("Log guardado correctamente:", log);
        }

        // Guardamos el token de acceso en el JWT
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Este callback se ejecuta al crear o actualizar una sesión
      session.accessToken = token.access_token;  // Guardar el token en la sesión
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirige al usuario a /home después del inicio de sesión exitoso
      return `${baseUrl}/home`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
