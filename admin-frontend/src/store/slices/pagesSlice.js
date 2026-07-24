import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Fetch all pages (metadata list)
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/content/pages');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pages');
    }
  }
);

// Fetch a single page detail by slug
export const fetchPageBySlug = createAsyncThunk(
  'pages/fetchPageBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/content/pages/${slug}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Page not found');
    }
  }
);

// Create a new page
export const createPage = createAsyncThunk(
  'pages/createPage',
  async (pageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/content/pages', pageData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create page');
    }
  }
);

// Update an existing page
export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, pageData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/content/pages/${id}`, pageData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update page');
    }
  }
);

// Delete page by ID
export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/content/pages/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete page');
    }
  }
);

// Seed database on demand
export const seedPagesDatabase = createAsyncThunk(
  'pages/seedPagesDatabase',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/content/seed');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Database seeding failed');
    }
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    list: [],
    currentPage: null,
    isLoading: false,
    isActionLoading: false,
    error: null,
    actionSuccess: false,
  },
  reducers: {
    clearPageStatus: (state) => {
      state.error = null;
      state.actionSuccess = false;
    },
    resetCurrentPage: (state) => {
      state.currentPage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPages
      .addCase(fetchPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // fetchPageBySlug
      .addCase(fetchPageBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentPage = null;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPage = action.payload;
      })
      .addCase(fetchPageBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // createPage
      .addCase(createPage.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
        state.actionSuccess = false;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.actionSuccess = true;
        state.list.unshift(action.payload);
      })
      .addCase(createPage.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })

      // updatePage
      .addCase(updatePage.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
        state.actionSuccess = false;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.actionSuccess = true;
        state.currentPage = action.payload;
        // Update item in local list as well
        const idx = state.list.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })

      // deletePage
      .addCase(deletePage.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.list = state.list.filter(p => p._id !== action.payload);
        if (state.currentPage?._id === action.payload) {
          state.currentPage = null;
        }
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })

      // seedPagesDatabase
      .addCase(seedPagesDatabase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(seedPagesDatabase.fulfilled, (state) => {
        state.isLoading = false;
        state.actionSuccess = true;
      })
      .addCase(seedPagesDatabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPageStatus, resetCurrentPage } = pagesSlice.actions;
export default pagesSlice.reducer;
