import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isModalOpen: null,
    isModalImport: null,
    isModaUpdate: null,
};

export const modalUserAdminReducer = createSlice({
    name: 'modalUserAdminReducer',
    initialState,
    reducers: {
        openModalUserCreate: (state, action) => {
            state.isModalOpen = true;
        },

        closeModalUserCreate: (state, action) => {
            state.isModalOpen = false;
        },

        openModalImportUser: (state, action) => {
            state.isModalImport = true;
        },

        closeModalImportUser: (state, action) => {
            state.isModalImport = false;
        },

        openModalUpdateUser: (state, action) => {
            state.isModaUpdate = true;
        },

        closeModalUpdateUser: (state, action) => {
            state.isModaUpdate = false;
        },
    },
});

export const {
    openModalUserCreate,
    closeModalUserCreate,
    openModalImportUser,
    closeModalImportUser,
    closeModalUpdateUser,
    openModalUpdateUser,
} = modalUserAdminReducer.actions;

export default modalUserAdminReducer.reducer;
