/* eslint-env jest */
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

// Mock Header biar fokus test halaman NotFound aja
jest.mock("../components/Header", () => () => <div data-testid="header-mock" />);

describe("NotFound page", () => {
  test("renders 404 content", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /page not found/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/this page isn’t available/i),
    ).toBeInTheDocument();
  });

  test("renders navigation links to dashboard and login", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByRole("link", {
      name: /back to dashboard/i,
    });
    const loginLink = screen.getByRole("link", { name: /go to login/i });

    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});