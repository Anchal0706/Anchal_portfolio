import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Content Analyst</h4>
                <h5>SDAI</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Working with schools, principals, and senior academic stakeholders to build
              partnerships and facilitate workshops on AI, learning, and digital awareness.
              Engaging directly with students to introduce them to learning programmes.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance AI Contributor</h4>
                <h5>Outlier AI</h5>
              </div>
              <h3>2024–NOW</h3>
            </div>
            <p>
              Contributing to large language model training through RLHF and SFT
              workflows. Evaluating outputs, improving accuracy, strengthening logical
              coherence, and providing structured feedback that improves model quality
              and user-facing communication.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Content Marketer</h4>
                <h5>Qorvatech</h5>
              </div>
              <h3>2023–24</h3>
            </div>
            <p>
              Aug 2023 – Sept 2024. Developed SEO-driven content and strategic articles
              to strengthen discoverability, improve readability, and support audience
              engagement. Refined editorial logic, structure, and consistency through
              analytical feedback on existing content.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Content Writer</h4>
                <h5>C-Incognito</h5>
              </div>
              <h3>2022–23</h3>
            </div>
            <p>
              Nov 2022 – Aug 2023. Created research-led blogs, summaries, and digital
              content with focus on SEO, audience retention, and clarity. Strengthened
              the discipline of writing for both performance and readability.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Editorial &amp; Freelance</h4>
                <h5>KnitInfotech, Ballot Box, Dainik Jagran, Rank Keywords</h5>
              </div>
              <h3>EARLIER</h3>
            </div>
            <p>
              Earlier editorial and content roles that shaped editorial instincts,
              sharpened communication skills, and built the writing discipline that
              continues to inform every piece of work today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
