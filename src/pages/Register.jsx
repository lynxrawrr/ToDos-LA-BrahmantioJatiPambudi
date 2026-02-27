import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";

import { useAppDispatch } from "../app/hooks";
import { register } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  // styles
  const loginInputClass =
    "px-4 " +
    "dark:border-[var(--brand-purple-dark)] " +
    "dark:hover:border-[color-mix(in_srgb,var(--brand-purple-dark)_80%,transparent)] " +
    "dark:focus:ring-2 dark:focus:ring-[color-mix(in_srgb,var(--brand-purple-dark)_35%,transparent)]";

  // handler: submit register form
  function submit(e) {
    e.preventDefault();

    const n = name.trim();
    const em = email.trim();
    const p = pw.trim();

    if (!n) return setErr("Full name wajib diisi.");
    if (!em) return setErr("Email wajib diisi.");
    if (p.length < 8) return setErr("Password minimal 8 karakter.");
    setErr("");

    dispatch(register({ name: n, email: em }));
    nav("/dashboard");
  }

  return (
    <div className="min-h-screen bg-(--page-bg) text-(--page-fg)">
      {/* Header */}
      <Header />

      <main className="mx-auto grid max-w-6xl place-items-center px-6 py-14 md:py-16">
        {/* Register Card */}
        <Card className="w-full max-w-xl p-8 md:p-10">
          {/* Title */}
          <h1 className="text-xl font-bold">
            Welcome, let’s create an account
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-(--muted)">
            Create a new account so that all your note history can be saved and
            you can access it on various devices.
          </p>

          {/* Form */}
          <form onSubmit={submit} className="mt-8 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-(--muted-2)">
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={loginInputClass}
              />
            </div>

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

            {/* Terms */}
            <p className="text-xs text-(--muted)">
              By continuing you agree to the{" "}
              <span className="underline underline-offset-2">
                terms of service
              </span>{" "}
              and{" "}
              <span className="underline underline-offset-2">
                privacy policy
              </span>
              .
            </p>

            {/* Error Message */}
            {err ? <p className="text-sm text-(--danger)">{err}</p> : null}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit">Continue</Button>
            </div>

            {/* Login Link */}
            <p className="pt-2 text-sm text-(--muted) text-right">
              Already registered?{" "}
              <Link
                to="/login"
                className={[
                  "font-semibold underline underline-offset-2 transition",
                  "text-(--muted-2) hover:text-(--page-fg)",
                  "dark:text-(--brand-blue-dark) dark:hover:text-(--brand-blue-dark-hover)",
                ].join(" ")}
              >
                Sign In
              </Link>
            </p>
          </form>
        </Card>
      </main>
    </div>
  );
}
