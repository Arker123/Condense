import { Routes, Route } from 'react-router-dom';
import Landing from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Landing/>} />
        <Route exact path="/landing" element={<LandingPage2 />} />
      </Routes>
    </div>
  );
}

export default App;
