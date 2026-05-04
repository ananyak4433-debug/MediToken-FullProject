import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
  getPatientsRequest,
  getPatientsSuccess,
  getPatientsFailure
} from './slice';

// 🔗 API
const fetchPatientsApi = () =>
  axios.get('http://localhost:7000/api/patients/getAll');

// 🧠 Worker Saga
function* fetchPatients() {
  try {
    const res = yield call(fetchPatientsApi);

    let data = [];

    // ✅ handle all formats safely
    if (Array.isArray(res.data)) {
      data = res.data;
    } else if (Array.isArray(res.data.patients)) {
      data = res.data.patients;
    } else if (Array.isArray(res.data.data)) {
      data = res.data.data;
    }

    yield put(getPatientsSuccess(data));

  } catch (error) {
    yield put(
      getPatientsFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

// 👂 Watcher
function* patientActionWatcher() {
  yield takeLatest(getPatientsRequest.type, fetchPatients);
}

export default patientActionWatcher;