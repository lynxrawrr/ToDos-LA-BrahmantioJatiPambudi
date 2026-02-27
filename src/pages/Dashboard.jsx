import { useCallback, useEffect, useMemo } from "react";
import TodoComposer from "../components/TodoComposer";
import TodoList from "../components/TodoList";
import Tabs from "../components/Tabs";
import Header from "../components/Header";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  setFilter,
  toggleTodo,
} from "../features/todos/todosSlice";
import {
  selectCompletedTodos,
  selectError,
  selectFilter,
  selectMutation,
  selectStatus,
  selectTodos,
} from "../features/todos/selectors";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const filter = useAppSelector(selectFilter);
  const mutation = useAppSelector(selectMutation);

  const all = useAppSelector(selectTodos);
  const completed = useAppSelector(selectCompletedTodos);

  useEffect(() => {
    if (status === "idle") dispatch(fetchTodos());
  }, [status, dispatch]);

  const visible = useMemo(
    () => (filter === "completed" ? completed : all),
    [filter, completed, all],
  );

  const onAdd = useCallback(
    (title) => {
      dispatch(addTodo({ title, userId: 1 }));
    },
    [dispatch],
  );

  const onToggle = useCallback(
    (id, completedValue) => {
      dispatch(toggleTodo({ id, completed: completedValue }));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (id) => {
      dispatch(deleteTodo(id));
    },
    [dispatch],
  );

  const onChangeFilter = useCallback(
    (v) => {
      dispatch(setFilter(v));
    },
    [dispatch],
  );

  return (
    <div className="min-h-screen bg-(--page-bg) text-(--page-fg)">
      {/* Site Header */}
      <Header showAuthAction />

      <main className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="sr-only">Dashboard Todo App</h1>

        {/* Content Container */}
        <section
          className="mx-auto max-w-3xl"
          aria-labelledby="todos-section-title"
        >
          <h2 id="todos-section-title" className="sr-only">
            Kelola Todo
          </h2>

          {/* Composer */}
          <TodoComposer onAdd={onAdd} isBusy={mutation === "adding"} />

          {/* Tabs */}
          <Tabs
            allCount={all.length}
            completedCount={completed.length}
            value={filter}
            onChange={onChangeFilter}
          />

          {/* Divider */}
          <div className="mt-4 border-t border-(--gray-200) dark:border-(--gray-500)" />

          {/* Content State */}
          {status === "loading" ? (
            <p className="py-16 text-center text-sm text-(--muted)">
              Loading...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-sm text-(--danger)">
              {error}
            </p>
          ) : (
            <TodoList items={visible} onToggle={onToggle} onDelete={onDelete} />
          )}
        </section>
      </main>
    </div>
  );
}