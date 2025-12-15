import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../utils/types';
import { authService } from '../services/authService';

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.login(email, password);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await authService.register(email, password, firstName, lastName);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const { userService } = await import('../services/userService');
    const updatedUser = await userService.updateProfile(updates);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
);

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const user = await authService.getCurrentUser();
  localStorage.setItem('user', JSON.stringify(user));
  return user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: (() => {
    const storedUser = localStorage.getItem('user');
    return {
      ...initialState,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  })(),
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
