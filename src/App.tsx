import { useSmoothScroll } from './lib/motion';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import { identity } from './data/content';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#projets">
        Aller au contenu
      </a>
      <div className="grid-rule" aria-hidden="true" />

      <Nav />

      <main>
        <Hero />
        <Projects />
        <Experience />
        <About />
        <Skills />
        <Contact />
      </main>

      <footer className="footer">
        <div className="shell footer__inner">
          <span className="footer__name">
            {identity.lastName} {identity.firstName}
          </span>
          <span className="footer__built">
            Construit avec React, GSAP, Three.js
          </span>
          <a className="footer__top" href="#top">
            Haut de page
          </a>
        </div>
      </footer>
    </>
  );
}
