import { useLayoutEffect, useRef, useState } from 'react';
import { identity } from '../data/content';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { ArrowUpRight, Github, Linkedin, Mail, Phone, Pin } from './icons';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('.contact__claim', {
        clipPath: 'inset(0 0 100% 0)',
        y: 28,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 72%' },
      });

      gsap.from(['.contact__line', '.contact__form'], {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 68%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: Errors = {};
    if (!name) next.name = 'Indiquez votre nom pour que je sache qui écrit.';
    if (!email) next.email = 'Indiquez une adresse pour que je puisse répondre.';
    else if (!EMAIL_RE.test(email))
      next.email = 'Cette adresse est incomplète — vérifiez le @ et le domaine.';
    if (!message) next.message = 'Écrivez quelques mots sur votre projet.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Pas de back-end : le formulaire compose le courriel et le remet au
    // client de messagerie. Rien n'est perdu en silence.
    const subject = encodeURIComponent(`Portfolio — message de ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${identity.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="shell">
        <div className="section-head">
          <span className="section-head__prompt" aria-hidden="true">
            $
          </span>
          <h2 className="section-head__title">./contacter</h2>
        </div>

        <div className="contact__grid">
          <div className="contact__aside">
            <p className="contact__claim">
              Un projet, une équipe à renforcer, une idée à mettre en
              production&nbsp;?
            </p>

            <ul className="contact__lines">
              <li className="contact__line">
                <Mail className="contact__icon" />
                <a href={`mailto:${identity.email}`}>{identity.email}</a>
              </li>
              <li className="contact__line">
                <Phone className="contact__icon" />
                <a href={`tel:${identity.phoneHref}`}>{identity.phone}</a>
              </li>
              <li className="contact__line">
                <Pin className="contact__icon" />
                <span>{identity.location}</span>
              </li>
            </ul>

            <div className="contact__social">
              <a
                className="social-btn"
                href={identity.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github className="social-btn__glyph" />
                <span className="social-btn__label">
                  {identity.githubLabel}
                </span>
                <ArrowUpRight className="social-btn__go" />
              </a>
              <a
                className="social-btn"
                href={identity.linkedin}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Linkedin className="social-btn__glyph" />
                <span className="social-btn__label">
                  {identity.linkedinLabel}
                </span>
                <ArrowUpRight className="social-btn__go" />
              </a>
            </div>
          </div>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Votre nom"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className="field__error" id="name-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p className="field__error" id="email-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Quelques mots sur ce que vous voulez construire."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p className="field__error" id="message-error" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <button className="btn btn--solid contact__send" type="submit">
              Envoyer le message
              <ArrowUpRight className="btn__icon" />
            </button>

            <p className="contact__note" role="status">
              {sent
                ? 'Votre client de messagerie vient de s’ouvrir avec le message prérempli.'
                : 'Le formulaire ouvre votre messagerie avec le message prérempli.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
