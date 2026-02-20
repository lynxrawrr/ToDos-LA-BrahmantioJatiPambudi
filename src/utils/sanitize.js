export function sanitizeTodoTitle(input) {
  const raw = String(input ?? "");

  // remove tags
  const noTags = raw.replace(/<[^>]*>/g, "");

  // whitespace & trim
  const cleaned = noTags.replace(/\s+/g, " ").trim();

  // max length
  return cleaned.slice(0, 120);
}

export function validateTodoTitle(title) {
  if (!title) return "Todo tidak boleh kosong.";
  if (title.length < 3) return "Minimal 3 karakter ya.";
  return null;
}
