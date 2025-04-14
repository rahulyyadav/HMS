"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="bg-white shadow-custom w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/hms-logo.svg"
                alt="HMS Logo"
                width={120}
                height={36}
                priority
              />
            </Link>

            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link
                href="/packages"
                className="text-text-light hover:text-primary transition-colors duration-200"
              >
                Packages
              </Link>
              <Link
                href="/doctors"
                className="text-text-light hover:text-primary transition-colors duration-200"
              >
                Doctors List
              </Link>
              <Link
                href="/achievements"
                className="text-text-light hover:text-primary transition-colors duration-200"
              >
                Achievements
              </Link>
              <Link
                href="/user/statistics"
                className="text-text-light hover:text-primary transition-colors duration-200"
              >
                Instant Statistics
              </Link>
              {isAuthenticated && (
                <Link
                  href="/user/health"
                  className="text-text-light hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User avatar"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="hidden md:inline">
                    {session?.user?.name || session?.user?.email || "User"}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-slideDown">
                    <Link
                      href="/user/health"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/statistics"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      View Instant Statistics
                    </Link>
                    <Link
                      href="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  onMouseEnter={() => setShowLoginOptions(true)}
                  onMouseLeave={() => setShowLoginOptions(false)}
                >
                  <Link href="/login">Login</Link>
                </button>

                {showLoginOptions && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-slideDown"
                    onMouseEnter={() => setShowLoginOptions(true)}
                    onMouseLeave={() => setShowLoginOptions(false)}
                  >
                    <Link
                      href="/login/user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      User Login
                    </Link>
                    <Link
                      href="/login/doctor"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Doctor Login
                    </Link>
                    <Link
                      href="/login/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Admin Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center ml-4">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/packages"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Packages
          </Link>
          <Link
            href="/doctors"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Doctors List
          </Link>
          <Link
            href="/achievements"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Achievements
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/user/health"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                href="/user/statistics"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                View Instant Statistics
              </Link>
              <Link
                href="/user/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login/user"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                User Login
              </Link>
              <Link
                href="/login/doctor"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Doctor Login
              </Link>
              <Link
                href="/login/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
