// __mocks__/react-fontawesome.js

import React from 'react';

const FontAwesomeIcon = ({ icon }) => {
  // You can customize this mock behavior as per your requirements
  return <span data-testid="font-awesome-icon">{icon}</span>;
};

export { FontAwesomeIcon };
