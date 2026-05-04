// import { combineReducers } from 'redux';

// // reducer import
// import customizationReducer from './customizationReducer';
// import loginReducer from 'container/LoginContainer/slice';
// import ratingReducer from 'container/RatingContainer/slice';




// // ==============================|| COMBINE REDUCER ||============================== //

// const reducer = combineReducers({
//   login: loginReducer,
//   customization: customizationReducer,
//   rating: ratingReducer,
// });

// export default reducer;




// import { combineReducers } from 'redux';

// import customizationReducer from './customizationReducer';
// import loginReducer from 'container/LoginContainer/slice';
// // import ratingReducer from 'container/RatingContainer/slice';

// import staffReducer from 'container/StaffContainer/slice';
// import doctorReducer from 'container/DoctorContainer/slice';
// import patientReducer from 'container/PatientContainer/slice';

// const reducer = combineReducers({
//   login: loginReducer,
//   customization: customizationReducer,


//   staff: staffReducer,
//   doctors: doctorReducer,
//   patients: patientReducer
// });

// export default reducer;



import { combineReducers } from 'redux';

import customizationReducer from './customizationReducer';
import loginReducer from 'container/LoginContainer/slice';
import staffReducer from 'container/StaffContainer/slice';
import doctorReducer from 'container/DoctorContainer/slice';
import patientReducer from 'container/PatientContainer/slice';
import appointmentReducer from 'container/TokenQueueContainer/slice'; 
import bookingReducer from 'container/BookingContainer/slice';
import supportReducer from 'container/SupportContainer/slice';

const reducer = combineReducers({
  login: loginReducer,
  customization: customizationReducer,
  staff: staffReducer,
  doctors: doctorReducer,
  patients: patientReducer,
  appointments: appointmentReducer ,
  bookings: bookingReducer ,
  support: supportReducer
});

export default reducer;