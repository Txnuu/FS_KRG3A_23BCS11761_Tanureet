import React, { createContext, useState } from 'react';

export const UserContext = createContext({
  username: '',
  isLoggedIn: false,
});

export const UserProvider = ({ children }) => {
  const [user] = useState({
    username: 'Arjun',
    isLoggedIn: true,
  });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

