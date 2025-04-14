"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function UserLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data);
        if (data.code === "INVALID_CREDENTIALS") {
          setError(
            "Server configuration error. Please contact the administrator."
          );
        } else {
          setError(data.error || "An unexpected error occurred");
        }
        return;
      }

      if (data.exists) {
        const otpResponse = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const otpData = await otpResponse.json();

        if (!otpResponse.ok) {
          console.error("OTP API error:", otpData);
          setError(otpData.error || "Failed to send verification code");
          return;
        }

        setStep("otp");
      } else {
        setShowRegisterPrompt(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/user/health");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Health Monitoring System"
                width={80}
                height={80}
                className="h-20 w-20"
              />
            </div>
            <h2 className="mt-6 text-3xl font-light tracking-tight text-gray-900">
              {step === "email" ? "Welcome back" : "Verify your email"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {step === "email"
                ? "Enter your email to continue"
                : "We've sent a code to your email"}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-100">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {showRegisterPrompt && (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="text-sm text-gray-600">
                Your account was not found. Would you like to register?
              </div>
              <div className="mt-2">
                <Link
                  href="/register"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  Register now →
                </Link>
              </div>
            </div>
          )}

          {showSupport && (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="text-sm text-gray-600">
                Having trouble signing in? Contact our support team.
              </div>
              <div className="mt-2">
                <a
                  href="mailto:support@healthmonitoring.com"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  Email support →
                </a>
              </div>
            </div>
          )}

          <form
            className="mt-8 space-y-6"
            onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit}
          >
            <div className="space-y-4">
              {step === "email" ? (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Verification code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
                    placeholder="Enter 4-digit code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : step === "email" ? (
                  "Continue"
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => setShowSupport(!showSupport)}
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Need help?
            </button>
            <Link
              href="/login"
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Back to login options
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
