<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import OrganizerHome from "./pages/OrganizerHome";
import CreateEvent from "./pages/CreateEvent";
=======
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Hooks/Authorization';
import Login from './pages/Login';
import Admin from './pages/Admin';
>>>>>>> 81159983bcd1b9e97ec90bd3ec52f4a7945ccf24

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/organizer" element={<OrganizerHome />} />
          <Route path="/createevent" element={<CreateEvent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
