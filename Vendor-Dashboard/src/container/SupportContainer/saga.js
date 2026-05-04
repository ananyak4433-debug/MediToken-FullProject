
// import { takeEvery, call, put } from 'redux-saga/effects';
// import commonApi from '../api';
// import appConfig from '../../config';
// import * as actionType from './slice';

// /* ===== GET SUPPORT TYPES ===== */
// function* fetchDepartments() {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/admin/support-types/getall`,
//       method: 'GET',
//       successAction: actionType.getDepartmentsSuccess,
//       failAction: actionType.getDepartmentsFail
//     });
//   } catch (error) {
//     yield put(actionType.getDepartmentsFail(error.message || 'Failed to fetch support types'));
//   }
// }

// /* ===== SUBMIT SUPPORT REQUEST ===== */
// function* submitSupportSaga(action) {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/vendor/support/create`,
//       method: 'POST',
//       successAction: actionType.submitSupportSuccess,
//       failAction: actionType.submitSupportFail,
//       body: JSON.stringify(action.payload)
//     });
//   } catch (error) {
//     yield put(actionType.submitSupportFail(error.message || 'Failed to submit request'));
//   }
// }

// /* ===== GET MY REQUESTS ===== */
// function* getMyRequestsSaga() {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/vendor/support/my`,
//       method: 'GET',
//       successAction: actionType.getMyRequestsSuccess,
//       failAction: actionType.getMyRequestsFail
//     });
//   } catch (error) {
//     yield put(actionType.getMyRequestsFail(error.message || 'Failed to fetch requests'));
//   }
// }

// /* ===== WATCHER ===== */
// export default function* supportActionWatcher() {
//   yield takeEvery(actionType.getDepartments.type,  fetchDepartments);
//   yield takeEvery(actionType.submitSupport.type,   submitSupportSaga);
//   yield takeEvery(actionType.getMyRequests.type,   getMyRequestsSaga);
// }




import { takeEvery, call, put, select } from 'redux-saga/effects';  // ✅ add select
import commonApi from '../api';
import appConfig from '../../config';
import * as actionType from './slice';

const getVendorId = (state) => state?.login?.userData?._id || state?.login?.userData?.id;

/* ===== GET SUPPORT TYPES ===== */
function* fetchDepartments() {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/admin/support-types/getall`,  // ✅ now public
      method: 'GET',
      successAction: actionType.getDepartmentsSuccess,
      failAction: actionType.getDepartmentsFail
    });
  } catch (error) {
    yield put(actionType.getDepartmentsFail(error.message || 'Failed to fetch support types'));
  }
}

/* ===== SUBMIT SUPPORT REQUEST ===== */
function* submitSupportSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/vendor/support/create`,
      method: 'POST',
      successAction: actionType.submitSupportSuccess,
      failAction: actionType.submitSupportFail,
      body: JSON.stringify(action.payload)
    });
    // ✅ refresh requests after submit
    yield put(actionType.getMyRequests());
  } catch (error) {
    yield put(actionType.submitSupportFail(error.message || 'Failed to submit request'));
  }
}

/* ===== GET MY REQUESTS ===== */
function* getMyRequestsSaga() {
  try {
    const vendorId = yield select(getVendorId);
    if (!vendorId) {
      console.warn('No vendorId — skipping getMyRequests');
      return;
    }
    yield call(commonApi, {
      api: `${appConfig.ip}/vendor/support/my`,
      method: 'GET',
      successAction: actionType.getMyRequestsSuccess,
      failAction: actionType.getMyRequestsFail
    });
  } catch (error) {
    yield put(actionType.getMyRequestsFail(error.message || 'Failed to fetch requests'));
  }
}

/* ===== WATCHER ===== */
export default function* supportActionWatcher() {
  yield takeEvery(actionType.getDepartments.type, fetchDepartments);
  yield takeEvery(actionType.submitSupport.type,  submitSupportSaga);
  yield takeEvery(actionType.getMyRequests.type,  getMyRequestsSaga);
}