import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginAnimationProps {
  onComplete: () => void;
}

export function LoginAnimation({ onComplete }: LoginAnimationProps) {
  const [stage, setStage] = useState<'logo' | 'bird' | 'complete'>('logo');

  useEffect(() => {
    // Logo erscheint
    const logoTimer = setTimeout(() => {
      setStage('bird');
    }, 1000);

    // Kolibri fliegt ein und aus
    const birdTimer = setTimeout(() => {
      setStage('complete');
    }, 3000);

    // Animation beenden
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(birdTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 auth-shell auth-animation-shell">
      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="auth-animation-card">
          <Heart className="w-24 h-24 text-primary-700" />
        </div>
        
        {/* Kolibri SVG */}
        {stage !== 'logo' && (
          <motion.div
            initial={{ x: -200, y: 0, opacity: 0 }}
            animate={{ 
              x: stage === 'bird' ? [0, 50, 100] : [100, 300],
              y: stage === 'bird' ? [0, -20, -10] : [-10, -50],
              opacity: stage === 'bird' ? 1 : 0,
              rotate: stage === 'bird' ? [0, 5, -5, 0] : [0, 15]
            }}
            transition={{ 
              duration: stage === 'bird' ? 2 : 0.5,
              ease: 'easeInOut'
            }}
            className="absolute top-0 left-full ml-8"
          >
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 100 100" 
              className="drop-shadow-lg"
            >
              {/* Kolibri Körper */}
              <ellipse cx="50" cy="50" rx="12" ry="18" fill="#10b981" />
              
              {/* Kopf */}
              <circle cx="50" cy="35" r="10" fill="#059669" />
              
              {/* Schnabel */}
              <motion.path
                d="M 50 30 L 55 20 L 50 25 Z"
                fill="#dc2626"
                animate={{ 
                  d: [
                    "M 50 30 L 55 20 L 50 25 Z",
                    "M 50 30 L 58 18 L 50 25 Z",
                    "M 50 30 L 55 20 L 50 25 Z"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 0.3 }}
              />
              
              {/* Flügel links */}
              <motion.ellipse
                cx="35"
                cy="45"
                rx="15"
                ry="8"
                fill="#34d399"
                opacity="0.8"
                animate={{
                  ry: [8, 12, 8],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ repeat: Infinity, duration: 0.15 }}
              />
              
              {/* Flügel rechts */}
              <motion.ellipse
                cx="65"
                cy="45"
                rx="15"
                ry="8"
                fill="#34d399"
                opacity="0.8"
                animate={{
                  ry: [8, 12, 8],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ repeat: Infinity, duration: 0.15, delay: 0.075 }}
              />
              
              {/* Schwanz */}
              <motion.path
                d="M 50 68 Q 45 80 40 85"
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                animate={{
                  d: [
                    "M 50 68 Q 45 80 40 85",
                    "M 50 68 Q 48 80 42 87",
                    "M 50 68 Q 45 80 40 85"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              
              {/* Auge */}
              <circle cx="52" cy="33" r="2" fill="white" />
              <circle cx="53" cy="33" r="1" fill="#1f2937" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-32 text-center"
      >
        <h2 className="text-white text-2xl font-bold">Willkommen zurück!</h2>
        <p className="text-neutral-100 mt-2">Anmeldung erfolgreich...</p>
      </motion.div>
    </div>
  );
}

