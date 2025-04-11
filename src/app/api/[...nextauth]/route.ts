import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define the NextAuth configuration
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize() {
        // Placeholder - return a test user for now
        return { id: "1", name: "Test User", email: "test@example.com" };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

// Export the API route handlers
export { handler as GET, handler as POST };