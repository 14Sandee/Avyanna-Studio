'use client';

import { Loader2, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // If "remember me" is unchecked, session will be cleared on tab close
      if (!rememberMe) {
        // Store a flag so we can clear session on window close
        sessionStorage.setItem('avyanna_no_persist', 'true');
      } else {
        sessionStorage.removeItem('avyanna_no_persist');
      }

      router.replace('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) throw error;
      setSuccess('Password reset link sent! Check your email inbox.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-stone-50 via-white to-stone-100 px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Back to site */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Avyanna Studio
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-stone-100 bg-white/80 p-8 shadow-xl shadow-stone-200/50 backdrop-blur-xl md:p-10">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="mb-2 text-lg font-light tracking-[0.25em] text-stone-800 uppercase">
              Avyanna Studio
            </h1>
            <div className="mx-auto mb-3 h-[1px] w-8 bg-stone-300" />
            <p className="text-sm tracking-wider text-stone-400 uppercase">
              {mode === 'login' ? 'Admin Login' : 'Reset Password'}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs tracking-widest text-stone-400 uppercase">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 border-stone-200 bg-stone-50/50 text-base transition-colors focus-visible:bg-white focus-visible:ring-stone-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs tracking-widest text-stone-400 uppercase">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="h-12 border-stone-200 bg-stone-50/50 text-base transition-colors focus-visible:bg-white focus-visible:ring-stone-300"
                />
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
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
                    setMode('forgot');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-stone-400 transition-colors hover:text-stone-700"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-stone-800 text-sm tracking-[0.15em] text-white uppercase transition-all hover:bg-stone-900"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <p className="text-sm leading-relaxed text-stone-500">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <div className="space-y-2">
                <Label className="text-xs tracking-widest text-stone-400 uppercase">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 border-stone-200 bg-stone-50/50 text-base transition-colors focus-visible:bg-white focus-visible:ring-stone-300"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-stone-800 text-sm tracking-[0.15em] text-white uppercase transition-all hover:bg-stone-900"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-stone-400 transition-colors hover:text-stone-700"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs tracking-wide text-stone-300">
          Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
