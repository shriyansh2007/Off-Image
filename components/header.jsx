"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import { useStoreUserEffect } from "../hooks/useStoreUserEffect";
import { Unauthenticated, Authenticated } from "convex/react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const path = usePathname();
  const { isLoading } = useStoreUserEffect();
  const [mobileMenu, setMobileMenu] = useState(false);

  // Skip rendering on editor and auth pages
  if (path.includes("/editor") || path.includes("/signin") || path.includes("/signup")) {
    return null;
  }

  return (
    <>
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div
          className="
            relative
            flex items-center justify-between
            px-5 sm:px-8 py-3
            rounded-full
            border border-white/10
            bg-white/[0.04]
            backdrop-blur-2xl
            shadow-[0_0_40px_rgba(0,0,0,0.6)]
            overflow-hidden
          "
        >
          {/* Glow Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8FF00]/5 via-transparent to-[#8B5CF6]/5 pointer-events-none" />

          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center gap-1 text-xl sm:text-2xl font-black tracking-tight"
          >
            <span
              className="text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Off
            </span>

            <span
              className="text-[#C8FF00]"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Image
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: "Features", href: "features" },
              { name: "Pricing", href: "pricing" },
              { name: "Contact", href: "contact" },
            ].map((item) => {
              const isHome = path === "/";
              const href = isHome ? `#${item.href}` : `/?section=${item.href}#${item.href}`;
              return (
                <Link
                  key={item.name}
                  href={href}
                  className="
                    text-white/80
                    font-medium
                    transition-all
                    duration-300
                    hover:text-[#C8FF00]
                    relative
                    group
                  "
                >
                  {item.name}

                  <span
                    className="
                      absolute
                      left-0
                      -bottom-1
                      h-[2px]
                      w-0
                      bg-[#C8FF00]
                      transition-all
                      duration-300
                      group-hover:w-full
                    "
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Unauthenticated>
              <Link
                href="/signin"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:border-[#C8FF00]/50 hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#C8FF00] via-lime-300 to-[#86efac] px-5 py-2 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(200,255,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(200,255,0,0.24)]"
              >
                Sign Up
              </Link>
            </Unauthenticated>

            <Authenticated>
              <Link href="/dashboard">
                <button
                  className="
                    flex items-center justify-center
                    h-10 w-10
                    rounded-full
                    border border-white/10
                    bg-white/[0.05]
                    hover:border-[#C8FF00]/50
                    hover:text-[#C8FF00]
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  <LayoutDashboard size={18} />
                </button>
              </Link>

              <UserButton />
            </Authenticated>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                md:hidden
                flex items-center justify-center
                h-10 w-10
                rounded-full
                bg-white/[0.05]
                border border-white/10
                text-white
              "
            >
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div
            className="
              md:hidden
              mt-3
              rounded-3xl
              border border-white/10
              bg-[#111111]/90
              backdrop-blur-3xl
              p-6
              flex flex-col
              gap-5
              animate-in
              fade-in
              slide-in-from-top-4
              duration-300
            "
          >
            {[
              { name: "Features", anchor: "features" },
              { name: "Pricing", anchor: "pricing" },
              { name: "Contact", anchor: "contact" },
            ].map((item) => {
              const isHome = path === "/";
              const href = isHome ? `#${item.anchor}` : `/?section=${item.anchor}#${item.anchor}`;
              return (
                <Link
                  key={item.name}
                  href={href}
                  className="text-white/80 hover:text-[#C8FF00]"
                  onClick={() => setMobileMenu(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            <Unauthenticated>
              <Link
                href="/signin"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenu(false)}
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-[#C8FF00] px-4 py-3 text-center text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d9ff6f]"
                onClick={() => setMobileMenu(false)}
              >
                Sign Up
              </Link>
            </Unauthenticated>
          </div>
        )}
      </header>

      {isLoading && (
        <div className="fixed bottom-0 left-0 w-full z-[60] flex justify-center">
          <BarLoader
            width={"95%"}
            color="#C8FF00"
            height={3}
          />
        </div>
      )}
    </>
  );
};

export default Header;