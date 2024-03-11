import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import LandingPage2 from "./pages/LandingPage2";
import ContactUs from "./pages/ContactUs";
import SignUp from "./pages/SignUp";
import SummaryPage from "./pages/SummaryPage";
import Dashboard from "./pages/Dashboard";
import { store } from "./redux/store";
import { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import EnterURL from "./pages/EnterURL";

/**
 * Renders the main application component.
 * @return {JSX.Element} The rendered App component.
 */
function App() {
    // call refresh endpoint
    // const { loading } = useLoadingWithRefresh();

    return (
        <div className="">
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route
                            exact
                            path="/landing"
                            element={<LandingPage2 />}
                        />
                        <Route exact path="/contact" element={<ContactUs />} />
                        <Route exact path="/signup" element={<SignUp />} />
                        <Route
                            exact
                            path="/summary"
                            element={<SummaryPage />}
                        />
                        <Route
                            exact
                            path="/dashboard"
                            element={<Dashboard />}
                        />
                        <Route exact path="/enterURL" element={<EnterURL />} />
                    </Routes>
                </PersistGate>
            </Provider>
        </div>
    );
}

export default App;
