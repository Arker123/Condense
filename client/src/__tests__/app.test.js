import "jest-canvas-mock"; // Need because of lottie-files
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup, render } from "@testing-library/react";
import React from "react";
import App from "../App.js";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import MyNotesAndSummaries from "../pages/MyNotesAndSummaries.jsx";

afterEach(cleanup);

test("app renders without crashing", () => {
    render(
        <Router>
            <App />
        </Router>,
    );
});

test("mynotesandsummaries page renders", () => {
    render(
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <MyNotesAndSummaries />
            </Router>
          </PersistGate>
        </Provider>
      );
});