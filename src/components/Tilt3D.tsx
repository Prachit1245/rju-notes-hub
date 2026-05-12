import { ReactNode, useRef, MouseEvent, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt degrees
  scale?: number;
  glare?: boolean;
  style?: CSSProperties;
}

/**
 * Mouse-driven 3D tilt wrapper. Lightweight, respects prefers-reduced-motion
 * via CSS `.tilt-3d-root` (transforms are skipped if motion is reduced).
 */
export const Tilt3D = ({
  children,
  className,
  max = 10,
  scale = 1.02,
  glare = true,
  style,
}: Tilt3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * max * 2;
    const ry = (x - 0.5) * max * 2;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      el.style.setProperty('--tilt-scale', `${scale}`);
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', `0deg`);
    el.style.setProperty('--ry', `0deg`);
    el.style.setProperty('--tilt-scale', `1`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn('tilt-3d-root', glare && 'tilt-3d-glare', className)}
      style={style}
    >
      <div className="tilt-3d-inner">{children}</div>
    </div>
  );
};

export default Tilt3D;
