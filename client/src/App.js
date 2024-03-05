import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Landing from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import ContactUs from './pages/ContactUs';
import SignUp from './pages/SignUp';
import SummaryPage from './pages/SummaryPage';

import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

/**
 * Renders the main application component.
 * @return {JSX.Element} The rendered App component.
 */
function App() {
    // call refresh endpoint
    // const { loading } = useLoadingWithRefresh();

    return 
    // loading ? (
    //     <Loader message="Loading, please wait.." />
    // ) :
    (
        <div className="">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route exact path="/landing" element={<LandingPage2 />} />
                <Route exact path="/contact" element={<ContactUs />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path='/summary' element={<SummaryPage/>} />
            </Routes>
        </div>
    );
}

export default App;
