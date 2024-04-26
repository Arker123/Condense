import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import LandingPage2 from "./pages/LandingPage2";
import ContactUs from "./pages/ContactUs";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import SignUp from "./pages/SignUp";
import SummaryPage from "./pages/SummaryPage";
import SummaryPageFile from "./pages/SummaryPageFile";
import { store, persistor } from "./redux/store";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/feedback";
import Analytics from "./pages/Analytics";

import MyNotes from './pages/MyNotes';
import MyNotesAndSummaries from "./pages/MyNotesAndSummaries";
import SummaryAndNotes from "./pages/SummaryAndNotes";

import Profile from "./pages/Profile";
import Auth from "./utils/Auth";
import NotFound from "./pages/NotFound";
import YTSummaries from "./pages/YTSummaries"; 


/**
 * Renders the main application component.
 * @return {JSX.Element} The rendered App component.
 */
function App() {

  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route exact path="/landing" element={<LandingPage2 />} />
            <Route exact path="/contact" element={<ContactUs />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/feedback" element={<Feedback />} />
            <Route exact path="/ytsummaries" element={<YTSummaries />} /> 

            <Route element={<Auth />}>
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/summary" element={<SummaryPage />} />
              <Route exact path="/summaryFile" element={<SummaryPageFile />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/mynotes" element={<MyNotes/>} />
              <Route exact path="/mynotesandsummaries" element={<MyNotesAndSummaries/>} />
              <Route exact path="/summaryAndNote" element={<SummaryAndNotes/>} />
              <Route exact path="/analytics" element={<Analytics/>} />

            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PersistGate>
      </Provider>
    </div>
  );

}

export default App;
