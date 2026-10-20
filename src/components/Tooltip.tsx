import React, { useState, useEffect, useRef } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  id?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
  };

  // Auto-dismiss on touch devices after 3.2s
  useEffect(() => {
    if (!isOpen || !isTouchDevice()) return;
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Close on outside touch or click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2.5'
  };

  const caretClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-950 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-950 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-950 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-950 border-y-transparent border-l-transparent'
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => {
        if (!isTouchDevice()) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (!isTouchDevice()) setIsOpen(false);
      }}
      onFocus={() => {
        if (!isTouchDevice()) setIsOpen(true);
      }}
      onBlur={() => setIsOpen(false)}
      onClick={() => {
        setIsOpen(prev => !prev);
      }}
      aria-expanded={isOpen}
      id={id}
    >
      {children}

      {isOpen && (
        <div
          ref={tooltipRef}
          role="tooltip"
          aria-live="polite"
          onClick={(e) => {
            // Tapping tooltip closes it
            e.stopPropagation();
            setIsOpen(false);
          }}
          className={`absolute z-60 px-3.5 py-2.5 text-xs font-semibold text-slate-100 bg-slate-950/95 border border-amber-400/40 rounded-2xl shadow-2xl w-max text-center leading-snug backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none ${positionClasses[position]}`}
          style={{
            maxWidth: 'min(280px, calc(100vw - 32px))',
            width: 'max-content'
          }}
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 ${caretClasses[position]}`} />
        </div>
      )}
    </div>
  );
};
