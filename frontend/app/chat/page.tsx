"use client";

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
};

type Theme = "light" | "dark";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const QUICK_SUGGESTIONS = [
  {
    icon: "🚀",
    label: "Projects",
    prompt: "What projects has Prajwal built? Give me highlights of each.",
  },
  {
    icon: "⚡",
    label: "Tech Stack",
    prompt: "What are Prajwal's technical skills across frontend, backend, and cloud?",
  },
  {
    icon: "💼",
    label: "Experience",
    prompt: "Tell me about his internship at X7 IT Technologies and role.",
  },
  {
    icon: "🎓",
    label: "Education & Contact",
    prompt: "What is Prajwal's college, CGPA, graduation year, and contact details?",
  },
];

export default function ChatPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-bot",
      role: "bot",
      text: "👋 Hi! I am **Prajwal's AI Assistant**.\n\nAsk me anything about his technical projects, skills, internship , or contact info. You can also pick a suggestion below!",
      timestamp: "",
    },
  ]);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set the welcome message timestamp on the client to avoid hydration mismatch
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === "welcome-bot" && !m.timestamp
          ? { ...m, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : m
      )
    );
  }, []);

  // Centralized theme-switching function
  function applyTheme(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
    document.documentElement.className = `theme-${newTheme}`;
  }

  // Load theme preference on mount (URL param > localStorage > default light)
  // Also listen for live theme changes from parent portfolio via postMessage
  useEffect(() => {
    // 1. Read initial theme from URL param (for iframe embedding)
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get("theme");
    if (urlTheme === "dark" || urlTheme === "light") {
      applyTheme(urlTheme);
    } else {
      // 2. Fall back to localStorage
      const savedTheme = localStorage.getItem("portfolio_theme") as Theme | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        applyTheme(savedTheme);
      } else {
        applyTheme("light");
      }
    }

    // 3. Listen for live theme changes from parent portfolio (postMessage)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THEME_CHANGE") {
        const incomingTheme = event.data.theme;
        if (incomingTheme === "dark" || incomingTheme === "light") {
          applyTheme(incomingTheme);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  }

  // Smooth auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || isGenerating) return;

    const userMsg: Message = {
      id: "usr-" + Date.now(),
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const botMsgId = "bot-" + (Date.now() + 1);
    let fullReply = "";

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "bot",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullReply += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: fullReply } : m))
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: fullReply + " _(stopped)_" } : m
          )
        );
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            role: "bot",
            text: "⚠️ **Connection Error**: Unable to reach backend server (`http://localhost:8000`). Please verify FastAPI is running.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }

  function handleStop() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome-reset",
        role: "bot",
        text: "Conversation cleared! How can I help you explore Prajwal's portfolio?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  function renderBotContent(text: string, isStreaming = false) {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const items: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        items.push(renderTextLines(text.substring(lastIdx, match.index), `t-${lastIdx}`));
      }

      const lang = match[1] || "code";
      const code = match[2];
      const blockKey = `code-${match.index}`;

      items.push(
        <div key={blockKey} className="code-block">
          <div className="code-header">
            <span className="code-lang">{lang}</span>
            <button onClick={() => copyText(blockKey, code)} className="code-copy">
              {copiedId === blockKey ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre className="code-pre">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      items.push(renderTextLines(text.substring(lastIdx), `t-${lastIdx}`));
    }

    return (
      <div className="bot-content-wrap">
        {items}
        {isStreaming && <span className="stream-cursor" />}
      </div>
    );
  }

  function renderTextLines(raw: string, keyPrefix: string) {
    const lines = raw.split("\n");
    return (
      <div key={keyPrefix} className="lines-group">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
            return (
              <div key={`${keyPrefix}-li-${idx}`} className="bullet-row">
                <span className="bullet-dot">•</span>
                <span className="bullet-text">{formatInline(trimmed.replace(/^[-•*]\s*/, ""))}</span>
              </div>
            );
          }

          if (!trimmed) {
            return <div key={`${keyPrefix}-sp-${idx}`} className="line-spacer" />;
          }

          return (
            <p key={`${keyPrefix}-p-${idx}`} className="chat-paragraph">
              {formatInline(line)}
            </p>
          );
        })}
      </div>
    );
  }

  function formatInline(str: string) {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="highlight-text">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="inline-code">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  }

  return (
    <div className={`chat-viewport ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <Draggable
        handle=".chat-header"
        bounds="parent"
      >
        <div className="chat-container">
          {/* Header */}
          <header 
            className="chat-header" 
            style={{ cursor: "grab" }}
          >
            <div className="header-left">
            <div className="header-brand">
              <div className="bot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
                  <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
                </svg>
                <span className="status-dot" />
              </div>

              <div className="header-info">
                <div className="title-row">
                  <h1 className="assistant-title">Prajwal&apos;s Assistant</h1>
                  <span className="gradient-badge">AI</span>
                </div>
                <p className="assistant-subtitle">Online • Grounded on Verified Profile</p>
              </div>
            </div>
          </div>

          <div className="header-controls">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="icon-btn theme-toggle-btn"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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


            {/* Clear Button */}
            <button onClick={clearChat} className="icon-btn clear-button" title="Clear conversation" aria-label="Clear conversation">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="clear-label">Clear</span>
            </button>
          </div>
        </header>

        {/* Suggestions Bar */}
        <div className="suggestions-bar">
          <div className="suggestions-scroll">
            {QUICK_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                disabled={isGenerating}
                className="suggestion-chip"
              >
                <span className="chip-icon">{item.icon}</span>
                <span className="chip-text">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <main className="chat-stream">
          <div className="stream-inner">
            {messages.map((msg, index) => {
              const isLastBot = msg.role === "bot" && index === messages.length - 1;
              const isStreaming = isLastBot && isGenerating;

              return (
                <div
                  key={msg.id}
                  className={`message-row ${msg.role === "user" ? "user-side" : "bot-side"}`}
                >
                  {msg.role === "bot" && (
                    <div className="row-avatar bot-avatar-small" title="AI Bot">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <circle cx="12" cy="5" r="2" />
                        <path d="M12 7v4" />
                      </svg>
                    </div>
                  )}

                  <div className="bubble-box">
                    <div className={`speech-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}>
                      {msg.role === "bot" ? (
                        renderBotContent(msg.text, isStreaming)
                      ) : (
                        <p className="user-text-content">{msg.text}</p>
                      )}
                    </div>

                    <div className="bubble-info">
                      <span className="time-text">{msg.timestamp}</span>
                      {msg.role === "bot" && msg.text && (
                        <button
                          onClick={() => copyText(msg.id, msg.text)}
                          className="copy-button"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? "✓ Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="row-avatar user-avatar-small" title="You">
                      You
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Loader */}
            {isGenerating && messages[messages.length - 1]?.role === "user" && (
              <div className="message-row bot-side">
                <div className="row-avatar bot-avatar-small">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                  </svg>
                </div>
                <div className="bubble-box">
                  <div className="speech-bubble bot-bubble typing-box">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Bar */}
        <footer className="chat-footer">
          <div className="input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Prajwal's projects, experience, or skills..."
              disabled={isGenerating}
              className="user-input"
            />

            {isGenerating ? (
              <button onClick={handleStop} className="action-button stop-button" title="Stop generating">
                <div className="stop-icon" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="action-button send-button"
                title="Send message"
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            )}
          </div>
          <p className="footer-notice">Grounded strictly on Prajwal&apos;s verified profile</p>
        </footer>
      </div>
      </Draggable>

      {/* Styles */}
      <style jsx>{`
        .chat-viewport {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          background: var(--bg-gradient);
          color: var(--text-primary);
          padding: 1.25rem;
          overflow: hidden;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 880px;
          height: 100%;
          max-height: min(92dvh, 880px);
          background-color: var(--surface-panel);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          box-shadow: var(--box-shadow-main);
          overflow: hidden;
          transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, max-width 0.3s ease, max-height 0.3s ease, border-radius 0.3s ease;
          position: relative;
        }

        .chat-container:active {
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }

        /* HEADER */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.25rem;
          background-color: var(--surface-header);
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.65rem;
          border-radius: 8px;
          background-color: var(--surface-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .back-link:hover {
          border-color: var(--border-hover);
          color: var(--text-accent);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .bot-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--primary-gradient);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px var(--accent-glow);
          flex-shrink: 0;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background-color: #22c55e;
          border: 2px solid var(--surface-header);
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .assistant-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .assistant-subtitle {
          font-size: 0.74rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.65rem;
          border-radius: 8px;
          background-color: var(--surface-card);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .icon-btn:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .theme-toggle-btn {
          width: 34px;
          height: 34px;
          padding: 0;
          justify-content: center;
        }

        /* SUGGESTIONS */
        .suggestions-bar {
          background-color: var(--surface-card-alt);
          border-bottom: 1px solid var(--border-color);
          padding: 0.6rem 1.25rem;
          flex-shrink: 0;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .suggestions-scroll {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .suggestions-scroll::-webkit-scrollbar {
          display: none;
        }

        .suggestion-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          background-color: var(--surface-panel);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .suggestion-chip:hover:not(:disabled) {
          border-color: var(--border-hover);
          color: var(--text-accent);
          background: var(--surface-card);
        }

        .chip-icon {
          font-size: 0.85rem;
        }

        .chip-text {
          font-size: 0.78rem;
        }

        /* CHAT STREAM */
        .chat-stream {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 1rem 1.25rem;
          background-color: var(--surface-panel);
          transition: background-color 0.25s ease;
        }

        .stream-inner {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          flex: 1;
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 0.65rem;
          width: 100%;
        }

        .user-side {
          justify-content: flex-end;
        }

        .bot-side {
          justify-content: flex-start;
        }

        .row-avatar {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 1.15rem;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .bot-avatar-small {
          background: var(--primary-gradient);
          color: #ffffff;
          box-shadow: 0 2px 8px var(--accent-glow);
        }

        .user-avatar-small {
          background-color: var(--user-avatar-bg);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .bubble-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-width: 78%;
          min-width: 0;
        }

        .user-side .bubble-box {
          align-items: flex-end;
        }

        .speech-bubble {
          padding: 0.85rem 1.1rem;
          border-radius: 16px;
          font-size: 0.92rem;
          line-height: 1.55;
          word-break: break-word;
          overflow-wrap: anywhere;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .user-bubble {
          background: var(--primary-gradient);
          color: #ffffff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .user-text-content {
          color: #ffffff;
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .bot-bubble {
          background-color: var(--surface-card-alt);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .bot-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .lines-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .chat-paragraph {
          color: var(--text-primary);
          font-size: 0.92rem;
        }

        .line-spacer {
          height: 0.35rem;
        }

        .highlight-text {
          color: var(--text-primary);
          font-weight: 600;
        }

        .inline-code {
          font-family: 'JetBrains Mono', monospace;
          background-color: var(--surface-panel);
          border: 1px solid var(--border-color);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-size: 0.82rem;
          color: var(--text-accent);
        }

        .bullet-row {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          margin: 0.15rem 0;
        }

        .bullet-dot {
          color: var(--text-accent);
          font-size: 1.1rem;
          line-height: 1.1;
          flex-shrink: 0;
        }

        .bullet-text {
          flex: 1;
          min-width: 0;
        }

        .code-block {
          margin: 0.55rem 0;
          background-color: var(--code-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          max-width: 100%;
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0.75rem;
          background-color: var(--code-header-bg);
          border-bottom: 1px solid var(--border-color);
        }

        .code-lang {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .code-copy {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.72rem;
          cursor: pointer;
        }

        .code-copy:hover {
          color: var(--text-accent);
        }

        .code-pre {
          padding: 0.75rem;
          overflow-x: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          color: #e2e8f0;
          line-height: 1.45;
        }

        .stream-cursor {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: var(--primary-gradient);
          margin-left: 2px;
          vertical-align: middle;
          animation: blinkCursor 0.8s infinite;
        }

        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .bubble-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.3rem;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .copy-button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.7rem;
          cursor: pointer;
        }

        .copy-button:hover {
          color: var(--text-accent);
        }

        /* TYPING LOADER */
        .typing-box {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.75rem 1rem;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--primary-gradient);
          border-radius: 50%;
          animation: dotBounce 1.3s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.3s; }
        .typing-dot:nth-child(2) { animation-delay: -0.15s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }

        /* FOOTER */
        .chat-footer {
          padding: 0.85rem 1.25rem 0.95rem 1.25rem;
          background-color: var(--surface-header);
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--surface-input);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.3rem 0.4rem 0.3rem 0.9rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .input-wrap:focus-within {
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .user-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 16px;
          font-family: inherit;
        }

        .user-input::placeholder {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .action-button {
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .send-button {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--primary-gradient);
          box-shadow: 0 2px 10px var(--accent-glow);
        }

        .send-button:hover:not(:disabled) {
          background: var(--primary-gradient-hover);
          transform: translateY(-1px);
        }

        .send-button:disabled {
          background: var(--surface-card);
          color: var(--text-secondary);
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }

        .stop-button {
          gap: 0.35rem;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .stop-icon {
          width: 8px;
          height: 8px;
          background-color: #ffffff;
          border-radius: 1px;
        }

        .footer-notice {
          text-align: center;
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.4rem;
        }

        /* RESPONSIVENESS */
        @media (max-width: 768px) {
          .chat-viewport {
            padding: 0;
            height: 100vh;
            height: 100dvh;
          }

          .chat-container {
            height: 100vh;
            height: 100dvh;
            max-height: 100dvh;
            max-width: 100%;
            border-radius: 0;
            border: none;
          }

          .chat-header {
            padding: 0.75rem 1rem;
          }

          .back-text {
            display: none;
          }

          .bubble-box {
            max-width: 86%;
          }
        }
      `}</style>
    </div>
  );
}
