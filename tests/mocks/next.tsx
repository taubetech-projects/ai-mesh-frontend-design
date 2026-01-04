import React from "react";
import { vi } from "vitest";

// Mock next/link
export const MockNextLink = ({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  [key: string]: any;
}) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

// Mock next/navigation
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

export const mockUseRouter = () => mockRouter;
export const mockUseSearchParams = () => ({
  get: vi.fn(),
  getAll: vi.fn(),
  has: vi.fn(),
  forEach: vi.fn(),
});
