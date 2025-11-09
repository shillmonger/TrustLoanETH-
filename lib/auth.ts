import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

// You'll need to install the required packages:
// npm install next-auth @auth/mongodb-adapter

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add your own authentication logic here
        // This is a basic example - in a real app, you'd validate against a database
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          // Return a user object
          return { id: '1', name: 'User', email: 'user@example.com' };
        }
        // Return null if user data could not be retrieved
        return null;
      }
    })
    // Add other providers here (Google, GitHub, etc.)
  ],
  
  // Use MongoDB adapter for session storage
  adapter: MongoDBAdapter(clientPromise),
  
  // Customize session and JWT settings
  session: {
    strategy: 'jwt',
  },
  
  // Custom pages (optional)
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  // Callbacks for customizing JWT and session
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
