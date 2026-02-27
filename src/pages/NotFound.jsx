import { Link } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(--page-bg) text-(--page-fg)">
      {/* Header */}
      <Header />

      <main className="mx-auto grid max-w-6xl place-items-center px-6 py-14 md:py-16">
        {/* 404 Card */}
        <section className="w-full max-w-xl rounded-2xl border border-(--gray-200) bg-white p-8 text-center shadow-sm dark:border-[color-mix(in_srgb,var(--gray-500)_80%,transparent)] dark:bg-(--gray-500) dark:shadow-[0_18px_45px_rgba(0,0,0,.55)] md:p-10">
          {/* Code */}
          <p className="text-sm font-semibold text-(--muted)">404</p>

          {/* Title */}
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Page not found
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm text-(--muted)">
            This page isn’t available. The link may be incorrect or the page may
            have moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {/* Back to Dashboard */}
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Back to Dashboard</Button>
            </Link>

            {/* Go to Login */}
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-md border border-(--gray-200) px-4 py-2.5 text-sm font-semibold text-(--page-fg) transition hover:bg-(--gray-100) active:translate-y-px dark:border-(--brand-purple) dark:hover:bg-(--brand-purple)"
            >
              Go to Login
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
