/* eslint-env jest */
import { loadTheme, saveTheme } from "./storage";

describe("storage theme utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("loadTheme returns 'light' when localStorage has no theme", () => {
    expect(loadTheme()).toBe("light");
  });

  test("saveTheme stores theme to localStorage", () => {
    saveTheme("dark");

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("loadTheme returns saved theme", () => {
    localStorage.setItem("theme", "dark");

    expect(loadTheme()).toBe("dark");
  });
});
