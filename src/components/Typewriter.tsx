import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

type Props = {
  text: string;
  /** Délai avant la première frappe, en ms. */
  delay?: number;
  /** Durée moyenne entre deux caractères, en ms. */
  speed?: number;
  className?: string;
  onDone?: () => void;
};

/**
 * Frappe le texte caractère par caractère, avec une cadence irrégulière :
 * une frappe parfaitement régulière sonne mécanique. Le texte complet est
 * présent dans le DOM pour les lecteurs d'écran dès le premier rendu.
 */
export default function Typewriter({
  text,
  delay = 0,
  speed = 34,
  className,
  onDone,
}: Props) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text : ''));
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (prefersReducedMotion()) {
      doneRef.current?.();
      return;
    }

    let index = 0;
    let timer: number;

    const step = () => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) {
        doneRef.current?.();
        return;
      }
      // Une pause plus longue après la ponctuation, comme une vraie frappe.
      const char = text[index - 1];
      const pause = /[.,;:—]/.test(char) ? speed * 7 : speed * (0.6 + Math.random());
      timer = window.setTimeout(step, pause);
    };

    timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
