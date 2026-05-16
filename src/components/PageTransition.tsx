import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

/** Wraps page content with a key-bound fade/slide transition on route change. */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
};

export default PageTransition;
