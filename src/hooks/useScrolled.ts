import { useEffect, useState } from 'react';

/** Indique si la page a défilé (pour donner un fond à la navbar). La navbar reste toujours visible. */
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return scrolled;
}
