import TodoItem from "./TodoItem";
import { ClipboardList } from "lucide-react";

export default function TodoList({ items, onToggle, onDelete }) {
  // todo list renderer 
  if (!items.length) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="grid place-items-center py-16 text-center"
      >
        {/* Empty Icon */}
        <ClipboardList
          className="h-14 w-14 text-zinc-900 dark:text-zinc-500/60"
          strokeWidth={1.6}
          aria-hidden="true"
        />

        {/* Empty Title */}
        <p className="mt-5 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          Belum ada tugas untuk saat ini
        </p>

        {/* Empty Description */}
        <p className="mt-1 text-xs text-zinc-500/90 dark:text-zinc-400/80">
          Silahkan tambah tugas baru pada form di atas.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="todo-list-title">
      <h2 id="todo-list-title" className="sr-only">
        Daftar Todo
      </h2>

      <ul className="mt-4 space-y-3">
        {/* Todo Items */}
        {items.map((t) => (
          <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  );
}