"use client";
import { useAuth } from "@/shared/contexts/AuthContext";

export default function AppPage() {
  const { me, hasAuthority } = useAuth();

  return (
    <div>
      <h1>App</h1>
      <pre>{JSON.stringify(me, null, 2)}</pre>

      {hasAuthority("profile.update") && <button>Update Profile</button>}
      {hasAuthority("profile.password.change") && (
        <button>Change Password</button>
      )}
      {hasAuthority("profile.2fa.setup") && <button>Setup 2FA</button>}
    </div>
  );
}
