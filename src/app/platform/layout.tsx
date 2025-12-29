import { fetchPlatformMe } from "@/lib/auth/me";
import { PlatformAuthProvider } from "@/features/platform/auth/PlatformAuthProvider";

export default async function PlatformGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await fetchPlatformMe();
  return (
    <PlatformAuthProvider initialMe={me} enabled>
      {children}
    </PlatformAuthProvider>
  );
}
