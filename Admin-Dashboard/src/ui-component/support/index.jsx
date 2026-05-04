import React, { useState } from 'react';

import SupportCard from './SupportCard';
import SupportDetail from './SupportDetails';

const SupportPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <>
      {selectedTicket ? (
        <SupportDetail
          ticket={selectedTicket}
          onBack={() => setSelectedTicket(null)}
        />
      ) : (
        <SupportCard
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        />
      )}
    </>
  );
};

export default SupportPage;