'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import '../css/pageloadingstate.css';

interface PageLoadingStateProps {
  subtitle?: string;
  fullScreen?: boolean;
}

const defaultLoadingMessages = [
  {
    status: 'Passende Hilfe kommt gleich',
    subtitle: 'Wir sammeln gerade Unterstützung in deiner Nähe, damit du dich gleich gut aufgehoben fühlst.',
  },
  {
    status: 'Dein Überblick wird klar',
    subtitle: 'LUMI sortiert Aufgaben, Kontakte und Wege so, dass du entspannt starten kannst.',
  },
  {
    status: 'Begleitung wird vorbereitet',
    subtitle: 'Wir schaffen gerade einen ruhigen Start für alles, was dich heute unterstützen kann.',
  },
  {
    status: 'Hilfsangebote werden sortiert',
    subtitle: 'Gleich zeigen wir dir passende Möglichkeiten, Menschen und nächste Schritte in deiner Umgebung.',
  },
  {
    status: 'Dein Start wird leichter',
    subtitle: 'Schön, dass du da bist – wir bereiten alles so vor, dass es sich einfach und richtig anfühlt.',
  },
  {
    status: 'Ein guter Moment entsteht',
    subtitle: 'Manchmal braucht es nur einen Augenblick, bis Unterstützung spürbar näher rückt.',
  },
  {
    status: 'Etwas Entlastung ist nah',
    subtitle: 'LUMI bringt gerade Ruhe in deinen Überblick, damit du dich sicherer und wohler fühlen kannst.',
  },
  {
    status: 'Hilfe in deiner Nähe lädt',
    subtitle: 'Wir verbinden gerade passende Aufgaben, Kontakte und Orientierung für deinen nächsten Schritt.',
  },
];

function getRandomIndex(length: number, previousIndex?: number) {
  if (length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * length);

  while (nextIndex === previousIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
}

function LumiMascot({ baseId }: { baseId: string }) {
  const glowId = `${baseId}-glow`;
  const bodyId = `${baseId}-body`;
  const auraId = `${baseId}-aura`;
  const tailId = `${baseId}-tail`;
  const sparkleId = `${baseId}-sparkle`;
  const eyeId = `${baseId}-eye`;
  const mouthId = `${baseId}-mouth`;

  return (
    <svg viewBox="0 0 300 280" className="page-loading-mascot-svg">
      <defs xmlns="http://www.w3.org/2000/svg">
        <radialGradient id={glowId} cx="50%" cy="40%" r="64%">
          <stop offset="0%" stopColor="rgba(255, 249, 224, 1)" />
          <stop offset="58%" stopColor="rgba(255, 205, 116, 0.42)" />
          <stop offset="100%" stopColor="rgba(255, 205, 116, 0)" />
        </radialGradient>
        <linearGradient id={bodyId} x1="70" x2="164" y1="40" y2="228" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="46%" stopColor="#fff3bf" />
          <stop offset="100%" stopColor="#ffd568" />
        </linearGradient>
        <linearGradient id={auraId} x1="60" x2="264" y1="12" y2="144" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff4bc" />
          <stop offset="52%" stopColor="#ffca43" />
          <stop offset="100%" stopColor="#ffa217" />
        </linearGradient>
        <linearGradient id={tailId} x1="116" x2="250" y1="134" y2="238" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff2b3" />
          <stop offset="50%" stopColor="#ffc73a" />
          <stop offset="100%" stopColor="#f6a014" />
        </linearGradient>
        <radialGradient id={sparkleId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffefc" />
          <stop offset="100%" stopColor="#ffd971" />
        </radialGradient>
        <radialGradient id={eyeId} cx="42%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#7c3608" />
          <stop offset="55%" stopColor="#4e1d02" />
          <stop offset="100%" stopColor="#2a0c00" />
        </radialGradient>
        <radialGradient id={mouthId} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffba67" />
          <stop offset="55%" stopColor="#ff6d18" />
          <stop offset="100%" stopColor="#972000" />
        </radialGradient>
      </defs>

      <ellipse cx="150" cy="116" rx="114" ry="98" fill={`url(#${glowId})`} className="page-loading-mascot-glow" />
      <ellipse cx="154" cy="246" rx="62" ry="10" fill="rgba(244, 175, 78, 0.22)" className="page-loading-mascot-shadow" />

      <g className="page-loading-mascot-core">
        <g className="page-loading-mascot-head">
          <path className="page-loading-mascot-accent page-loading-mascot-accent-1" d="M116 80C114 18 171 -7 220 11C189 29 152 56 129 95Z" fill={`url(#${auraId})`} />
          <path className="page-loading-mascot-accent page-loading-mascot-accent-2" d="M170 84C223 34 288 49 299 95C263 91 212 105 170 137Z" fill={`url(#${auraId})`} />
          <path className="page-loading-mascot-accent page-loading-mascot-accent-3" d="M184 128C212 100 253 106 264 133C236 134 209 149 181 170Z" fill={`url(#${auraId})`} opacity="0.96" />
          <path className="page-loading-mascot-accent page-loading-mascot-accent-4" d="M111 122C120 93 141 83 159 90C142 103 128 118 118 138Z" fill={`url(#${bodyId})`} />

          <ellipse cx="118" cy="112" rx="74" ry="63" fill={`url(#${bodyId})`} className="page-loading-mascot-head-shape" />
          <ellipse cx="67" cy="128" rx="7" ry="4.4" fill="rgba(255, 145, 94, 0.22)" className="page-loading-mascot-blush" />
          <ellipse cx="156" cy="132" rx="8" ry="4.8" fill="rgba(255, 145, 94, 0.18)" className="page-loading-mascot-blush" />
          <ellipse cx="80" cy="109" rx="14" ry="20" fill={`url(#${eyeId})`} className="page-loading-mascot-eye" />
          <ellipse cx="142" cy="111" rx="17" ry="22" fill={`url(#${eyeId})`} className="page-loading-mascot-eye" />
          <ellipse cx="84" cy="100" rx="3.5" ry="4.7" fill="#fff" className="page-loading-mascot-eye-shine" />
          <ellipse cx="146" cy="101" rx="4.1" ry="5.1" fill="#fff" className="page-loading-mascot-eye-shine" />
          <circle cx="89" cy="108" r="1.5" fill="#fff4df" className="page-loading-mascot-eye-shine" />
          <circle cx="149" cy="112" r="1.6" fill="#fff4df" className="page-loading-mascot-eye-shine" />
          <path className="page-loading-mascot-mouth-line" d="M112 123Q116 127 120 123" stroke="#ef9f3a" strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <path className="page-loading-mascot-smile" d="M105 137Q118 150 132 137Q118 141 105 137Z" fill={`url(#${mouthId})`} />
        </g>

        <path className="page-loading-mascot-tail" d="M170 184C218 178 258 198 259 230C260 252 233 269 207 267C181 265 163 250 163 229C163 208 182 193 208 193C229 193 245 202 250 214C255 225 251 238 241 245C228 255 208 255 194 247C179 239 176 225 183 215C190 204 205 200 217 204" fill={`url(#${tailId})`} />
        <path className="page-loading-mascot-tail page-loading-mascot-tail-inner" d="M202 204C222 205 236 216 236 231C236 244 224 252 211 252C221 245 226 236 223 226C221 218 213 210 202 204Z" fill="rgba(255, 246, 205, 0.78)" />

        <path className="page-loading-mascot-arm page-loading-mascot-arm-left" d="M100 160C80 153 55 145 36 131C31 146 42 162 67 173C81 179 93 179 104 173Z" fill={`url(#${bodyId})`} />
        <path className="page-loading-mascot-arm page-loading-mascot-arm-right" d="M157 162C181 153 205 153 224 162C217 176 201 182 175 181C166 180 160 173 157 162Z" fill={`url(#${bodyId})`} />
        <path className="page-loading-mascot-body" d="M104 156C87 165 78 182 78 205C78 235 99 255 127 257C154 259 177 242 182 217C186 196 177 173 158 160C144 151 121 149 104 156Z" fill={`url(#${bodyId})`} />
        <path className="page-loading-mascot-belly" d="M106 162C113 180 121 198 129 216C135 197 141 178 145 160C132 154 118 154 106 162Z" fill="rgba(255,255,255,0.82)" />
      </g>

      <g className="page-loading-spark page-loading-spark-1" fill={`url(#${sparkleId})`}>
        <path d="M219 60l2.8 7 7 2.8-7 2.8-2.8 7-2.8-7-7-2.8 7-2.8z" />
      </g>
      <g className="page-loading-spark page-loading-spark-2" fill={`url(#${sparkleId})`}>
        <path d="M203 185l2 5.2 5.2 2-5.2 2-2 5.2-2-5.2-5.2-2 5.2-2z" />
      </g>
      <g className="page-loading-spark page-loading-spark-3" fill={`url(#${sparkleId})`}>
        <path d="M63 132l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z" />
      </g>
    </svg>
  );
}

export function PageLoadingState({
  subtitle,
  fullScreen = true,
}: PageLoadingStateProps) {
  const baseId = useId().replace(/:/g, '');
  const wordGradientId = `${baseId}-word-gradient`;
  const trailGradientId = `${baseId}-trail-gradient`;
  const animatedLabel = 'LUMI';
  const loadingMessages = useMemo(
    () => (subtitle ? [{ status: 'Dein Überblick ist gleich bereit', subtitle }] : defaultLoadingMessages),
    [subtitle]
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(getRandomIndex(loadingMessages.length));
  }, [loadingMessages]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessageIndex((currentIndex) => getRandomIndex(loadingMessages.length, currentIndex));
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [loadingMessages]);

  const activeMessage = loadingMessages[messageIndex] ?? loadingMessages[0];

  return (
    <div className={fullScreen ? 'auth-shell' : 'flex min-h-[40vh] items-center justify-center px-4 py-8'}>
      <div className="auth-loader-card page-loading-state" role="status" aria-live="polite">
        <div className="page-loading-panel p-4">
            

          <div className="page-loading-mark">
            <div className="page-loading-scene" aria-hidden="true">
              <div className="page-loading-backdrop-grid" />
              <div className="page-loading-aurora" />
              <div className="page-loading-beam" />

              <div className="page-loading-rings">
                <span className="page-loading-ring page-loading-ring-1" />
                <span className="page-loading-ring page-loading-ring-2" />
                <span className="page-loading-ring page-loading-ring-3" />
              </div>

              <div className="page-loading-comets">
                <span className="page-loading-comet page-loading-comet-1" />
                <span className="page-loading-comet page-loading-comet-2" />
              </div>

              <svg viewBox="0 0 320 110" className="page-loading-word-svg page-loading-word-svg-back">
                <defs xmlns="http://www.w3.org/2000/svg">
                  <linearGradient id={wordGradientId} x1="18" x2="300" y1="12" y2="84" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fff5cf" />
                    <stop offset="35%" stopColor="#ffd66e" />
                    <stop offset="68%" stopColor="#8bd4ff" />
                    <stop offset="100%" stopColor="#c68cff" />
                  </linearGradient>
                  <linearGradient id={trailGradientId} x1="36" x2="284" y1="92" y2="92" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffe39b" />
                    <stop offset="50%" stopColor="#ffc260" />
                    <stop offset="100%" stopColor="#87dfff" />
                  </linearGradient>
                </defs>

                <text x="50%" y="70" textAnchor="middle" className="page-loading-word-fill">
                  {animatedLabel}
                </text>
                <text x="50%" y="70" textAnchor="middle" className="page-loading-word-stroke" stroke={`url(#${wordGradientId})`}>
                  {animatedLabel}
                </text>
                <path
                  d="M34 91C72 98 102 83 132 83C170 83 190 99 223 99C250 99 269 90 286 86"
                  className="page-loading-trail"
                  stroke={`url(#${trailGradientId})`}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  pathLength="360"
                />
              </svg>

              <div className="page-loading-mascot-orbit">
                <span className="page-loading-jetstream" />
                <div className="page-loading-mascot-drift">
                  <div className="page-loading-mascot-tilt">
                    <LumiMascot baseId={baseId} />
                  </div>
                </div>
              </div>

              <svg viewBox="0 0 320 110" className="page-loading-word-svg page-loading-word-svg-front">
                <text x="50%" y="70" textAnchor="middle" className="page-loading-word-front-stroke" stroke={`url(#${wordGradientId})`}>
                  {animatedLabel}
                </text>
                <path
                  d="M34 91C72 98 102 83 132 83C170 83 190 99 223 99C250 99 269 90 286 86"
                  className="page-loading-trail page-loading-trail-front"
                  stroke={`url(#${trailGradientId})`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  pathLength="360"
                />
              </svg>
            </div>

            <div className="page-loading-copy">
              <div className="page-loading-copy-top">
                <span className="page-loading-status-pill">
                  <span className="page-loading-status-dot" aria-hidden="true" />
                  {activeMessage.status}
                </span>
              </div>

              <p className="page-loading-title">Dein Überblick ist gleich bereit</p>
              <p key={messageIndex} className="page-loading-subtitle page-loading-subtitle-animated">
                {activeMessage.subtitle}
              </p>

              <div className="page-loading-progress" aria-hidden="true">
                <span className="page-loading-progress-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
