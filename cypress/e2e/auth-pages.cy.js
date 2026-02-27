describe("Auth pages & routing", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/todos?_limit=12", {
      statusCode: 200,
      body: [],
    }).as("getTodosAfterAuth");

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem("theme", "light");
      },
    });
  });

  it("redirects root / to /dashboard", () => {
    cy.url().should("include", "/dashboard");
  });

  it("renders login page", () => {
    cy.visit("/login");

    cy.contains("Welcome, let’s Login").should("be.visible");
    cy.contains("Please login so you can see your record history.").should(
      "be.visible",
    );

    cy.get('input[placeholder="Your email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", /^Login$/).should("be.visible");
    cy.contains("a", "Register").should("have.attr", "href", "/register");
  });

  it("navigates from login to register via link", () => {
    cy.visit("/login");

    cy.contains("a", "Register").click();
    cy.url().should("include", "/register");
    cy.contains("Welcome, let’s create an account").should("be.visible");
  });

  it("shows login validation errors", () => {
    cy.visit("/login");

    // submit kosong -> error email
    cy.contains("button", /^Login$/).click();
    cy.contains("Email wajib diisi.").should("be.visible");

    // isi email + password pendek -> error password
    cy.get('input[placeholder="Your email"]').type("bramii@mail.com");
    cy.get('input[type="password"]').type("12345");
    cy.contains("button", /^Login$/).click();

    cy.contains("Password minimal 8 karakter.").should("be.visible");
  });

  it("login success stores user and navigates to dashboard", () => {
    cy.visit("/login");

    cy.get('input[placeholder="Your email"]').type("bramii@mail.com");
    cy.get('input[type="password"]').type("password123");
    cy.contains("button", /^Login$/).click();
    cy.wait("@getTodosAfterAuth");

    cy.url().should("include", "/dashboard");

    cy.window().then((win) => {
      const raw = win.localStorage.getItem("todo_user");
      expect(raw).to.not.be.null;

      const user = JSON.parse(raw);
      expect(user.email).to.equal("bramii@mail.com");
      expect(user.name).to.equal("bramii");
    });
  });

  it("renders register page", () => {
    cy.visit("/register");

    cy.contains("Welcome, let’s create an account").should("be.visible");
    cy.contains(
      "Create a new account so that all your note history can be saved",
    ).should("be.visible");

    cy.get('input[placeholder="Your name"]').should("be.visible");
    cy.get('input[placeholder="Your email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", /^Continue$/).should("be.visible");
    cy.contains("a", "Sign In").should("have.attr", "href", "/login");
  });

  it("navigates from register to login via link", () => {
    cy.visit("/register");

    cy.contains("a", "Sign In").click();
    cy.url().should("include", "/login");
    cy.contains("Welcome, let’s Login").should("be.visible");
  });

  it("shows register validation errors", () => {
    cy.visit("/register");

    // kosong -> nama wajib
    cy.contains("button", /^Continue$/).click();
    cy.contains("Full name wajib diisi.").should("be.visible");

    // isi nama tapi email kosong
    cy.get('input[placeholder="Your name"]').type("Bramii");
    cy.contains("button", /^Continue$/).click();
    cy.contains("Email wajib diisi.").should("be.visible");

    // isi email + password pendek
    cy.get('input[placeholder="Your email"]').type("bramii@mail.com");
    cy.get('input[type="password"]').type("12345");
    cy.contains("button", /^Continue$/).click();

    cy.contains("Password minimal 8 karakter.").should("be.visible");
  });

  it("register success stores user and navigates to dashboard", () => {
    cy.visit("/register");

    cy.get('input[placeholder="Your name"]').type("Bramii Jati");
    cy.get('input[placeholder="Your email"]').type("bramii@mail.com");
    cy.get('input[type="password"]').type("password123");
    cy.contains("button", /^Continue$/).click();
    cy.wait("@getTodosAfterAuth");

    cy.url().should("include", "/dashboard");

    cy.window().then((win) => {
      const raw = win.localStorage.getItem("todo_user");
      expect(raw).to.not.be.null;

      const user = JSON.parse(raw);
      expect(user.name).to.equal("Bramii Jati");
      expect(user.email).to.equal("bramii@mail.com");
    });
  });

  it("renders 404 page for unknown route", () => {
    cy.visit("/halaman-yang-tidak-ada");

    cy.contains("404").should("be.visible");
    cy.contains("Page not found").should("be.visible");
    cy.contains("This page isn’t available.").should("be.visible");

    cy.contains("a", "Back to Dashboard").should(
      "have.attr",
      "href",
      "/dashboard",
    );
    cy.contains("a", "Go to Login").should("have.attr", "href", "/login");
  });

  it("shows both 404 action buttons", () => {
    cy.visit("/random-route");

    cy.contains("a", "Back to Dashboard").should("be.visible");
    cy.contains("a", "Go to Login").should("be.visible");
  });

  it("can navigate from 404 to dashboard", () => {
    cy.visit("/random-route");

    cy.contains("a", "Back to Dashboard").click();
    cy.wait("@getTodosAfterAuth");
    cy.url().should("include", "/dashboard");
  });

  it("can navigate from 404 to login", () => {
    cy.visit("/random-route");

    cy.contains("a", "Go to Login").click();
    cy.url().should("include", "/login");
    cy.contains("Welcome, let’s Login").should("be.visible");
  });

  it("keeps auth pages accessible directly by URL", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");

    cy.visit("/register");
    cy.url().should("include", "/register");
  });
});