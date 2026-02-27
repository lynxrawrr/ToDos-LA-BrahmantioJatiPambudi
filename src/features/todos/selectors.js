import { createSelector } from "@reduxjs/toolkit";

// slice selector
const selectTodosState = (s) => s.todos;

// base selectors
export const selectItems = (s) => selectTodosState(s).items;
export const selectFilter = (s) => selectTodosState(s).filter;
export const selectStatus = (s) => selectTodosState(s).status;
export const selectError = (s) => selectTodosState(s).error;
export const selectMutation = (s) => selectTodosState(s).mutation;

// derived list selectors (memoized)
export const selectActiveTodos = createSelector([selectItems], (items) =>
  items.filter((t) => !t.completed),
);

export const selectCompletedTodos = createSelector([selectItems], (items) =>
  items.filter((t) => t.completed),
);

// visible list (sorted, memoized)
export const selectTodos = createSelector([selectItems], (items) =>
  items
    .map((t, i) => ({ t, i }))
    .sort((a, b) => Number(a.t.completed) - Number(b.t.completed) || a.i - b.i)
    .map((x) => x.t),
);