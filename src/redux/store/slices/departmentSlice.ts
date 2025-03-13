import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDepartments,
  createDepartment,
  assignDepartmentHead,
  updateDepartment,
  deleteDepartment,
} from '../../actions/departmentActions';
import { Department } from '../../types/departmentTypes';

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
      })
      .addCase(assignDepartmentHead.fulfilled, (state, action) => {
        const index = state.departments.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.departments[index] = action.payload;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.departments[index].name = action.payload.name;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter((d) => d.id !== action.meta.arg);
      });
  },
});

export default departmentSlice.reducer;