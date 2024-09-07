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
          element={<Wheel isAdmin={true} />}
        />
        <Route
          path="/wheel/:id"
          element={<Wheel isAdmin={false} />}
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
