// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("mockTodosApi", (overrides = {}) => {
  const initialTodos = overrides.initialTodos ?? [
    { id: 1, userId: 1, title: "Belajar React", completed: false },
    { id: 2, userId: 1, title: "Belajar Redux", completed: true },
    { id: 3, userId: 1, title: "Belajar Cypress", completed: false },
  ];

  // mutable in-memory state untuk simulasi backend
  let todos = [...initialTodos];
  let nextId = 100;

  cy.intercept("GET", "**/todos?_limit=12", (req) => {
    req.reply({
      statusCode: 200,
      body: todos,
    });
  }).as("getTodos");

  cy.intercept("POST", "**/todos", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const newTodo = {
      id: nextId++,
      userId: body.userId ?? 1,
      title: body.title,
      completed: body.completed ?? false,
    };

    // Dashboard slice addTodo.fulfilled -> unshift
    // API state juga kita update biar konsisten kalau ada refetch
    todos = [newTodo, ...todos];

    req.reply({
      statusCode: 201,
      body: newTodo,
    });
  }).as("addTodo");

  cy.intercept("PATCH", "**/todos/*", (req) => {
    const id = Number(req.url.split("/").pop());
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    todos = todos.map((t) =>
      t.id === id ? { ...t, completed: body.completed } : t,
    );

    req.reply({
      statusCode: 200,
      body: { id, completed: body.completed },
    });
  }).as("toggleTodo");

  cy.intercept("DELETE", "**/todos/*", (req) => {
    const id = Number(req.url.split("/").pop());

    todos = todos.filter((t) => t.id !== id);

    req.reply({
      statusCode: 200,
      body: {},
    });
  }).as("deleteTodo");
});

Cypress.Commands.add("visitDashboard", () => {
  // jaga localStorage agar state auth/theme tidak ganggu test
  cy.visit("/dashboard", {
    onBeforeLoad(win) {
      win.localStorage.clear();
      win.localStorage.setItem("theme", "light");
    },
  });
});
