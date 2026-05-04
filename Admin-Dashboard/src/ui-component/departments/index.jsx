// import React, { useState } from 'react';
// import DepartmentsCard from './DepartmentsCard';
// import AddDepartmentForm from './AddDepartmentForm';

// const Departments = () => {
//   const [showForm, setShowForm] = useState(false);

//   return showForm ? (
//     <AddDepartmentForm onCancel={() => setShowForm(false)} />
//   ) : (
//     <DepartmentsCard onAdd={() => setShowForm(true)} />
//   );
// };

// export default Departments;





import React, { useState } from 'react';

import DepartmentsCard from './DepartmentsCard';
import AddDepartmentForm from './AddDepartmentForm';

const DepartmentsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      {showAddForm ? (
        <AddDepartmentForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      ) : (
        <DepartmentsCard
          onAdd={() => setShowAddForm(true)}
        />
      )}
    </>
  );
};

export default DepartmentsPage;