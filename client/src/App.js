import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import LandingPage2 from "./pages/LandingPage2";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

/**
 * Renders the main application component.
 * @return {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route exact path="/landing" element={<LandingPage2 />} />
          </Routes>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
