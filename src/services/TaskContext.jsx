import React, { createContext, useContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);