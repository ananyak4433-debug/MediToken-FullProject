import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';

import {
  getAllRequestsRequest, getAllRequestsSuccess, getAllRequestsFailure,
  updateStatusRequest,   updateStatusSuccess,  updateStatusFailure,
  replyToRequestRequest, replyToRequestSuccess, replyToRequestFailure,
  deleteRequestRequest,  deleteRequestSuccess,  deleteRequestFailure
} from './slice';

// GET ALL
function* getAllRequestsSaga() {
  try {
    const res = yield call(() =>
      axios.get('/api/admin/support/getall', { withCredentials: true })
    );
    yield put(getAllRequestsSuccess(res.data));
  } catch (err) {
    yield put(getAllRequestsFailure(err.response?.data?.message || 'Failed to fetch requests'));
  }
}

// UPDATE STATUS
function* updateStatusSaga(action) {
  try {
    const { id, status } = action.payload;
    const res = yield call(() =>
      axios.put(`/api/admin/support/${id}/status`, { status }, { withCredentials: true })
    );
    yield put(updateStatusSuccess(res.data.request));
  } catch (err) {
    yield put(updateStatusFailure(err.response?.data?.message || 'Failed to update status'));
  }
}

// REPLY
function* replyToRequestSaga(action) {
  try {
    const { id, message } = action.payload;
    const res = yield call(() =>
      axios.post(`/api/admin/support/${id}/reply`, { message }, { withCredentials: true })
    );
    yield put(replyToRequestSuccess(res.data.request));
  } catch (err) {
    yield put(replyToRequestFailure(err.response?.data?.message || 'Failed to send reply'));
  }
}

// DELETE
function* deleteRequestSaga(action) {
  try {
    yield call(() =>
      axios.delete(`/api/admin/support/${action.payload}`, { withCredentials: true })
    );
    yield put(deleteRequestSuccess(action.payload));
  } catch (err) {
    yield put(deleteRequestFailure(err.response?.data?.message || 'Failed to delete request'));
  }
}

// WATCHER
export default function* supportRequestSaga() {
  yield takeLatest(getAllRequestsRequest.type,  getAllRequestsSaga);
  yield takeLatest(updateStatusRequest.type,    updateStatusSaga);
  yield takeLatest(replyToRequestRequest.type,  replyToRequestSaga);
  yield takeLatest(deleteRequestRequest.type,   deleteRequestSaga);
}