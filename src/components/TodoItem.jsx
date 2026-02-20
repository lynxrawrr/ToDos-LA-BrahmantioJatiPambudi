import { useState, useId } from "react";
import Checkbox from "./Checkbox";
import { Trash2, TriangleAlert } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

export default function TodoItem({ todo, onToggle, onDelete }) {
  // single todo row
  const done = todo.completed;
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <li
        role="group"
        aria-labelledby={titleId}
        className={[
          "flex items-center justify-between gap-3 rounded-md border px-3 py-3 transition",
          done
            ? "border-(--gray-200) bg-(--gray-200)"
            : "border-(--gray-200) bg-white",
          "dark:border-(--gray-500) dark:bg-(--gray-500)",
          done ? "opacity-60" : "",
        ].join(" ")}
      >
        {/* Left: checkbox + title */}
        <div className="flex min-w-0 items-center gap-3">
          <Checkbox
            checked={done}
            onChange={() => onToggle(todo.id, !done)}
            aria-labelledby={titleId}
          />

          <h3
            id={titleId}
            className={[
              "min-w-0 text-sm leading-snug",
              done ? "line-through text-(--muted)" : "text-(--page-fg)",
            ].join(" ")}
          >
            {todo.title}
          </h3>
        </div>

        {/* Right: delete action */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Hapus todo"
          title="Hapus"
          type="button"
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-md",
            "text-(--muted) transition",
            "hover:bg-(--gray-100) hover:text-(--page-fg)",
            "dark:hover:bg-(--gray-600)",
            "active:translate-y-px",
          ].join(" ")}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </li>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={open}
        title="Delete this task?"
        description="This action can’t be undone."
        confirmText="Delete"
        cancelText="Cancel"
        tone="danger"
        icon={<TriangleAlert className="h-5 w-5" />}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onDelete(todo.id);
          setOpen(false);
        }}
      />
    </>
  );
}