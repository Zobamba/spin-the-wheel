import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Wheel from './pages/Wheel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Wheel />}
        />
        <Route
          path="/wheel/:id"
          element={<Wheel />}
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
