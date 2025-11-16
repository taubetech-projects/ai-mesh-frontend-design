"use client"
import React from 'react';
import Link from 'next/link';

// --- Navbar Component ---
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/20 backdrop-blur-md text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 hover:opacity-80 transition-opacity">
              AI Mesh
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              About
            </a>
            <Link href="/login" className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Hero Section Component ---
const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden animated-gradient">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80"></div>
      <div className="relative z-10 text-center p-8">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-pink-300 drop-shadow-lg transition-all duration-300 hover:scale-105 hover:drop-shadow-2xl cursor-default">
          AI Mesh
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Harness the power of next-generation conversational AI.
          Your intelligent assistant is just a click away.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/auth/login" className="text-lg font-semibold px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300">
            Start Here
          </Link>
          <Link href="/playground" className="text-lg font-semibold px-10 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/20 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50">
            Try Playground
          </Link>
          {/* <button
            onClick={() => alert('Playground coming soon!')}
            className="text-lg font-semibold px-10 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/20 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Try Playground
          </button> */}
        </div>
      </div>
    </div>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} AI Mesh. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---
export default function HomePage() {
  // This style tag adds the custom animation for the gradient
  const GradientStyle = () => (
    <style>
      {`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background-size: 200% 200%;
          background-image: linear-gradient(
            135deg,
            #1e3a8a, /* indigo-900 */
            #5b21b6, /* purple-800 */
            #be185d, /* pink-700 */
            #a21caf  /* fuchsia-700 */
          );
          animation: gradient-animation 15s ease infinite;
        }
      `}
    </style>
  );

  return (
    <React.Fragment>
      <GradientStyle />
      <div className="font-sans antialiased text-gray-900 bg-gray-900">
        <Navbar />
        <main>
          <>
            <HeroSection />
            {/* You can add more homepage sections here */}
          </>
        </main>
        <Footer />
      </div>
    </React.Fragment>
  );
}