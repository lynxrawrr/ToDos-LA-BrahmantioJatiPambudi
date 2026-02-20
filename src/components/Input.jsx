export default function Input({ className = "", ...props }) {
  // input styles 
  return (
    <input
      {...props}
      className={[
        "h-11 w-full rounded-md border px-4 text-sm outline-none transition",
        "border-(--gray-200) bg-white text-(--page-fg) placeholder:text-(--muted)",
        "focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-purple-dark)_35%,transparent)]",
        "dark:border-[color-mix(in_srgb,var(--gray-500)_85%,transparent)]",
        "dark:bg-[color-mix(in_srgb,var(--gray-500)_35%,transparent)]",
        "dark:text-(--page-fg) dark:placeholder:text-[color-mix(in_srgb,var(--muted)_85%,transparent)]",
        className,
      ].join(" ")}
    />
  );
}
