import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faMapMarkerAlt, faPhone, faEnvelope}
    from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

library.add(faMapMarkerAlt, faPhone, faEnvelope, far);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <App />
    </Router>,
);
