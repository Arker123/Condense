import { Routes, Route } from 'react-router-dom';

import LandingPage2 from './pages/LandingPage2';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<LandingPage2 />} />
      </Routes>
    </div>
  );
}

export default App;
