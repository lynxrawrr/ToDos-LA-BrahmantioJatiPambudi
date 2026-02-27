/* eslint-env jest */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { logout } from "../features/auth/authSlice";

// mock custom hooks
import { useAppDispatch, useAppSelector } from "../app/hooks";
jest.mock("../app/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// mock storage helpers (theme)
import { loadTheme, saveTheme } from "../utils/storage";
jest.mock("../utils/storage", () => ({
  loadTheme: jest.fn(),
  saveTheme: jest.fn(),
}));

describe("Header", () => {
  let dispatchMock;

  function renderHeader(props = {}, authUser = null) {
    useAppSelector.mockImplementation((selectorFn) =>
      selectorFn({
        auth: { user: authUser },
      }),
    );

    return render(
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    dispatchMock = jest.fn();
    useAppDispatch.mockReturnValue(dispatchMock);

    loadTheme.mockReturnValue("light");
    saveTheme.mockClear();

    // reset class dark sebelum tiap test
    document.documentElement.classList.remove("dark");

    jest.clearAllMocks();
  });

  test("renders logo and theme toggle button", () => {
    renderHeader();

    expect(screen.getByAltText("Todo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  test("does not show auth action when showAuthAction is false", () => {
    renderHeader({ showAuthAction: false }, null);

    expect(
      screen.queryByRole("link", { name: /login/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  test("shows Login link when user is guest and showAuthAction=true", () => {
    renderHeader({ showAuthAction: true }, null);

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("shows Log Out button when user is logged in", () => {
    renderHeader(
      { showAuthAction: true },
      { name: "Bramii", email: "bramii@mail.com" },
    );

    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  test("toggles theme and saves preference", async () => {
    const user = userEvent.setup();

    renderHeader();

    const toggleBtn = screen.getByRole("button", {
      name: /switch to dark mode/i,
    });

    // awal light -> belum dark
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // klik jadi dark
    await user.click(toggleBtn);
    expect(saveTheme).toHaveBeenCalledWith("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // label berubah
    expect(
      screen.getByRole("button", { name: /switch to light mode/i }),
    ).toBeInTheDocument();

    // klik lagi jadi light
    await user.click(
      screen.getByRole("button", { name: /switch to light mode/i }),
    );
    expect(saveTheme).toHaveBeenCalledWith("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("opens logout confirm dialog and closes on cancel", async () => {
    const user = userEvent.setup();

    renderHeader(
      { showAuthAction: true },
      { name: "Bramii", email: "bramii@mail.com" },
    );

    await user.click(screen.getByRole("button", { name: /log out/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/log out\?/i)).toBeInTheDocument();
    expect(
      within(dialog).getByText(/you’ll need to sign in again/i),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("dispatches logout action when confirm logout is clicked", async () => {
    const user = userEvent.setup();

    renderHeader(
      { showAuthAction: true },
      { name: "Bramii", email: "bramii@mail.com" },
    );

    // buka dialog dari tombol header
    await user.click(screen.getByRole("button", { name: /^log out$/i }));

    const dialog = screen.getByRole("dialog");

    // klik tombol confirm di dialog
    await user.click(
      within(dialog).getByRole("button", { name: /^log out$/i }),
    );

    expect(dispatchMock).toHaveBeenCalledWith(logout());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("initializes dark mode from loadTheme()", () => {
    loadTheme.mockReturnValue("dark");

    renderHeader();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      screen.getByRole("button", { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });
});
