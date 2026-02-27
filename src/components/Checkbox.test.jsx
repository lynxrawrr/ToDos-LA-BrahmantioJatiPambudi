import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  test("renders unchecked state with default aria-label", () => {
    render(<Checkbox checked={false} onChange={jest.fn()} />);

    const checkboxBtn = screen.getByRole("button", { name: "Tandai selesai" });

    expect(checkboxBtn).toBeInTheDocument();
    expect(checkboxBtn).toHaveAttribute("aria-pressed", "false");
  });

  test("renders checked state with default aria-label", () => {
    render(<Checkbox checked={true} onChange={jest.fn()} />);

    const checkboxBtn = screen.getByRole("button", {
      name: "Tandai belum selesai",
    });

    expect(checkboxBtn).toBeInTheDocument();
    expect(checkboxBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("calls onChange when clicked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Checkbox checked={false} onChange={onChange} />);

    const checkboxBtn = screen.getByRole("button", { name: "Tandai selesai" });
    await user.click(checkboxBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("uses aria-labelledby when provided (and no default aria-label)", () => {
    render(
      <div>
        <span id="todo-title">Belajar React</span>
        <Checkbox checked={false} onChange={jest.fn()} aria-labelledby="todo-title" />
      </div>,
    );

    const checkboxBtn = screen.getByRole("button", { name: "Belajar React" });

    expect(checkboxBtn).toBeInTheDocument();
    expect(checkboxBtn).toHaveAttribute("aria-labelledby", "todo-title");
    expect(checkboxBtn).not.toHaveAttribute("aria-label", "Tandai selesai");
  });

  test("prefers explicit aria-label over default label", () => {
    render(
      <Checkbox
        checked={false}
        onChange={jest.fn()}
        aria-label="Centang todo sekarang"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Centang todo sekarang" }),
    ).toBeInTheDocument();
  });
});