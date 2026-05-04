// import React from 'react';
// import SupportTypesCard from './SupportTypesCard';

// const SupportTypes = () => {
//   return <SupportTypesCard />;
// };

// export default SupportTypes;



import React, { useState } from 'react';
import SupportTypesCard from './SupportTypesCard';
import AddSupportTypeForm from './AddSupportTypeForm';

const SupportTypesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      {showAddForm ? (
        <AddSupportTypeForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      ) : (
        <SupportTypesCard
          onAdd={() => setShowAddForm(true)}
        />
      )}
    </>
  );
};

export default SupportTypesPage;