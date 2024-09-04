import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Wheel from './pages/Wheel';

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
      </Routes>
    </div>
  );
}

export default App;
