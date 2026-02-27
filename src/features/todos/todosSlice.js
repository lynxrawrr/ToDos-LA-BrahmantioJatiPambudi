import {
  createAsyncThunk,
  createSlice,
  nanoid,
  current,
} from "@reduxjs/toolkit";

import {
  addTodoApi,
  deleteTodoApi,
  fetchTodosApi,
  toggleTodoApi,
} from "./todosApi";

import { saveTodosCache } from "../../utils/storage";

// state: todos slice initial shape
const initialState = {
  items: [],
  status: "idle",
  error: null,
  filter: "all",
  mutation: null,
};

// thunk: fetch todos (GET)
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ limit } = {}, thunkAPI) => {
    try {
      return await fetchTodosApi({ limit });
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

// thunk: add todo (POST)
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async ({ title, userId }, thunkAPI) => {
    try {
      const res = await addTodoApi({ title, userId });
      return { ...res, id: res.id ?? nanoid() };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

// thunk: toggle todo status (PATCH)
export const toggleTodo = createAsyncThunk(
  "todos/toggleTodo",
  async ({ id, completed }, thunkAPI) => {
    try {
      await toggleTodoApi({ id, completed });
      return { id, completed };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

// thunk: delete todo (DELETE)
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, thunkAPI) => {
    try {
      await deleteTodoApi(id);
      return id;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    hydrateFromCache(state, action) {
      state.items = action.payload ?? [];
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch reducers
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        saveTodosCache(current(state).items);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })

      // add reducers
      .addCase(addTodo.pending, (state) => {
        state.mutation = "adding";
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.mutation = null;
        state.items.unshift(action.payload);
        saveTodosCache(current(state).items);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.mutation = null;
        state.error = action.payload || "Unknown error";
      })

      // toggle reducers
      .addCase(toggleTodo.pending, (state) => {
        state.mutation = "toggling";
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.mutation = null;
        const t = state.items.find((x) => x.id === action.payload.id);
        if (t) t.completed = action.payload.completed;
        saveTodosCache(current(state).items);
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.mutation = null;
        state.error = action.payload || "Unknown error";
      })

      // delete reducers
      .addCase(deleteTodo.pending, (state) => {
        state.mutation = "deleting";
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.mutation = null;
        state.items = state.items.filter((x) => x.id !== action.payload);
        saveTodosCache(current(state).items);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.mutation = null;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { setFilter, hydrateFromCache } = todosSlice.actions;
export default todosSlice.reducer;
