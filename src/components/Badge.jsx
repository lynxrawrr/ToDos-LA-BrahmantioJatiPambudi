import { memo } from "react";

function Badge({ children, tone = "neutral" }) {
  // tone = variant warna badge
  const toneClass =
    tone === "blue"
      ? "bg-[color-mix(in_srgb,var(--brand-blue)_20%,transparent)] text-(--brand-blue-dark)"
      : tone === "purple"
        ? "bg-[color-mix(in_srgb,var(--brand-purple)_25%,transparent)] text-(--brand-purple-dark)"
        : "bg-(--gray-200) text-(--muted-2) dark:bg-(--gray-500) dark:text-(--gray-200)";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default memo(Badge);