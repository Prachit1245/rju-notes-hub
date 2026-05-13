import { useEffect, useRef } from 'react';

/**
 * Extreme hero FX layer:
 * - Mouse-driven parallax across multiple depth layers
 * - True 3D rotating glass cubes orbiting in space
 * - Soft ambient orbs and a dashed conic ring
 * Pointer-events: none — never blocks UI. Disabled when reduced-motion.
 */
export const HeroFx = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;

    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const Cube = ({ className, depth, spin }: { className: string; depth: number; spin: string }) => (
    <div className={`fx-shard ${className}`} style={{ ['--depth' as any]: depth }}>
      <div className="fx-shard-spin" style={{ animationDuration: spin }}>
        <span /><span /><span /><span /><span /><span />
      </div>
    </div>
  );

  return (
    <div ref={ref} className="hero-fx" aria-hidden="true">
      <span className="fx-orb fx-orb-a" style={{ ['--depth' as any]: 8 }} />
      <span className="fx-orb fx-orb-b" style={{ ['--depth' as any]: 14 }} />
      <span className="fx-orb fx-orb-c" style={{ ['--depth' as any]: 6 }} />

      <Cube className="fx-shard-1" depth={22} spin="22s" />
      <Cube className="fx-shard-2" depth={30} spin="16s" />
      <Cube className="fx-shard-3" depth={18} spin="26s" />

      <span className="fx-ring" style={{ ['--depth' as any]: 40 }} />
    </div>
  );
};

export default HeroFx;
