import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import appConfig from '../../config';
import * as actionType from './slice';

/* ================= GET VENDOR APPOINTMENTS ================= */
function* fetchAppointments() {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/appointments/vendor`  ,    
      method: 'GET',
      successAction: actionType.getAppointmentsSuccess,  // ✅ no ()
      failAction: actionType.getAppointmentsFail          // ✅ no ()
    });
    console.log("🎟 Token Number:", response?.data?.data?.tokenNumber);
  } catch (error) {
    yield put(actionType.getAppointmentsFail(error.message));
  }
}

/* ================= UPDATE STATUS ================= */
function* updateStatusSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/appointments/${action.payload.id}`,
      method: 'PUT',
      successAction: actionType.updateAppointmentStatusSuccess,  // ✅
      failAction: actionType.updateAppointmentStatusFail,         // ✅
      body: JSON.stringify({ status: action.payload.status })
    });
    yield put(actionType.getAppointments()); // ✅ refresh list
  } catch (error) {
    yield put(actionType.updateAppointmentStatusFail(error.message));
  }
}

/* ================= WATCHER ================= */
export default function* appointmentWatcher() {
  yield takeEvery(actionType.getAppointments.type, fetchAppointments);
  yield takeEvery(actionType.updateAppointmentStatus.type, updateStatusSaga);
}