"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Set default theme on html element
    const savedTheme = localStorage.getItem("portfolio_theme") || "light";
    document.documentElement.className = `theme-${savedTheme}`;

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate towards 100
        const remaining = 100 - prev;
        return prev + Math.max(remaining * 0.12, 1);
      });
    }, 40);

    // Navigate after animation
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => router.push("/chat"), 400);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-content">
        {/* Logo */}
        <div className="splash-logo">
          <div className="logo-shape">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
              <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="splash-title">
          Prajwal&apos;s <span className="gradient-text">AI Assistant</span>
        </h1>
        <p className="splash-subtitle">Portfolio • Projects • Skills • Experience</p>

        {/* Progress Bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>

        <p className="splash-status">
          {progress < 40 ? "Initializing..." : progress < 75 ? "Loading interface..." : "Almost ready..."}
        </p>
      </div>

      <style jsx>{`
        .splash-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          background: var(--bg-gradient);
          color: var(--text-primary);
          transition: opacity 0.4s ease;
        }

        .splash-screen.fade-out {
          opacity: 0;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .splash-logo {
          margin-bottom: 0.5rem;
        }

        .logo-shape {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: var(--primary-gradient);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px var(--accent-glow-strong);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 30px var(--accent-glow);
          }
          50% {
            box-shadow: 0 8px 40px var(--accent-glow-strong);
          }
        }

        .splash-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .gradient-text {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .splash-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .progress-track {
          width: 220px;
          height: 4px;
          border-radius: 4px;
          background: var(--border-color);
          overflow: hidden;
          margin-top: 0.75rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          background: var(--primary-gradient);
          transition: width 0.15s ease-out;
        }

        .splash-status {
          font-size: 0.78rem;
          color: var(--text-muted, var(--text-secondary));
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
