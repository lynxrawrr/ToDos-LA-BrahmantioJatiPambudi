/* eslint-env jest */
import {
  fetchTodosApi,
  addTodoApi,
  toggleTodoApi,
  deleteTodoApi,
} from "./todosApi";

describe("todosApi", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchTodosApi", () => {
    test("calls fetch with default limit=12", async () => {
      const mockData = [{ id: 1, title: "Todo 1", completed: false }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchTodosApi();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/todos?_limit=12",
      );
      expect(result).toEqual(mockData);
    });

    test("calls fetch with custom limit", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetchTodosApi({ limit: 5 });

      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/todos?_limit=5",
      );
    });

    test("throws correct error when response is not ok", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchTodosApi()).rejects.toThrow("Gagal Mengambil Todo.");
    });
  });

  describe("addTodoApi", () => {
    test("calls fetch with POST and correct body", async () => {
      const mockResponse = {
        id: 101,
        title: "Belajar API",
        completed: false,
        userId: 1,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addTodoApi({ title: "Belajar API", userId: 1 });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify({
            title: "Belajar API",
            completed: false,
            userId: 1,
          }),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test("uses default userId=1 when not provided", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, title: "X", completed: false, userId: 1 }),
      });

      await addTodoApi({ title: "X" });

      const [, options] = fetch.mock.calls[0];
      expect(JSON.parse(options.body)).toEqual({
        title: "X",
        completed: false,
        userId: 1,
      });
    });

    test("throws correct error when response is not ok", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(addTodoApi({ title: "Test" })).rejects.toThrow(
        "Gagal Menambah Todo.",
      );
    });
  });

  describe("toggleTodoApi", () => {
    test("calls fetch with PATCH and completed payload", async () => {
      const mockResponse = { id: 10, completed: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await toggleTodoApi({ id: 10, completed: true });

      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/todos/10",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify({ completed: true }),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test("throws correct error when response is not ok", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(toggleTodoApi({ id: 10, completed: true })).rejects.toThrow(
        "Gagal Update Status Todo.",
      );
    });
  });

  describe("deleteTodoApi", () => {
    test("calls fetch with DELETE and returns { id }", async () => {
      fetch.mockResolvedValueOnce({ ok: true });

      const result = await deleteTodoApi(77);

      expect(fetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/todos/77",
        { method: "DELETE" },
      );
      expect(result).toEqual({ id: 77 });
    });

    test("throws correct error when response is not ok", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(deleteTodoApi(77)).rejects.toThrow("Gagal hapus todo.");
    });
  });
});
