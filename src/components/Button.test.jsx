import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  test("renders children text", () => {
    render(<Button>Simpan</Button>);

    expect(screen.getByRole("button", { name: /simpan/i })).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Klik</Button>);

    await user.click(screen.getByRole("button", { name: /klik/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("supports disabled prop", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
  });

  test("merges custom className", () => {
    render(<Button className="w-full">Custom</Button>);

    expect(screen.getByRole("button", { name: /custom/i })).toHaveClass("w-full");
  });

  test("forwards type prop", () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole("button", { name: /submit/i })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});