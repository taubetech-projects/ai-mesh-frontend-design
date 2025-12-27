import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";

export async function fetchMe() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!access) return null;

  const res = await fetch(
    `${process.env.BACKEND_ORIGIN}/v1/api/chat/users/me`,
    {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  return res.json();
}
