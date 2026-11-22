
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    jwtClient(),
  ],
});

export const { signIn, signUp, useSession } = authClient;
