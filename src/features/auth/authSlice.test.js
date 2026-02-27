/* eslint-env jest */

describe("authSlice - initial state", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules(); // penting: supaya module di-import ulang dan initialState dihitung ulang
  });

  test("initial user is null when localStorage is empty", async () => {
    const mod = await import("./authSlice");
    const reducer = mod.default;

    const state = reducer(undefined, { type: "@@INIT" });

    expect(state).toEqual({ user: null });
  });

  test("initial user is loaded from localStorage when valid JSON exists", async () => {
    const savedUser = {
      name: "Bramii",
      email: "bramii@mail.com",
    };

    localStorage.setItem("todo_user", JSON.stringify(savedUser));

    const mod = await import("./authSlice");
    const reducer = mod.default;

    const state = reducer(undefined, { type: "@@INIT" });

    expect(state).toEqual({ user: savedUser });
  });

  test("initial user falls back to null when localStorage JSON is invalid", async () => {
    localStorage.setItem("todo_user", "{invalid-json");

    const mod = await import("./authSlice");
    const reducer = mod.default;

    const state = reducer(undefined, { type: "@@INIT" });

    expect(state).toEqual({ user: null });
  });
});

describe("authSlice - reducers", () => {
  let reducer;
  let register;
  let login;
  let logout;

  beforeEach(async () => {
    localStorage.clear();
    jest.resetModules();

    const mod = await import("./authSlice");
    reducer = mod.default;
    register = mod.register;
    login = mod.login;
    logout = mod.logout;
  });

  test("register sets user and saves it to localStorage", () => {
    const user = {
      name: "Bramii",
      email: "bramii@mail.com",
    };

    const state = reducer(undefined, register(user));

    expect(state.user).toEqual(user);
    expect(localStorage.getItem("todo_user")).toBe(JSON.stringify(user));
  });

  test("login sets user and saves it to localStorage", () => {
    const user = {
      name: "Bramii",
      email: "bramii@mail.com",
    };

    const state = reducer(undefined, login(user));

    expect(state.user).toEqual(user);
    expect(localStorage.getItem("todo_user")).toBe(JSON.stringify(user));
  });

  test("logout clears user and removes localStorage key", () => {
    const user = { name: "Bramii", email: "bramii@mail.com" };

    // start from logged in state
    let state = reducer(undefined, login(user));
    expect(state.user).toEqual(user);
    expect(localStorage.getItem("todo_user")).toBeTruthy();

    // logout
    state = reducer(state, logout());

    expect(state.user).toBeNull();
    expect(localStorage.getItem("todo_user")).toBeNull();
  });
});
