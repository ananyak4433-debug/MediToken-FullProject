import React from 'react';
import NavLogo from 'assets/images/logo3-bg.png';

function Logo() {
  return (
    <div>
      <img src={NavLogo} alt="FSD" loading="lazy" height={80} />
    </div>
  );
}

export default Logo;
