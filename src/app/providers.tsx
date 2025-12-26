"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/shared/contexts/theme-context";
import { LanguageProvider } from "@/shared/contexts/language-context";
import { Suspense, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import store from "@/lib/store/store";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { usePathname } from "next/navigation";

export function Providers({
  children,
  initialMe,
}: {
  children: React.ReactNode;
  initialMe: any;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth");

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60 * 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Suspense fallback={null}>
        <Provider store={store}>
          <AuthProvider initialMe={initialMe} enabled={!isAuthRoute}>
            <ThemeProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </Suspense>
      <Analytics />
    </QueryClientProvider>
  );
}
