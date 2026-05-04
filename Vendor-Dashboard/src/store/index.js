// // src/store/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import createSagaMiddleware from 'redux-saga';
// import rootReducer from 'store/reducer';
// import rootSaga from 'store/saga';
// import logger from 'redux-logger';
// import config from 'config';
// const sagaMiddleware = createSagaMiddleware();
// console.log("config.env",config.env);

// const middleware = config.env === 'UAT' ? [sagaMiddleware] : [logger, sagaMiddleware];

// const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware)
// });

// sagaMiddleware.run(rootSaga);

// export default store;







// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'store/reducer';
import rootSaga from 'store/saga';
import logger from 'redux-logger';
import config from 'config';

const sagaMiddleware = createSagaMiddleware();

console.log("config.env", config.env);

// ✅ Choose middleware based on env
const customMiddleware =
  config.env === 'UAT'
    ? [sagaMiddleware]
    : [logger, sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,

  // ✅ disable thunk (important)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(customMiddleware)
});

// ✅ run saga AFTER store creation
sagaMiddleware.run(rootSaga);

export default store;