import React from 'react';
import { cn } from './ui/utils';

interface PageMetric {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: 'neutral' | 'primary' | 'accent' | 'success';
}

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  metrics?: PageMetric[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

interface SectionCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

const toneClasses: Record<NonNullable<PageMetric['tone']>, string> = {
  neutral: 'border-neutral-200 bg-white/95',
  primary: 'border-secondary-200 bg-secondary-50/80',
  accent: 'border-accent-200 bg-accent-50/85',
  success: 'border-emerald-200 bg-emerald-50/90',
};

export function PageShell({
  eyebrow,
  title,
  description,
  metrics = [],
  actions,
  children,
  className,
  contentClassName,
}: PageShellProps) {
  const hasMetrics = metrics.length > 0;

  return (
    <div className={cn('page-shell', className)}>
      <section className="page-header-card">
        <div className={cn('grid gap-4', hasMetrics && 'lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.78fr)] lg:items-end')}>
          <div className="min-w-0">
            {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
            <h1 className="page-title">{title}</h1>
            {description ? <p className="page-description">{description}</p> : null}
            {actions ? <div className="page-actions mt-3">{actions}</div> : null}
          </div>

          {hasMetrics ? (
            <div
              className={cn(
                'grid gap-2',
                metrics.length === 1 && 'sm:grid-cols-1',
                metrics.length === 2 && 'sm:grid-cols-2',
                metrics.length >= 3 && 'sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'
              )}
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={cn('rounded-2xl border px-3.5 py-3', toneClasses[metric.tone ?? 'neutral'])}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{metric.label}</p>
                  <p className="mt-1.5 text-xl font-black text-neutral-950">{metric.value}</p>
                  {metric.hint ? <p className="mt-0.5 text-xs text-neutral-600">{metric.hint}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className={cn('space-y-4 md:space-y-5', contentClassName)}>{children}</div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section className={cn('surface-card', className)}>
      {(title || description || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-xl font-bold tracking-[-0.03em] text-neutral-950">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-neutral-600">{description}</p> : null}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
