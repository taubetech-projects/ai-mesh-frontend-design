export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: false, // isProd, // IMPORTANT: false on localhost (http)
    sameSite: "lax" as const,
    path: "/",
  };
};
