
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt, admin } from "better-auth/plugins";

// Reuse MongoDB client across Next.js server instances
const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
    mongoClientPromise?: Promise<MongoClient>;
};

const client =
    globalForMongo.mongoClient ??
    new MongoClient(process.env.DB_URI as string);

if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = client;
}

// Connect only once per runtime
if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = client.connect().catch((error) => {
        globalForMongo.mongoClientPromise = undefined;
        throw error;
    });
}

await globalForMongo.mongoClientPromise;

const db = client.db("salonBook");

export const auth = betterAuth({
    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin"],
        }),
        jwt(),
    ],

    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        },
    },

    database: mongodbAdapter(db, {
        client,
    }),

    user: {
        additionalFields: {
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        },
    },

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
