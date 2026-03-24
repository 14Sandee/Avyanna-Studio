"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState<"login" | "forgot">("login");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // If "remember me" is unchecked, session will be cleared on tab close
      if (!rememberMe) {
        // Store a flag so we can clear session on window close
        sessionStorage.setItem("avyanna_no_persist", "true");
      } else {
        sessionStorage.removeItem("avyanna_no_persist");
      }

      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) throw error;
      setSuccess("Password reset link sent! Check your email inbox.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-stone-100 px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative w-full max-w-md">
        {/* Back to site */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Avyanna Studio
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg tracking-[0.25em] font-light text-stone-800 uppercase mb-2">
              Avyanna Studio
            </h1>
            <div className="w-8 h-[1px] bg-stone-300 mx-auto mb-3" />
            <p className="text-sm tracking-wider text-stone-400 uppercase">
              {mode === "login" ? "Admin Login" : "Reset Password"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 text-base border-stone-200 bg-stone-50/50 focus-visible:ring-stone-300 focus-visible:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="h-12 text-base border-stone-200 bg-stone-50/50 focus-visible:ring-stone-300 focus-visible:bg-white transition-colors"
                />
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-stone-800 focus:ring-stone-300"
                  />
                  <span className="text-sm text-stone-500">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-stone-800 hover:bg-stone-900 text-white text-sm tracking-[0.15em] uppercase transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <p className="text-sm text-stone-500 leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <div className="space-y-2">
                <Label className="text-xs tracking-[0.1em] uppercase text-stone-400">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 text-base border-stone-200 bg-stone-50/50 focus-visible:ring-stone-300 focus-visible:bg-white transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-stone-800 hover:bg-stone-900 text-white text-sm tracking-[0.15em] uppercase transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-stone-300 mt-6 tracking-wide">
          Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
}
