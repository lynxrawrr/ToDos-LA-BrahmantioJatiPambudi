export function loadTheme() {
  return localStorage.getItem("theme") || "light";
}
export function saveTheme(theme) {
  localStorage.setItem("theme", theme);
}
