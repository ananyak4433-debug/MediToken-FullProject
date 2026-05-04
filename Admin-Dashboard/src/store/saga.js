// import { all, call } from 'redux-saga/effects';

// import LoginActionWatcher from 'container/LoginContainer/saga';
// import staffActionWatcher from 'container/StaffContainer/saga';
// import doctorsWatcher from 'container/DoctorContainer/saga';
// import departmentSaga from 'container/departmentsContainer/saga';

// function* rootSaga() {
//   yield all([
//     call(LoginActionWatcher),
//     call(staffActionWatcher),
//     call(doctorsWatcher),
//     call(departmentSaga)
//   ]);
// }

// export default rootSaga;


import { all, call } from 'redux-saga/effects';

import LoginActionWatcher from 'container/LoginContainer/saga';
import departmentSaga from 'container/departmentsContainer/saga';
import vendorSaga from 'container/VendorContainer/saga';
import supportTypeSaga from 'container/SupportTypeContainer/saga';
import supportRequestSaga from 'container/SupportRequestContainer/saga';

function* rootSaga() {
  yield all([
    call(LoginActionWatcher),
    call(departmentSaga),
    call(vendorSaga),
    call(supportTypeSaga),
    call(supportRequestSaga)
  ]);
}

export default rootSaga;