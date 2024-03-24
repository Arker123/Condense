import "./LandingPage.css";
import Lottie from "lottie-react";
import animationData from "../assets/landing-animation.json";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const animationRef = useRef();
  return (
    <div className="LandingApp">
      <div className="animation">
        <Lottie
          lottieRef={animationRef}
          onComplete={() => {
            navigate("/landing");
          }}
          animationData={animationData}
          loop={false}
        />
      </div>
    </div>
  );
}

export default Landing;
