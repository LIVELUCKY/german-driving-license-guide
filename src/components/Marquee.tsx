import { useEffect, useRef, useState } from 'react';

interface Props {
  items: string[];
  speed?: number; // px per second, default 60
  className?: string;
  pauseOnHover?: boolean;
}

export default function Marquee({ items, speed = 60, className = '', pauseOnHover = true }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(28);
  const doubled = [...items, ...items];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / 2;
    setDuration(w / speed);
  }, [items, speed]);

  return (
    <div
      className={'marquee-root ' + className}
      aria-hidden="true"
      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
    >
      <div
        ref={trackRef}
        className={'marquee-inner' + (pauseOnHover ? ' pause-hover' : '')}
        style={{ display: 'inline-block', animationDuration: duration + 's' }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ margin: '0 24px' }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
