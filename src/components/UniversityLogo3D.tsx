import { useRef, MouseEvent } from 'react';
import logo from '@/assets/rju-university-logo.webp';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  size?: number;
}

const ORBIT_TEXT =
  'ALL NOTES OF RJU  •  NOTICES  •  OLD QUESTIONS  •  MADE FOR RJU STUDENTS  •  ';

/**
 * Official RJU crest with 3D parallax tilt, halo, conic ring, orbiting dots,
 * and a slowly rotating circular tagline behind the logo. GPU-only transforms;
 * respects prefers-reduced-motion.
 */
export const UniversityLogo3D = ({ className, size = 220 }: Props) => {
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
      el.style.setProperty('--lrx', `${(0.5 - y) * 16}deg`);
      el.style.setProperty('--lry', `${(x - 0.5) * 20}deg`);
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
      aria-label="Rajarshi Janak University crest"
    >
      <div className="uni-logo-3d-stage">
        {/* Rotating circular tagline behind the crest */}
        <svg
          className="uni-logo-3d-circular-text"
          viewBox="0 0 300 300"
          aria-hidden="true"
        >
          <defs>
            <path
              id="uni-logo-circle-path"
              d="M 150,150 m -132,0 a 132,132 0 1,1 264,0 a 132,132 0 1,1 -264,0"
            />
          </defs>
          <text>
            <textPath href="#uni-logo-circle-path" startOffset="0">
              {ORBIT_TEXT.repeat(2)}
            </textPath>
          </text>
        </svg>

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
