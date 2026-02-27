import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input", () => {
  test("renders input and forwards basic props", () => {
    render(
      <Input
        placeholder="Your email"
        type="email"
        aria-label="Email"
        value=""
        onChange={() => {}}
      />,
    );

    const input = screen.getByLabelText("Email");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Your email");
    expect(input).toHaveAttribute("type", "email");
  });

  test("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Input aria-label="Nama" value="" onChange={handleChange} />);

    const input = screen.getByLabelText("Nama");
    await user.type(input, "Bramii");

    expect(handleChange).toHaveBeenCalled();
  });

  test("merges custom className", () => {
    render(
      <Input
        aria-label="Todo"
        value=""
        onChange={() => {}}
        className="border-red-500"
      />,
    );

    expect(screen.getByLabelText("Todo")).toHaveClass("border-red-500");
  });

  test("forwards custom attributes like data-cy", () => {
    render(
      <Input
        aria-label="Search"
        value=""
        onChange={() => {}}
        data-cy="search-input"
      />,
    );

    expect(screen.getByLabelText("Search")).toHaveAttribute(
      "data-cy",
      "search-input",
    );
  });
});