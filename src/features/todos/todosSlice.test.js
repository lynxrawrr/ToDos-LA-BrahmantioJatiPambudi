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
import { saveTodosCache } from "../../utils/storage";

jest.mock("./todosApi", () => ({
  fetchTodosApi: jest.fn(),
  addTodoApi: jest.fn(),
  toggleTodoApi: jest.fn(),
  deleteTodoApi: jest.fn(),
}));

jest.mock("../../utils/storage", () => ({
  saveTodosCache: jest.fn(),
}));

describe("todosSlice reducer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test("hydrateFromCache sets items from payload, sets status=succeeded, and clears error", () => {
    const cached = [
      { id: 1, title: "Cached 1", completed: false },
      { id: 2, title: "Cached 2", completed: true },
    ];

    const prev = {
      ...reducer(undefined, { type: "@@INIT" }),
      status: "failed",
      error: "Old error",
    };

    const next = reducer(prev, hydrateFromCache(cached));

    expect(next.items).toEqual(cached);
    expect(next.status).toBe("succeeded");
    expect(next.error).toBeNull();
  });

  test("hydrateFromCache uses empty array when payload is null", () => {
    const prev = {
      ...reducer(undefined, { type: "@@INIT" }),
      status: "failed",
      error: "Old error",
    };

    const next = reducer(prev, hydrateFromCache(null));

    expect(next.items).toEqual([]);
    expect(next.status).toBe("succeeded");
    expect(next.error).toBeNull();
  });
});

describe("todosSlice extraReducers (fetchTodos)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test("fetchTodos.fulfilled sets status=succeeded, items, and saves cache", () => {
    const payload = [
      { id: 1, title: "A", completed: false },
      { id: 2, title: "B", completed: true },
    ];

    const prev = reducer(undefined, { type: "@@INIT" });
    const next = reducer(prev, { type: fetchTodos.fulfilled.type, payload });

    expect(next.status).toBe("succeeded");
    expect(next.items).toEqual(payload);
    expect(saveTodosCache).toHaveBeenCalledWith(payload);
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addTodo.pending sets mutation=adding and clears error", () => {
    const prev = { ...reducer(undefined, { type: "@@INIT" }), error: "x" };

    const next = reducer(prev, { type: addTodo.pending.type });

    expect(next.mutation).toBe("adding");
    expect(next.error).toBeNull();
  });

  test("addTodo.fulfilled unshifts new item to the beginning and saves cache", () => {
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
    expect(saveTodosCache).toHaveBeenCalledWith(next.items);
  });

  test("toggleTodo.fulfilled updates matched todo completed value and saves cache", () => {
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
    expect(saveTodosCache).toHaveBeenCalledWith(next.items);
  });

  test("deleteTodo.fulfilled removes item by id and saves cache", () => {
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
    expect(saveTodosCache).toHaveBeenCalledWith(next.items);
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
    expect(saveTodosCache).toHaveBeenCalledWith(mockItems);
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
    expect(saveTodosCache).toHaveBeenCalledWith(state.items);
  });

  test("toggleTodo updates item completion through thunk", async () => {
    const store = makeStore();

    // seed state dulu
    await store.dispatch(
      addTodo.fulfilled(
        { id: 1, title: "Todo A", completed: false, userId: 1 },
        "",
        { title: "Todo A", userId: 1 },
      ),
    );

    todosApi.toggleTodoApi.mockResolvedValueOnce({});

    await store.dispatch(toggleTodo({ id: 1, completed: true }));

    const state = store.getState().todos;
    expect(todosApi.toggleTodoApi).toHaveBeenCalledWith({
      id: 1,
      completed: true,
    });
    expect(state.items.find((t) => t.id === 1)?.completed).toBe(true);
  });

  test("deleteTodo removes item through thunk", async () => {
    const store = makeStore();

    // seed state dulu
    await store.dispatch(
      addTodo.fulfilled(
        { id: 1, title: "Todo A", completed: false, userId: 1 },
        "",
        { title: "Todo A", userId: 1 },
      ),
    );

    todosApi.deleteTodoApi.mockResolvedValueOnce({});

    await store.dispatch(deleteTodo(1));

    const state = store.getState().todos;
    expect(todosApi.deleteTodoApi).toHaveBeenCalledWith(1);
    expect(state.items).toEqual([]);
  });
});