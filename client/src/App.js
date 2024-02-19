
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import { BrowserRouter,Routes, Route } from "react-router-dom";
function App() {
  return (
    // <Home/>
    <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </div>
  );
}
export default App