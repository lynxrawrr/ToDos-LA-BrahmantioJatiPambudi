/* eslint-env jest */
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  test("does not render when open is false", () => {
    render(
      <ConfirmDialog
        open={false}
        title="Delete item?"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete item?")).not.toBeInTheDocument();
  });

  test("renders title and description when open is true", () => {
    render(
      <ConfirmDialog
        open
        title="Delete this task?"
        description="This action can’t be undone."
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete this task?")).toBeInTheDocument();
    expect(screen.getByText("This action can’t be undone.")).toBeInTheDocument();
  });

  test("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <ConfirmDialog
        open
        onCancel={onCancel}
        onConfirm={jest.fn()}
        cancelText="Cancel"
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <ConfirmDialog
        open
        onCancel={jest.fn()}
        onConfirm={onConfirm}
        confirmText="Delete"
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test("calls onCancel when close (X) button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <ConfirmDialog open onCancel={onCancel} onConfirm={jest.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("shows loading state and disables action buttons", () => {
    render(
      <ConfirmDialog
        open
        loading
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        confirmText="Delete"
        cancelText="Cancel"
      />,
    );

    expect(screen.getByRole("button", { name: /close/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /please wait/i })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  test("clicking backdrop container calls onCancel", () => {
    const onCancel = jest.fn();

    const { container } = render(
      <ConfirmDialog open onCancel={onCancel} onConfirm={jest.fn()} />,
    );

    // element with role="dialog" is the outer container that handles onMouseDown
    const overlay = screen.getByRole("dialog");
    fireEvent.mouseDown(overlay, { target: overlay });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(container).toBeInTheDocument();
  });

  test("clicking inside panel does not call onCancel via backdrop handler", () => {
    const onCancel = jest.fn();

    render(
      <ConfirmDialog
        open
        title="Dialog title"
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />,
    );

    // click on inner panel content (title), not on outer overlay
    const title = screen.getByText("Dialog title");
    fireEvent.mouseDown(title);

    expect(onCancel).not.toHaveBeenCalled();
  });

  test("renders primary tone confirm button classes", () => {
    render(
      <ConfirmDialog
        open
        tone="primary"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        confirmText="Log Out"
      />,
    );

    const confirmBtn = screen.getByRole("button", { name: /log out/i });
    expect(confirmBtn.className).toContain("bg-[var(--brand-blue-dark)]");
  });

  test("renders danger tone confirm button classes by default", () => {
    render(
      <ConfirmDialog
        open
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        confirmText="Delete"
      />,
    );

    const confirmBtn = screen.getByRole("button", { name: /delete/i });
    expect(confirmBtn.className).toContain("bg-[var(--danger)]");
  });
});