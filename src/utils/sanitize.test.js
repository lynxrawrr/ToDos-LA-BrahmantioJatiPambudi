import { sanitizeTodoTitle, validateTodoTitle } from "./sanitize";

describe("sanitizeTodoTitle", () => {
  test("trim and normalize spaces", () => {
    expect(sanitizeTodoTitle("  belajar   react   lanjut  ")).toBe(
      "belajar react lanjut",
    );
  });

  test("remove html tags", () => {
    expect(sanitizeTodoTitle("<b>Belajar</b> React")).toBe("Belajar React");
  });

  test("max length 120 chars", () => {
    const long = "a".repeat(130);
    expect(sanitizeTodoTitle(long)).toHaveLength(120);
  });
});

describe("validateTodoTitle", () => {
  test("reject empty title", () => {
    expect(validateTodoTitle("")).toBe("Todo tidak boleh kosong.");
  });

  test("reject too short title", () => {
    expect(validateTodoTitle("ab")).toBe("Minimal 3 karakter ya.");
  });

  test("accept valid title", () => {
    expect(validateTodoTitle("Belajar Redux")).toBeNull();
  });
});
