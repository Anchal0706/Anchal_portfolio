import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ANCHAL
              <br />
              <span>MISHRA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Content Analyst &</h3>
            <h2 className="landing-info-h2 landing-static">
              <div className="landing-h2-1">AI Strategist</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
