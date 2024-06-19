import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CommitDetails from "./CommitDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/repositories/:owner/:repository/commit/:commitSHA"
          element={<CommitDetails />}
        />
        <Route
          path="/"
          element={
            <Navigate to="/repositories/golemfactory/clay/commit/a1bf367b3af680b1182cc52bb77ba095764a11f9" />
          }
        />
        {/* You can replace the Navigate component with your own default component if you have one */}
      </Routes>
    </Router>
  );
}

export default App;
