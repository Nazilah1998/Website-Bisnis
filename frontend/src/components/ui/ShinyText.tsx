import React from 'react';

export function ShinyText({ text, className = '' }: { text: string, className?: string }) {
  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#ffffff,45%,#64748b,55%,#ffffff)] bg-[length:200%_100%] animate-shiny ${className}`}
    >
      {text}
    </span>
  );
}
