/* eslint-env jest */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  setFilter,
  toggleTodo,
} from "../features/todos/todosSlice";

jest.mock("../app/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Mock child components biar fokus ke Dashboard logic
jest.mock("../components/Header", () => () => (
  <div data-testid="header">Header</div>
));

jest.mock("../components/TodoComposer", () => (props) => (
  <div data-testid="todo-composer">
    <div>Composer busy: {String(props.isBusy)}</div>
    <button onClick={() => props.onAdd("Belajar Dashboard Test")}>
      Mock Add
    </button>
  </div>
));

jest.mock("../components/Tabs", () => (props) => (
  <div data-testid="tabs">
    <div>
      Tabs: all={props.allCount} completed={props.completedCount} value=
      {props.value}
    </div>
    <button onClick={() => props.onChange("all")}>Tab All</button>
    <button onClick={() => props.onChange("completed")}>Tab Completed</button>
  </div>
));

jest.mock("../components/TodoList", () => (props) => (
  <div data-testid="todo-list">
    <div>TodoList count: {props.items.length}</div>
    <div>
      {props.items.map((t) => (
        <span key={t.id} data-testid={`visible-${t.id}`}>
          {t.title}
        </span>
      ))}
    </div>

    <button onClick={() => props.onToggle(1, true)}>Mock Toggle</button>
    <button onClick={() => props.onDelete(1)}>Mock Delete</button>
  </div>
));

// Mock action creators (return plain action object supaya gampang assert dispatch)
jest.mock("../features/todos/todosSlice", () => ({
  addTodo: jest.fn((payload) => ({ type: "todos/addTodo", payload })),
  deleteTodo: jest.fn((id) => ({ type: "todos/deleteTodo", payload: id })),
  fetchTodos: jest.fn(() => ({ type: "todos/fetchTodos" })),
  setFilter: jest.fn((value) => ({ type: "todos/setFilter", payload: value })),
  toggleTodo: jest.fn((payload) => ({ type: "todos/toggleTodo", payload })),
}));

// selectors asli dipakai Dashboard via useAppSelector(selectorFn),
// tapi karena useAppSelector kita mock, selector implementation nggak perlu dimock.

function setupSelectorState({
  status = "idle",
  error = null,
  filter = "all",
  mutation = null,
  all = [],
  completed = [],
} = {}) {
  // Urutan panggilan useAppSelector di Dashboard:
  // status, error, filter, mutation, all, completed
  useAppSelector
    .mockReturnValueOnce(status)
    .mockReturnValueOnce(error)
    .mockReturnValueOnce(filter)
    .mockReturnValueOnce(mutation)
    .mockReturnValueOnce(all)
    .mockReturnValueOnce(completed);
}

describe("Dashboard", () => {
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    useAppDispatch.mockReturnValue(dispatch);
  });

  test("dispatches fetchTodos on mount when status is idle", () => {
    setupSelectorState({
      status: "idle",
      all: [],
      completed: [],
    });

    render(<Dashboard />);

    expect(fetchTodos).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: "todos/fetchTodos" });
  });

  test("does not dispatch fetchTodos when status is not idle", () => {
    setupSelectorState({
      status: "succeeded",
      all: [],
      completed: [],
    });

    render(<Dashboard />);

    expect(fetchTodos).not.toHaveBeenCalled();
  });

  test("renders loading state", () => {
    setupSelectorState({
      status: "loading",
      all: [],
      completed: [],
    });

    render(<Dashboard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });

  test("renders error state", () => {
    setupSelectorState({
      status: "succeeded",
      error: "Gagal mengambil data.",
      all: [],
      completed: [],
    });

    render(<Dashboard />);

    expect(screen.getByText("Gagal mengambil data.")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });

  test("renders TodoList with all items when filter=all", () => {
    const all = [
      { id: 1, title: "A", completed: false },
      { id: 2, title: "B", completed: true },
    ];
    const completed = [{ id: 2, title: "B", completed: true }];

    setupSelectorState({
      status: "succeeded",
      filter: "all",
      all,
      completed,
    });

    render(<Dashboard />);

    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
    expect(screen.getByText("TodoList count: 2")).toBeInTheDocument();
    expect(screen.getByTestId("visible-1")).toHaveTextContent("A");
    expect(screen.getByTestId("visible-2")).toHaveTextContent("B");
  });

  test("renders TodoList with completed items when filter=completed", () => {
    const all = [
      { id: 1, title: "A", completed: false },
      { id: 2, title: "B", completed: true },
    ];
    const completed = [{ id: 2, title: "B", completed: true }];

    setupSelectorState({
      status: "succeeded",
      filter: "completed",
      all,
      completed,
    });

    render(<Dashboard />);

    expect(screen.getByText("TodoList count: 1")).toBeInTheDocument();
    expect(screen.queryByTestId("visible-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("visible-2")).toHaveTextContent("B");
  });

  test("passes isBusy=true to TodoComposer when mutation is adding", () => {
    setupSelectorState({
      status: "succeeded",
      mutation: "adding",
      all: [],
      completed: [],
    });

    render(<Dashboard />);

    expect(screen.getByText(/Composer busy: true/i)).toBeInTheDocument();
  });

  test("dispatches setFilter when Tabs onChange is triggered", async () => {
    const user = userEvent.setup();

    setupSelectorState({
      status: "succeeded",
      filter: "all",
      all: [{ id: 1, title: "A", completed: false }],
      completed: [],
    });

    render(<Dashboard />);

    await user.click(screen.getByRole("button", { name: /tab completed/i }));

    expect(setFilter).toHaveBeenCalledWith("completed");
    expect(dispatch).toHaveBeenCalledWith({
      type: "todos/setFilter",
      payload: "completed",
    });
  });

  test("dispatches addTodo when TodoComposer onAdd is triggered", async () => {
    const user = userEvent.setup();

    setupSelectorState({
      status: "succeeded",
      all: [],
      completed: [],
    });

    render(<Dashboard />);

    await user.click(screen.getByRole("button", { name: /mock add/i }));

    expect(addTodo).toHaveBeenCalledWith({
      title: "Belajar Dashboard Test",
      userId: 1,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "todos/addTodo",
      payload: { title: "Belajar Dashboard Test", userId: 1 },
    });
  });

  test("dispatches toggleTodo when TodoList onToggle is triggered", async () => {
    const user = userEvent.setup();

    setupSelectorState({
      status: "succeeded",
      all: [{ id: 1, title: "A", completed: false }],
      completed: [],
    });

    render(<Dashboard />);

    await user.click(screen.getByRole("button", { name: /mock toggle/i }));

    expect(toggleTodo).toHaveBeenCalledWith({ id: 1, completed: true });
    expect(dispatch).toHaveBeenCalledWith({
      type: "todos/toggleTodo",
      payload: { id: 1, completed: true },
    });
  });

  test("dispatches deleteTodo when TodoList onDelete is triggered", async () => {
    const user = userEvent.setup();

    setupSelectorState({
      status: "succeeded",
      all: [{ id: 1, title: "A", completed: false }],
      completed: [],
    });

    render(<Dashboard />);

    await user.click(screen.getByRole("button", { name: /mock delete/i }));

    expect(deleteTodo).toHaveBeenCalledWith(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "todos/deleteTodo",
      payload: 1,
    });
  });
});
