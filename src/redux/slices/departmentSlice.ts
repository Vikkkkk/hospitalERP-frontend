import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchDepartments,
  createDepartment,
  assignDepartmentHead,
  updateDepartment,
  deleteDepartment,
} from '../actions/departmentActions';
import { Department } from '../types/departmentTypes';

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

// 🎯 Initial State
const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

// 🚀 Create Department Slice
const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    clearDepartments: (state) => {
      state.departments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ✅ Handle Create Department
      .addCase(createDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.departments.push(action.payload);
      })
      // ✅ Handle Assign Department Head
      .addCase(assignDepartmentHead.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.departments.findIndex((dept) => dept.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      // ✅ Handle Update Department
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.departments.findIndex((dept) => dept.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })
      // ✅ Handle Delete Department
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter((dept) => dept.id !== action.meta.arg);
      });
  },
});

// 📌 Export Actions & Reducer
export const { clearDepartments } = departmentSlice.actions;
export default departmentSlice.reducer;