import React, { useEffect } from 'react';
import { PageLoadingState } from '../loadingpage/components/PageLoadingState';

interface LoginAnimationProps {
  onComplete: () => void;
}

export function LoginAnimation({ onComplete }: LoginAnimationProps) {
  useEffect(() => {
    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50">
      <PageLoadingState subtitle="Willkommen zurück – wir öffnen gerade deinen Überblick und passende Unterstützung für dich." />
    </div>
  );
}

