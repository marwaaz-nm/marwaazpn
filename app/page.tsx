"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";
import { z } from "zod";
import {
  ArrowRight, Award, BadgeCheck, BriefcaseBusiness, Building2, CalendarCheck2,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3,
  FileCheck2, Files, FileSignature, Handshake, Headphones, KeyRound,
  Landmark, Languages, LockKeyhole, Mail, MapPin, Menu, MessageCircle,
  Moon, Navigation, Phone, QrCode, Scale, ScanLine, ScrollText, Shield,
  ShieldCheck, Stamp, Star, Sun, Upload, UserRoundCheck, UsersRound, X, XCircle,
  type LucideIcon,
} from "lucide-react";

const services: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Kala Wareejinta Guryaha iyo Beeraha", description: "Diyaarinta iyo sugidda dukumentiyada kala wareejinta guryaha iyo beeraha.", icon: Building2 },
  { title: "Kala Wareejinta Baabuurta iyo Dhulalka", description: "Habaynta heshiisyada iyo caddeymaha lahaanshaha baabuurta iyo dhulalka.", icon: Landmark },
  { title: "Kala Wareejinta Hantida Guurtada iyo Maguurtada", description: "Sugidda wareejinta hantida guurta iyo tan maguurtada ah si sharci waafaqsan.", icon: BriefcaseBusiness },
  { title: "Kala Wareejinta Hantida Sharciyeysan", description: "Diiwaangelin iyo xaqiijin rasmi ah oo loo sameeyo hantida sharciyeysan.", icon: ShieldCheck },
  { title: "Kala Wareejinta Saamiyada Shirkadaha", description: "Diyaarinta dukumentiyada wareejinta saamiyada iyo xuquuqda shirkadaha.", icon: UsersRound },
  { title: "Qorista iyo Diyaarinta Araaji'da Dacwooyinka", description: "Qorista araajida dacwooyinka si hufan oo waafaqsan habraaca sharciga.", icon: ScrollText },
  { title: "Qorista Mucaamalaadka", description: "Qorista iyo habaynta mucaamalaadka rasmiga ah ee shaqsiyaadka iyo hay'adaha.", icon: FileSignature },
  { title: "Diyaarinta iyo Sugidda Heshiisyada Sharciga Waafaqsan", description: "Diyaarinta heshiisyo cad oo ilaalinaya xuquuqda dhammaan dhinacyada.", icon: Handshake },
  { title: "Diyaarinta iyo Sugidda Lahaanshaha iyo Isla Lahaanshaha", description: "Caddeynta lahaanshaha ama isla lahaanshaha hanti si rasmi ah.", icon: Files },
  { title: "Diyaarinta iyo Sugidda Damaanadaha Sharciga Waafaqsan", description: "Qorista iyo xaqiijinta damaanado leh awood sharciyeed oo cad.", icon: BadgeCheck },
];

const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Trusted Legal Services", description: "A careful, accountable process for every client.", icon: ShieldCheck },
  { title: "Fast Processing", description: "Efficient service without compromising accuracy.", icon: Clock3 },
  { title: "Secure Documentation", description: "Controlled handling from submission to completion.", icon: LockKeyhole },
  { title: "Professional Staff", description: "Experienced support with courteous communication.", icon: UserRoundCheck },
  { title: "Modern Verification", description: "Reference and QR-enabled document checks.", icon: ScanLine },
  { title: "Government Standards", description: "Procedures aligned with official requirements.", icon: Landmark },
  { title: "Privacy Protection", description: "Confidentiality is built into every interaction.", icon: Shield },
  { title: "Excellent Support", description: "Responsive assistance before and after your visit.", icon: Headphones },
];

const faqs = [
  ["How can I notarize a document?", "Bring the original document and valid identification to our Baidoa office. Our team will review the document, confirm identity, witness signatures where required, and complete the notarial certificate."],
  ["What documents are required?", "Requirements vary by service, but you should generally bring the original document, a valid photo ID, and any supporting records. Contact us beforehand for service-specific guidance."],
  ["How long does the process take?", "Most standard services are completed during one visit. Complex contracts, property files, or documents requiring additional review may take longer."],
  ["Can I verify documents online?", "Yes. Enter the official reference number in our verification tool. Documents issued through our modern register can be checked instantly."],
  ["Do I need an appointment?", "Walk-ins are welcome during working hours, but an appointment gives you priority and helps us prepare for specialized services."],
];

const testimonials = [
  { name: "Amina Hassan", role: "Business owner", review: "The team explained every step clearly and completed our company documents quickly. Professional, respectful, and very reliable.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80" },
  { name: "Abdullahi Nur", role: "Property client", review: "I appreciated the careful document checks and confidentiality. The verification reference also gives our family real peace of mind.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80" },
  { name: "Hodan Ali", role: "Institutional client", review: "Marwaaz combines a welcoming service with the standards we expect from a modern legal office. I confidently recommend them.", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80" },
];

const gallery = [
  ["Office", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82"],
  ["Reception", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=82"],
  ["Legal documents", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=82"],
  ["Meeting room", "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=82"],
  ["Signing process", "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=82"],
  ["Official records", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=700&q=82"],
  ["Certificates", "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=900&q=82"],
];

const team = [
  { name: "Mohamed A. Hassan", role: "Principal Notary", experience: "12+ years in legal documentation", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=82" },
  { name: "Hodan M. Ali", role: "Senior Legal Officer", experience: "8+ years in client advisory", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=82" },
  { name: "Abdirahman Nur", role: "Verification Officer", experience: "6+ years in document controls", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=82" },
];

const bookingSchema = z.object({
  fullName: z.string().min(3, "Please enter your full name"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please choose a date"),
  time: z.string().min(1, "Please choose a time"),
  message: z.string().max(500, "Please keep your message under 500 characters").optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;
type VerificationState = "valid" | "invalid" | null;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

function SectionHeading({ eyebrow, title, copy, align = "center" }: { eyebrow: string; title: string; copy?: string; align?: "center" | "left" }) {
  return (
    <motion.div className={`section-heading ${align === "left" ? "align-left" : ""}`} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
      <span className="eyebrow"><span />{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </motion.div>
  );
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const number = useMotionValue(0);
  const display = useTransform(number, (current) => `${Math.round(current).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(number, value, { duration: 1.8, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, number, value]);

  return <div className="stat" ref={ref}><motion.strong>{display}</motion.strong><span>{label}</span></div>;
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [verificationRef, setVerificationRef] = useState("");
  const [verification, setVerification] = useState<VerificationState>(null);
  const [testimonial, setTestimonial] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const scannerRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BookingForm>({ resolver: zodResolver(bookingSchema) });

  useEffect(() => {
    const shouldUseDark = window.localStorage.getItem("marwaaz-theme") === "dark";
    setDark(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("marwaaz-theme", next ? "dark" : "light");
  };

  const verify = () => {
    const normalized = verificationRef.trim().toUpperCase();
    setVerification(normalized === "MNP-2026-04141" || normalized === "MZ-04141" ? "valid" : "invalid");
  };

  const onBook = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setSubmitted(true);
    reset();
  };

  const activeTestimonial = testimonials[testimonial];
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const jsonLd = { "@context": "https://schema.org", "@type": "Notary", name: "Marwaaz Public Notary", description: "Professional public notary services in Baidoa, Somalia.", telephone: "+252617414141", address: { "@type": "PostalAddress", addressLocality: "Baidoa", addressCountry: "SO" }, openingHours: "Sa-Th 07:30-19:30", areaServed: "Baidoa, Somalia" };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Marwaaz Public Notary home"><span className="brand-mark"><img src="/logo.png" alt="" /></span><span><strong>MARWAAZ</strong><small>PUBLIC NOTARY</small></span></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          {[["About", "about"], ["Services", "services"], ["Verify", "verify"], ["Team", "team"], ["Contact", "contact"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-appointment" href="#appointment" onClick={() => setMenuOpen(false)}>Book appointment</a>
        </nav>
        <div className="header-actions"><button className="icon-button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
      </header>

      <section id="top" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div className="trust-chip" variants={fadeUp}><BadgeCheck size={17} /> Professional • Confidential • Verified</motion.div>
          <motion.p className="hero-kicker" variants={fadeUp}>Public notary services · Baidoa, Somalia</motion.p>
          <motion.h1 variants={fadeUp}>Documents that carry<br /><em>trust, wherever they go.</em></motion.h1>
          <motion.p className="hero-copy" variants={fadeUp}>Trusted legal authentication, notarization, property documentation, and professional legal support—delivered with integrity, confidentiality, and efficiency.</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}><a className="button button-gold" href="#appointment"><CalendarCheck2 size={19} />Book Appointment</a><a className="button button-ghost" href="#verify"><QrCode size={19} />Verify Document</a></motion.div>
        </motion.div>
        <motion.aside className="hero-assurance glass-card" initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
          <div className="assurance-seal"><ShieldCheck size={37} /><span>MARWAAZ<small>AUTHENTICATED</small></span></div><div><span className="live-dot" />Verification system online</div><p>Every registered document can be checked through its unique reference.</p><a href="#verify">Check a reference <ArrowRight size={15} /></a>
        </motion.aside>
        <a href="#about" className="scroll-cue" aria-label="Scroll to about section"><span>Discover</span><ChevronDown size={19} /></a>
      </section>

      <div className="credibility-strip"><span><ShieldCheck size={18} />Confidential handling</span><span><BadgeCheck size={18} />Verified documents</span><span><Clock3 size={18} />Efficient processing</span><span><Award size={18} />Professional standards</span></div>

      <section id="about" className="section about-section">
        <div className="about-visual"><motion.div className="about-image" initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}><img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1100&q=85" alt="Legal documents arranged on a professional desk" /><div className="experience-card"><strong>Trusted</strong><span>Legal documentation with care</span></div></motion.div></div>
        <motion.div className="about-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span className="eyebrow" variants={fadeUp}><span />ABOUT MARWAAZ</motion.span><motion.h2 variants={fadeUp}>Precision in every signature.<br />Confidence in every document.</motion.h2><motion.p variants={fadeUp}>Marwaaz Public Notary provides reliable and professional notarial services for individuals, businesses, institutions, and government organizations. Our mission is to ensure every legal document is authenticated accurately, securely, and according to applicable legal procedures.</motion.p>
          <motion.div className="values" variants={fadeUp}>{["Integrity", "Professionalism", "Confidentiality", "Accuracy", "Transparency", "Client satisfaction"].map((value) => <span key={value}><Check size={14} />{value}</span>)}</motion.div><motion.a className="text-link" href="#services" variants={fadeUp}>Explore our services <ArrowRight size={16} /></motion.a>
        </motion.div>
      </section>

      <section id="services" className="section section-tint">
        <SectionHeading eyebrow="ADEEGYADA NOOTAAYADA" title="Adeegyo sharciyeed oo lagu kalsoonaan karo" copy="Waxaan si xirfad, hufnaan iyo masuuliyad leh u diyaarinnaa una sugnaa mucaamalaadka, heshiisyada iyo kala wareejinta hantida." />
        <div className="service-grid">{services.map((service, index) => { const Icon = service.icon; return <motion.article className="service-card" key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: (index % 4) * 0.06, duration: 0.45 }} whileHover={{ y: -7 }}><div className="service-icon"><Icon size={24} /></div><h3>{service.title}</h3><p>{service.description}</p><a href="#appointment">Faahfaahin <ArrowRight size={14} /></a></motion.article>; })}</div>
      </section>

      <section className="stats-section" aria-label="Marwaaz statistics"><div className="stats-copy"><span className="eyebrow light"><span />PROVEN SERVICE</span><h2>Built on thousands of moments of trust.</h2></div><div className="stats-grid"><StatCounter value={5000} suffix="+" label="Documents authenticated" /><StatCounter value={1500} suffix="+" label="Satisfied clients" /><StatCounter value={15} suffix="+" label="Professional services" /><StatCounter value={99} suffix="%" label="Client satisfaction" /></div></section>

      <section className="section choose-section"><SectionHeading eyebrow="WHY MARWAAZ" title="A modern standard of notarial care" copy="Legal credibility is earned through consistent processes, secure handling, and clear client communication." align="left" /><div className="reason-grid">{reasons.map((reason, index) => { const Icon = reason.icon; return <motion.article key={reason.title} className="reason-card" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.07 }}><span><Icon size={21} /></span><div><h3>{reason.title}</h3><p>{reason.description}</p></div></motion.article>; })}</div></section>

      <section id="verify" className="section verification-section">
        <div className="verification-copy"><span className="eyebrow light"><span />DIGITAL VERIFICATION</span><h2>Confirm authenticity in seconds.</h2><p>Enter the official reference printed on a Marwaaz document. Our system will confirm whether it is registered and valid.</p><ul><li><CheckCircle2 size={18} />Instant status confirmation</li><li><CheckCircle2 size={18} />QR-enabled records</li><li><CheckCircle2 size={18} />Secure reference matching</li></ul><div className="demo-reference"><span>Demo reference</span><button onClick={() => setVerificationRef("MNP-2026-04141")}>MNP-2026-04141</button></div></div>
        <div className="verification-console glass-card">
          <div className="console-heading"><div><span className="console-icon"><QrCode size={23} /></span><div><strong>Document verification</strong><small>Secure registry access</small></div></div><span className="secure-label"><LockKeyhole size={13} />Secure</span></div>
          <label htmlFor="reference">Reference number</label><div className="verify-input"><input id="reference" value={verificationRef} onChange={(e) => { setVerificationRef(e.target.value); setVerification(null); }} placeholder="e.g. MNP-2026-04141" onKeyDown={(e) => e.key === "Enter" && verify()} /><button onClick={verify}>Verify</button></div>
          <input ref={scannerRef} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={() => { setVerificationRef("MNP-2026-04141"); setVerification("valid"); }} aria-label="Upload or capture a QR code" /><button className="scan-button" onClick={() => scannerRef.current?.click()}><ScanLine size={18} />Scan QR code with camera</button>
          <AnimatePresence mode="wait">{verification && <motion.div key={verification} className={`result-card ${verification}`} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
            {verification === "valid" ? <><div className="result-status"><span><CheckCircle2 size={22} /></span><div><strong>Document is valid</strong><small>Verified against the official register</small></div></div><div className="result-details"><dl><div><dt>Document no.</dt><dd>MNP-2026-04141</dd></div><div><dt>Owner name</dt><dd>Abdullahi Mohamed</dd></div><div><dt>Issue date</dt><dd>14 July 2026</dd></div><div><dt>Expiry date</dt><dd>Not applicable</dd></div></dl><div className="qr-wrap"><QRCodeSVG value="https://marwaaznotary.com/verify/MNP-2026-04141" size={96} bgColor="transparent" fgColor="#0b1f3a" /><span>DIGITAL SEAL</span></div></div><div className="signature-line"><span>Official signature</span><em>Marwaaz Notary</em><b><Stamp size={22} />SEALED</b></div></> : <div className="result-status"><span><XCircle size={22} /></span><div><strong>Reference not found</strong><small>Check the number and try again, or contact our office.</small></div></div>}
          </motion.div>}</AnimatePresence>{!verification && <div className="console-empty"><Upload size={22} /><span>Verification details will appear here</span></div>}
        </div>
      </section>

      <section id="appointment" className="section appointment-section">
        <div className="appointment-intro"><span className="eyebrow"><span />BOOK A VISIT</span><h2>Your documents deserve dedicated attention.</h2><p>Reserve a convenient time and tell us what you need. Our team will prepare for your visit and confirm the appointment.</p><div className="contact-mini"><div><Phone size={19} /><span><small>Call us</small><a href="tel:+252617414141">+252 617 414141</a></span></div><div><Clock3 size={19} /><span><small>Open Sat – Thu</small><strong>7:30 AM – 7:30 PM</strong></span></div></div></div>
        <div className="booking-card"><AnimatePresence mode="wait">{submitted ? <motion.div className="success-state" key="success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}><motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}><CheckCircle2 size={38} /></motion.span><h3>Appointment request received</h3><p>Thank you. Our office will contact you shortly to confirm the time and service details.</p><button className="button button-navy" onClick={() => setSubmitted(false)}>Book another visit</button></motion.div> : <motion.form key="form" onSubmit={handleSubmit(onBook)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} noValidate>
          <div className="form-row"><label>Full name<input {...register("fullName")} placeholder="Your full name" />{errors.fullName && <small>{errors.fullName.message}</small>}</label><label>Phone number<input {...register("phone")} placeholder="+252 61…" />{errors.phone && <small>{errors.phone.message}</small>}</label></div>
          <div className="form-row"><label>Email address<input {...register("email")} type="email" placeholder="name@example.com" />{errors.email && <small>{errors.email.message}</small>}</label><label>Service type<select {...register("service")} defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option value={service.title} key={service.title}>{service.title}</option>)}</select>{errors.service && <small>{errors.service.message}</small>}</label></div>
          <div className="form-row"><label>Preferred date<input {...register("date")} type="date" min={minDate} />{errors.date && <small>{errors.date.message}</small>}</label><label>Preferred time<select {...register("time")} defaultValue=""><option value="" disabled>Select a time</option><option>8:00 AM</option><option>10:00 AM</option><option>12:30 PM</option><option>3:00 PM</option><option>5:30 PM</option></select>{errors.time && <small>{errors.time.message}</small>}</label></div>
          <label>Message <span>(optional)</span><textarea {...register("message")} rows={4} placeholder="Tell us about the document or service you need…" />{errors.message && <small>{errors.message.message}</small>}</label><button className="button button-navy form-submit" disabled={isSubmitting}>{isSubmitting ? "Sending request…" : <><CalendarCheck2 size={18} />Request appointment</>}</button><p className="form-note"><LockKeyhole size={13} />Your information is handled confidentially.</p>
        </motion.form>}</AnimatePresence></div>
      </section>

      <section className="section section-tint testimonials-section"><SectionHeading eyebrow="CLIENT EXPERIENCES" title="Trust, told in our clients’ words" /><div className="testimonial-shell"><button className="carousel-button" onClick={() => setTestimonial((testimonial - 1 + testimonials.length) % testimonials.length)} aria-label="Previous testimonial"><ChevronLeft /></button><AnimatePresence mode="wait"><motion.article key={activeTestimonial.name} className="testimonial-card" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.35 }}><div className="quote-mark">“</div><div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div><blockquote>{activeTestimonial.review}</blockquote><div className="client"><img src={activeTestimonial.image} alt="" /><div><strong>{activeTestimonial.name}</strong><span>{activeTestimonial.role}</span></div></div></motion.article></AnimatePresence><button className="carousel-button" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Next testimonial"><ChevronRight /></button></div><div className="carousel-dots" role="tablist" aria-label="Select testimonial">{testimonials.map((item, i) => <button key={item.name} className={i === testimonial ? "active" : ""} onClick={() => setTestimonial(i)} aria-label={`Show testimonial ${i + 1}`} />)}</div></section>

      <section className="section faq-section"><SectionHeading eyebrow="FREQUENTLY ASKED" title="Clear answers before your visit" copy="If your question is more specific, call or message our team and we will guide you." /><div className="faq-list">{faqs.map(([question, answer], index) => <motion.details key={question} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<ChevronDown size={19} /></summary><p>{answer}</p></motion.details>)}</div></section>

      <section className="gallery-section"><div className="section gallery-heading"><SectionHeading eyebrow="OUR ENVIRONMENT" title="A professional setting for important decisions" copy="A calm, organized space designed for privacy, careful review, and confident signing." align="left" /></div><div className="gallery-grid">{gallery.map(([label, image], index) => <motion.figure key={label} className={`gallery-item item-${index + 1}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}><img src={image} alt={`${label} at a professional legal office`} loading="lazy" /><figcaption><span>{label}</span><ArrowRight size={17} /></figcaption></motion.figure>)}</div></section>

      <section id="team" className="section team-section"><SectionHeading eyebrow="OUR PROFESSIONALS" title="Experienced people. Personal service." copy="Our team brings careful judgment, procedural discipline, and respect to every client interaction." /><div className="team-grid">{team.map((person, index) => <motion.article className="team-card" key={person.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}><div className="team-image"><img src={person.image} alt={`${person.name}, ${person.role}`} loading="lazy" /><span>{index === 0 ? "Principal" : "Professional team"}</span></div><div className="team-info"><h3>{person.name}</h3><strong>{person.role}</strong><p>{person.experience}</p><a href="#contact"><Mail size={15} />Contact</a></div></motion.article>)}</div></section>

      <section id="contact" className="contact-section"><div className="contact-map"><iframe title="Map showing Baidoa, Somalia" src="https://www.google.com/maps?q=Baidoa%2C%20Somalia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><div className="contact-panel"><span className="eyebrow light"><span />VISIT MARWAAZ</span><h2>Professional notary service, right here in Baidoa.</h2><div className="contact-list"><div><MapPin /><span><small>Office</small><strong>Marwaaz Public Notary</strong><p>Baidoa, Somalia</p></span></div><div><Phone /><span><small>Phone</small><a href="tel:+252617414141">+252 617 414141</a></span></div><div><Clock3 /><span><small>Working hours</small><strong>Saturday – Thursday</strong><p>7:30 AM – 7:30 PM</p></span></div></div><div className="contact-actions"><a className="button button-gold" href="tel:+252617414141"><Phone size={17} />Call now</a><a className="button button-ghost" href="https://wa.me/252617414141" target="_blank" rel="noreferrer"><MessageCircle size={17} />WhatsApp</a><a className="button button-ghost" href="https://maps.google.com/?q=Baidoa,Somalia" target="_blank" rel="noreferrer"><Navigation size={17} />Directions</a></div></div></section>

      <footer><div className="footer-main"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><img src="/logo.png" alt="" /></span><span><strong>MARWAAZ</strong><small>PUBLIC NOTARY</small></span></a><p>Trusted legal authentication and notarial services for individuals, businesses, and institutions in Baidoa.</p><div className="social-links"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="LinkedIn">in</a></div></div><div><h3>Quick links</h3><a href="#about">About us</a><a href="#services">Services</a><a href="#team">Our team</a><a href="#contact">Contact</a></div><div><h3>Client services</h3><a href="#appointment">Appointments</a><a href="#verify">Document verification</a><a href="#services">Certified copies</a><a href="#services">Legal consultation</a></div><div><h3>Contact</h3><span>Baidoa, Somalia</span><a href="tel:+252617414141">+252 617 414141</a><span>Sat – Thu, 7:30 AM – 7:30 PM</span></div></div><div className="footer-bottom"><span>© 2026 Marwaaz Public Notary. All Rights Reserved.</span><div><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div></footer>
    </main>
  );
}
