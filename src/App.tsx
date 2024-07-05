import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './containers/Home/Home';
import Admin from './containers/Admin/Admin';
import Toolbar from './components/Toolbar/Toolbar';

const App: React.FC = () => {
  return (
    <>
      <header>
        <Toolbar />
      </header>
      <main className="container-fluid">
        <Routes>
          <Route path="/pages/:pageName" element={<Home />} />
          <Route path="/pages/admin" element={<Admin />} />
          <Route path="*" element={<h1>Not found!</h1>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
