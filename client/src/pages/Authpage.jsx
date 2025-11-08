import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [liEmail, setLiEmail] = useState("");
  const [liPass, setLiPass] = useState("");

  // Signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");
  const [suPass2, setSuPass2] = useState("");
  const [touched, setTouched] = useState({});
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpMsg, setOtpMsg] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const RESEND_COOLDOWN = 20;

  useEffect(() => {
    if (resendSeconds > 0) {
      const timer = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendSeconds]);

  const isNameOk = (v) => v.trim().length >= 2;
  const isEmailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPassOk = (v) =>
    v.length >= 8 && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v);
  const signupStepValid = () =>
    isNameOk(firstName) &&
    isNameOk(lastName) &&
    isEmailOk(suEmail) &&
    isPassOk(suPass) &&
    suPass === suPass2;

  const mark = (key) => setTouched((s) => ({ ...s, [key]: true }));

  const startSignup = () => {
    setMode("signup");
    setStep(1);
    setError("");
  };

  const onSubmitSignupStep1 = async (e) => {
    e.preventDefault();
    setTouched({ fn: true, ln: true, se: true, pw: true, pw2: true });
    if (!signupStepValid()) return;

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: suEmail,
          password: suPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      setStep(2);
      setResendSeconds(RESEND_COOLDOWN);
      setOtp(["", "", "", ""]);
      setOtpMsg("OTP sent to your email.");
      setTimeout(() => otpRefs[0].current?.focus(), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) return setOtpMsg("Enter full code");

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: suEmail, otp: code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      setOtpMsg("✅ Verified successfully! Redirecting...");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setOtpMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendSeconds > 0) return;
    try {
      setResendSeconds(RESEND_COOLDOWN);
      setOtp(["", "", "", ""]);
      otpRefs[0].current?.focus();
      setOtpMsg("Requesting new code...");

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: suEmail,
          password: suPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtpMsg("A new code was sent to your email.");
    } catch (err) {
      setOtpMsg(err.message);
    }
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: liEmail, password: liPass }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const copy = [...otp];
    copy[i] = v;
    setOtp(copy);
    if (v && i < 3) otpRefs[i + 1].current?.focus();
    if (!v && i > 0) otpRefs[i - 1].current?.focus();
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").trim().slice(0, 4);
    if (!/^\d{1,4}$/.test(text)) return;
    const arr = text.split("");
    const next = ["", "", "", ""];
    arr.forEach((d, idx) => (next[idx] = d));
    setOtp(next);
    const focusIdx = Math.min(arr.length, 3);
    setTimeout(() => otpRefs[focusIdx]?.current?.focus(), 50);
  };

  return (
  <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#14021b,#090211,#05010a)] flex items-start justify-center pt-20 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
    <div className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(10,0,20,0.6)] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block relative bg-linear-to-br from-[#2a004a] via-[#1b0135] to-[#0a0015] p-8 lg:p-10">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute -left-16 -top-10 w-72 h-72 rounded-full bg-linear-to-tr from-[#7c2eff] to-[#ff6ad5] blur-3xl opacity-30" />
          <div className="absolute -right-24 bottom-8 w-56 h-56 rounded-full bg-linear-to-bl from-[#5b1bff] to-[#9a4bff] blur-2xl opacity-25" />
          <div className="absolute left-10 bottom-0 w-40 h-40 rounded-full bg-linear-to-tr from-[#8b3bff] to-[#ff66c7] blur-lg opacity-20" />
        </div>
        <div className="h-full flex flex-col justify-center gap-6 text-gray-100">
          <div className="text-3xl font-poppins font-semibold bg-clip-text text-transparent bg-linear-to-r from-fuchsia-400 to-purple-600">
            PublicFeed
          </div>
          <h2 className="text-2xl font-poppins font-semibold leading-tight">
            Where professionals connect, create, and grow.
          </h2>
          <p className="text-sm text-gray-300 max-w-sm">
            Join a community that values craft and clarity.
          </p>
        </div>
      </div>

      <div className="relative flex items-start justify-center py-8 sm:py-12 px-4 sm:px-6 md:px-10 bg-[rgba(15,10,25,0.4)] backdrop-blur-3xl backdrop-saturate-180 border border-purple-900/30 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="w-full max-w-xl">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="text-base sm:text-lg font-poppins font-semibold bg-clip-text text-transparent bg-linear-to-r from-fuchsia-400 to-purple-600">
              {mode === "login"
                ? "Sign in"
                : step === 1
                ? "Create account"
                : "Verify code"}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setMode("login");
                  setStep(0);
                }}
                className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full ${
                  mode === "login"
                    ? "bg-[#2a0b4a] text-white"
                    : "text-gray-300 hover:bg-[#12041b]"
                }`}
              >
                Login
              </button>
              <button
                onClick={startSignup}
                className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full ${
                  mode === "signup"
                    ? "bg-fuchsia-600 text-white"
                    : "text-gray-300 hover:bg-[#12041b]"
                }`}
              >
                Sign up
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-400 text-xs bg-red-900/20 p-2 sm:p-3 rounded-lg border border-red-800/30 break-words">
              {error}
            </div>
          )}

          <div className="relative overflow-hidden min-h-[500px] sm:min-h-[600px] transition-all duration-500">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${
                mode === "login" ? "translate-x-0" : "-translate-x-1/2"
              } w-[200%]`}
            >
              <div className="w-1/2 px-1 sm:px-2">
                <form
                  onSubmit={onSubmitLogin}
                  className="p-4 sm:p-6 bg-[rgba(20,7,32,0.3)] rounded-xl sm:rounded-2xl border border-purple-800/20 flex flex-col justify-between min-h-[500px] sm:min-h-[600px] backdrop-blur-xl backdrop-saturate-180"
                >
                  <div className="flex flex-col gap-4">
                    <label className="text-xs text-gray-400">Email</label>
                    <input
                      value={liEmail}
                      onChange={(e) => setLiEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="you@domain.com"
                      className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100 text-sm"
                    />
                    <label className="text-xs text-gray-400">Password</label>
                    <input
                      value={liPass}
                      onChange={(e) => setLiPass(e.target.value)}
                      type="password"
                      required
                      placeholder="••••••••"
                      className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 outline-none text-gray-100 text-sm"
                    />
                  </div>

                  <button
                    disabled={loading}
                    className="mt-6 w-full py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-purple-600 to-fuchsia-600 text-white text-sm sm:text-base font-medium shadow-[0_8px_30px_rgba(168,85,247,0.18)] disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>

              <div className="w-1/2 px-1 sm:px-2">
                <div className="p-4 sm:p-6 bg-[rgba(20,7,32,0.3)] rounded-xl sm:rounded-2xl border border-purple-800/20 flex flex-col justify-between min-h-[500px] sm:min-h-[600px] backdrop-blur-xl backdrop-saturate-180">
                  {step === 1 && (
                    <form
                      onSubmit={onSubmitSignupStep1}
                      className="flex flex-col gap-4 justify-between h-full"
                    >
                      <div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-gray-400">First name</label>
                            <input
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              onBlur={() => mark("fn")}
                              placeholder="John"
                              required
                              className={`mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border ${
                                touched.fn && !isNameOk(firstName)
                                  ? "border-red-500"
                                  : "border-purple-800/30"
                              } text-gray-100 text-sm`}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-gray-400">Last name</label>
                            <input
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              onBlur={() => mark("ln")}
                              placeholder="Doe"
                              required
                              className={`mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border ${
                                touched.ln && !isNameOk(lastName)
                                  ? "border-red-500"
                                  : "border-purple-800/30"
                              } text-gray-100 text-sm`}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="text-xs text-gray-400">Email</label>
                          <input
                            value={suEmail}
                            onChange={(e) => setSuEmail(e.target.value)}
                            onBlur={() => mark("se")}
                            placeholder="email@domain.com"
                            required
                            className={`mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border ${
                              touched.se && !isEmailOk(suEmail)
                                ? "border-red-500"
                                : "border-purple-800/30"
                            } text-gray-100 text-sm`}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="text-xs text-gray-400">Password</label>
                          <input
                            value={suPass}
                            onChange={(e) => setSuPass(e.target.value)}
                            onBlur={() => mark("pw")}
                            placeholder="Min 8 chars, number & symbol"
                            type="password"
                            required
                            className={`mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border ${
                              touched.pw && !isPassOk(suPass)
                                ? "border-red-500"
                                : "border-purple-800/30"
                            } text-gray-100 text-sm`}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="text-xs text-gray-400">Confirm password</label>
                          <input
                            value={suPass2}
                            onChange={(e) => setSuPass2(e.target.value)}
                            onBlur={() => mark("pw2")}
                            placeholder="Repeat password"
                            type="password"
                            required
                            className={`mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0f0714]/60 border ${
                              touched.pw2 && suPass !== suPass2
                                ? "border-red-500"
                                : "border-purple-800/30"
                            } text-gray-100 text-sm`}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setStep(0);
                            setMode("login");
                          }}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-transparent border border-purple-800/30 text-gray-300 text-sm"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={!signupStepValid() || loading}
                          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white text-sm ${
                            signupStepValid()
                              ? "bg-linear-to-r from-purple-600 to-fuchsia-600"
                              : "bg-[#2a1533]/50 cursor-not-allowed"
                          }`}
                        >
                          {loading ? "Sending..." : "Next"}
                        </button>
                      </div>
                    </form>
                  )}

                  {step === 2 && (
                    <form
                      onSubmit={verifyOtp}
                      className="flex flex-col gap-6 justify-center items-center h-full transition-all duration-500"
                    >
                      <div className="text-xs sm:text-sm text-gray-300 text-center px-2 break-words">
                        Enter the 4-digit code sent to{" "}
                        <span className="text-fuchsia-300 font-medium break-all">
                          {suEmail}
                        </span>
                      </div>

                      <div onPaste={handleOtpPaste} className="flex gap-2 sm:gap-3 justify-center">
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={otpRefs[i]}
                            value={d}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            maxLength={1}
                            inputMode="numeric"
                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg rounded-lg bg-[#0f0714]/60 border border-purple-800/30 focus:border-fuchsia-500 text-gray-100"
                          />
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-transparent border border-purple-800/30 text-gray-300 text-sm"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-linear-to-r from-purple-600 to-fuchsia-600 text-white disabled:opacity-50 text-sm"
                        >
                          {loading ? "Verifying..." : "Verify"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 w-full">
                        <div>{otpMsg}</div>
                        <button
                          type="button"
                          onClick={resendOtp}
                          disabled={resendSeconds > 0}
                          className={`text-fuchsia-400 ${
                            resendSeconds > 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {resendSeconds > 0
                            ? `Resend in ${resendSeconds}s`
                            : "Resend"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            Privacy • Terms • Contact
          </div>
        </div>
      </div>
    </div>
  </div>
)

}
