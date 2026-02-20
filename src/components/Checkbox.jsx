import { Check } from "lucide-react";

export default function Checkbox({
  checked,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label={
        ariaLabel ||
        (!ariaLabelledby
          ? checked
            ? "Tandai belum selesai"
            : "Tandai selesai"
          : undefined)
      }
      aria-labelledby={ariaLabelledby}
      className={[
        "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
        checked
          ? "bg-(--brand-purple-dark) border-(--brand-purple-dark) text-white"
          : "bg-transparent border-(--brand-blue-dark) text-transparent hover:bg-[color-mix(in_srgb,var(--brand-blue-dark)_12%,transparent)]",
        "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-blue-dark)_30%,transparent)]",
      ].join(" ")}
      {...props}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </button>
  );
}