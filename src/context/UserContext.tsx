import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  const resetUser = () => setUser(null); // Reset user

  const updateUser = (newUserData: any) => {
    setUser(newUserData); // Update user with new data
  };

  return (
    <UserContext.Provider value={{ user, setUser, resetUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
