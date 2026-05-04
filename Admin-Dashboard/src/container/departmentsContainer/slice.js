// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   departments: [],
//   loading: false,
//   error: null
// };

// const departmentSlice = createSlice({
//   name: 'departments',
//   initialState,
//   reducers: {
//     getDepartmentsRequest: (state) => {
//       state.loading = true;
//     },
//     getDepartmentsSuccess: (state, action) => {
//       state.loading = false;
//       state.departments = action.payload;
//     },
//     getDepartmentsFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     addDepartmentRequest: (state) => {
//       state.loading = true;
//     },
//     addDepartmentSuccess: (state, action) => {
//       state.loading = false;
//       state.departments.push(action.payload);
//     },
//     addDepartmentFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     deleteDepartmentRequest: (state) => {
//       state.loading = true;
//     },
//     deleteDepartmentSuccess: (state, action) => {
//       state.loading = false;
//       state.departments = state.departments.filter(
//         (dept) => dept._id !== action.payload
//       );
//     },
//     deleteDepartmentFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     }
//   }
// });

// export const {
//   getDepartmentsRequest,
//   getDepartmentsSuccess,
//   getDepartmentsFailure,
//   addDepartmentRequest,
//   addDepartmentSuccess,
//   addDepartmentFailure,
//   deleteDepartmentRequest,
//   deleteDepartmentSuccess,
//   deleteDepartmentFailure
// } = departmentSlice.actions;

// export default departmentSlice.reducer;











import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departments: [],
  loading: false,
  error: null
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    // GET
    getDepartmentsRequest: (state) => { state.loading = true; },
    getDepartmentsSuccess: (state, action) => {
      state.loading = false;
      state.departments = action.payload;
    },
    getDepartmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ADD
    addDepartmentRequest: (state) => { state.loading = true; },
    addDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments.push(action.payload);
    },
    addDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // EDIT ✅
    editDepartmentRequest: (state) => { state.loading = true; },
    editDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments = state.departments.map(d =>
        d._id === action.payload._id ? action.payload : d
      );
    },
    editDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // DELETE
    deleteDepartmentRequest: (state) => { state.loading = true; },
    deleteDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.departments = state.departments.filter(d => d._id !== action.payload);
    },
    deleteDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  getDepartmentsRequest, getDepartmentsSuccess, getDepartmentsFailure,
  addDepartmentRequest, addDepartmentSuccess, addDepartmentFailure,
  editDepartmentRequest, editDepartmentSuccess, editDepartmentFailure, // ✅
  deleteDepartmentRequest, deleteDepartmentSuccess, deleteDepartmentFailure
} = departmentSlice.actions;

export default departmentSlice.reducer;