/* eslint-env jest */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./Login";
import { login } from "../features/auth/authSlice";

// ---- Mocks ----
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../components/Header", () => () => (
  <div data-testid="header-mock" />
));

jest.mock("../app/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../features/auth/authSlice", () => ({
  login: jest.fn((payload) => ({ type: "auth/login", payload })),
}));

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form and register link", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /welcome, let’s login/i }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/must be at least 8 characters/i),
    ).toBeInTheDocument();

    const registerLink = screen.getByRole("link", { name: /register/i });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("shows error when email is empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText(/must be at least 8 characters/i),
      "12345678",
    );
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(screen.getByText("Email wajib diisi.")).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error when password is less than 8 characters", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "bramii@mail.com",
    );
    await user.type(
      screen.getByPlaceholderText(/must be at least 8 characters/i),
      "1234",
    );
    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(
      screen.getByText("Password minimal 8 karakter."),
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("dispatches login and navigates to dashboard on valid submit", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByPlaceholderText(/your email/i),
      "  bramii@mail.com  ",
    );
    await user.type(
      screen.getByPlaceholderText(/must be at least 8 characters/i),
      "password123",
    );

    await user.click(screen.getByRole("button", { name: /^login$/i }));

    expect(login).toHaveBeenCalledWith({
      email: "bramii@mail.com",
      name: "bramii",
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/login",
      payload: { email: "bramii@mail.com", name: "bramii" },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
