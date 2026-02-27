import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "./TodoItem";

function setup(override = {}) {
  const onToggle = jest.fn();
  const onDelete = jest.fn();

  const todo = {
    id: 101,
    title: "Belajar Testing React",
    completed: false,
    ...override.todo,
  };

  render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />);

  return { todo, onToggle, onDelete };
}

describe("TodoItem", () => {
  test("renders todo title", () => {
    setup();

    expect(screen.getByText("Belajar Testing React")).toBeInTheDocument();
  });

  test("calls onToggle(todo.id, !completed) when toggle button is clicked", async () => {
    const user = userEvent.setup();
    const { todo, onToggle } = setup();

    // Checkbox custom kamu adalah button dengan aria-labelledby (name = title)
    const toggleBtn = screen.getByRole("button", {
      name: /belajar testing react/i,
    });

    expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(toggleBtn);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(todo.id, true);
  });

  test("renders completed todo as pressed toggle button", () => {
    setup({
      todo: {
        completed: true,
        title: "Task selesai",
      },
    });

    const toggleBtn = screen.getByRole("button", { name: /task selesai/i });

    expect(toggleBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Task selesai")).toBeInTheDocument();
  });

  test("opens confirm dialog when delete button is clicked", async () => {
    const user = userEvent.setup();
    setup();

    const deleteBtn = screen.getByRole("button", { name: /hapus todo/i });
    await user.click(deleteBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete this task?")).toBeInTheDocument();
    expect(
      screen.getByText(/This action can.?t be undone\./i),
    ).toBeInTheDocument();
  });

  test("calls onDelete(todo.id) after confirming delete", async () => {
    const user = userEvent.setup();
    const { todo, onDelete } = setup();

    await user.click(screen.getByRole("button", { name: /hapus todo/i }));

    const dialog = screen.getByRole("dialog");
    const confirmBtn = within(dialog).getByRole("button", {
      name: /^delete$/i,
    });

    await user.click(confirmBtn);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(todo.id);
  });

  test("closes dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /hapus todo/i }));

    const dialog = screen.getByRole("dialog");
    const cancelBtn = within(dialog).getByRole("button", { name: /^cancel$/i });

    await user.click(cancelBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes dialog when close (X) button is clicked", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /hapus todo/i }));

    const dialog = screen.getByRole("dialog");
    const closeBtn = within(dialog).getByRole("button", { name: /^close$/i });

    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
