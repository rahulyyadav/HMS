import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      idToken: true,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at * 1000,
          userInfo: profile,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.expiresAt) {
        return token;
      }

      // Access token has expired, try to update it
      return token;
    },
    async session({ session, token }) {
      session.user = token.userInfo;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
