import { takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';

import {
  getVendorsRequest, getVendorsSuccess, getVendorsFailure,
  addVendorRequest, addVendorSuccess, addVendorFailure,
  editVendorRequest, editVendorSuccess, editVendorFailure,  // ✅
  deleteVendorRequest, deleteVendorSuccess, deleteVendorFailure
} from './slice';

// GET ALL VENDORS
function* getVendorsSaga() {
  try {
    const res = yield call(() => axios.get('/api/vendors/allVendors', { withCredentials: true }));
    yield put(getVendorsSuccess(res.data));
  } catch (err) {
    yield put(getVendorsFailure(err.response?.data?.message || 'Failed to fetch vendors'));
  }
}

// ADD VENDOR
function* addVendorSaga(action) {
  try {
    const res = yield call(() => axios.post('/api/vendors/signup', action.payload, { withCredentials: true }));
    yield put(addVendorSuccess(res.data.vendor));
  } catch (err) {
    yield put(addVendorFailure(err.response?.data?.message || 'Failed to add vendor'));
  }
}

// EDIT VENDOR ✅
function* editVendorSaga(action) {
  try {
    const { id, ...data } = action.payload;
    const res = yield call(() =>
      axios.put(`/api/vendors/${id}`, data, { withCredentials: true })
    );
    yield put(editVendorSuccess(res.data.vendor || res.data));
    yield put(getVendorsRequest()); // ✅ refresh list
  } catch (err) {
    yield put(editVendorFailure(err.response?.data?.message || 'Failed to update vendor'));
  }
}

// DELETE VENDOR
function* deleteVendorSaga(action) {
  try {
    yield call(() => axios.delete(`/api/vendors/${action.payload}`, { withCredentials: true }));
    yield put(deleteVendorSuccess(action.payload));
  } catch (err) {
    yield put(deleteVendorFailure(err.response?.data?.message || 'Failed to delete vendor'));
  }
}

// WATCHER
export default function* vendorSaga() {
  yield takeLatest(getVendorsRequest.type, getVendorsSaga);
  yield takeLatest(addVendorRequest.type, addVendorSaga);
  yield takeLatest(editVendorRequest.type, editVendorSaga);   // ✅
  yield takeLatest(deleteVendorRequest.type, deleteVendorSaga);
}