import { memo } from "react";
import { X } from "lucide-react";

function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
  loading = false,
  icon,
}) {
  // modal dialog for confirm actions
  if (!open) return null;

  const confirmClass =
    tone === "primary"
      ? "bg-[var(--brand-blue-dark)] hover:bg-[var(--brand-blue-dark-hover)]"
      : "bg-[var(--danger)] hover:bg-[var(--danger-hover)]";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className={[
          "relative w-full max-w-md rounded-xl border p-6 shadow-xl",
          "bg-white border-(--gray-200)",
          "dark:bg-(--gray-600) dark:border-(--gray-500)",
        ].join(" ")}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md
                     text-(--muted) hover:bg-(--gray-100) hover:text-(--page-fg)
                     dark:hover:bg-(--gray-500)"
          aria-label="Close"
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          {icon ? (
            <div
              className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg
                            bg-(--gray-100) text-(--page-fg)
                            dark:bg-(--gray-500)"
            >
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            <h2 className="text-base font-bold text-(--page-fg)">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-(--muted)">{description}</p>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold
                       border border-(--gray-200) bg-white transition hover:bg-(--gray-100)
                       dark:border-(--gray-500) dark:bg-(--gray-600) dark:hover:bg-(--gray-500)"
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={[
              "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition active:translate-y-px disabled:opacity-70",
              confirmClass,
            ].join(" ")}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ConfirmDialog);