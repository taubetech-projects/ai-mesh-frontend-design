import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./page";
import {
  CHAT_ROUTES,
  PLATFORM_ROUTES,
} from "@/shared/constants/routingConstants";
// Mock the constants locally instead of importing
vi.mock("@/shared/constants/routingConstants", () => ({
  CHAT_ROUTES: {
    CHAT: "/chat",
    SIGNIN: "/signin",
  },
  PLATFORM_ROUTES: {
    HOME: "/platform",
  },
}));

// Mock react-redux
vi.mock("react-redux", () => ({
  Provider: vi.fn(({ children }) => <>{children}</>),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: vi.fn(({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
}));

// Type-safe query helpers
const getByText = (text: string | RegExp) => screen.getByText(text);
const getAllByText = (text: string | RegExp) => screen.getAllByText(text);
const getByRole = (role: string) => screen.getByRole(role);

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the navbar with logo and navigation links", () => {
    render(<HomePage />);

    const nav = screen.getByRole("navigation");
    expect(within(nav).getByText("AI Mesh")).toBeInTheDocument();

    expect(within(nav).getByText("Features")).toBeInTheDocument();
    expect(within(nav).getByText("Pricing")).toBeInTheDocument();
    expect(within(nav).getByText("About")).toBeInTheDocument();
    expect(within(nav).getByText("Log In")).toBeInTheDocument();
  });

  it("has correct href attributes for navigation links", () => {
    render(<HomePage />);

    const nav = screen.getByRole("navigation");

    const logoLink = within(nav).getByRole("link", { name: "AI Mesh" });
    expect(logoLink).toHaveAttribute("href", CHAT_ROUTES.CHAT);

    const loginLink = within(nav).getByRole("link", { name: /log in/i });
    expect(loginLink).toHaveAttribute("href", CHAT_ROUTES.SIGNIN);
  });

  it("renders the hero section with correct content", () => {
    render(<HomePage />);

    const heroTitles = getAllByText("AI Mesh");
    expect(heroTitles.length).toBeGreaterThan(0);

    expect(
      getByText(/Harness the power of next-generation conversational AI/)
    ).toBeInTheDocument();

    expect(getByText("Start Here")).toBeInTheDocument();
    expect(getByText("Try Playground")).toBeInTheDocument();
  });

  it("hero section buttons have correct links", () => {
    render(<HomePage />);

    const startButton = getByText("Start Here") as HTMLAnchorElement;
    expect(startButton).toHaveAttribute("href", CHAT_ROUTES.SIGNIN);

    const playgroundButton = getByText("Try Playground") as HTMLAnchorElement;
    expect(playgroundButton).toHaveAttribute("href", PLATFORM_ROUTES.HOME);
  });

  it("renders the footer with correct content", () => {
    render(<HomePage />);

    const currentYear = new Date().getFullYear();
    expect(
      getByText(`© ${currentYear} AI Mesh. All rights reserved.`)
    ).toBeInTheDocument();

    expect(getByText("Privacy Policy")).toBeInTheDocument();
    expect(getByText("Terms of Service")).toBeInTheDocument();
    expect(getByText("Contact Us")).toBeInTheDocument();
  });

  it("applies correct CSS classes to navbar", () => {
    render(<HomePage />);

    const navbar = getByRole("navigation");
    expect(navbar).toHaveClass("fixed");
    expect(navbar).toHaveClass("top-0");
    expect(navbar).toHaveClass("w-full");
    expect(navbar).toHaveClass("bg-black/20");
    expect(navbar).toHaveClass("backdrop-blur-md");
  });

  it("hero title has gradient text effect", () => {
    render(<HomePage />);

    const heroTitles = getAllByText("AI Mesh");
    expect(heroTitles.length).toBeGreaterThan(1);

    const heroTitle = heroTitles[1];
    expect(heroTitle).toHaveClass("text-transparent");
    expect(heroTitle).toHaveClass("bg-clip-text");
    expect(heroTitle).toHaveClass("bg-gradient-to-r");
  });

  it("CTA buttons have hover effects", () => {
    render(<HomePage />);

    const startButton = getByText("Start Here");
    expect(startButton).toHaveClass("hover:scale-105");
    expect(startButton).toHaveClass("transition-all");
    expect(startButton).toHaveClass("duration-300");
  });

  it("navbar login button has correct styling", () => {
    render(<HomePage />);

    const loginButton = getByText("Log In");
    expect(loginButton).toHaveClass("bg-indigo-600");
    expect(loginButton).toHaveClass("hover:bg-indigo-700");
  });
});

describe("Accessibility", () => {
  it("has semantic HTML structure", () => {
    render(<HomePage />);

    expect(getByRole("navigation")).toBeInTheDocument();
    expect(getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
