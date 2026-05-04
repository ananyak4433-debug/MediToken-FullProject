import { put, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

function* commonApi(value) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  // Optional Authorization
  if (value.authorization) {
    headers.Authorization = value.authorization;
  }

  try {
    const response = yield call(fetch, value.api, {
      method: value.method,
      headers,
      body: value.body || null,
      credentials: 'include', // ✅ for cookies
       mode: 'cors',
       cache: 'no-store'
    });

    let data = {};

    // ✅ Safely parse JSON (even for error responses)
    try {
      if (response.status !== 204) {
        data = yield call([response, 'json']);
      }
    } catch (e) {
      data = { message: 'Invalid JSON response from server' };
    }

    if (!response.ok) {
      if (response.status === 401) {
        yield call(
          toast.error,
          data.message || 'Session expired. Please login again.',
          { autoClose: 3000 }
        );
        return;
      }

     
      throw {
        message: data.message || 'Request failed',
        status: response.status
      };
    }
console.log('📡 Response status:', response.status);
console.log('📦 Response data:', data);
console.log('✅ Success action type:', value.successAction.type);


    
    yield put({
      type: value.successAction.type,
      payload: data
    });

    return data;

  } catch (error) {
    console.error('API error:', error);

    // ✅ Failure dispatch (ONLY serializable data)
    yield put({
      type: value.failAction.type,
      payload: {
        message: error.message || 'Something went wrong',
        status: error.status || 500
      }
    });

    // ✅ Show actual backend error if available
    yield call(
      toast.error,
      error.message || 'Something went wrong',
      { autoClose: 3000 }
    );
  }
}

export default commonApi;