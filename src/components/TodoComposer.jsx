import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { sanitizeTodoTitle, validateTodoTitle } from "../utils/sanitize";
import { CirclePlus } from "lucide-react";

export default function TodoComposer({ onAdd, isBusy }) {
  // add-todo form (sanitize + validate)
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const clean = sanitizeTodoTitle(title);
    const err = validateTodoTitle(clean);
    if (err) return setError(err);

    setError("");
    onAdd(clean);
    setTitle("");
  }

  return (
    <form onSubmit={submit} className="flex w-full items-start gap-3">
      {/* Input Field */}
      <div className="w-full">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah tugas baru"
          aria-label="Tambah tugas baru"
        />
        {/* Validation Message */}
        {error ? (
          <p className="mt-1 text-xs text-(--danger)">{error}</p>
        ) : null}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isBusy} className="shrink-0">
        Tambah
        <CirclePlus className="h-4 w-4" aria-hidden />
      </Button>
    </form>
  );
}
