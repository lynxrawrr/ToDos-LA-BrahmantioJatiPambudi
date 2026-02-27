import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "./Register";
import { register as registerAction } from "../features/auth/authSlice";

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
  register: jest.fn((payload) => ({ type: "auth/register", payload })),
}));

describe("Register page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form and sign in link", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /welcome, let’s create an account/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toHaveAttribute("href", "/login");
  });

  test("shows error when full name is empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/^email$/i), "bramii@mail.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Full name wajib diisi.")).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error when email is empty", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/full name/i), "Bramii");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Email wajib diisi.")).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error when password is less than 8 characters", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/full name/i), "Bramii");
    await user.type(screen.getByLabelText(/^email$/i), "bramii@mail.com");
    await user.type(screen.getByLabelText(/^password$/i), "1234");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      screen.getByText("Password minimal 8 karakter."),
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("dispatches register and navigates to dashboard on valid submit", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/full name/i), "  Bramii  ");
    await user.type(screen.getByLabelText(/^email$/i), "  bramii@mail.com  ");
    await user.type(screen.getByLabelText(/^password$/i), "password123");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(registerAction).toHaveBeenCalledWith({
      name: "Bramii",
      email: "bramii@mail.com",
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "auth/register",
      payload: { name: "Bramii", email: "bramii@mail.com" },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});