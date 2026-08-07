import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>CONTENT &amp; SEO</h3>
              <h4>Strategy, Structure, and Search Performance</h4>
              <p>
                Content strategy and SEO intelligence — shaping content around audience
                intent, information hierarchy, and search behaviour, not writing volume.
                Editorial rigour applied to discoverability.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">SEO writing</div>
                <div className="what-tags">Content strategy</div>
                <div className="what-tags">E-E-A-T frameworks</div>
                <div className="what-tags">Editorial structure</div>
                <div className="what-tags">Audience research</div>
                <div className="what-tags">Brand communication</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
              ```jsx
<div className="what-content-in">
  <h3>VIDEO &amp; VISUAL STORYTELLING</h3>
  <h4>Editing, Pacing, and Visual Communication</h4>
  <p>
    Short-form video editing and visual storytelling — transforming ideas into
    engaging digital content through thoughtful pacing, captions, transitions,
    and story-driven editing. Exploring how AI, editing, and creativity can
    work together to create more engaging visual experiences.
  </p>
     <h5>Skillset &amp; tools</h5>
     <div className="what-content-flex">
        <div className="what-tags">Video editing</div>
        <div className="what-tags">Short-form content</div>
        <div className="what-tags">Visual storytelling</div>
        <div className="what-tags">Reels &amp; Shorts</div>
        <div className="what-tags">Captions &amp; transitions</div>
        <div className="what-tags">CapCut</div>
    </div>
    <div className="what-arrow"></div>
    </div>
  </div>
  <div
  className="what-content what-noTouch"
  ref={(el) => setRef(el, 2)}
    >
      ```
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>AI &amp; LLM ALIGNMENT</h3>
              <h4>Making Models More Accurate, More Useful</h4>
              <p>
                LLM training through RLHF and SFT, output evaluation, and structured
                feedback that improves model quality. Editorial judgement applied to
                AI behaviour — clarity, coherence, and aligned intent.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">RLHF &amp; SFT</div>
                <div className="what-tags">Prompt engineering</div>
                <div className="what-tags">Output evaluation</div>
                <div className="what-tags">Structured annotation</div>
                <div className="what-tags">Response benchmarking</div>
                <div className="what-tags">AI-assisted workflows</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
