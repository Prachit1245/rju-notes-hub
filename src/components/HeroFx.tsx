import { useEffect, useRef } from 'react';

/**
 * Extreme hero FX layer:
 * - Mouse-driven parallax on multiple depth layers
 * - 3D-rotating glass shards / orbs orbiting in space
 * - Pointer-events: none so it never blocks UI
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
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
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

  return (
    <div ref={ref} className="hero-fx" aria-hidden="true">
      {/* Far-back ambient orbs */}
      <span className="fx-orb fx-orb-a" style={{ ['--depth' as any]: 8 }} />
      <span className="fx-orb fx-orb-b" style={{ ['--depth' as any]: 14 }} />
      <span className="fx-orb fx-orb-c" style={{ ['--depth' as any]: 6 }} />

      {/* 3D rotating glass shards */}
      <span className="fx-shard fx-shard-1" style={{ ['--depth' as any]: 22 }}>
        <span /><span /><span /><span /><span /><span />
      </span>
      <span className="fx-shard fx-shard-2" style={{ ['--depth' as any]: 30 }}>
        <span /><span /><span /><span /><span /><span />
      </span>
      <span className="fx-shard fx-shard-3" style={{ ['--depth' as any]: 18 }}>
        <span /><span /><span /><span /><span /><span />
      </span>

      {/* Foreground sparkle ring */}
      <span className="fx-ring" style={{ ['--depth' as any]: 40 }} />
    </div>
  );
};

export default HeroFx;
