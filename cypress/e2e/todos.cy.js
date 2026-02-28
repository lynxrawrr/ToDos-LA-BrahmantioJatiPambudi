describe("Todo Dashboard E2E", () => {
  const getTodoInput = () => cy.get("#todo-input");

  const clickAddButton = () =>
    cy.contains("button", /^tambah$/i).click({ force: true });

  beforeEach(() => {
    cy.mockTodosApi();
    cy.visitDashboard();
    cy.wait("@getTodos");
  });

  it("loads todos from API and displays them", () => {
    cy.contains("Belajar React").should("be.visible");
    cy.contains("Belajar Redux").should("be.visible");
    cy.contains("Belajar Cypress").should("be.visible");
  });

  it("adds a new todo", () => {
    getTodoInput().as("todoInput");

    cy.get("@todoInput").clear().type("Belajar E2E Testing");
    clickAddButton();

    cy.wait("@addTodo");

    cy.contains("Belajar E2E Testing").should("be.visible");
  });

  it("shows validation when adding empty todo", () => {
    clickAddButton();

    cy.contains("Todo tidak boleh kosong.").should("be.visible");
  });

  it("clears validation error after valid todo submit", () => {
    clickAddButton();
    cy.contains("Todo tidak boleh kosong.").should("be.visible");

    getTodoInput().clear().type("Belajar Fix Error");
    clickAddButton();

    cy.wait("@addTodo");

    cy.contains("Todo tidak boleh kosong.").should("not.exist");
    cy.contains("Belajar Fix Error").should("be.visible");
  });

  it("sanitizes todo title before submit", () => {
    getTodoInput().as("todoInput");

    cy.get("@todoInput").clear().type("   Belajar   Sanitasi   ");
    clickAddButton();

    cy.wait("@addTodo");

    cy.contains("Belajar Sanitasi").should("be.visible");
  });

  it("toggles todo status and moves item to completed tab", () => {
    cy.contains("Belajar React").should("be.visible");

    cy.contains("Belajar React")
      .closest("li")
      .within(() => {
        cy.get("button").first().click();
      });

    cy.wait("@toggleTodo");

    cy.contains("button", /^Selesai/i).click();

    cy.get("ul").within(() => {
      cy.contains("Belajar React").should("be.visible");
      cy.contains("Belajar Redux").should("be.visible");
    });
  });

  it("deletes todo after confirmation", () => {
    cy.contains("Belajar Cypress")
      .closest("li")
      .within(() => {
        cy.get('button[aria-label="Hapus todo"]').click();
      });

    cy.contains("Delete this task?").should("be.visible");
    cy.contains("button", /^delete$/i).click();

    cy.wait("@deleteTodo");

    cy.contains("Belajar Cypress").should("not.exist");
  });

  it("does not delete todo when delete is cancelled", () => {
    cy.contains("Belajar Cypress")
      .closest("li")
      .within(() => {
        cy.get('button[aria-label="Hapus todo"]').click();
      });

    cy.contains("Delete this task?").should("be.visible");
    cy.contains("button", /^cancel$/i).click();

    cy.contains("Delete this task?").should("not.exist");
    cy.contains("Belajar Cypress").should("exist");
  });

  it("filters completed todos using tabs", () => {
    cy.contains("button", /^Selesai/i).click();

    cy.get("ul").should("exist");
    cy.get("ul li").should("have.length", 1);

    cy.get("ul").within(() => {
      cy.contains("Belajar Redux").should("be.visible");
    });

    cy.contains("Belajar React").should("not.exist");
    cy.contains("Belajar Cypress").should("not.exist");
  });

  it("can switch back to all todos tab", () => {
    cy.contains("button", /^Selesai/i).click();

    cy.get("ul li").should("have.length", 1);
    cy.get("ul").within(() => {
      cy.contains("Belajar Redux").should("be.visible");
    });

    cy.contains("button", /^Belum Selesai$/i).click();

    cy.get("ul").within(() => {
      cy.contains("Belajar React").should("be.visible");
      cy.contains("Belajar Cypress").should("be.visible");
    });
  });

  it("shows empty state when API returns no todos", () => {
    cy.intercept("GET", "**/todos?_limit=12", {
      statusCode: 200,
      body: [],
    }).as("getTodosEmpty");

    cy.visitDashboard();
    cy.wait("@getTodosEmpty");

    cy.contains("Belum ada tugas untuk saat ini").should("be.visible");
    cy.contains("Silahkan tambah tugas baru pada form di atas.").should(
      "be.visible",
    );
  });

  it("shows error message when fetch todos fails", () => {
    cy.intercept("GET", "**/todos?_limit=12", {
      statusCode: 500,
      body: {},
    }).as("getTodosFail");

    cy.visitDashboard();
    cy.wait("@getTodosFail");

    cy.contains(/gagal mengambil todo|unknown error/i).should("be.visible");
  });

  it("shows loading state while fetching todos", () => {
    cy.intercept("GET", "**/todos?_limit=12", (req) => {
      req.reply({
        delay: 800,
        statusCode: 200,
        body: [],
      });
    }).as("getTodosSlow");

    cy.visitDashboard();

    cy.contains("Loading...").should("be.visible");
    cy.wait("@getTodosSlow");
  });

  it("shows offline cache banner when app is offline with cached todos", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "todos_cache",
          JSON.stringify([{ id: 1, title: "Cached Todo", completed: false }]),
        );

        Object.defineProperty(win.navigator, "onLine", {
          configurable: true,
          get: () => false,
        });
      },
    });

    cy.contains("You are offline. Showing cached todos.").should("be.visible");
    cy.contains("Cached Todo").should("be.visible");
  });
});
