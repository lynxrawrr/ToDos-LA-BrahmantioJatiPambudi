import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useConfirm } from "./useConfirm";
import { useState } from "react";

function TestHarness() {
  const { confirm, dialogProps, handleConfirm, handleCancel } = useConfirm();
  const [result, setResult] = useState("pending");

  async function openDefault() {
    const ok = await confirm();
    setResult(String(ok));
  }

  async function openCustom() {
    const ok = await confirm({
      title: "Delete this task?",
      message: "This action can’t be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
    });
    setResult(String(ok));
  }

  return (
    <div>
      <button onClick={openDefault}>Open Default</button>
      <button onClick={openCustom}>Open Custom</button>
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>

      <div data-testid="open">{String(dialogProps.open)}</div>
      <div data-testid="title">{dialogProps.title}</div>
      <div data-testid="message">{dialogProps.message}</div>
      <div data-testid="confirmText">{dialogProps.confirmText}</div>
      <div data-testid="cancelText">{dialogProps.cancelText}</div>
      <div data-testid="tone">{dialogProps.tone}</div>
      <div data-testid="result">{result}</div>
    </div>
  );
}

describe("useConfirm", () => {
  test("initial state is closed", () => {
    render(<TestHarness />);

    expect(screen.getByTestId("open")).toHaveTextContent("false");
    expect(screen.getByTestId("title")).toHaveTextContent("");
    expect(screen.getByTestId("result")).toHaveTextContent("pending");
  });

  test("confirm() opens dialog with default values", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await user.click(screen.getByRole("button", { name: /open default/i }));

    expect(screen.getByTestId("open")).toHaveTextContent("true");
    expect(screen.getByTestId("title")).toHaveTextContent("Are you sure?");
    expect(screen.getByTestId("message")).toHaveTextContent("");
    expect(screen.getByTestId("confirmText")).toHaveTextContent("Confirm");
    expect(screen.getByTestId("cancelText")).toHaveTextContent("Cancel");
    expect(screen.getByTestId("tone")).toHaveTextContent("danger");
  });

  test("confirm() accepts custom options", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await user.click(screen.getByRole("button", { name: /open custom/i }));

    expect(screen.getByTestId("open")).toHaveTextContent("true");
    expect(screen.getByTestId("title")).toHaveTextContent("Delete this task?");
    expect(screen.getByTestId("message")).toHaveTextContent(
      "This action can’t be undone.",
    );
    expect(screen.getByTestId("confirmText")).toHaveTextContent("Delete");
    expect(screen.getByTestId("cancelText")).toHaveTextContent("Cancel");
    expect(screen.getByTestId("tone")).toHaveTextContent("danger");
  });

  test("handleConfirm resolves promise with true and closes dialog", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await user.click(screen.getByRole("button", { name: /open default/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(screen.getByTestId("open")).toHaveTextContent("false");
    expect(screen.getByTestId("result")).toHaveTextContent("true");
  });

  test("handleCancel resolves promise with false and closes dialog", async () => {
    const user = userEvent.setup();
    render(<TestHarness />);

    await user.click(screen.getByRole("button", { name: /open default/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByTestId("open")).toHaveTextContent("false");
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });
});