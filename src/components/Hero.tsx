import { motion } from 'framer-motion';
import { Suspense, lazy, useState } from 'react';

// Three.js pèse plus que tout le reste de la page réunie. Le fond n'est
// pas nécessaire à la lecture : il arrive après, sans retarder le texte.
const CircuitField = lazy(() => import('./CircuitField'));
import Typewriter from './Typewriter';
import { identity } from '../data/content';
import { ArrowDown, ArrowUpRight, Github, Linkedin } from './icons';
import { prefersReducedMotion } from '../lib/motion';

const line = {
  hidden: { clipPath: 'inset(0 0 100% 0)', y: '0.28em' },
  show: (i: number) => ({
    clipPath: 'inset(0 0 -20% 0)',
    y: 0,
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 + i * 0.11 },
  }),
};

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 + i * 0.09 },
  }),
};

export default function Hero() {
  const [typed, setTyped] = useState(prefersReducedMotion());

  return (
    <section className="hero" id="top">
      <Suspense fallback={null}>
        <CircuitField />
      </Suspense>

      <div className="hero__inner shell">
        <h1 className="hero__name">
          <motion.span
            className="hero__name-line"
            variants={line}
            initial="hidden"
            animate="show"
            custom={0}
          >
            {identity.lastName}
          </motion.span>
          <motion.span
            className="hero__name-line hero__name-line--given"
            variants={line}
            initial="hidden"
            animate="show"
            custom={1}
          >
            {identity.firstName}
          </motion.span>
        </h1>

        <motion.p
          className="hero__role"
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0}
        >
          {identity.role}
          <span className="hero__sep" aria-hidden="true">
            ::
          </span>
          {identity.specialty}
        </motion.p>

        <motion.p
          className="hero__pitch"
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1}
        >
          <span className="hero__prompt" aria-hidden="true">
            $
          </span>
          <Typewriter
            text={identity.pitch}
            delay={1250}
            speed={26}
            onDone={() => setTyped(true)}
          />
          <span className="caret" aria-hidden="true" />
        </motion.p>

        <motion.div
          className="hero__actions"
          variants={fade}
          initial="hidden"
          animate="show"
          custom={2}
        >
          <a className="btn btn--solid" href="#projets">
            Voir mes projets
            <ArrowDown className="btn__icon" />
          </a>
          <a className="btn btn--ghost" href="#contact">
            Me contacter
            <ArrowUpRight className="btn__icon" />
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero__rail shell"
        variants={fade}
        initial="hidden"
        animate="show"
        custom={3}
      >
        <span className="hero__loc">{identity.location}</span>

        <div className="hero__social">
          <a
            href={identity.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`GitHub — ${identity.githubLabel}`}
          >
            <Github />
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`LinkedIn — ${identity.linkedinLabel}`}
          >
            <Linkedin />
          </a>
        </div>

        <span className={`hero__cue${typed ? ' is-ready' : ''}`} aria-hidden="true">
          défiler
          <i className="hero__cue-track">
            <i className="hero__cue-dot" />
          </i>
        </span>
      </motion.div>
    </section>
  );
}
