// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'store/reducer';
import rootSaga from 'store/saga';
import logger from 'redux-logger';
import config from 'config';
const sagaMiddleware = createSagaMiddleware();
console.log("config.env",config.env);

const middleware = config.env === 'UAT' ? [sagaMiddleware] : [logger, sagaMiddleware];

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware)
});

sagaMiddleware.run(rootSaga);

export default store;
