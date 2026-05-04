// import { takeEvery, call, put } from 'redux-saga/effects';
// import commonApi from '../api';
// import appConfig from '../../config';
// import * as actionType from './slice';

// /* ================= GET DOCTORS ================= */
// function* fetchDoctors() {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/doctors/allDoctors`,
//       method: 'GET',
//       successAction: actionType.getDoctorsSuccess,
//       failAction: actionType.getDoctorsFail
//     });
//   } catch (error) {
//     yield put(actionType.getDoctorsFail(error.message));
//   }
// }

// /* ================= ADD DOCTOR ================= */
// function* addDoctorSaga(action) {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/doctors/create`,
//       method: 'POST',
//       successAction: actionType.addDoctorSuccess,
//       failAction: actionType.addDoctorFail,
//       body: JSON.stringify(action.payload)
//     });
//     yield put(actionType.getDoctors());
//   } catch (error) {
//     yield put(actionType.addDoctorFail(error.message));
//   }
// }

// /* ================= EDIT DOCTOR ================= */
// function* editDoctorSaga(action) {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/doctors/${action.payload._id}`,
//       method: 'PUT',
//       successAction: actionType.editDoctorSuccess,
//       failAction: actionType.editDoctorFail,
//       body: JSON.stringify(action.payload)
//     });
//     yield put(actionType.getDoctors()); // 🔥 refresh list
//   } catch (error) {
//     yield put(actionType.editDoctorFail(error.message));
//   }
// }

// /* ================= DELETE DOCTOR ================= */
// function* removeDoctorSaga(action) {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/doctors/${action.payload}`,
//       method: 'DELETE',
//       successAction: actionType.removeDoctorSuccess,
//       failAction: actionType.removeDoctorFail
//     });
//     yield put(actionType.getDoctors()); // 🔥 refresh list
//   } catch (error) {
//     yield put(actionType.removeDoctorFail(error.message));
//   }
// }

// /* ================= WATCHER ================= */
// export default function* doctorsWatcher() {
//   yield takeEvery(actionType.getDoctors.type, fetchDoctors);
//   yield takeEvery(actionType.addDoctor.type, addDoctorSaga);
//   yield takeEvery(actionType.editDoctor.type, editDoctorSaga);
//   yield takeEvery(actionType.removeDoctor.type, removeDoctorSaga);
// }




import { takeEvery, call, put, select } from 'redux-saga/effects';  // ✅ add select
import commonApi from '../api';
import appConfig from '../../config';
import * as actionType from './slice';

// ✅ selector to get vendorId from Redux state
const getVendorId = (state) => state?.login?.userData?._id || state?.login?.userData?.id;

function* fetchDoctors() {
  try {
    const vendorId = yield select(getVendorId);  // ✅ get logged-in vendor's ID

    if (!vendorId) {
      console.warn('No vendorId found — skipping fetchDoctors');
      return;
    }

    yield call(commonApi, {
      api: `${appConfig.ip}/doctors/allDoctors?vendorId=${vendorId}`,  // ✅ filter by vendor
      method: 'GET',
      successAction: actionType.getDoctorsSuccess,
      failAction: actionType.getDoctorsFail
    });
  } catch (error) {
    yield put(actionType.getDoctorsFail(error.message));
  }
}

function* addDoctorSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/doctors/create`,
      method: 'POST',
      successAction: actionType.addDoctorSuccess,
      failAction: actionType.addDoctorFail,
      body: JSON.stringify(action.payload)
    });
    yield put(actionType.getDoctors());
  } catch (error) {
    yield put(actionType.addDoctorFail(error.message));
  }
}

function* editDoctorSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/doctors/${action.payload._id}`,
      method: 'PUT',
      successAction: actionType.editDoctorSuccess,
      failAction: actionType.editDoctorFail,
      body: JSON.stringify(action.payload)
    });
    yield put(actionType.getDoctors());
  } catch (error) {
    yield put(actionType.editDoctorFail(error.message));
  }
}

function* removeDoctorSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/doctors/${action.payload}`,
      method: 'DELETE',
      successAction: actionType.removeDoctorSuccess,
      failAction: actionType.removeDoctorFail
    });
    yield put(actionType.getDoctors());
  } catch (error) {
    yield put(actionType.removeDoctorFail(error.message));
  }
}

export default function* doctorsWatcher() {
  yield takeEvery(actionType.getDoctors.type, fetchDoctors);
  yield takeEvery(actionType.addDoctor.type, addDoctorSaga);
  yield takeEvery(actionType.editDoctor.type, editDoctorSaga);
  yield takeEvery(actionType.removeDoctor.type, removeDoctorSaga);
}