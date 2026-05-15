import { useRef, MouseEvent } from 'react';
import logo from '@/assets/rju-university-logo.webp';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
}

/**
 * Official RJU university crest with a 3D parallax tilt, slow auto-spin halo,
 * conic glow ring, and orbiting accents. Pointer-driven, GPU-only transforms,
 * and respects prefers-reduced-motion via the .uni-logo-3d CSS class.
 */
export const UniversityLogo3D = ({ className, size = 168 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--lrx', `${(0.5 - y) * 18}deg`);
      el.style.setProperty('--lry', `${(x - 0.5) * 22}deg`);
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--lrx', `0deg`);
    el.style.setProperty('--lry', `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('uni-logo-3d', className)}
      style={{ width: size, height: size }}
      aria-label="Rajarshi Janak University official logo"
    >
      <div className="uni-logo-3d-stage">
        <div className="uni-logo-3d-halo" />
        <div className="uni-logo-3d-ring" />
        <div className="uni-logo-3d-orbit">
          <span className="uni-logo-3d-dot" />
          <span className="uni-logo-3d-dot" />
          <span className="uni-logo-3d-dot" />
        </div>
        <img
          src={logo}
          alt="Rajarshi Janak University crest"
          className="uni-logo-3d-img"
          loading="eager"
          decoding="async"
          draggable={false}
        />
        <div className="uni-logo-3d-shine" />
      </div>
    </div>
  );
};

export default UniversityLogo3D;
