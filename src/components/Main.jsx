import React, { useState } from 'react';
import Task from './Task';

const Main = () => {
  const [activeTab, setActiveTab] = useState('taskgui');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <main className="col-md-9 ms-sm col-lg-10 px-md-4 main">
      <div className="main-container">
        <div className={`container mt-4 taskgui ${activeTab === 'taskgui' ? 'active' : ''}`}>
          <Task />
        </div>
        {/* Outras divs para as guias restantes aqui */}
      </div>
    </main>
  );
};

export default Main;
