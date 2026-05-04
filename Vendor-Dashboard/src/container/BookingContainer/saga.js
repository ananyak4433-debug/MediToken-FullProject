import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import appConfig from '../../config';
import * as actionType from './slice';

function* fetchBookings(action) {
  try {
    const date = action.payload?.date || '';
    yield call(commonApi, {
      api: `${appConfig.ip}/appointments/vendor/all${date ? `?date=${date}` : ''}`,
      method: 'GET',
      successAction: actionType.getBookingsSuccess,
      failAction: actionType.getBookingsFail
    });
  } catch (error) {
    yield put(actionType.getBookingsFail(error.message));
  }
}

function* cancelBookingSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/appointments/${action.payload.id}`,
      method: 'PUT',
      successAction: actionType.cancelBookingSuccess,
      failAction: actionType.cancelBookingFail,
      body: JSON.stringify({ status: 'cancelled' })
    });
    yield put(actionType.getBookings()); 
  } catch (error) {
    yield put(actionType.cancelBookingFail(error.message));
  }
}

function* updateBookingStatusSaga(action) {
  try {
    yield call(commonApi, {
      api: `${appConfig.ip}/appointments/${action.payload.id}`,
      method: 'PUT',
      successAction: actionType.updateBookingStatusSuccess,
      failAction: actionType.updateBookingStatusFail,
      body: JSON.stringify({ status: action.payload.status })
    });
    yield put(actionType.getBookings());
  } catch (error) {
    yield put(actionType.updateBookingStatusFail(error.message));
  }
}

export default function* bookingWatcher() {
  yield takeEvery(actionType.getBookings.type, fetchBookings);
  yield takeEvery(actionType.cancelBooking.type, cancelBookingSaga); 
  yield takeEvery(actionType.updateBookingStatus.type, updateBookingStatusSaga);
}
