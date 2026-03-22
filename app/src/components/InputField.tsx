import type { ElementType,  ReactNode } from 'react';

const labelCls = 'block text-sm font-medium text-neutral-700 mb-2';
const iconCls = 'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400';

export default function InputField({ label, icon: Icon, children }: { label: string; icon: ElementType; children: ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative"><Icon className={iconCls} />{children}</div>
    </div>
  );
}
