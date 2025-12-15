import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TodoState, Todo } from '../utils/types';
import { todoService, type GetTodosParams } from '../services/todoService';
import { ITEMS_PER_PAGE } from '../utils/constants';

const initialState: TodoState = {
  todos: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalPages: 1,
  total: 0,
  filter: 'all',
  searchQuery: '',
  priorityFilter: 'all',
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { getState }) => {
    const state = getState() as { todos: TodoState };
    const { currentPage, itemsPerPage, filter, searchQuery, priorityFilter } = state.todos;

    const params: GetTodosParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined,
      priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      completed: filter === 'all' ? undefined : filter === 'completed',
    };

    return await todoService.getTodos(params);
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    return await todoService.createTodo(todo);
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, updates }: { id: string; updates: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> }) => {
    return await todoService.updateTodo(id, updates);
  }
);

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: string) => {
  await todoService.deleteTodo(id);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoState['filter']>) => {
      state.filter = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setPriorityFilter: (state, action: PayloadAction<TodoState['priorityFilter']>) => {
      state.priorityFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.data;
        state.total = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.page;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement des tâches';
      })
      .addCase(createTodo.fulfilled, () => {
        // Will be refetched by component
      })
      .addCase(updateTodo.fulfilled, () => {
        // Will be refetched by component
      })
      .addCase(deleteTodo.fulfilled, () => {
        // Will be refetched by component
      });
  },
});

export const { setFilter, setSearchQuery, setPriorityFilter, setCurrentPage } = todoSlice.actions;
export default todoSlice.reducer;
