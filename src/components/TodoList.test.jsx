/* eslint-env jest */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "./TodoList";

// Mock TodoItem supaya test fokus ke TodoList
jest.mock("./TodoItem", () => {
  return function MockTodoItem({ todo, onToggle, onDelete }) {
    return (
      <li data-testid={`todo-item-${todo.id}`}>
        <span>{todo.title}</span>

        <button onClick={() => onToggle(todo.id, !todo.completed)}>
          Toggle {todo.id}
        </button>

        <button onClick={() => onDelete(todo.id)}>Delete {todo.id}</button>
      </li>
    );
  };
});

describe("TodoList", () => {
  test("renders empty state when items is empty", () => {
    render(<TodoList items={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText("Belum ada tugas untuk saat ini"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Silahkan tambah tugas baru pada form di atas."),
    ).toBeInTheDocument();
  });

  test("renders list section and hidden heading when items exist", () => {
    const items = [
      { id: 1, title: "Belajar React", completed: false },
      { id: 2, title: "Belajar Redux", completed: true },
    ];

    render(
      <TodoList items={items} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: /daftar todo/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Belajar React")).toBeInTheDocument();
    expect(screen.getByText("Belajar Redux")).toBeInTheDocument();
  });

  test("renders the same number of TodoItem as items", () => {
    const items = [
      { id: 1, title: "Todo 1", completed: false },
      { id: 2, title: "Todo 2", completed: false },
      { id: 3, title: "Todo 3", completed: true },
    ];

    render(
      <TodoList items={items} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(3);
  });

  test("passes onToggle callback to each TodoItem", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();

    const items = [{ id: 11, title: "Todo A", completed: false }];

    render(<TodoList items={items} onToggle={onToggle} onDelete={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /toggle 11/i }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(11, true);
  });

  test("passes onDelete callback to each TodoItem", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    const items = [{ id: 22, title: "Todo B", completed: false }];

    render(<TodoList items={items} onToggle={jest.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete 22/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(22);
  });
});
