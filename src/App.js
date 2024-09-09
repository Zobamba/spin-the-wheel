import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Wheel from './pages/Wheel';
import NotFound from './pages/NotFound';

function App() {
  const email = localStorage.getItem('email');
  const isAdmin = email === process.env.REACT_APP_ADMIN_EMAIL;

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Wheel isAdmin={isAdmin} />}
        />
        <Route
          path="/wheel/:id"
          element={<Wheel isAdmin={isAdmin} />}
        />
        <Route
          path="/not-found"
          element={<NotFound />}
        />
      </Routes>
    </div>
  );
}

export default App;
