// import { combineReducers } from 'redux';

// import customizationReducer from './customizationReducer';
// import loginReducer from 'container/LoginContainer/slice';

// import staffReducer from 'container/StaffContainer/slice';
// import doctorReducer from 'container/DoctorContainer/slice';
// import departmentsReducer from 'container/departmentsContainer/slice';

// const reducer = combineReducers({
//   login: loginReducer,
//   customization: customizationReducer,
//   staff: staffReducer,
//   doctor: doctorReducer,
//   departments: departmentsReducer
// });

// export default reducer;




import { combineReducers } from 'redux';

import customizationReducer from './customizationReducer';
import loginReducer from 'container/LoginContainer/slice';
import departmentsReducer from 'container/departmentsContainer/slice';
import vendorReducer from 'container/VendorContainer/slice';
import supportTypeReducer from 'container/SupportTypeContainer/slice';
import supportRequestReducer from 'container/SupportRequestContainer/slice';


const reducer = combineReducers({
  login: loginReducer,
  customization: customizationReducer,
  departments: departmentsReducer,
  vendors: vendorReducer,
  supportType: supportTypeReducer,
  supportRequests: supportRequestReducer
});

export default reducer;