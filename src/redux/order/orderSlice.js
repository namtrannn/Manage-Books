import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NoStyleItemContext } from 'antd/es/form/context';
import { original, current } from 'immer';

/*
    *  cart = [
        {quantity:1, _id: abc, detail:  {_id:'abc}, name:'ascasc'}
    ]
    */

const initialState = {
    carts: [],
    quantityProduct: 0,
};

const orderReducer = createSlice({
    name: 'orderReducer',
    initialState,

    reducers: {
        doAddBookActions: (state, action) => {
            let cart = state.carts.length > 0 ? [...state.carts] : [];
            console.log('check cart', cart);

            const item = action.payload;

            let isExisIndex = cart.findIndex((c) => c._id === item.detail._id);

            if (isExisIndex > -1) {
                cart[isExisIndex].quantity += item.quantity;
            } else {
                cart.push({ quantity: item.quantity, _id: item.detail._id, detail: item.detail });
            }

            state.carts = cart;

            state.quantityProduct = state.carts.length;
        },
        doUpdateBookActions: (state, action) => {
            const carts = current(state.carts);
            const item = action.payload;

            const updateCart = carts.map((cart) => {
                return {
                    ...cart,
                };
            });

            //console.log('updateCart', updateCart);

            let isExisIndex = updateCart.findIndex((c) => c._id === item.detail._id);

            if (isExisIndex > -1) {
                updateCart[isExisIndex].quantity = item.quantity;
                //Nếu số lượng sản phẩm > sl tối đa
                if (updateCart[isExisIndex].quantity > updateCart[isExisIndex].detail.quantity) {
                    updateCart[isExisIndex].quantity = updateCart[isExisIndex].detail.quantity;
                }
            } else {
                updateCart.push({ quantity: item.quantity, _id: item.detail._id, detail: item.detail });
            }

            state.carts = updateCart;
        },

        doDeleteProduct: (state, action) => {
            const carts = current(state.carts);

            const item = action.payload;

            console.log('payload', item);

            const deleteCarts = carts.map((cart) => {
                return {
                    ...cart,
                };
            });

            const listProduct = deleteCarts.filter((c) => c._id != item._id);
            //console.log('list', listProduct);

            state.quantityProduct = listProduct.length;
            state.carts = listProduct;
        },

        doPlaceOrderActions: (state, action) => {
            state.carts = [];
            state.quantityProduct = state.carts.length;
        },
    },
});

export const { doAddBookActions, doUpdateBookActions, doDeleteProduct, doPlaceOrderActions } = orderReducer.actions;

export default orderReducer.reducer;
