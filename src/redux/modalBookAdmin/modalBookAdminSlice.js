import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isModalDetail: null,
    isModalCreate: null,
    isModalUpdate: null,
};

const modalBookAdminReducer = createSlice({
    name: 'modalBookAdmin',
    initialState,

    reducers: {
        openModalDetailBook: (state, action) => {
            state.isModalDetail = true;
        },

        closeModalDetailBook: (state, action) => {
            state.isModalDetail = false;
        },

        openModalCreateBook: (state, action) => {
            state.isModalCreate = true;
        },

        closeModalCreateBook: (state, action) => {
            state.isModalCreate = false;
        },

        openModalUpdate: (state, action) => {
            state.isModalUpdate = true;
        },

        closeModalUpdate: (state, action) => {
            state.isModalUpdate = false;
        },
    },
});

export const {
    openModalDetailBook,
    closeModalDetailBook,
    openModalCreateBook,
    closeModalCreateBook,
    openModalUpdate,
    closeModalUpdate,
} = modalBookAdminReducer.actions;

export default modalBookAdminReducer.reducer;
