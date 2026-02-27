const THEME_KEY = "theme";
const TODOS_CACHE_KEY = "todos_cache";

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTodosCache() {
  try {
    const raw = localStorage.getItem(TODOS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTodosCache(items) {
  try {
    localStorage.setItem(TODOS_CACHE_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors
  }
}