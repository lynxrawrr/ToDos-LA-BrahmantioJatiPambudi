describe("Todo Dashboard E2E", () => {
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
    // Cari input berdasarkan placeholder / textbox
    // karena kita belum lihat exact DOM, pakai fallback fleksibel
    cy.get(
      'input[type="text"], input[placeholder*="todo" i], input[placeholder*="tugas" i]',
    )
      .first()
      .as("todoInput");

    cy.get("@todoInput").clear().type("Belajar E2E Testing");

    // Cari tombol submit tambah (fleksibel)
    cy.contains("button", /tambah|add|simpan/i).click({ force: true });

    cy.wait("@addTodo");

    // todo baru muncul
    cy.contains("Belajar E2E Testing").should("be.visible");
  });

  it("shows validation when adding empty todo", () => {
    cy.contains("button", /tambah|add|simpan/i).click({ force: true });

    cy.contains("Todo tidak boleh kosong.").should("be.visible");
  });

  it("sanitizes todo title before submit", () => {
    cy.get(
      'input[type="text"], input[placeholder*="todo" i], input[placeholder*="tugas" i]',
    )
      .first()
      .as("todoInput");

    cy.get("@todoInput").clear().type("   Belajar   Sanitasi   ");

    cy.contains("button", /tambah|add|simpan/i).click({ force: true });

    cy.wait("@addTodo");

    cy.contains("Belajar Sanitasi").should("be.visible");
  });

  it("toggles todo status", () => {
    // pakai item yang belum completed: "Belajar React"
    cy.get("body").then(() => {
      cy.contains("Belajar React")
        .closest("li")
        .within(() => {
          cy.get("button").first().click();
        });
    });

    cy.wait("@toggleTodo");

    // Assertion sederhana: item tetap ada dan request PATCH sukses
    cy.contains("Belajar React").should("exist");
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

    // lebih stabil daripada cuma cek not.exist di within
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
    // Override intercept khusus test ini
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

    // slice kamu bisa render pesan custom atau fallback
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
});