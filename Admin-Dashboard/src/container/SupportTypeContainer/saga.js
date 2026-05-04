import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';

import {
  getSupportTypesRequest, getSupportTypesSuccess, getSupportTypesFailure,
  addSupportTypeRequest, addSupportTypeSuccess, addSupportTypeFailure,
  editSupportTypeRequest, editSupportTypeSuccess, editSupportTypeFailure,
  deleteSupportTypeRequest, deleteSupportTypeSuccess, deleteSupportTypeFailure
} from './slice';

// GET ALL
function* getSupportTypesSaga() {
  try {
    const res = yield call(() =>
      axios.get('/api/admin/support-types/getall', { withCredentials: true })
    );
    yield put(getSupportTypesSuccess(res.data.supportTypes));
  } catch (err) {
    yield put(getSupportTypesFailure(err.response?.data?.message));
  }
}

// CREATE
function* addSupportTypeSaga(action) {
  try {
    const res = yield call(() =>
      axios.post('/api/admin/support-types/create', action.payload, { withCredentials: true })
    );
    yield put(addSupportTypeSuccess(res.data.supportType));
  } catch (err) {
    yield put(addSupportTypeFailure(err.response?.data?.message));
  }
}

// EDIT
function* editSupportTypeSaga(action) {
  try {
    const { id, ...data } = action.payload;
    const res = yield call(() =>
      axios.put(`/api/admin/support-types/${id}`, data, { withCredentials: true })
    );
    yield put(editSupportTypeSuccess(res.data.supportType));
    yield put(getSupportTypesRequest()); // refresh list
  } catch (err) {
    yield put(editSupportTypeFailure(err.response?.data?.message));
  }
}

// DELETE
function* deleteSupportTypeSaga(action) {
  try {
    yield call(() =>
      axios.delete(`/api/admin/support-types/delete/${action.payload}`, { withCredentials: true })
    );
    yield put(deleteSupportTypeSuccess(action.payload));
  } catch (err) {
    yield put(deleteSupportTypeFailure(err.response?.data?.message));
  }
}

// WATCHER
export default function* supportTypeSaga() {
  yield takeLatest(getSupportTypesRequest.type, getSupportTypesSaga);
  yield takeLatest(addSupportTypeRequest.type, addSupportTypeSaga);
  yield takeLatest(editSupportTypeRequest.type, editSupportTypeSaga);
  yield takeLatest(deleteSupportTypeRequest.type, deleteSupportTypeSaga);
}