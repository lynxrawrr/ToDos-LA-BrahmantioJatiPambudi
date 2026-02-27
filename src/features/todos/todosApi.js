const BASE = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTodosApi({ limit = 12 } = {}) {
  const res = await fetch(`${BASE}?_limit=${limit}`);
  if (!res.ok) throw new Error("Gagal Mengambil Todo.");
  return res.json();
}

export async function addTodoApi({ title, userId = 1 }) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ title, completed: false, userId }),
  });
  if (!res.ok) throw new Error("Gagal Menambah Todo.");
  return res.json();
}

export async function toggleTodoApi({ id, completed }) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("Gagal Update Status Todo.");
  return res.json();
}

export async function deleteTodoApi(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Gagal hapus todo.");
  return { id };
}
