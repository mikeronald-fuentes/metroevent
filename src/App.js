import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Register from './pages/Register';
import HomeUser from './pages/HomeUser';
import OrganizerHome from "./pages/OrganizerHome";
import CreateEvent from "./pages/CreateEvent";
import { AuthProvider } from "./Hooks/Authorization";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/organizer" element={<OrganizerHome />} />
          <Route path="/createevent" element={<CreateEvent />} />
          <Route path="/homeuser" element={<HomeUser />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;