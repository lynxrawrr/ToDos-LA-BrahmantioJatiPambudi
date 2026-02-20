import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { loadTheme, saveTheme } from "../utils/storage";
import logo from "../assets/logo/logo.svg";
import { Moon, Sun, TriangleAlert } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const getInitialDark = () => {
  const t = loadTheme();
  const dark = t === "dark";
  document.documentElement.classList.toggle("dark", dark);
  return dark;
};

export default function Header({ showAuthAction = false }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [isDark, setIsDark] = useState(getInitialDark);
  const [openLogout, setOpenLogout] = useState(false);

  function toggleTheme() {
    setIsDark((prev) => {
      const nextDark = !prev;
      saveTheme(nextDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", nextDark);
      return nextDark;
    });
  }

  return (
    <>
      <header
        className={[
          "border-b backdrop-blur",
          "border-(--gray-200) dark:border-(--gray-500)",
          "bg-[color-mix(in_srgb,var(--navbar)_80%,transparent)]",
          "dark:bg-[color-mix(in_srgb,var(--navbar)_60%,transparent)]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:py-7">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Todo"
              className="h-8 md:h-9 w-auto"
              draggable={false}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className={[
                "inline-flex h-10 w-10 items-center justify-center rounded-md border transition",
                "border-(--gray-200) hover:bg-(--gray-100)",
                "bg-[color-mix(in_srgb,white_70%,transparent)]",
                "dark:border-(--gray-500)",
                "dark:bg-[color-mix(in_srgb,var(--navbar)_40%,transparent)]",
                "dark:hover:bg-(--gray-600)",
              ].join(" ")}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Auth Actions */}
            {showAuthAction ? (
              user ? (
                // Logged In
                <button
                  onClick={() => setOpenLogout(true)}
                  type="button"
                  className={[
                    "rounded-md px-4 py-2.5 text-sm font-semibold text-white transition active:translate-y-px",
                    "bg-(--brand-blue-dark) hover:bg-(--brand-blue-dark-hover)",
                  ].join(" ")}
                >
                  Log Out
                </button>
              ) : (
                // Guest
                <Link
                  to="/login"
                  className={[
                    "rounded-md border px-4 py-2.5 text-sm font-semibold transition active:translate-y-px",
                    "border-(--gray-200) hover:bg-(--gray-100)",
                    "dark:border-(--gray-500) dark:hover:bg-(--gray-600)",
                  ].join(" ")}
                >
                  Login
                </Link>
              )
            ) : null}
          </div>
        </div>
      </header>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={openLogout}
        title="Log out?"
        description="You’ll need to sign in again to access your account."
        confirmText="Log Out"
        cancelText="Cancel"
        tone="primary"
        icon={<TriangleAlert className="h-5 w-5" />}
        onCancel={() => setOpenLogout(false)}
        onConfirm={() => {
          dispatch(logout());
          setOpenLogout(false);
        }}
      />
    </>
  );
}
