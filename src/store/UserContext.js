import React, { createContext, useContext, useState, useEffect } from "react";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    name: "",
    token: "",
    userId: null,
  });
  const [tasks, setTasks] = useState([]);

  const value = {
    user,
    setUser,
    tasks,
    setTasks,
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  return useContext(UserContext);
};
