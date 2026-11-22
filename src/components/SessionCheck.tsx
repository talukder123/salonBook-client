"use client";

import { useSession } from "@/lib/auth-client";

const SessionCheck = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return <p>Loading...</p>;

  console.log("Current Session:", session);
  console.log("User Role:", session?.user?.role);

  return (
    <div>
      <p>Name: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  );
};

export default SessionCheck;