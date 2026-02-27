/* eslint-env jest */
import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  setFilter,
  hydrateFromCache,
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from "./todosSlice";
import * as todosApi from "./todosApi";

jest.mock("./todosApi", () => ({
  fetchTodosApi: jest.fn(),
  addTodoApi: jest.fn(),
  toggleTodoApi: jest.fn(),
  deleteTodoApi: jest.fn(),
}));

describe("todosSlice reducer", () => {
  test("should return initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });

    expect(state).toEqual({
      items: [],
      status: "idle",
      error: null,
      filter: "all",
      mutation: null,
    });
  });

  test("setFilter updates filter", () => {
    const prev = reducer(undefined, { type: "@@INIT" });
    const next = reducer(prev, setFilter("completed"));

    expect(next.filter).toBe("completed");
  });

  test("hydrateFromCache sets items from payload", () => {
    const cached = [
      { id: 1, title: "Cached 1", completed: false },
      { id: 2, title: "Cached 2", completed: true },
    ];

    const next = reducer(undefined, hydrateFromCache(cached));

    expect(next.items).toEqual(cached);
  });

  test("hydrateFromCache uses empty array when payload is null", () => {
    const next = reducer(undefined, hydrateFromCache(null));

    expect(next.items).toEqual([]);
  });
});

describe("todosSlice extraReducers (fetchTodos)", () => {
  test("fetchTodos.pending sets status=loading and clears error", () => {
    const prev = {
      items: [],
      status: "idle",
      error: "old error",
      filter: "all",
      mutation: null,
    };

    const next = reducer(prev, { type: fetchTodos.pending.type });

    expect(next.status).toBe("loading");
    expect(next.error).toBeNull();
  });

  test("fetchTodos.fulfilled sets status=succeeded and items", () => {
    const payload = [
      { id: 1, title: "A", completed: false },
      { id: 2, title: "B", completed: true },
    ];

    const prev = reducer(undefined, { type: "@@INIT" });
    const next = reducer(prev, { type: fetchTodos.fulfilled.type, payload });

    expect(next.status).toBe("succeeded");
    expect(next.items).toEqual(payload);
  });

  test("fetchTodos.rejected sets status=failed and error from payload", () => {
    const prev = reducer(undefined, { type: "@@INIT" });

    const next = reducer(prev, {
      type: fetchTodos.rejected.type,
      payload: "Gagal Mengambil Todo.",
    });

    expect(next.status).toBe("failed");
    expect(next.error).toBe("Gagal Mengambil Todo.");
  });
});

describe("todosSlice extraReducers (add/toggle/delete)", () => {
  test("addTodo.pending sets mutation=adding and clears error", () => {
    const prev = { ...reducer(undefined, { type: "@@INIT" }), error: "x" };

    const next = reducer(prev, { type: addTodo.pending.type });

    expect(next.mutation).toBe("adding");
    expect(next.error).toBeNull();
  });

  test("addTodo.fulfilled unshifts new item to the beginning", () => {
    const prev = {
      ...reducer(undefined, { type: "@@INIT" }),
      items: [{ id: 1, title: "Old", completed: false }],
      mutation: "adding",
    };

    const newTodo = { id: 999, title: "New", completed: false };
    const next = reducer(prev, {
      type: addTodo.fulfilled.type,
      payload: newTodo,
    });

    expect(next.mutation).toBeNull();
    expect(next.items[0]).toEqual(newTodo);
    expect(next.items).toHaveLength(2);
  });

  test("toggleTodo.fulfilled updates matched todo completed value", () => {
    const prev = {
      ...reducer(undefined, { type: "@@INIT" }),
      items: [
        { id: 1, title: "A", completed: false },
        { id: 2, title: "B", completed: false },
      ],
      mutation: "toggling",
    };

    const next = reducer(prev, {
      type: toggleTodo.fulfilled.type,
      payload: { id: 2, completed: true },
    });

    expect(next.mutation).toBeNull();
    expect(next.items.find((t) => t.id === 2)?.completed).toBe(true);
    expect(next.items.find((t) => t.id === 1)?.completed).toBe(false);
  });

  test("deleteTodo.fulfilled removes item by id", () => {
    const prev = {
      ...reducer(undefined, { type: "@@INIT" }),
      items: [
        { id: 1, title: "A", completed: false },
        { id: 2, title: "B", completed: true },
      ],
      mutation: "deleting",
    };

    const next = reducer(prev, {
      type: deleteTodo.fulfilled.type,
      payload: 1,
    });

    expect(next.mutation).toBeNull();
    expect(next.items).toEqual([{ id: 2, title: "B", completed: true }]);
  });

  test("rejected mutation resets mutation and stores error", () => {
    const prev = {
      ...reducer(undefined, { type: "@@INIT" }),
      mutation: "adding",
    };

    const next = reducer(prev, {
      type: addTodo.rejected.type,
      payload: "Gagal Menambah Todo.",
    });

    expect(next.mutation).toBeNull();
    expect(next.error).toBe("Gagal Menambah Todo.");
  });
});

describe("todos thunks (with mocked API)", () => {
  function makeStore() {
    return configureStore({
      reducer: {
        todos: reducer,
      },
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetchTodos dispatches fulfilled and stores API result", async () => {
    const mockItems = [
      { id: 1, title: "Belajar React", completed: false },
      { id: 2, title: "Belajar Redux", completed: true },
    ];

    todosApi.fetchTodosApi.mockResolvedValueOnce(mockItems);

    const store = makeStore();
    await store.dispatch(fetchTodos({ limit: 2 }));

    const state = store.getState().todos;
    expect(todosApi.fetchTodosApi).toHaveBeenCalledWith({ limit: 2 });
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(mockItems);
  });

  test("fetchTodos dispatches rejected with message when API throws", async () => {
    todosApi.fetchTodosApi.mockRejectedValueOnce(
      new Error("Gagal Mengambil Todo."),
    );

    const store = makeStore();
    await store.dispatch(fetchTodos({ limit: 5 }));

    const state = store.getState().todos;
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Gagal Mengambil Todo.");
  });

  test("addTodo uses fallback id when API returns no id", async () => {
    todosApi.addTodoApi.mockResolvedValueOnce({
      title: "Todo tanpa id",
      completed: false,
      userId: 1,
    });

    const store = makeStore();
    await store.dispatch(addTodo({ title: "Todo tanpa id", userId: 1 }));

    const state = store.getState().todos;
    expect(state.items[0]).toMatchObject({
      title: "Todo tanpa id",
      completed: false,
      userId: 1,
    });
    expect(state.items[0].id).toBeTruthy(); // fallback nanoid()
  });
});
