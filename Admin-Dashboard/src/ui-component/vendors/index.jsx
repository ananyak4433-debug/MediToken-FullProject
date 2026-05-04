// import React, { useState } from 'react';
// import VendorsCard from './VendorsCard';
// import AddVendorForm from './AddVendorForm';

// const Vendors = () => {
//   const [showForm, setShowForm] = useState(false);

//   return showForm ? (
//     <AddVendorForm onCancel={() => setShowForm(false)} />
//   ) : (
//     <VendorsCard onAdd={() => setShowForm(true)} />
//   );
// };

// export default Vendors;






// import React, { useState } from 'react';

// import VendorsCard from './VendorsCard';
// import AddVendorForm from './AddVendorForm';

// const VendorsPage = () => {
//   const [showAddForm, setShowAddForm] = useState(false);

//   return (
//     <>
//       {showAddForm ? (
//         <AddVendorForm
//           onCancel={() => setShowAddForm(false)}
//           onSuccess={() => setShowAddForm(false)}
//         />
//       ) : (
//         <VendorsCard
//           onAdd={() => setShowAddForm(true)}
//         />
//       )}
//     </>
//   );
// };

// export default VendorsPage;





import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getVendorsRequest } from 'container/VendorContainer/slice';

import VendorsCard from './VendorsCard';
import AddVendorForm from './AddVendorForm';

const VendorsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const dispatch = useDispatch();

  const handleSuccess = () => {
    setShowAddForm(false);
    setTimeout(() => {
      dispatch(getVendorsRequest());
    }, 500);
  };

  return (
    <>
      {showAddForm ? (
        <AddVendorForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={handleSuccess}
        />
      ) : (
        <VendorsCard
          onAdd={() => setShowAddForm(true)}
        />
      )}
    </>
  );
};

export default VendorsPage;