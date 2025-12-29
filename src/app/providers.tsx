"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/shared/contexts/theme-context";
import { LanguageProvider } from "@/shared/contexts/language-context";
import { Suspense, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import store from "@/lib/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
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
          <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </Provider>
      </Suspense>
      <Analytics />
    </QueryClientProvider>
  );
}
