// base todos 
export const selectFilter = (s) => s.todos.filter;
export const selectStatus = (s) => s.todos.status;
export const selectError = (s) => s.todos.error;
export const selectMutation = (s) => s.todos.mutation;

// derived list selectors 
export const selectActiveTodos = (s) =>
  s.todos.items.filter((t) => !t.completed);

export const selectCompletedTodos = (s) =>
  s.todos.items.filter((t) => t.completed);

// visible list 
export const selectTodos = (s) => {
  const items = s.todos.items;

  return items
    .map((t, i) => ({ t, i }))
    .sort((a, b) => Number(a.t.completed) - Number(b.t.completed) || a.i - b.i)
    .map((x) => x.t);
};