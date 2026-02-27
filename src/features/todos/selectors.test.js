/* eslint-env jest */
import {
  selectFilter,
  selectStatus,
  selectError,
  selectMutation,
  selectActiveTodos,
  selectCompletedTodos,
  selectTodos,
} from "./selectors";

function makeState(overrides = {}) {
  return {
    todos: {
      items: [],
      status: "idle",
      error: null,
      filter: "all",
      mutation: null,
      ...overrides,
    },
  };
}

describe("todos selectors - base", () => {
  test("selectFilter returns filter", () => {
    const state = makeState({ filter: "completed" });
    expect(selectFilter(state)).toBe("completed");
  });

  test("selectStatus returns status", () => {
    const state = makeState({ status: "succeeded" });
    expect(selectStatus(state)).toBe("succeeded");
  });

  test("selectError returns error", () => {
    const state = makeState({ error: "Oops" });
    expect(selectError(state)).toBe("Oops");
  });

  test("selectMutation returns mutation", () => {
    const state = makeState({ mutation: "adding" });
    expect(selectMutation(state)).toBe("adding");
  });
});

describe("todos selectors - derived", () => {
  const items = [
    { id: 1, title: "A", completed: false },
    { id: 2, title: "B", completed: true },
    { id: 3, title: "C", completed: false },
    { id: 4, title: "D", completed: true },
  ];

  test("selectActiveTodos returns only incomplete todos", () => {
    const state = makeState({ items });

    expect(selectActiveTodos(state)).toEqual([
      { id: 1, title: "A", completed: false },
      { id: 3, title: "C", completed: false },
    ]);
  });

  test("selectCompletedTodos returns only completed todos", () => {
    const state = makeState({ items });

    expect(selectCompletedTodos(state)).toEqual([
      { id: 2, title: "B", completed: true },
      { id: 4, title: "D", completed: true },
    ]);
  });

  test("selectTodos sorts active first, then completed", () => {
    const state = makeState({
      items: [
        { id: 10, title: "Completed 1", completed: true }, // idx 0
        { id: 11, title: "Active 1", completed: false }, // idx 1
        { id: 12, title: "Completed 2", completed: true }, // idx 2
        { id: 13, title: "Active 2", completed: false }, // idx 3
      ],
    });

    const result = selectTodos(state);

    expect(result.map((t) => t.id)).toEqual([11, 13, 10, 12]);
  });

  test("selectTodos keeps stable order within same completed group", () => {
    const state = makeState({
      items: [
        { id: 1, title: "A1", completed: false },
        { id: 2, title: "A2", completed: false },
        { id: 3, title: "C1", completed: true },
        { id: 4, title: "C2", completed: true },
      ],
    });

    const result = selectTodos(state);

    expect(result.map((t) => t.id)).toEqual([1, 2, 3, 4]);
  });
});
