import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import commonApi from '../api';
import appConfig from '../../config';
import * as actionType from './slice';

// function* login(action) {
//   const loginReq = {
//     email: action.payload.email,
//     password: action.payload.password
//   };

//   try {
//     const params = {
//       api: `${appConfig.ip}/vendors/login`,
//       method: 'POST',
//       successAction: actionType.loginSuccess,  
//       failAction: actionType.loginFail,         
//       authorization: null,
//       body: JSON.stringify(loginReq)
//     };

//     const res = yield call(commonApi, params);

//     if (res) {
//       yield call(toast.success, 'Login successful', { autoClose: 3000 });
//       yield call(userMe);  
//       yield call(action.payload.navigate, '/');
//     } else {
//       yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
//     }
//   } catch (error) {
//     console.error('Login failed:', error);
//     yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
//   }
// }


function* login(action) {
  const { email, password, navigate } = action.payload;

  // 👇 Try vendor login first, then staff login based on a "role" flag
  // OR — pass role from your login form
  const isStaff = action.payload.role === 'staff';

  const loginEndpoint = isStaff
    ? `${appConfig.ip}/staff/login`
    : `${appConfig.ip}/vendors/login`;

  try {
    const res = yield call(commonApi, {
      api: loginEndpoint,
      method: 'POST',
      successAction: actionType.loginSuccess,
      failAction: actionType.loginFail,
      authorization: null,
      body: JSON.stringify({ email, password })
    });

    if (res) {
      yield call(toast.success, 'Login successful', { autoClose: 3000 });
      yield call(fetchUserProfile, isStaff);
      yield call(navigate, '/');
    } else {
      yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
    }
  } catch (error) {
    console.error('Login failed:', error);
    yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
  }
}

function* fetchUserProfile(isStaff) {
  const profileEndpoint = isStaff
    ? `${appConfig.ip}/staff/profile`
    : `${appConfig.ip}/vendors/profile`;

  try {
    yield call(commonApi, {
      api: profileEndpoint,
      method: 'GET',
      successAction: actionType.userMeSuccess,
      failAction: actionType.userMeFail,
      authorization: null
    });
  } catch (error) {
    console.error('Fetch profile failed:', error);
    yield put(actionType.userMeFail({
      message: error.message || 'Failed to fetch user.',
      status: 500
    }));
    yield call(toast.error, 'Failed to load user details.', { autoClose: 3000 });
  }
}

function* userMe() {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/vendors/profile`,
      method: 'GET',
      successAction: actionType.userMeSuccess,  
      failAction: actionType.userMeFail,        
      authorization: null                       
    });
    

  } catch (error) {
    console.error('Fetch User failed:', error);
    yield put(
      actionType.userMeFail({
        message: error.message || 'Failed to fetch user.',
        status: 500
      })
    );
    yield call(toast.error, 'Failed to load user details.', { autoClose: 3000 });
  }
}

export default function* LoginActionWatcher() {
  yield takeEvery(actionType.userLogin, login);
  yield takeEvery(actionType.userMe, userMe);
}