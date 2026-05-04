// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getStaff } from 'container/StaffContainer/slice';

// const StaffPage = () => {
//   const dispatch = useDispatch();
//   const { staffList, loading } = useSelector((state) => state.staff);

//   useEffect(() => {
//     dispatch(getStaff());
//   }, [dispatch]);

//   return (
//     <div>
//       <h2>Staff List</h2>

//       {loading && <p>Loading...</p>}

//       {staffList?.map((s) => (
//         <div key={s._id}>
//           <p>{s.name}</p>
//           <p>{s.email}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StaffPage;