import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, Dumbbell, Instagram, Menu, Moon, Play, Quote, Sun, X, Zap } from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1500&q=85';
const coachImage = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1100&q=85';
const strengthImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85';
const outdoorImage = 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1300&q=85';
const studioImage = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1300&q=85';
const afterImage = 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=900&q=85';
const beforeImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85';

type Testimonial = { quote: string; name: string; detail: string; initials: string; color: string };
const testimonials: Testimonial[] = [
  { quote: 'I stopped treating my body like a problem to solve. Six months in, I am stronger, calmer, and I trust myself around food again.', name: 'Maya R.', detail: '12-week 1:1 coaching', initials: 'MR', color: 'bg-[#f2a08b]' },
  { quote: 'Every session has a purpose, but nothing feels punishing. The best part is that my daughter now sees me choosing movement because I enjoy it.', name: 'Clare W.', detail: 'In-person strength client', initials: 'CW', color: 'bg-[#9cbab0]' },
  { quote: 'Jess met me where I was, not where an app said I should be. I lost 18 lb, but the confidence is the real transformation.', name: 'Talia S.', detail: 'Foundations programme', initials: 'TS', color: 'bg-[#e7c66b]' },
];

const navItems = [
  ['The method', 'method'],
  ['Your coach', 'coach'],
  ['Results', 'results'],
  ['Start here', 'start'],
];

function App() {
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [parallax, setParallax] = useState(0);
  const [slide, setSlide] = useState(0);
  const [compare, setCompare] = useState(52);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calc, setCalc] = useState({ height: '165', weight: '78', age: '34', activity: '1.45' });
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    const onScroll = () => {
      setShowTop(window.scrollY > 700);
      setParallax(Math.min(window.scrollY * 0.12, 70));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('fit-strong-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem('fit-strong-theme');
    if (saved === 'dark') setDark(true);
  }, []);

  useEffect(() => {
    document.title = 'Fit Strong with Jess | Sustainable strength for real life';
    const description = 'Personal strength and weight-loss coaching for women in Bristol who want to feel capable, confident, and at home in their body.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
    [['og:title', 'Fit Strong with Jess | Stronger for life'], ['og:description', description], ['og:type', 'website'], ['og:image', heroImage]].forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    });
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Fit Strong with Jess', description, image: coachImage, telephone: '+44 7700 900 321', address: { '@type': 'PostalAddress', addressLocality: 'Bristol', addressCountry: 'GB' }, areaServed: 'Bristol' });
    document.head.appendChild(ld);
    return () => { document.head.removeChild(ld); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % testimonials.length), 6200);
    return () => window.clearInterval(timer);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }, []);

  const calculated = useMemo(() => {
    const height = Number(calc.height) / 100;
    const weight = Number(calc.weight);
    const age = Number(calc.age);
    const bmi = height > 0 ? weight / (height * height) : 0;
    const bmr = (10 * weight) + (6.25 * Number(calc.height)) - (5 * age) - 161;
    return { bmi: Number.isFinite(bmi) ? bmi.toFixed(1) : '0.0', calories: Math.round(bmr * Number(calc.activity)) || 0 };
  }, [calc]);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    if (!name || !email || !email.includes('@')) { setContactError('Pop in your name and a valid email so Jess can get back to you.'); return; }
    setContactError('');
    setContactSent(true);
    form.reset();
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.includes('@')) { setNewsletterState('error'); return; }
    setNewsletterState('success');
    setNewsletterEmail('');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="noise min-h-[100dvh] bg-background text-foreground transition-colors duration-500">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between px-5 md:px-10">
          <button data-testid="button-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-12"><Dumbbell size={18} strokeWidth={2.5} /></span>
            <span className="text-left font-black leading-none tracking-[-.04em]"><span className="block text-[15px]">FIT STRONG</span><span className="mt-1 block text-[9px] font-bold tracking-[.25em] text-muted-foreground">WITH JESS</span></span>
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map(([label, id]) => <button data-testid={`button-nav-${id}`} key={id} onClick={() => scrollTo(id)} className="text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground">{label}</button>)}
          </nav>
          <div className="flex items-center gap-2">
            <button data-testid="button-theme" aria-label="Toggle dark mode" onClick={() => setDark((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground/5">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button data-testid="button-header-consultation" onClick={() => scrollTo('start')} className="hidden rounded-full bg-primary px-5 py-3 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 md:block">Book a consultation <ArrowDownRight className="ml-1 inline" size={15} /></button>
            <button data-testid="button-mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 md:hidden">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
        {mobileOpen && <div className="border-t border-foreground/10 bg-background px-5 py-5 md:hidden">{navItems.map(([label, id]) => <button data-testid={`button-mobile-nav-${id}`} key={id} onClick={() => scrollTo(id)} className="block w-full border-b border-foreground/10 py-3 text-left text-sm font-semibold">{label}</button>)}<button data-testid="button-mobile-cta" onClick={() => scrollTo('start')} className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground">Book a consultation</button></div>}
      </header>

      <main>
        <section className="relative flex min-h-[780px] items-end overflow-hidden bg-[#173d32] text-[#f6f1e7] md:min-h-[850px]">
          <div className="hero-grid absolute inset-0 opacity-20" />
          <div className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[53%]">
            <img data-testid="img-hero" src={heroImage} alt="Woman lifting weights in a bright gym" className="h-full w-full object-cover object-center opacity-80 mix-blend-luminosity transition-transform duration-100" style={{ transform: `translateY(${parallax}px) scale(1.08)` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#173d32] via-[#173d32]/40 to-transparent md:via-transparent" />
          </div>
          <div className="relative mx-auto w-full max-w-[1340px] px-5 pb-20 pt-40 md:px-10 md:pb-28">
            <div className="max-w-[720px]">
              <div className="reveal flex items-center gap-3 text-[#e7c66b]"><span className="h-px w-10 bg-[#e7c66b]" /><span className="eyebrow">Personal training · Bristol</span></div>
              <h1 className="reveal reveal-delay-1 display-font mt-7 max-w-[750px] text-[clamp(3.5rem,8vw,7.8rem)] font-extrabold leading-[.9] tracking-[-.075em] text-balance">Strong looks <em className="font-medium text-[#f2a08b]">different</em> on everyone.</h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-[440px] text-base leading-7 text-[#e8e6dc]/75 md:text-lg">I help women build a body they trust — with smart training, honest support, and a plan that fits your actual life.</p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <button data-testid="button-hero-start" onClick={() => scrollTo('start')} className="rounded-full bg-[#e7c66b] px-7 py-4 text-sm font-extrabold text-[#173d32] transition-transform hover:-translate-y-1">Let&apos;s work together <ArrowDownRight className="ml-2 inline" size={17} /></button>
                <button data-testid="button-hero-story" onClick={() => scrollTo('coach')} className="flex items-center gap-3 px-2 py-3 text-sm font-semibold text-[#f6f1e7]/80 transition-colors hover:text-[#e7c66b]"><span className="grid h-9 w-9 place-items-center rounded-full border border-[#f6f1e7]/50"><Play size={13} fill="currentColor" /></span> Meet Jess</button>
              </div>
            </div>
            <div className="reveal reveal-delay-3 mt-20 flex items-end justify-between border-t border-[#f6f1e7]/20 pt-5 md:mt-24">
              <p className="max-w-[170px] text-[11px] leading-5 text-[#f6f1e7]/55">No quick fixes.<br />No punishment workouts.</p>
              <div className="hidden text-right text-[#f6f1e7]/55 md:block"><span className="eyebrow block text-[9px]">Scroll to explore</span><ArrowDownRight className="ml-auto mt-2" size={19} /></div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[#e7c66b] text-[#173d32]">
          <div className="mx-auto grid max-w-[1340px] grid-cols-2 md:grid-cols-4">
            <Metric value={240} suffix="+" label="women coached" />
            <Metric value={18} suffix=" lb" label="average first 12 weeks" />
            <Metric value={92} suffix="%" label="still training at 6 months" />
            <Metric value={8} suffix=" yrs" label="coaching experience" />
          </div>
        </section>

        <section id="method" className="mx-auto max-w-[1340px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-14 md:grid-cols-[.8fr_1.2fr] md:gap-24">
            <div className="reveal">
              <span className="eyebrow text-accent">The Fit Strong method</span>
              <h2 className="display-font mt-5 text-5xl font-extrabold leading-[.95] tracking-[-.06em] md:text-7xl">Training that meets you <em className="font-medium text-primary">where you are.</em></h2>
              <p className="mt-7 max-w-[390px] leading-7 text-muted-foreground">This is not about earning your food or shrinking yourself. It is about feeling capable in a body that is well cared for.</p>
              <button data-testid="button-method-start" onClick={() => scrollTo('start')} className="mt-8 border-b-2 border-primary pb-2 text-sm font-bold text-primary">Find your starting point <ArrowRight className="ml-2 inline" size={15} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard index="01" title="Strength first" copy="Learn the lifts, build real muscle, and notice what your body can do." icon={<Dumbbell size={21} />} />
              <MethodCard index="02" title="Food without fear" copy="A flexible nutrition framework that leaves room for dinners, holidays, and life." icon={<Zap size={21} />} />
              <MethodCard index="03" title="Progress that lasts" copy="Simple metrics that celebrate more than a number on the scales." icon={<ArrowUp size={21} />} />
              <MethodCard index="04" title="Support that sees you" copy="A coach who listens closely, tells you the truth, and keeps showing up." icon={<Quote size={21} />} />
            </div>
          </div>
        </section>

        <section id="coach" className="overflow-hidden bg-[#f1ece1] dark:bg-[#201b17]">
          <div className="mx-auto grid max-w-[1340px] items-stretch md:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[520px] overflow-hidden md:min-h-[700px]">
              <img data-testid="img-coach" src={coachImage} alt="Jess, a smiling personal trainer in a black training outfit" className="h-full w-full object-cover object-center grayscale-[15%]" />
              <div className="absolute bottom-6 left-6 bg-[#e7c66b] px-4 py-3 text-[#173d32]"><span className="eyebrow block text-[9px]">Coach / human</span><span className="display-font text-2xl font-bold">Jess Parker</span></div>
            </div>
            <div className="flex flex-col justify-center px-5 py-20 md:px-20 md:py-28">
              <div className="reveal"><span className="eyebrow text-accent">A little about me</span><h2 className="display-font mt-5 max-w-[560px] text-5xl font-extrabold leading-[.95] tracking-[-.06em] md:text-7xl">I know what it&apos;s like to <em className="font-medium text-accent">start again.</em></h2><p className="mt-8 max-w-[520px] text-lg leading-8 text-muted-foreground">For years, I was stuck in the all-or-nothing cycle: overtraining, under-eating, starting over on Monday. The day I learned to train with respect instead of resentment, everything changed.</p><p className="mt-5 max-w-[520px] leading-7 text-muted-foreground">Now I bring that same practical, patient approach to every woman I coach. You do not need more discipline. You need a plan you can return to.</p><div className="mt-10 flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={19} /></span><span className="text-sm font-bold">Certified personal trainer · Nutrition coach</span></div></div>
            </div>
          </div>
        </section>

        <section id="results" className="mx-auto max-w-[1340px] px-5 py-24 md:px-10 md:py-36">
          <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="eyebrow text-accent">The work, in real life</span><h2 className="display-font mt-4 text-5xl font-extrabold leading-[.95] tracking-[-.06em] md:text-7xl">Results you can <em className="font-medium text-primary">feel.</em></h2></div><p className="max-w-[280px] text-sm leading-6 text-muted-foreground">The scale is one piece of the picture. Confidence, energy, and consistency tell the fuller story.</p></div>
          <div className="reveal reveal-delay-1 mt-14 grid gap-5 md:grid-cols-[1.25fr_.75fr]">
            <div className="relative h-[470px] overflow-hidden bg-[#173d32] md:h-[600px]">
              <img data-testid="img-strength" src={strengthImage} alt="Woman performing a barbell squat with a trainer nearby" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173d32] via-transparent to-transparent" /><div className="absolute bottom-7 left-7 text-[#f6f1e7]"><span className="eyebrow text-[#e7c66b]">The win</span><p className="display-font mt-2 max-w-[310px] text-4xl font-bold leading-none">“I carry myself differently now.”</p></div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
              <div className="relative min-h-[290px] overflow-hidden bg-[#e7c66b] p-7 text-[#173d32]"><span className="eyebrow">What changes</span><p className="display-font mt-4 text-4xl font-bold leading-none">More energy for the things you love.</p><ArrowUp className="absolute bottom-7 right-7" size={27} /></div>
              <div className="relative min-h-[290px] overflow-hidden"><img data-testid="img-outdoor" src={outdoorImage} alt="Woman hiking on a sunny mountain trail" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[#173d32]/45" /><p className="absolute bottom-7 left-7 max-w-[220px] font-semibold leading-6 text-[#f6f1e7]">A stronger body makes the rest of life feel a little more possible.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-[#173d32] px-5 py-24 text-[#f6f1e7] md:px-10 md:py-32">
          <div className="mx-auto grid max-w-[1340px] gap-16 md:grid-cols-[.7fr_1.3fr] md:items-center">
            <div className="reveal"><span className="eyebrow text-[#e7c66b]">A fair comparison</span><h2 className="display-font mt-5 text-5xl font-extrabold leading-[.95] tracking-[-.06em] md:text-7xl">Your progress is <em className="font-medium text-[#f2a08b]">yours.</em></h2><p className="mt-7 max-w-[370px] leading-7 text-[#f6f1e7]/65">No borrowed timelines. No staged “after” pictures. Just a visual reminder that change is made one ordinary week at a time.</p></div>
            <div className="reveal reveal-delay-1">
              <div className="relative aspect-[1.65] overflow-hidden border border-[#f6f1e7]/25">
                <img data-testid="img-before-after" src={beforeImage} alt="Woman training in a gym, before and after progress comparison" className="absolute inset-0 h-full w-full object-cover grayscale-[20%]" />
                <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${compare}%` }}><img src={afterImage} alt="Woman showing her strength progress" className="h-full w-[calc(100vw-40px)] max-w-none object-cover grayscale-[10%] md:w-[760px]" /></div>
                <div className="absolute inset-y-0" style={{ left: `${compare}%` }}><div className="h-full w-0.5 bg-[#e7c66b]" /><div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e7c66b] text-[#173d32]"><ArrowLeft size={13} /><ArrowRight size={13} /></div></div>
                <span className="absolute bottom-4 left-4 bg-[#173d32]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em]">Starting point</span><span className="absolute bottom-4 right-4 bg-[#e7c66b] px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#173d32]">Stronger today</span>
              </div>
              <input data-testid="input-progress-slider" aria-label="Compare progress images" type="range" min="10" max="90" value={compare} onChange={(event) => setCompare(Number(event.target.value))} className="mt-5 w-full accent-[#e7c66b]" />
            </div>
          </div>
        </section>

        <section className="bg-[#f1ece1] px-5 py-24 dark:bg-[#201b17] md:px-10 md:py-32">
          <div className="mx-auto max-w-[930px]">
            <div className="reveal text-center"><span className="eyebrow text-accent">Words from the strong women</span><h2 className="display-font mt-5 text-5xl font-extrabold leading-[.95] tracking-[-.06em] md:text-7xl">You don&apos;t have to<br /><em className="font-medium text-primary">take our word for it.</em></h2></div>
            <div className="reveal reveal-delay-1 relative mt-16 min-h-[330px]">
              <Quote className="absolute -left-3 -top-5 text-accent/30 md:-left-12" size={65} strokeWidth={1} />
              <div className="mx-auto max-w-[760px] text-center"><p data-testid="text-testimonial-quote" className="display-font text-3xl font-bold leading-tight tracking-[-.04em] md:text-5xl">“{testimonials[slide].quote}”</p><div className="mt-10 flex items-center justify-center gap-3"><span className={`grid h-11 w-11 place-items-center rounded-full text-xs font-black text-[#173d32] ${testimonials[slide].color}`}>{testimonials[slide].initials}</span><div className="text-left"><p data-testid="text-testimonial-name" className="text-sm font-bold">{testimonials[slide].name}</p><p className="text-xs text-muted-foreground">{testimonials[slide].detail}</p></div></div></div>
              <div className="mt-10 flex items-center justify-center gap-3"><button data-testid="button-testimonial-prev" aria-label="Previous testimonial" onClick={() => setSlide((slide - 1 + testimonials.length) % testimonials.length)} className="grid h-11 w-11 place-items-center rounded-full border border-foreground/20 transition-colors hover:bg-foreground/10"><ArrowLeft size={17} /></button>{testimonials.map((item, index) => <button data-testid={`button-testimonial-dot-${index}`} aria-label={`Show testimonial ${index + 1}`} key={item.name} onClick={() => setSlide(index)} className={`h-1.5 rounded-full transition-all ${index === slide ? 'w-9 bg-primary' : 'w-1.5 bg-foreground/25'}`} />)}<button data-testid="button-testimonial-next" aria-label="Next testimonial" onClick={() => setSlide((slide + 1) % testimonials.length)} className="grid h-11 w-11 place-items-center rounded-full border border-foreground/20 transition-colors hover:bg-foreground/10"><ArrowRight size={17} /></button></div>
            </div>
          </div>
        </section>

        <section id="start" className="mx-auto max-w-[1340px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-16 md:grid-cols-[.8fr_1.2fr] md:gap-24">
            <div className="reveal"><span className="eyebrow text-accent">Start here</span><h2 className="display-font mt-5 text-5xl font-extrabold leading-[.95] tracking-[-.06em] md:text-7xl">A plan that starts with <em className="font-medium text-primary">you.</em></h2><p className="mt-7 max-w-[390px] leading-7 text-muted-foreground">Tell me what you want to change, what has got in the way, and what your life looks like right now. We will make a plan from there.</p><div className="mt-10 border-l-2 border-[#e7c66b] pl-5"><p className="text-sm font-bold">Not ready to talk yet?</p><button data-testid="button-calculator-open" onClick={() => setCalculatorOpen(true)} className="mt-2 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4">Try the free numbers check</button></div></div>
            <div className="reveal reveal-delay-1">
              {contactSent ? <div data-testid="status-contact-success" className="flex min-h-[520px] flex-col justify-center bg-[#173d32] p-8 text-[#f6f1e7] md:p-14"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#e7c66b] text-[#173d32]"><Check /></span><h3 className="display-font mt-7 text-5xl font-bold leading-none">Message received.</h3><p className="mt-5 max-w-[400px] leading-7 text-[#f6f1e7]/70">Thanks for reaching out. Jess will read your note and reply within two working days.</p><button data-testid="button-contact-reset" onClick={() => setContactSent(false)} className="mt-8 self-start border-b border-[#e7c66b] pb-1 text-sm font-bold text-[#e7c66b]">Send another message</button></div> : <form data-testid="form-contact" onSubmit={submitContact} className="bg-[#f1ece1] p-6 dark:bg-[#201b17] md:p-12"><div className="grid gap-6 sm:grid-cols-2"><label className="text-sm font-bold">Your name<input data-testid="input-contact-name" name="name" required placeholder="First name" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" /></label><label className="text-sm font-bold">Email address<input data-testid="input-contact-email" name="email" type="email" required placeholder="you@example.com" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" /></label></div><label className="mt-8 block text-sm font-bold">What would you like support with?<select data-testid="select-contact-goal" name="goal" className="mt-2 w-full border-b border-foreground/25 bg-transparent px-0 py-3 text-base outline-none focus:border-primary"><option>Building strength</option><option>Weight loss without extremes</option><option>Getting consistent again</option><option>Feeling confident in the gym</option></select></label><label className="mt-8 block text-sm font-bold">A little about where you are<textarea data-testid="textarea-contact-message" name="message" rows={3} placeholder="The more context, the better..." className="mt-2 w-full resize-none border-b border-foreground/25 bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground/60 focus:border-primary" /></label>{contactError && <p data-testid="status-contact-error" className="mt-5 text-sm font-semibold text-destructive">{contactError}</p>}<button data-testid="button-contact-submit" type="submit" className="mt-9 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-1">Send my enquiry <ArrowDownRight className="ml-2 inline" size={16} /></button><p className="mt-5 text-xs text-muted-foreground">No pressure, no spam. Just a proper conversation.</p></form>}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-[#e7c66b] px-5 py-20 text-[#173d32] md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1340px] gap-10 md:grid-cols-[1fr_auto] md:items-end"><div><span className="eyebrow">Useful, not overwhelming</span><h2 className="display-font mt-4 text-5xl font-extrabold leading-none tracking-[-.06em] md:text-6xl">A little support in your inbox.</h2><p className="mt-5 max-w-[480px] text-sm leading-6 text-[#173d32]/70">Monthly training notes, realistic nutrition ideas, and reminders for the weeks when motivation goes missing.</p></div><form data-testid="form-newsletter" onSubmit={submitNewsletter} className="w-full max-w-[410px]"><div className="flex border-b-2 border-[#173d32] py-2"><input data-testid="input-newsletter-email" value={newsletterEmail} onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterState('idle'); }} type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[#173d32]/60" /><button data-testid="button-newsletter-submit" type="submit" aria-label="Sign up for newsletter" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#173d32] text-[#e7c66b] transition-transform hover:scale-105"><ArrowRight size={17} /></button></div>{newsletterState === 'success' && <p data-testid="status-newsletter-success" className="mt-3 text-sm font-bold">You&apos;re on the list. See you in your inbox.</p>}{newsletterState === 'error' && <p data-testid="status-newsletter-error" className="mt-3 text-sm font-bold">That email needs one small fix — try again?</p>}</form></div>
        </section>
      </main>

      <footer className="bg-[#173d32] px-5 py-14 text-[#f6f1e7] md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1340px] gap-12 md:grid-cols-[1fr_auto_auto]"><div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#e7c66b] text-[#173d32]"><Dumbbell size={18} /></span><span className="font-black tracking-[-.04em]">FIT STRONG <span className="font-normal text-[#e7c66b]">WITH JESS</span></span></div><p className="mt-6 max-w-[290px] text-sm leading-6 text-[#f6f1e7]/55">Sustainable strength and weight-loss coaching for women in Bristol.</p></div><div><span className="eyebrow text-[#e7c66b]">Explore</span><div className="mt-5 grid gap-3 text-sm text-[#f6f1e7]/75">{navItems.slice(0, 3).map(([label, id]) => <button data-testid={`button-footer-${id}`} key={id} onClick={() => scrollTo(id)} className="text-left transition-colors hover:text-[#e7c66b]">{label}</button>)}</div></div><div><span className="eyebrow text-[#e7c66b]">Say hello</span><a data-testid="link-instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-2 text-sm text-[#f6f1e7]/75 transition-colors hover:text-[#e7c66b]"><Instagram size={17} /> @fitstrongwithjess</a><p className="mt-3 text-sm text-[#f6f1e7]/50">Bristol, UK · In person</p></div></div><div className="mx-auto mt-14 flex max-w-[1340px] flex-col justify-between gap-3 border-t border-[#f6f1e7]/15 pt-5 text-[11px] text-[#f6f1e7]/40 md:flex-row"><span>© {new Date().getFullYear()} Fit Strong with Jess</span><span>Strong for life, not just summer.</span></div>
      </footer>

      {showTop && <button data-testid="button-scroll-top" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-[#e7c66b] text-[#173d32] shadow-warm transition-transform hover:-translate-y-1"><ArrowUp size={18} /></button>}
      {calculatorOpen && <Calculator values={calc} setValues={setCalc} result={calculated} onClose={() => setCalculatorOpen(false)} onContact={() => { setCalculatorOpen(false); window.setTimeout(() => document.getElementById('start')?.scrollIntoView({ behavior: 'smooth' }), 50); }} />}
    </div>
  );
}

function LoadingScreen() {
  return <div data-testid="status-loading" className="grid min-h-[100dvh] place-items-center bg-[#173d32] text-[#f6f1e7]"><div className="text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e7c66b] text-[#173d32]"><Dumbbell size={22} /></span><p className="eyebrow mt-5 text-[#e7c66b]">Fit strong with Jess</p><div className="mx-auto mt-5 h-0.5 w-32 overflow-hidden bg-[#f6f1e7]/20"><div className="h-full w-1/2 animate-pulse bg-[#e7c66b]" /></div></div></div>;
}

function Metric({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let current = 0; const step = Math.max(1, Math.round(value / 35));
      const timer = window.setInterval(() => { current = Math.min(value, current + step); setCount(current); if (current >= value) window.clearInterval(timer); }, 28);
      observer.disconnect();
      return () => window.clearInterval(timer);
    }, { threshold: .5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <div ref={ref} data-testid={`metric-${label.replaceAll(' ', '-')}`} className="border-r border-[#173d32]/15 px-4 py-6 first:border-l md:px-8 md:py-7"><p className="display-font text-4xl font-bold leading-none md:text-5xl">{count}<span className="text-2xl">{suffix}</span></p><p className="mt-2 text-[10px] font-bold uppercase tracking-[.13em] opacity-65">{label}</p></div>;
}

function MethodCard({ index, title, copy, icon }: { index: string; title: string; copy: string; icon: ReactNode }) {
  return <article data-testid={`card-method-${index}`} className="group border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/60 sm:p-8"><div className="flex items-start justify-between"><span className="eyebrow text-muted-foreground">{index}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">{icon}</span></div><h3 className="display-font mt-12 text-3xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>;
}

function Calculator({ values, setValues, result, onClose, onContact }: { values: { height: string; weight: string; age: string; activity: string }; setValues: (value: { height: string; weight: string; age: string; activity: string }) => void; result: { bmi: string; calories: number }; onClose: () => void; onContact: () => void }) {
  const update = (key: keyof typeof values, value: string) => setValues({ ...values, [key]: value });
  return <div data-testid="dialog-calculator" className="fixed inset-0 z-50 grid place-items-center bg-[#173d32]/80 p-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="relative max-h-[90vh] w-full max-w-[560px] overflow-auto bg-background p-7 shadow-2xl md:p-10"><button data-testid="button-calculator-close" aria-label="Close calculator" onClick={onClose} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-foreground/15"><X size={17} /></button><span className="eyebrow text-accent">Free numbers check</span><h2 className="display-font mt-4 max-w-[390px] text-4xl font-bold leading-none">A useful starting point, not a verdict.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">These estimates are for context only. Your body is more than a formula.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><CalcInput label="Height (cm)" value={values.height} onChange={(value) => update('height', value)} /><CalcInput label="Weight (kg)" value={values.weight} onChange={(value) => update('weight', value)} /><CalcInput label="Age" value={values.age} onChange={(value) => update('age', value)} /><label className="text-xs font-bold">Usual activity<select data-testid="select-calculator-activity" value={values.activity} onChange={(event) => update('activity', event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent py-2 text-sm outline-none"><option value="1.2">Mostly sitting</option><option value="1.45">Some movement</option><option value="1.65">Regular training</option><option value="1.8">Very active</option></select></label></div><div className="mt-10 grid grid-cols-2 gap-3"><div className="bg-secondary p-5"><span className="eyebrow text-muted-foreground">BMI estimate</span><p data-testid="text-calculator-bmi" className="display-font mt-2 text-4xl font-bold">{result.bmi}</p></div><div className="bg-[#e7c66b] p-5 text-[#173d32]"><span className="eyebrow">Daily energy</span><p data-testid="text-calculator-calories" className="display-font mt-2 text-4xl font-bold">{result.calories.toLocaleString()}</p><p className="text-[10px] font-bold uppercase tracking-wider opacity-70">approx. calories</p></div></div><p className="mt-6 text-xs leading-5 text-muted-foreground">Want to make sense of the numbers without letting them run the show?</p><button data-testid="button-calculator-contact" onClick={onContact} className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Talk it through with Jess <ArrowRight className="ml-1 inline" size={15} /></button></div></div>;
}

function CalcInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-xs font-bold">{label}<input data-testid={`input-calculator-${label.split(' ')[0].toLowerCase()}`} type="number" value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border-b border-foreground/25 bg-transparent py-2 text-sm outline-none focus:border-primary" /></label>;
}

export default App;