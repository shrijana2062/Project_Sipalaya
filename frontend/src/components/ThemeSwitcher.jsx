import React, { useState, useEffect } from 'react';
import { Palette, X, Sparkles, Check } from 'lucide-react';

const THEMES = [
  {
    id: 'cosmic',
    name: 'Cosmic Aurora',
    gradient: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
    desc: 'Original Indigo & Ocean Teal'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    desc: 'Vibrant Magenta & Violet'
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    desc: 'Classic Royal & Cyan Blue'
  },
  {
    id: 'obsidian',
    name: 'Space Obsidian',
    gradient: 'linear-gradient(135deg, #f4f4f5, #71717a)',
    desc: 'Stealth Monochrome'
  },
  {
    id: 'amber',
    name: 'White & Yellow',
    gradient: 'linear-gradient(135deg, #eab308, #fbbf24)',
    desc: 'Sunlight Amber Light Theme'
  }
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('amber');

  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') || 'amber';
    setActiveTheme(savedTheme);
    if (savedTheme !== 'cosmic') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const changeTheme = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('site-theme', themeId);
    if (themeId !== 'cosmic') {
      document.documentElement.setAttribute('data-theme', themeId);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}
        className="theme-switcher-btn"
        title="Change Theme & Color Grading"
      >
        {isOpen ? <X size={22} /> : <Palette size={22} />}
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            border: '2px solid var(--bg-secondary)',
            display: 'block'
          }} />
        )}
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div
          className="glass-card animate-up"
          style={{
            position: 'absolute',
            bottom: '72px',
            right: 0,
            width: '280px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            transformOrigin: 'bottom right'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', margin: 0 }}>Color Grading</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {THEMES.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  className="theme-option-btn"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: theme.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: (theme.id === 'obsidian' || theme.id === 'amber') ? '#09090b' : 'white',
                      flexShrink: 0
                    }}
                  >
                    {isActive && <Check size={12} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: isActive ? 'white' : 'var(--text-secondary)', margin: 0 }}>
                      {theme.name}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                      {theme.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .theme-switcher-btn:hover {
          transform: rotate(30deg) scale(1.05);
          border-color: var(--accent-primary);
          box-shadow: 0 8px 30px rgba(var(--accent-primary-rgb, 99, 102, 241), 0.2);
        }
        .theme-option-btn:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: var(--accent-primary) !important;
        }
      `}</style>
    </div>
  );
}
