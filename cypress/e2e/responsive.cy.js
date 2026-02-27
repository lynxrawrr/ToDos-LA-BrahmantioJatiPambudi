describe("Todo Dashboard Responsive", () => {
  beforeEach(() => {
    cy.mockTodosApi();
  });

  it("renders and remains usable on mobile viewport", () => {
    cy.viewport("iphone-x");
    cy.visitDashboard();
    cy.wait("@getTodos");

    // Header + konten utama tampil
    cy.get("header").should("be.visible");
    cy.contains("Belajar React").should("be.visible");
    cy.contains("Belajar Redux").should("be.visible");

    // Tabs tampil
    cy.contains("button", /^Belum Selesai$/i).should("be.visible");
    cy.contains("button", /^Selesai/i).should("be.visible");

    // Input + submit todo tetap usable di mobile
    cy.get(
      'input[type="text"], input[placeholder*="todo" i], input[placeholder*="tugas" i]',
    )
      .first()
      .as("todoInput");

    cy.get("@todoInput").should("be.visible").type("Todo Mobile");
    cy.contains("button", /tambah|add|simpan/i).click({ force: true });

    cy.wait("@addTodo");
    cy.contains("Todo Mobile").should("be.visible");

    // Toggle todo (klik checkbox pada item tertentu)
    cy.contains("Belajar React")
      .closest("li")
      .within(() => {
        cy.get("button").first().click({ force: true });
      });

    cy.wait("@toggleTodo");
    cy.contains("Belajar React").should("exist");

    // Delete flow + modal confirm tetap usable
    cy.contains("Belajar Cypress")
      .closest("li")
      .within(() => {
        cy.get('button[aria-label="Hapus todo"]').click({ force: true });
      });

    cy.contains("Delete this task?").should("be.visible");
    cy.contains("button", /^cancel$/i).should("be.visible");
    cy.contains("button", /^delete$/i).click({ force: true });

    cy.wait("@deleteTodo");
    cy.contains("Belajar Cypress").should("not.exist");

    // Filter tab completed tetap jalan di mobile
    cy.contains("button", /^Selesai/i).click({ force: true });

    cy.get("ul")
      .should("exist")
      .within(() => {
        cy.contains("Belajar Redux").should("be.visible"); // completed seed
      });

    // Optional: cek tidak ada horizontal overflow parah
    cy.document().then((doc) => {
      const sw = doc.documentElement.scrollWidth;
      const cw = doc.documentElement.clientWidth;

      // kasih toleransi kecil 1-2px untuk rounding/layout engine
      expect(sw).to.be.lte(cw + 2);
    });
  });

  it("renders empty state properly on mobile viewport", () => {
    cy.viewport("iphone-x");

    // Override GET todos untuk test ini
    cy.intercept("GET", "**/todos?_limit=12", {
      statusCode: 200,
      body: [],
    }).as("getTodosEmptyMobile");

    cy.visitDashboard();
    cy.wait("@getTodosEmptyMobile");

    cy.get("header").should("be.visible");
    cy.contains("Belum ada tugas untuk saat ini").should("be.visible");
    cy.contains("Silahkan tambah tugas baru pada form di atas.").should(
      "be.visible",
    );
  });

  it("renders and remains usable on tablet viewport", () => {
    cy.viewport("ipad-2");
    cy.visitDashboard();
    cy.wait("@getTodos");

    cy.get("header").should("be.visible");
    cy.contains("Belajar React").should("be.visible");
    cy.contains("button", /^Selesai/i).click();
    cy.contains("Belajar Redux").should("be.visible");
  });

  it("renders on desktop viewport", () => {
    cy.viewport(1280, 800);
    cy.visitDashboard();
    cy.wait("@getTodos");

    // Elemen utama tampil
    cy.get("header").should("be.visible");
    cy.contains("Belajar React").should("be.visible");
    cy.contains("Belajar Redux").should("be.visible");
    cy.contains("button", /^Belum Selesai$/i).should("be.visible");
    cy.contains("button", /^Selesai/i).should("be.visible");

    // Composer tetap usable
    cy.get(
      'input[type="text"], input[placeholder*="todo" i], input[placeholder*="tugas" i]',
    )
      .first()
      .type("Todo Desktop");

    cy.contains("button", /tambah|add|simpan/i).click({ force: true });
    cy.wait("@addTodo");

    cy.contains("Todo Desktop").should("be.visible");
  });
});