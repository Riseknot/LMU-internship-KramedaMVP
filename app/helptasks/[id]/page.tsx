'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/src/hooks/useUser';
import {
  CreatorProfileModal,
  HelptaskDetailContent,
  HelptaskErrorState,
  HelptaskLoadingState,
  type HelptaskDetail,
} from '@/helptasks/components/HelptaskDetailUI';
import { getTravelMetrics } from '@/helptasks/components/googleDistance';

export default function HelptaskDetailPage() {
  const [helptaskData, setHelptaskData] = useState<HelptaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [distanceText, setDistanceText] = useState('Entfernung nicht verfügbar');
  const [travelTimeText, setTravelTimeText] = useState('Auto: — • Zu Fuß: — • Bahn: —');

  const { user, isLoading: isUserLoading } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/helptasks?id=${id}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        const task = Array.isArray(data) ? data[0] : data;

        if (!task) throw new Error('not-found');
        setHelptaskData(task);
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') return;
        setError(fetchError.message === 'not-found' ? 'Keine Helptask gefunden.' : 'Fehler beim Laden.');
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!isProfileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isProfileOpen]);

  useEffect(() => {
    if (isUserLoading) {
      setDistanceText('Entfernung wird geladen...');
      setTravelTimeText('Auto: lädt • Zu Fuß: lädt • Bahn: lädt');
      return;
    }

    const origin = [
      user?.address?.street,
      user?.address?.streetNumber,
      user?.address?.zipCode,
      user?.address?.city,
    ]
      .filter(Boolean)
      .join(' ');

    const destination = [helptaskData?.address?.zipCode, helptaskData?.address?.city]
      .filter(Boolean)
      .join(' ');

    if (!origin || !destination) {
      setDistanceText('Entfernung nicht verfügbar');
      setTravelTimeText('Auto: — • Zu Fuß: — • Bahn: —');
      return;
    }

    let cancelled = false;

    getTravelMetrics(origin, destination)
      .then(({ distanceText: nextDistance, travelTimesText: nextTimes }) => {
        if (cancelled) return;
        setDistanceText(nextDistance);
        setTravelTimeText(nextTimes);
      })
      .catch(() => {
        if (cancelled) return;
        setDistanceText('Entfernung nicht verfügbar');
        setTravelTimeText('Auto: — • Zu Fuß: — • Bahn: —');
      });

    return () => {
      cancelled = true;
    };
  }, [
    helptaskData?.address?.city,
    helptaskData?.address?.zipCode,
    isUserLoading,
    user?.address?.city,
    user?.address?.street,
    user?.address?.streetNumber,
    user?.address?.zipCode,
  ]);

  return (
    <>
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </button>

        {isLoading ? (
          <HelptaskLoadingState />
        ) : error || !helptaskData ? (
          <HelptaskErrorState
            message={error ?? 'Diese Aufgabe konnte nicht gefunden werden.'}
            onGoDashboard={() => router.push('/dashboard')}
          />
        ) : (
          <HelptaskDetailContent
            helptaskData={helptaskData}
            distanceText={distanceText}
            travelTimeText={travelTimeText}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}
      </main>

      <CreatorProfileModal
        isOpen={isProfileOpen}
        helptaskData={helptaskData}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}