"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { login, verifyToken } from "@/lib/authApi";
import { TokenManager } from "@/lib/tokenManager";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { ORGANIZATION } from "@/constants/organization";
import { apiErrorMessage, isApiError } from "@/lib/apiErrors";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type Notice = { kind: "error" | "info"; text: string } | null;

export default function AdminLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language].admin;
  const tNet = translations[language].network;
  const org = ORGANIZATION[language];
  const { online } = useNetworkStatus();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Tokens live in a cookie, which does not exist during the server render.
  // Reading them in an effect rather than in useState keeps the first client
  // paint identical to the server's and avoids a hydration mismatch.
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("session") === "expired"
      ) {
        setNotice({ kind: "info", text: t.sessionExpired });
      }

      const access = TokenManager.getAccessToken();
      if (!access) {
        if (!cancelled) setCheckingSession(false);
        return;
      }

      try {
        const res = await verifyToken(access);
        if (cancelled) return;
        if (!res.code && !res.detail) {
          router.replace("/admin/terms");
          return;
        }
        TokenManager.clearTokens();
      } catch {
        // A stale or unverifiable token is not an error worth showing: the
        // visitor is on the login page already. Clear it and let them sign in.
        if (!cancelled) TokenManager.clearTokens();
      }

      if (!cancelled) setCheckingSession(false);
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);

    if (!username.trim() || !password) {
      setNotice({ kind: "error", text: t.emptyFields });
      return;
    }

    if (!online) {
      setNotice({ kind: "error", text: tNet.offlineText });
      return;
    }

    setLoading(true);
    try {
      const tokens = await login({ username: username.trim(), password });
      TokenManager.setTokens(tokens.access, tokens.refresh);
      router.replace("/admin/terms");
    } catch (error) {
      // The whole point of this branch: a refused password must land here and
      // stay on screen. It used to be swallowed by a window.location redirect
      // in the api client, which reloaded the page and cleared the form.
      if (isApiError(error) && error.status === 401) {
        setNotice({ kind: "error", text: t.badCredentials });
      } else if (isApiError(error) && error.kind === "client") {
        setNotice({ kind: "error", text: apiErrorMessage(error, language) });
      } else {
        setNotice({
          kind: "error",
          text: error ? apiErrorMessage(error, language) : t.loginFailed,
        });
      }
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#001c3b] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0099B5] via-[#c9a96e] to-[#1EB53A] opacity-80 z-10" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900 blur-[120px] opacity-40" />
      <div className="absolute top-[80%] right-[0%] w-[40%] h-[40%] rounded-full bg-[#c9a96e] blur-[100px] opacity-20" />

      <div className="z-10 w-full max-w-md">
        {/* Header/Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 shadow-xl">
            <svg
              className="w-8 h-8 text-[#c9a96e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            {t.panelTitle}
          </h1>
          <p className="mt-2 text-blue-200 text-sm sm:text-base font-medium tracking-wide">
            {t.panelSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/20">
          {checkingSession ? (
            <p className="text-center text-sm text-gray-600 py-6">
              {t.checkingAccess}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {notice && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className={`p-4 rounded-md flex items-start gap-3 border-l-4 ${
                    notice.kind === "error"
                      ? "bg-red-50 border-red-500"
                      : "bg-amber-50 border-amber-500"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      notice.kind === "error"
                        ? "text-red-500"
                        : "text-amber-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p
                    className={`text-sm font-medium ${
                      notice.kind === "error"
                        ? "text-red-700"
                        : "text-amber-800"
                    }`}
                  >
                    {notice.text}
                  </p>
                </div>
              )}

              {!online && (
                <p
                  role="status"
                  className="text-sm text-amber-800 bg-amber-50 border-l-4 border-amber-500 p-3 rounded-md"
                >
                  {tNet.offlineTitle}
                </p>
              )}

              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wider"
                >
                  {t.usernameLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="admin-username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001c3b] focus:border-transparent text-gray-900 transition-all shadow-sm"
                    placeholder="admin"
                    autoComplete="username"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wider"
                >
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001c3b] focus:border-transparent text-gray-900 transition-all shadow-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Parolni yashirish" : "Parolni koʻrsatish"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001c3b] rounded-md"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full relative flex justify-center items-center bg-[#001c3b] text-[#c9a96e] py-3.5 rounded-xl hover:bg-[#002a5c] focus:outline-none focus:ring-2 focus:ring-[#001c3b] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl font-bold text-[15px] uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#c9a96e]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t.signingIn}
                  </>
                ) : (
                  <>
                    {t.signIn}
                    <svg
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-blue-200/60 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} {org.shortName}
        </p>
      </div>
    </div>
  );
}
