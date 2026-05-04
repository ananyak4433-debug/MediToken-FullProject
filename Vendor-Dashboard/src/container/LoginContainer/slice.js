
import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        data: {},
        userData: {},
        loading: false,
        error: null
    },
    reducers: {
        userLogin: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        loginFail: (state, action) => {
            state.loading = false;
            state.error = {
                message: action.payload.message || 'Login failed',
                status: action.payload.status || 500
            };
        },

        userMe: (state) => {
            state.loading = true;
            state.error = null;
        },
        userMeSuccess: (state, action) => {
            console.log('🎯 userMeSuccess payload:', action.payload);  // ADD THIS
         state.loading = false;
            // state.userData = action.payload;
             state.userData = action.payload?.data || action.payload || {};
             console.log('🎯 userData stored as:', state.userData);     // ADD THIS
            state.error = null;
        },
        userMeFail: (state, action) => {
            state.loading = false;
        }
    }
});

export const { userLogin, loginSuccess, loginFail, userMe, userMeSuccess, userMeFail } = loginSlice.actions;
export const selectError = (state) => state.login.error;

export default loginSlice.reducer;