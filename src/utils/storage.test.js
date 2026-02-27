/* eslint-env jest */
import {
  loadTheme,
  saveTheme,
  loadTodosCache,
  saveTodosCache,
} from "./storage";

describe("storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("theme utils", () => {
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

  describe("todos cache utils", () => {
    test("loadTodosCache returns [] when localStorage has no cache", () => {
      expect(loadTodosCache()).toEqual([]);
    });

    test("saveTodosCache stores todos array to localStorage", () => {
      const todos = [
        { id: 1, title: "Belajar React", completed: false },
        { id: 2, title: "Belajar Testing", completed: true },
      ];

      saveTodosCache(todos);

      expect(localStorage.getItem("todos_cache")).toBe(JSON.stringify(todos));
    });

    test("loadTodosCache returns parsed cached todos", () => {
      const todos = [
        { id: 1, title: "Cached Todo", completed: false },
        { id: 2, title: "Cached Done", completed: true },
      ];

      localStorage.setItem("todos_cache", JSON.stringify(todos));

      expect(loadTodosCache()).toEqual(todos);
    });

    test("loadTodosCache returns [] when cached value is invalid JSON", () => {
      localStorage.setItem("todos_cache", "{invalid json}");

      expect(loadTodosCache()).toEqual([]);
    });

    test("saveTodosCache does not throw when localStorage.setItem fails", () => {
      const setItemSpy = jest
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });

      expect(() =>
        saveTodosCache([{ id: 1, title: "A", completed: false }]),
      ).not.toThrow();

      expect(setItemSpy).toHaveBeenCalled();
    });
  });
});