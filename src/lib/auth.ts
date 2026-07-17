import { betterAuth } from "better-auth";
import { admin, jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("IdeaDen");

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "free",
      },
    },
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:3000"],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60,
      strategy: "jwt",
    },
  },
  plugins: [jwt(), admin()],
});
