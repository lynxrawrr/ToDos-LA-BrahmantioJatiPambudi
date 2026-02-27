import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoComposer from "./TodoComposer";

describe("TodoComposer", () => {
  test("calls onAdd with sanitized value when input is valid", async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();

    render(<TodoComposer onAdd={onAdd} isBusy={false} />);

    const input = screen.getByLabelText("Tambah tugas baru");
    const submitBtn = screen.getByRole("button", { name: /tambah/i });

    await user.type(input, "   Belajar   React   ");
    await user.click(submitBtn);

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("Belajar React");
    expect(input).toHaveValue(""); // reset input setelah submit
  });

  test("shows validation error for empty input", async () => {
    const user = userEvent.setup();

    render(<TodoComposer onAdd={jest.fn()} isBusy={false} />);

    const submitBtn = screen.getByRole("button", { name: /tambah/i });
    await user.click(submitBtn);

    expect(screen.getByText("Todo tidak boleh kosong.")).toBeInTheDocument();
  });

  test("button disabled when isBusy=true", () => {
    render(<TodoComposer onAdd={jest.fn()} isBusy={true} />);

    expect(screen.getByRole("button", { name: /tambah/i })).toBeDisabled();
  });
});
