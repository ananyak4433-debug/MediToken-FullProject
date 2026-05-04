// import { takeEvery, call, put } from 'redux-saga/effects';
// import commonApi from '../api';
// import appConfig from '../../config';
// import * as actionType from './slice';

// /* ================= GET STAFF ================= */
// function* fetchStaff() {
//   try {
//     const params = {
//       api: `${appConfig.ip}/staff/all`,
//       method: 'GET',
//       successAction: actionType.getStaffSuccess, // ✅ reference, not called
//       failAction: actionType.getStaffFail,
//       authorization: null
//     };

//     yield call(commonApi, params);

//   } catch (error) {
//     yield put(actionType.getStaffFail(error.message || 'Failed to fetch staff'));
//   }
// }

// /* ================= ADD STAFF ================= */
// function* addStaff(action) {
//   try {
//     const params = {
//       api: `${appConfig.ip}/staff/signup`,
//       method: 'POST',
//       successAction: actionType.addStaffSuccess, // ✅ fixed — no ()
//       failAction: actionType.addStaffFail,        // ✅ fixed — no ()
//       authorization: null,
//       body: JSON.stringify(action.payload)
//     };

//     yield call(commonApi, params);
//     yield put(actionType.getStaff());

//   } catch (error) {
//     yield put(actionType.addStaffFail(error.message || 'Failed to add staff'));
//   }
// }

// /* ================= EDIT STAFF ================= */
// function* editStaff(action) {
//   try {
//     const { id, ...data } = action.payload;

//     const params = {
//       api: `${appConfig.ip}/staff/${id}`,
//       method: 'PUT',
//       successAction: actionType.editStaffSuccess,
//       failAction: actionType.editStaffFail,
//       authorization: null,
//       body: JSON.stringify(data)
//     };

//     yield call(commonApi, params);
//     yield put(actionType.getStaff()); // ✅ refresh list after edit

//   } catch (error) {
//     yield put(actionType.editStaffFail(error.message || 'Failed to update staff'));
//   }
// }

// /* ================= DELETE STAFF ================= */
// function* deleteStaff(action) {
//   try {
//     const params = {
//       api: `${appConfig.ip}/staff/${action.payload}`,
//       method: 'DELETE',
//       successAction: actionType.deleteStaffSuccess,
//       failAction: actionType.deleteStaffFail,
//       authorization: null
//     };

//     yield call(commonApi, params);
//     yield put(actionType.getStaff()); // ✅ refresh list after delete

//   } catch (error) {
//     yield put(actionType.deleteStaffFail(error.message || 'Failed to delete staff'));
//   }
// }

// /* ================= WATCHER ================= */
// export default function* staffActionWatcher() {
//   yield takeEvery(actionType.getStaff.type, fetchStaff);
//   yield takeEvery(actionType.addStaff.type, addStaff);
//   yield takeEvery(actionType.editStaff.type, editStaff);
//   yield takeEvery(actionType.deleteStaff.type, deleteStaff);
// }




// import { takeEvery, call, put, select } from 'redux-saga/effects';  // ✅ add select
// import commonApi from '../api';
// import appConfig from '../../config';
// import * as actionType from './slice';

// // ✅ selector to get vendorId from Redux state
// const getVendorId = (state) => state?.login?.userData?._id || state?.login?.userData?.id;

// function* fetchStaff() {
//   try {
//     const vendorId = yield select(getVendorId);  // ✅ get logged-in vendor's ID
//      console.log('🔑 vendorId in saga:', vendorId);
//   console.log('👥 Staff count returned:', staffList?.length);

//     if (!vendorId) {
//       console.warn('No vendorId found — skipping fetchStaff');
//       return;
//     }

//     yield call(commonApi, {
//       api: `${appConfig.ip}/staff/all?vendorId=${vendorId}`,  // ✅ filter by vendor
//       method: 'GET',
//       successAction: actionType.getStaffSuccess,
//       failAction: actionType.getStaffFail
//     });
//   } catch (error) {
//     yield put(actionType.getStaffFail(error.message || 'Failed to fetch staff'));
//   }
// }

// function* addStaff(action) {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/staff/signup`,
//       method: 'POST',
//       successAction: actionType.addStaffSuccess,
//       failAction: actionType.addStaffFail,
//       body: JSON.stringify(action.payload)
//     });
//     yield put(actionType.getStaff());
//   } catch (error) {
//     yield put(actionType.addStaffFail(error.message || 'Failed to add staff'));
//   }
// }

// function* editStaff(action) {
//   try {
//     const { id, ...data } = action.payload;
//     yield call(commonApi, {
//       api: `${appConfig.ip}/staff/${id}`,
//       method: 'PUT',
//       successAction: actionType.editStaffSuccess,
//       failAction: actionType.editStaffFail,
//       body: JSON.stringify(data)
//     });
//     yield put(actionType.getStaff());
//   } catch (error) {
//     yield put(actionType.editStaffFail(error.message || 'Failed to update staff'));
//   }
// }

// function* deleteStaff(action) {
//   try {
//     yield call(commonApi, {
//       api: `${appConfig.ip}/staff/${action.payload}`,
//       method: 'DELETE',
//       successAction: actionType.deleteStaffSuccess,
//       failAction: actionType.deleteStaffFail
//     });
//     yield put(actionType.getStaff());
//   } catch (error) {
//     yield put(actionType.deleteStaffFail(error.message || 'Failed to delete staff'));
//   }
// }

// export default function* staffActionWatcher() {
//   yield takeEvery(actionType.getStaff.type, fetchStaff);
//   yield takeEvery(actionType.addStaff.type, addStaff);
//   yield takeEvery(actionType.editStaff.type, editStaff);
//   yield takeEvery(actionType.deleteStaff.type, deleteStaff);
// }











import { takeEvery, call, put, select } from 'redux-saga/effects';
import commonApi from '../api';
import appConfig from '../../config';
import * as actionType from './slice';

const getVendorId = (state) => state?.login?.userData?._id || state?.login?.userData?.id;

function* fetchStaff() {
  try {
    const vendorId = yield select(getVendorId);
    console.log('🔑 fetchStaff vendorId:', vendorId);

    if (!vendorId) {
      console.warn('No vendorId — skipping fetchStaff');
      return;
    }

    yield call(commonApi, {
      api: `${appConfig.ip}/staff/all`,   // ✅ backend uses cookie, no need for ?vendorId
      method: 'GET',
      successAction: actionType.getStaffSuccess,
      failAction: actionType.getStaffFail
    });
  } catch (error) {
    yield put(actionType.getStaffFail(error.message || 'Failed to fetch staff'));
  }
}

function* addStaff(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/staff/signup`,
      method: 'POST',
      successAction: actionType.addStaffSuccess,
      failAction: actionType.addStaffFail,
      body: JSON.stringify(action.payload)
    });
    yield put(actionType.getStaff());  // ✅ refresh list
  } catch (error) {
    yield put(actionType.addStaffFail(error.message || 'Failed to add staff'));
  }
}

function* editStaff(action) {
  try {
    const { id, ...data } = action.payload;
    yield call(commonApi, {
      api: `${appConfig.ip}/staff/${id}`,
      method: 'PUT',
      successAction: actionType.editStaffSuccess,
      failAction: actionType.editStaffFail,
      body: JSON.stringify(data)
    });
    yield put(actionType.getStaff());  // ✅ refresh list
  } catch (error) {
    yield put(actionType.editStaffFail(error.message || 'Failed to update staff'));
  }
}

function* deleteStaff(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/staff/${action.payload}`,
      method: 'DELETE',
      successAction: actionType.deleteStaffSuccess,
      failAction: actionType.deleteStaffFail
    });
    yield put(actionType.getStaff());  // ✅ refresh list
  } catch (error) {
    yield put(actionType.deleteStaffFail(error.message || 'Failed to delete staff'));
  }
}

export default function* staffActionWatcher() {
  yield takeEvery(actionType.getStaff.type, fetchStaff);
  yield takeEvery(actionType.addStaff.type, addStaff);
  yield takeEvery(actionType.editStaff.type, editStaff);
  yield takeEvery(actionType.deleteStaff.type, deleteStaff);
}