import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from '../redux/account/accountSlice';
import modalBookAdminReducer from './modalBookAdmin/modalBookAdminSlice';
import modalUserAdminReducer from './modalUserAdmin/modalUserAdminSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import orderReducer from './order/orderSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['account'], // account will no be persisted
};

export const rootReducer = combineReducers({
    account: accountReducer,
    userAdmin: modalUserAdminReducer,
    bookAdmin: modalBookAdminReducer,
    order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

let persistor = persistStore(store);

export { store, persistor };
