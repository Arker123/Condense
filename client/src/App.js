import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import LandingPage2 from "./pages/LandingPage2";
import ContactUs from "./pages/ContactUs";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SummaryPage from "./pages/SummaryPage";
import { store, persistor } from "./redux/store";

/**
 * Renders the main application component.
 * @return {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <div className="">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route exact path="/landing" element={<LandingPage2 />} />
            <Route exact path="/contact" element={<ContactUs />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
          </Routes>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
