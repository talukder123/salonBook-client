
"use client";

import { authClient } from "@/lib/auth-client";

const CheckJWT = () => {
  const handleTest = async () => {
    try {
      // Step 1: Get JWT
      const { data, error } = await authClient.token();

      console.log("Token API:", {
        hasToken: Boolean(data?.token),
        error,
      });

      if (error || !data?.token) {
        console.error("Token Error:", error);
        return;
      }

      // Step 2: Send JWT to backend
      const response = await fetch(
        "http://localhost:5000/admin-test",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      console.log("HTTP Status:", response.status);

      const result = await response.json();

      console.log("Backend Response:", result);
    } catch (error) {
      console.error("Request Failed:", error);
    }
  };

  return (
    <button onClick={handleTest}>
      Test Protected API
    </button>
  );
};

export default CheckJWT;
