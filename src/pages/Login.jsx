import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";

import { useAppDispatch } from "../app/hooks";
import { login } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  // styles
  const loginInputClass =
    "px-4 " +
    "dark:border-[var(--brand-purple-dark)] " +
    "dark:hover:border-[color-mix(in_srgb,var(--brand-purple-dark)_80%,transparent)] " +
    "dark:focus:ring-2 dark:focus:ring-[color-mix(in_srgb,var(--brand-purple-dark)_35%,transparent)]";

  // handler: submit login form
  function submit(e) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return setErr("Email wajib diisi.");
    if (pw.trim().length < 8) return setErr("Password minimal 8 karakter.");
    setErr("");

    dispatch(
      login({ email: cleanEmail, name: cleanEmail.split("@")[0] || "User" }),
    );
    nav("/dashboard");
  }

  return (
    <div className="min-h-screen bg-(--page-bg) text-(--page-fg)">
      {/* Header */}
      <Header />

      <main className="mx-auto grid max-w-6xl place-items-center px-6 py-14 md:py-16">
        {/* Login Card */}
        <Card className="w-full max-w-xl p-8 md:p-10">
          {/* Title */}
          <h1 className="text-xl font-bold">Welcome, let’s Login</h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-(--muted)">
            Please login so you can see your record history.
          </p>

          {/* Form */}
          <form onSubmit={submit} className="mt-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-(--muted-2)">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className={loginInputClass}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-(--muted-2)">
                Password
              </label>
              <Input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Must be at least 8 characters."
                type="password"
                className={loginInputClass}
              />
            </div>

            {/* Error Message */}
            {err ? <p className="text-sm text-(--danger)">{err}</p> : null}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit">Login</Button>
            </div>

            {/* Register Link */}
            <p className="pt-2 text-sm text-(--muted) text-right">
              Don’t have account?{" "}
              <Link
                to="/register"
                className={[
                  "font-semibold underline underline-offset-2 transition",
                  "text-(--muted-2) hover:text-(--page-fg)",
                  "dark:text-(--brand-blue-dark) dark:hover:text-(--brand-blue-dark-hover)",
                ].join(" ")}
              >
                Register
              </Link>
            </p>
          </form>
        </Card>
      </main>
    </div>
  );
}
