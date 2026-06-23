import React from 'react';

export function GridBackground({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-background text-foreground ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
