import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import * as nextMocks from "./mocks/next";

// Mock Next.js modules using our mocks
vi.mock("next/link", () => ({
  default: nextMocks.MockNextLink,
}));

vi.mock("next/navigation", () => ({
  useRouter: nextMocks.mockUseRouter,
  useSearchParams: nextMocks.mockUseSearchParams,
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

// Mock your constants
vi.mock("@/shared/constants/routingConstants", () => ({
  CHAT_ROUTES: {
    CHAT: "/chat",
    SIGNIN: "/signin",
  },
  PLATFORM_ROUTES: {
    HOME: "/platform",
  },
}));

// Mock Redux store
vi.mock("@/lib/store/store", () => ({
  default: {
    getState: vi.fn(),
    dispatch: vi.fn(),
    subscribe: vi.fn(),
    replaceReducer: vi.fn(),
  },
}));

// Clear all mocks after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
