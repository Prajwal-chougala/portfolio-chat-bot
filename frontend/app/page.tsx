"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function LandingPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize theme from localStorage (default to light)
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio_theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.className = `theme-${savedTheme}`;
    } else {
      setTheme("light");
      document.documentElement.className = "theme-light";
    }
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("portfolio_theme", nextTheme);
    document.documentElement.className = `theme-${nextTheme}`;
  }

  const projects = [
    {
      title: "Portfolio AI Assistant",
      tag: "AI & Full-Stack",
      description:
        "Intelligent, real-time streaming conversational assistant answering recruiter inquiries strictly from verified profile data.",
      stack: ["Next.js 15", "FastAPI", "Groq LLM", "TypeScript", "Python"],
      highlights: [
        "Chunked token streaming over FastAPI StreamingResponse",
        "Responsive, unified gradient UI with Light/Dark modes",
        "100% ground-truth verified responses without hallucinations",
      ],
      link: "/chat",
      linkText: "Try Live Assistant 💬",
      isInternal: true,
    },
    {
      title: "KLECET HRMS",
      tag: "Enterprise Java",
      description:
        "Flagship academic Java web platform with a multi-tier leave approval workflow (Employee → HOD → Office → Principal).",
      stack: ["Java", "JSP/Servlet", "MySQL", "Apache Tomcat"],
      highlights: [
        "Conducted security audit: replaced weak hashing with SHA-256+salt & fixed SQL injections in 20+ files",
        "Engineered SecurityFilter and environment variable configuration",
        "Full responsive UI conversion preserving legacy business logic",
      ],
    },
    {
      title: "Shivshakti HRMS",
      tag: "Backend & Cloud",
      description:
        "Level 1 recruitment backend module architected statelessly for high-concurrency throughput and horizontal scale.",
      stack: ["NestJS", "TypeScript", "MySQL 8.x", "TypeORM", "Redis", "Nginx"],
      highlights: [
        "Stateless architecture designed for zero-downtime scalability",
        "JWT authentication with Redis token blacklist & caching",
        "Modular service architecture with TypeORM entity relations",
      ],
    },
    {
      title: "SecureFund",
      tag: "Web3 & Blockchain",
      description:
        "Decentralized fund distribution platform eliminating intermediary corruption via Ethereum smart contracts.",
      stack: ["Solidity", "Ethereum", "MERN Stack", "MetaMask"],
      highlights: [
        "Conditional fund release logic enforced via smart contract bytecode",
        "MetaMask wallet integration for verified peer-to-peer transfers",
        "Immutable on-chain audit trail of every disbursement",
      ],
    },
    {
      title: "WAT-WISE",
      tag: "IoT & Machine Learning",
      description:
        "IoT & ML powered energy monitoring system tracking appliance-level electricity consumption and costs.",
      stack: ["Python", "TensorFlow", "scikit-learn", "IoT Sensors", "Mobile"],
      highlights: [
        "ML inference models to predict energy peak prices and optimization schedules",
        "Integration of embedded IoT sensors with cloud API endpoints",
        "Mobile companion app for real-time remote appliance control",
      ],
    },
  ];

  const skillGroups = [
    {
      category: "Languages",
      skills: ["Java", "Python", "TypeScript", "JavaScript", "C", "C++", "SQL", "Solidity"],
    },
    {
      category: "Frontend Development",
      skills: ["React", "Next.js 15", "React 19", "Tailwind CSS", "HTML5 & CSS3", "Responsive UI"],
    },
    {
      category: "Backend & Systems",
      skills: ["Node.js", "FastAPI", "NestJS", "Django", "Java (JSP/Servlet)", "RESTful APIs", "JWT"],
    },
    {
      category: "Databases & Cloud",
      skills: ["MySQL", "Supabase", "Redis", "AWS (EC2, S3, Lambda)", "Docker", "Nginx", "Git / GitHub"],
    },
    {
      category: "Emerging Technologies",
      skills: ["Groq LLMs", "scikit-learn", "TensorFlow", "IoT Architecture", "Smart Contracts"],
    },
  ];

  return (
    <div className={`landing-page ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* ======================= NAVBAR ======================= */}
      <header className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <div className="logo-icon">PC</div>
            <div className="logo-text">
              <span className="name">Prajwal Chougala</span>
              <span className="role">Software Engineer</span>
            </div>
          </Link>

          <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </nav>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-btn"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            {/* Chat Assistant CTA */}
            <Link href="/chat" className="nav-chat-btn">
              <span className="chat-dot" />
              <span>Ask AI 💬</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle Navigation Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ======================= HERO SECTION ======================= */}
      <section id="about" className="hero-section">
        <div className="section-container hero-content">
          <div className="hero-badge-wrap">
            <div className="status-pill">
              <span className="pulse-indicator" />
              <span>Open to New Grad & Full-Stack Software Roles (Graduating 2027)</span>
            </div>
          </div>

          <h1 className="hero-title">
            Hi, I&apos;m <span className="gradient-text">Prajwal Chougala</span>
          </h1>

          <p className="hero-subtitle">
            Fourth-Year Computer Science Engineering Student & Full-Stack Developer
          </p>

          <p className="hero-bio">
            I specialize in building high-performance web systems, robust backend architectures, 
            and intelligent AI-powered solutions. Passionate about solving complex engineering challenges 
            with modern frameworks and clean, secure code.
          </p>

          {/* Quick Metrics */}
          <div className="hero-metrics">
            <div className="metric-card">
              <span className="metric-val gradient-text">8.88</span>
              <span className="metric-lbl">CGPA (KLE CET)</span>
            </div>
            <div className="metric-card">
              <span className="metric-val gradient-text">5+</span>
              <span className="metric-lbl">Full-Stack Projects</span>
            </div>
            <div className="metric-card">
              <span className="metric-val gradient-text">VP</span>
              <span className="metric-lbl">Coding Club</span>
            </div>
            <div className="metric-card">
              <span className="metric-val gradient-text">Remote</span>
              <span className="metric-lbl">MERN Internship</span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="hero-actions">
            <Link href="/chat" className="btn-primary hero-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
                <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
              </svg>
              <span>Chat with My AI Assistant</span>
            </Link>

            <a href="#projects" className="btn-secondary hero-btn">
              <span>View Projects</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <a href="mailto:chougalaprajwal@gmail.com" className="btn-secondary hero-btn">
              <span>Contact Me</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ======================= AI SHOWCASE BANNER ======================= */}
      <section className="ai-banner-section">
        <div className="section-container">
          <div className="ai-banner-card">
            <div className="ai-banner-text">
              <div className="gradient-badge">🤖 Powered by Groq & LLaMA 3.3</div>
              <h2 className="ai-banner-title">Meet My Interactive AI Portfolio Assistant</h2>
              <p className="ai-banner-desc">
                Have specific questions about my internship at X7 IT Technologies, database architectures, 
                hackathons, or academic background? Chat directly with the AI assistant for instant, streaming responses!
              </p>
              <div className="sample-prompts">
                <Link href="/chat" className="prompt-pill">
                  ⚡ &ldquo;What are Prajwal&apos;s technical skills?&rdquo;
                </Link>
                <Link href="/chat" className="prompt-pill">
                  🚀 &ldquo;Tell me about the KLECET HRMS project&rdquo;
                </Link>
                <Link href="/chat" className="prompt-pill">
                  📬 &ldquo;How can I contact Prajwal?&rdquo;
                </Link>
              </div>
            </div>

            <div className="ai-banner-cta">
              <Link href="/chat" className="btn-primary banner-btn">
                <span>Open Chat Assistant 💬</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= PROJECTS SECTION ======================= */}
      <section id="projects" className="section-block">
        <div className="section-container">
          <div className="section-heading">
            <div className="gradient-badge">Featured Work</div>
            <h2 className="section-title">Projects & Systems</h2>
            <p className="section-desc">
              A selection of enterprise applications, decentralized solutions, and cloud architectures I have engineered.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((item, idx) => (
              <div key={idx} className="project-card">
                <div className="card-top">
                  <span className="project-tag">{item.tag}</span>
                  {item.link && (
                    <Link href={item.link} className="project-link-badge">
                      {item.linkText || "View Project ↗"}
                    </Link>
                  )}
                </div>

                <h3 className="project-title">{item.title}</h3>
                <p className="project-desc">{item.description}</p>

                <div className="project-highlights">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="highlight-bullet">
                      <span className="bullet-icon">▸</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="stack-wrap">
                  {item.stack.map((s, sIdx) => (
                    <span key={sIdx} className="stack-pill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= SKILLS MATRIX ======================= */}
      <section id="skills" className="section-block skills-section">
        <div className="section-container">
          <div className="section-heading">
            <div className="gradient-badge">Technical Expertise</div>
            <h2 className="section-title">Skills & Technologies</h2>
            <p className="section-desc">
              Tools and languages I use to design, build, and deploy production-ready applications.
            </p>
          </div>

          <div className="skills-grid">
            {skillGroups.map((grp, idx) => (
              <div key={idx} className="skill-group-card">
                <h3 className="skill-category-title">{grp.category}</h3>
                <div className="skill-pills">
                  {grp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= EXPERIENCE & LEADERSHIP ======================= */}
      <section id="experience" className="section-block">
        <div className="section-container">
          <div className="section-heading">
            <div className="gradient-badge">Career & Leadership</div>
            <h2 className="section-title">Experience & Roles</h2>
            <p className="section-desc">Hands-on industry experience and community involvement.</p>
          </div>

          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-badge">Internship</div>
              <h3 className="timeline-role">MERN Developer Intern</h3>
              <p className="timeline-org">X7 IT Technologies • Remote</p>
              <p className="timeline-detail">
                Contributed to the backend development of a commercial real estate business application using Django,
                collaborating in an agile environment and integrating scalable API endpoints.
              </p>
            </div>

            <div className="timeline-card">
              <div className="timeline-badge">Leadership</div>
              <h3 className="timeline-role">Vice-President</h3>
              <p className="timeline-org">College Coding Club • KLE CET</p>
              <p className="timeline-detail">
                Mentored students, organized coding competitions, and spearheaded the successful organization of the
                flagship <strong>INVENTRA-2k25</strong> hackathon.
              </p>
            </div>

            <div className="timeline-card">
              <div className="timeline-badge">Education</div>
              <h3 className="timeline-role">B.E. in Computer Science & Engineering</h3>
              <p className="timeline-org">KLE College of Engineering & Technology, Chikodi (2023 - 2027)</p>
              <p className="timeline-detail">
                Maintaining a stellar academic record with an aggregate <strong>CGPA of 8.88 / 10</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CONTACT SECTION ======================= */}
      <section id="contact" className="section-block contact-section">
        <div className="section-container contact-box">
          <div className="gradient-badge">Get in Touch</div>
          <h2 className="contact-title">Let&apos;s Build Something Impactful Together</h2>
          <p className="contact-desc">
            I am currently open for full-time Software Engineer and Full-Stack Developer opportunities. 
            Feel free to reach out via email or connect on LinkedIn!
          </p>

          <div className="contact-links">
            <a href="mailto:chougalaprajwal@gmail.com" className="contact-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>chougalaprajwal@gmail.com</span>
            </a>

            <a
              href="https://www.linkedin.com/in/prajwal-chougala/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LinkedIn Profile</span>
            </a>

            <a
              href="https://github.com/Prajwal-chougala"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="site-footer">
        <div className="section-container footer-content">
          <p>© {new Date().getFullYear()} Prajwal Chougala. Built with Next.js & FastAPI.</p>
          <div className="footer-links">
            <Link href="/chat">AI Assistant</Link>
            <a href="https://github.com/Prajwal-chougala/portfolio-chat-bot" target="_blank" rel="noopener noreferrer">
              Source Code
            </a>
          </div>
        </div>
      </footer>

      {/* ======================= FLOATING CHAT TRIGGER ======================= */}
      <Link href="/chat" className="floating-chat-bubble" title="Open AI Chat Assistant">
        <div className="floating-chat-inner">
          <div className="floating-pulse" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
            <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
          </svg>
          <span className="floating-label">Chat with AI</span>
        </div>
      </Link>

      {/* ======================= STYLES ======================= */}
      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          width: 100%;
          background: var(--bg-gradient);
          color: var(--text-primary);
          overflow-x: hidden;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .section-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* NAVBAR */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--surface-header);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .nav-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--primary-gradient);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-text .name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .logo-text .role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }

        .nav-links a {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.15s ease;
        }

        .nav-links a:hover {
          color: var(--text-accent);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-btn {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .theme-btn:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .nav-chat-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.95rem;
          border-radius: 9px;
          background: var(--primary-gradient);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: 0 2px 10px var(--accent-glow);
          transition: all 0.2s ease;
        }

        .nav-chat-btn:hover {
          background: var(--primary-gradient-hover);
          transform: translateY(-1px);
        }

        .chat-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        /* HERO */
        .hero-section {
          padding: 5rem 0 3.5rem 0;
          text-align: center;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.9rem;
          border-radius: 30px;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary);
          box-shadow: var(--box-shadow-card);
          margin-bottom: 1.5rem;
        }

        .pulse-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
        }

        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2.5vw, 1.35rem);
          font-weight: 600;
          color: var(--text-secondary);
          max-width: 720px;
          margin-bottom: 1.25rem;
        }

        .hero-bio {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 680px;
          margin-bottom: 2.5rem;
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          width: 100%;
          max-width: 780px;
          margin-bottom: 2.5rem;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 0.75rem;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: var(--box-shadow-card);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-hover);
        }

        .metric-val {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.2rem;
        }

        .metric-lbl {
          font-size: 0.76rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-align: center;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .hero-btn {
          min-width: 180px;
        }

        /* AI BANNER */
        .ai-banner-section {
          padding: 1.5rem 0 3.5rem 0;
        }

        .ai-banner-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 2.2rem 2.5rem;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          box-shadow: var(--box-shadow-main);
          position: relative;
          overflow: hidden;
        }

        .ai-banner-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary-gradient);
        }

        .ai-banner-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .ai-banner-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .ai-banner-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.55;
          max-width: 680px;
        }

        .sample-prompts {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }

        .prompt-pill {
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          background: var(--surface-card-alt);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .prompt-pill:hover {
          border-color: var(--border-hover);
          color: var(--text-accent);
          transform: translateY(-1px);
        }

        .ai-banner-cta {
          flex-shrink: 0;
        }

        .banner-btn {
          white-space: nowrap;
          padding: 0.85rem 1.6rem;
        }

        /* SECTION BLOCKS */
        .section-block {
          padding: 4.5rem 0;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
        }

        .section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .section-desc {
          font-size: 0.98rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.55;
        }

        /* PROJECTS GRID */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.6rem;
          box-shadow: var(--box-shadow-card);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .project-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-hover);
          box-shadow: var(--box-shadow-main);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.9rem;
        }

        .project-tag {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          background: var(--badge-bg);
          color: var(--text-accent);
          border: 1px solid var(--badge-border);
          text-transform: uppercase;
        }

        .project-link-badge {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-accent);
          text-decoration: underline;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .project-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1rem;
        }

        .project-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .highlight-bullet {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .bullet-icon {
          color: var(--text-accent);
          font-weight: 700;
          flex-shrink: 0;
        }

        .stack-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding-top: 0.9rem;
          border-top: 1px solid var(--border-color);
        }

        .stack-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          background: var(--surface-card-alt);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        /* SKILLS MATRIX */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .skill-group-card {
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1.4rem;
          box-shadow: var(--box-shadow-card);
          transition: border-color 0.2s ease;
        }

        .skill-group-card:hover {
          border-color: var(--border-hover);
        }

        .skill-category-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.85rem;
          padding-bottom: 0.45rem;
          border-bottom: 1px solid var(--border-color);
        }

        .skill-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .skill-pill {
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          background: var(--surface-card-alt);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          transition: all 0.15s ease;
        }

        .skill-pill:hover {
          border-color: var(--border-hover);
          color: var(--text-accent);
          transform: translateY(-1px);
        }

        /* TIMELINE */
        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .timeline-card {
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.6rem;
          box-shadow: var(--box-shadow-card);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .timeline-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-hover);
        }

        .timeline-badge {
          align-self: flex-start;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          background: var(--badge-bg);
          color: var(--text-accent);
          border: 1px solid var(--badge-border);
          text-transform: uppercase;
        }

        .timeline-role {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .timeline-org {
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .timeline-detail {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-top: 0.4rem;
        }

        /* CONTACT */
        .contact-box {
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: var(--box-shadow-main);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .contact-title {
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0.8rem 0 0.6rem 0;
        }

        .contact-desc {
          font-size: 0.96rem;
          color: var(--text-secondary);
          max-width: 580px;
          line-height: 1.55;
          margin-bottom: 2rem;
        }

        .contact-links {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.25rem;
          border-radius: 10px;
          background: var(--surface-card-alt);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .contact-btn:hover {
          border-color: var(--border-hover);
          color: var(--text-accent);
          transform: translateY(-2px);
        }

        /* FOOTER */
        .site-footer {
          border-top: 1px solid var(--border-color);
          background: var(--surface-header);
          padding: 1.5rem 0;
          font-size: 0.84rem;
          color: var(--text-secondary);
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .footer-links a {
          color: var(--text-secondary);
          transition: color 0.15s ease;
        }

        .footer-links a:hover {
          color: var(--text-accent);
        }

        /* FLOATING CHAT BUBBLE */
        .floating-chat-bubble {
          position: fixed;
          bottom: 1.75rem;
          right: 1.75rem;
          z-index: 99;
          text-decoration: none;
        }

        .floating-chat-inner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.2rem;
          border-radius: 30px;
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.88rem;
          box-shadow: 0 8px 24px var(--accent-glow-strong);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
          position: relative;
        }

        .floating-chat-bubble:hover .floating-chat-inner {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 30px var(--accent-glow-strong);
        }

        .floating-pulse {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--surface-panel);
        }

        /* MOBILE RESPONSIVENESS */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--surface-panel);
            border-bottom: 1px solid var(--border-color);
            flex-direction: column;
            padding: 1rem 1.5rem;
            gap: 1rem;
          }

          .nav-links.mobile-open {
            display: flex;
          }

          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .hero-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .ai-banner-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 1.75rem;
          }

          .banner-btn {
            width: 100%;
          }

          .floating-label {
            display: none;
          }

          .floating-chat-inner {
            padding: 0.85rem;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  );
}
