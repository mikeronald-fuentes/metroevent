import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import OrganizerHome from "./pages/OrganizerHome";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/organizer" element={<OrganizerHome />} />
          <Route path="/createevent" element={<CreateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
