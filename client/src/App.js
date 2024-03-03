import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Landing from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import SummaryPage from './pages/SummaryPage';

/**
 * Renders the main application component.
 * @return {JSX.Element} The rendered App component.
 */

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route exact path="/landing" element={<LandingPage2 />} />
                <Route path='/summary' element={<SummaryPage/>} />
            </Routes>
        </div>
    );
}

export default App;
