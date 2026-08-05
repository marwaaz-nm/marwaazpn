"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight, ArrowUp, Award, BadgeCheck, BriefcaseBusiness, Building2, CalendarCheck2,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3,
  FileCheck2, Files, FileSignature, Handshake, Headphones, KeyRound,
  Landmark, Languages, LockKeyhole, Mail, MapPin, Menu, MessageCircle,
  Moon, Navigation, Phone, QrCode, Quote, Scale, ScanLine, ScrollText, Shield,
  ShieldCheck, Stamp, Star, Sun, Upload, UserRoundCheck, UsersRound, X, XCircle,
  type LucideIcon,
} from "lucide-react";

const services: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Kala Wareejinta Guryaha iyo Beeraha", description: "Waxaan si sharci ah kuu diyaarinaa dukumentiyada kala wareejinta guryaha iyo beeraha.", icon: Building2 },
  { title: "Kala Wareejinta Baabuurta iyo Dhulka", description: "Waxaan kuu diyaarinaa heshiisyada iyo caddaynaha lahaanshaha gaadiidka iyo dhulka.", icon: Landmark },
  { title: "Kala Wareejinta Hantida Guurtada iyo Maguurtada", description: "Waxaan si sharci ah u samaynaa habraaca kala wareejinta hantida guurtada iyo maguurtada ah.", icon: BriefcaseBusiness },
  { title: "Sharciyeynta iyo Diiwaangelinta Hantida", description: "Waxaan diiwaangelinnaa oo xaqiijinnaa hantida sharciyeysan si rasmi ah.", icon: ShieldCheck },
  { title: "Kala Wareejinta Saamiyada Shirkadaha", description: "Waxaan kuu diyaarinaa dukumentiyada rasmiga ah ee wareejinta saamiyada shirkadaha.", icon: UsersRound },
  { title: "Qorista Codsiyada iyo Araajida Dacwadaha", description: "Waxaan kuu qornaa araajida dacwadaha si sax ah oo sharciga waafaqsan.", icon: ScrollText },
  { title: "Qorista Mucaamalaadka Rasmiga Ah", description: "Waxaan qornaa oo habaynaa mucaamalaadka sharciga ah ee ganacsiga iyo shaqsiyaadka.", icon: FileSignature },
  { title: "Diyaarinta Heshiisyada Sharciga Ah", description: "Waxaan kuu qornaa heshiisyo cadcad oo si sugan u ilaalinaya xuquuqdaada.", icon: Handshake },
  { title: "Caddaynta Lahaanshaha", description: "Waxaan kuu caddaynaa lahaanshaha hantida ama iskaashiga ganacsiga.", icon: Files },
  { title: "Damaanadaha Sharciga Ah", description: "Waxaan qornaa oo xaqiijinnaa damaanadaha leh awoodda rasmiga ah ee sharciga.", icon: BadgeCheck },
  { title: "Cabbiraadda Dhulka iyo Xogta GPS-ka", description: "Ka hor kala wareejinta dhulka, waxaan booqannaa oo cabbirnaa dhulka, waxaanay qaadannaa xogta GPS-ka.", icon: MapPin },
];

const requirements: { title: string; icon: LucideIcon; items: string[] }[] = [
  {
    title: "Kala Wareejinta Dhulka",
    icon: Landmark,
    items: [
      "Warqad sharci ah oo caddeynaysa lahaanshaha dhulka (Sabarloog ka soo baxay Dowladda Hoose)",
      "Ama warqad Nootaayo oo hore loo sharciyeeyay",
      "Haddii aan la haysan warqad rasmi ah, waxaa la sameeyaa Warqad Sugitaan Lahaansho oo Nootaayadu soo saarto",
    ],
  },
  {
    title: "Kala Wareejinta Baabuurta",
    icon: KeyRound,
    items: [
      "Buugga lahaanshaha rasmiga ah ee baabuurka",
      "Ama warqad Nootaayo oo hore loo sharciyeeyay",
    ],
  },
];

const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Adeeg Sharci oo Lagu Kalsoon Yahay", description: "Adeeg kasta oo aan bixinno wuxuu ku dhisnaan yahay mas'uuliyad iyo sharci-fulin toos ah.", icon: ShieldCheck },
  { title: "Dhammaystir Degdeg Ah", description: "Waan dhowrnaa waqtigaaga macnaha leh, tayada adeeggana kama tanaasulno.", icon: Clock3 },
  { title: "Xafidaad iyo Dhowrid Sugan", description: "Dukumentiyadaada iyo warqadahaaga rasmiga ah waxaan u xafidnaa si sugan.", icon: LockKeyhole },
  { title: "Koox Sharci oo Khibrad Leh", description: "Waxaad ka helaysaa la-talin sharci, hagid toos ah iyo ixtiraam sare.", icon: UserRoundCheck },
  { title: "Xaqiijinta Nidaamka Casriga Ah", description: "Dukumenti kasta waxaad ku xaqiijin kartaa lambarkiisa tixraaca ama Koodhka QR-ka.", icon: ScanLine },
  { title: "Habraac Sharci oo Rasmi Ah", description: "Dhawrida heshiisyada iyo mucaamalaadka oo dhan waxaa loo fuliyaa si sharciga waafaqsan.", icon: Landmark },
  { title: "Ilaalinta iyo Dhowrida Sirta", description: "Xogtaada iyo dukumentiyadaada waxaan u xafidnaa si qarsoodi ah oo ammaan ah.", icon: Shield },
  { title: "Garab-staag iyo Taageero Joogto Ah", description: "Waan ku garab taagannahay ka hor, inta lagu jiro iyo ka dib dhammaystirka adeegga.", icon: Headphones },
];

const steps: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "1. Keenida Dukumentiga iyo Aqoonsiga", description: "Keen dukumentiga asalka ah, aqoonsiga sawirka leh ama sugiyaasha (markhaatiyada) xafiiskayaga Baydhabo ku yaal ama ballan ku qabso.", icon: FileCheck2 },
  { title: "2. Booqashada Goobta iyo GPS-ka", description: "Haddii adeeggu yahay dhul ama hanti maguurto ah, kooxdayadu waxay booqataa goobta si loo cabbiro oo loo qaado xogta GPS-ka.", icon: MapPin },
  { title: "3. Diyaarinta, Qorista iyo Hubinta Sharciga", description: "Nootaayadu waxay qortaa oo diyaarisaa dukumentiga sharciga ah, iyadoo si taxaddar leh u hubisa milkiyadda, aqoonsiyada iyo saxiixyada dhinacyada.", icon: FileSignature },
  { title: "4. Shaabadaynta, Diiwaanka iyo QR-ka", description: "Dukumentiga waxaa la saaraa shaabadda rasmiga ah, la diiwaangeliyaa, waxaana la siiyaa lambar tixraac iyo Koodhka QR-ka ee xaqiijinta.", icon: Stamp },
];

const faqs = [
  [
    "Sidee dhulkayga oo aan sharciyaysnayn la iigu sharciyeeyaa?",
    "Waxaad Nootaayada horkeenaysaa sugiyaal dhulkaas milkiyaddiisa xaqiijin kara, ka dib Nootaayadu waxay ka qoraysaa warqad sugitaan ah oo tilmaamaysa lahaanshaaga."
  ],
  [
    "Sidee dhulkayga ugu samaysan karaa Sabarloog ka soo baxda Dowladda Hoose?",
    "Si dhulkaaga laguugu sameeyo Sabarloog, Nootaayada Marwaaz ayaa kuu qoraysa warqad lagu sugayo dhulka haddii aadan haysan warqad sharci ah oo nootaayeysan, ka dibna Dowladda Hoose kaaga dalbaysa Sabarloogga."
  ],
  [
    "Intee muddo ah ayay qaadataa dhammaystirka adeegyada Nootaayada?",
    "Waqtiga ay qaadanayso waxay ku xiran tahay nooca adeegga."
  ],
  [
    "Xaggee ayay ku taallaa Nootaayadu?",
    "Nootaayadu waxay ku taallaa nawaaxiga Ex-Dahabshiil, ka soo horjeedka Huteel Baydhabo."
  ],
  [
    "Nootaayada Marwaaz ma leedahay aqoonsi iyo leysan sharci ah?",
    "Haa. Nootaayada Marwaaz waxay ka diiwaangashan tahay Wasaaradda Caddaaladda iyo Arrimaha Dastuurka ee Dowladda Federaalka Soomaaliya, iyo Wasaaradda Caddaaladda ee Dowladda Koonfur Galbeed Soomaaliya. Xafiisku wuxuu si rasmi ah u shaqaynayay tan iyo sannadkii 2022."
  ],
];

const testimonials = [
  { name: "Aamina Xasan", role: "Ganacsato", review: "Tallaabo kasta si cad ayaa naloo sharxay, dukumentiyadii nala sameeyayna si degdeg ah oo xirfad leh ayaa loo dhammeeyey." },
  { name: "Cabdullaahi Nuur", role: "Macmiil Hanti", review: "Waxaan aad uga helay hubinta taxaddarka leh iyo sida sirta loo ilaaliyay. Adeeggu wuxuu ahaa mid lagu kalsoonaan karo." },
  { name: "Hodan Cali", role: "Macmiil Hay'adeed", review: "Marwaaz wuxuu isku daraa soo-dhaweyn hufan, nidaam sharci iyo heerka laga filayo xafiis nootaayo oo casri ah." },
];

const team = [
  { name: "Dr. Cabdirisaaq Yacquub Xasan", role: "Maamulaha Guud", experience: "Hogaaminta iyo Maamulka Guud ee Nootaayada" },
  { name: "Cabdisalaan Xasan Bilow", role: "Maamule Ku-xigeen", experience: "Maamulka Adeegyada iyo Hagida Sharciyeed" },
  { name: "Saalax Cali Maxamed", role: "Hawl-wadeen", experience: "Shaqaalaha Adeegyada iyo Diiwaangelinta" },
  { name: "Xasan Cali Mursal", role: "Hawl-wadeen", experience: "Shaqaalaha Adeegyada iyo Diiwaangelinta" },
  { name: "Maxamed Cali Xuseen", role: "Hawl-wadeen", experience: "Shaqaalaha Adeegyada iyo Diiwaangelinta" },
  { name: "Haaruun Maxamed Xasan", role: "Hawl-wadeen", experience: "Shaqaalaha Adeegyada iyo Diiwaangelinta" },
];

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

type VerificationState = "valid" | "invalid" | null;
type OfficeStatus = { open: boolean; time: string };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

function SectionHeading({ eyebrow, title, copy, align = "center", index }: { eyebrow: string; title: string; copy?: string; align?: "center" | "left"; index?: string }) {
  return (
    <motion.div className={`section-heading ${align === "left" ? "align-left" : ""}`} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
      <span className="eyebrow">{index && <b>{index}</b>}<span />{eyebrow}</span>
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
  const [officeStatus, setOfficeStatus] = useState<OfficeStatus | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const shouldUseDark = window.localStorage.getItem("marwaaz-theme") === "dark";
    setDark(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Mogadishu", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const minutesNow = hour * 60 + minute;
      const open = weekday !== "Fri" && minutesNow >= 7 * 60 + 30 && minutesNow < 19 * 60 + 30;
      setOfficeStatus({ open, time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` });
    };
    compute();
    const id = window.setInterval(compute, 60000);
    return () => window.clearInterval(id);
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

  const activeTestimonial = testimonials[testimonial];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Notary",
    name: "Nootaayada Marwaaz Baydhabo",
    alternateName: ["Marwaaz Public Notary", "Nootaayo Marwaaz", "Nootaayada Ugu Fiican Baydhabo", "Marwaaz Notary"],
    url: "https://marwaazpn.com",
    logo: "https://marwaazpn.com/logo.png",
    image: "https://marwaazpn.com/og.png",
    description: "Nootaayada Marwaaz waa nootaayada ugu fiican Baydhabo. Waxaan bixinnaa adeegyada rasmiga ah ee nootaayada, kala wareejinta hantida, dhulka, baabuurta iyo heshiisyada sharciga ah ee Baydhabo, Soomaaliya.",
    telephone: "+252617414141",
    sameAs: [
      "https://www.facebook.com/share/1DdrxRCNqt/"
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nawaaxiga Ex-Dahabshiil, ka soo horjeedka Huteel Baydhabo",
      addressLocality: "Baidoa",
      addressRegion: "Bay",
      addressCountry: "SO"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "07:30",
        closes: "19:30"
      }
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Baidoa, Somalia"
    }
  };

  return (
    <main>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="float-actions">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button key="top" className="float-btn top-btn" initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Kor u laabo bogga"><ArrowUp size={19} /></motion.button>
          )}
        </AnimatePresence>
        <a className="float-btn whatsapp-btn" href="https://wa.me/252613536363" target="_blank" rel="noreferrer" aria-label="Nala soo hadal WhatsApp"><span className="pulse-ring" /><MessageCircle size={23} /></a>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Marwaaz Public Notary home"><span className="brand-mark"><img src="/logo.png" alt="" /></span><span><strong>MARWAAZ</strong><small>PUBLIC NOTARY</small></span></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Hagaha bogga">
          {[["Nagu Saabsan", "about"], ["Adeegyada", "services"], ["Xaqiijin", "verify"], ["Kooxda", "team"], ["Xiriir", "contact"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-appointment" href="#nala-xiriir" onClick={() => setMenuOpen(false)}>Nala Soo Xiriir</a>
        </nav>
        <div className="header-actions"><button className="icon-button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
      </header>

      <section id="top" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div className="trust-chip" variants={fadeUp}><BadgeCheck size={17} /> Rasmi • Sugan • Lagu Kalsoonaan Karo</motion.div>
          <motion.p className="hero-kicker" variants={fadeUp}>Nootaayada Dadweynaha · Baydhabo, Soomaaliya · Tan iyo 2022</motion.p>
          <motion.h1 variants={fadeUp}>Nootaayada Marwaaz.<br /><em>Xuquuqdaada. Kalsoonidaada.</em></motion.h1>
          <motion.p className="hero-copy" variants={fadeUp}>Waxaan si sharci waafaqsan u diyaarinaa, u xaqiijinnaa una sugnaa heshiisyada, kala wareejinta hantida iyo mucaamalaadka muhiimka ah.</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}><a className="button button-gold" href="#nala-xiriir"><Phone size={19} />Nala Soo Xiriir</a><a className="button button-ghost" href="#verify"><QrCode size={19} />Xaqiiji Dukumenti</a></motion.div>
        </motion.div>
        <motion.aside className="hero-assurance glass-card" initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
          <div className="assurance-seal"><span className="seal-ring"><ShieldCheck size={37} /></span><span>MARWAAZ<small>RASMI AHAAN LOO AQOONSAN YAHAY</small></span></div><div className="rating-badge"><span className="stars-row">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</span><span>4.9/5 · 500+ qiimeyn caddayn ah</span></div><div><span className="live-dot" />Nidaamka xaqiijinta dukumentiyada waa diyaar</div><p>Dukumenti kasta oo diiwaangashan waxaa lagu hubin karaa lambarkiisa gaarka ah.</p><a href="#verify">Hubi tixraaca <ArrowRight size={15} /></a>
        </motion.aside>
        <a href="#about" className="scroll-cue" aria-label="Hoos ugu gudub"><span>Sii eeg</span><ChevronDown size={19} /></a>
        <svg className="hero-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0,28 C240,68 480,68 720,40 C960,12 1200,12 1440,40 L1440,70 L0,70 Z" /></svg>
      </section>

      <section className="motto-ribbon" aria-label="Halkudhayga Marwaaz">
        <Quote size={26} />
        <p>&ldquo;Mé Guurtéda Murung Ay Koo Galne Marwaaz Marag Ku Abtugoy&rdquo;</p>
        <span>— MARWAAZ PUBLIC NOTARY</span>
      </section>

      <div className="credibility-strip"><span><ShieldCheck size={18} />Ilaalinta Sirta</span><span><BadgeCheck size={18} />Dukumenti La Xaqiijiyey</span><span><Clock3 size={18} />Adeeg Degdeg Ah</span><span><Award size={18} />Heer Xirfadeed</span></div>

      <section id="about" className="section about-section">
        <div className="about-visual"><motion.div className="about-image" initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}><img src="/image1.png" alt="Kaydka dukumentiyada Marwaaz Public Notary" /><div className="experience-card"><strong>Rasmi</strong><span>Dukumentiyo si taxaddar leh loo sugo</span></div></motion.div></div>
        <motion.div className="about-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span className="eyebrow" variants={fadeUp}><span />NAGU SAABSAN</motion.span><motion.h2 variants={fadeUp}>Saxiix kasta waa saxnaan.<br />Dukumenti kasta waa kalsooni.</motion.h2><motion.p variants={fadeUp}>Marwaaz Public Notary waxay adeegyo nootaayo oo rasmi ah siisaa shaqsiyaadka, ganacsiyada, hay'adaha iyo ururrada. Ujeedkeennu waa in dukumenti kasta loo diyaariyo loona xaqiijiyo si sax ah, sugan oo sharciga waafaqsan.</motion.p>
          <motion.div className="authority-strip" variants={fadeUp}><Scale size={20} /><p>Nootaayada Marwaaz waxay oggolaansho rasmi ah ka haysaa <strong>Wasaaradda Caddaaladda iyo Arrimaha Dastuurka</strong> ee Dowladda Federaalka Soomaaliya, iyo <strong>Wasaaradda Caddaaladda iyo Arrimaha Garsoorka</strong> ee Dowladda Koonfur Galbeed Soomaaliya. Xafiisku wuxuu furan yahay tan iyo sannadkii 2022.</p></motion.div>
          <motion.div className="values" variants={fadeUp}>{["Daacadnimo", "Xirfad", "Ilaalinta Sirta", "Saxnaan", "Daahfurnaan", "Qanacsanaanta Macmiilka"].map((value) => <span key={value}><Check size={14} />{value}</span>)}</motion.div><motion.a className="text-link" href="#services" variants={fadeUp}>Eeg adeegyadayada <ArrowRight size={16} /></motion.a>
        </motion.div>
      </section>

      <section id="services" className="section section-tint">
        <SectionHeading eyebrow="ADEEGYADA NOOTAAYADA" title="Adeegyo sharciyeed oo lagu kalsoonaan karo" copy="Waxaan si xirfad, hufnaan iyo mas'uuliyad leh u diyaarinaa una sugnaa mucaamalaadka, heshiisyada iyo kala wareejinta hantida." index="01" />
        <div className="service-grid">{services.map((service, index) => { const Icon = service.icon; return <motion.article className="service-card" key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: (index % 4) * 0.06, duration: 0.45 }} whileHover={{ y: -7 }}><div className="service-icon"><Icon size={24} /></div><h3>{service.title}</h3><p>{service.description}</p><a href="#nala-xiriir">Faahfaahin <ArrowRight size={14} /></a></motion.article>; })}</div>
      </section>

      <section className="section process-section">
        <SectionHeading eyebrow="HABRAACA ADEEGGA" title="Afar Tallaabo oo Fudud oo Nootaayadu Qaaddo" copy="Habraaca shaqo ee Nootaayada Marwaaz wuxuu u dhisan yahay si hufan oo aad tallaabo kasta ugu kalsoonaato." index="02" />
        <div className="process-grid">{steps.map((step, index) => { const Icon = step.icon; return <motion.div className="process-step" key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.1, duration: 0.45 }}><span className="process-number">{String(index + 1).padStart(2, "0")}</span><span className="process-icon"><Icon size={22} /></span><h3>{step.title}</h3><p>{step.description}</p></motion.div>; })}</div>
      </section>

      <section className="section requirements-section">
        <SectionHeading eyebrow="SHURUUDAHA LOO BAAHAN YAHAY" title="Waa maxay dukumentiyada loo baahan yahay?" copy="Si si degdeg ah oo hufan loogu adeego, hubi inaad sidato dukumentiyada saxda ah ee loo baahan yahay nooc kasta oo kala wareejin ah." index="03" />
        <div className="requirements-grid">
          {requirements.map((req) => { const Icon = req.icon; return (
            <motion.div className="requirement-card" key={req.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }}>
              <span className="requirement-icon"><Icon size={22} /></span>
              <h3>{req.title}</h3>
              <ul>{req.items.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>
            </motion.div>
          ); })}
        </div>
        <div className="requirement-notes">
          <div className="requirement-note"><span><UsersRound size={18} /></span><div><strong>Haddii Iibiyuhu Maqan Yahay?</strong><p>Haddii qofka dhulka iibinaya uu ka maqan yahay dalka ama magaalada, waxaa loo baahan yahay Warqad Wakaalad ah oo ka soo baxday Nootaayo ama Safaarad dowladeed.</p></div></div>
          <div className="requirement-note"><span><MapPin size={18} /></span><div><strong>Cabbiraadda Dhulka iyo GPS-ka</strong><p>Ka hor kala wareejinta dhul kasta, waxaan booqannaa goobta, cabbirnaa dhulka waxaanay diiwaangelinnaa xogta GPS-ka si loo xaqiijiyo.</p></div></div>
        </div>
      </section>

      <section className="stats-section" aria-label="Tirakoobka Marwaaz"><div className="stats-copy"><span className="eyebrow light"><span />ADEEG LA AQOONSAN YAHAY</span><h2>Kalsooni lagu dhisay kumanaan dukumenti oo la xaqiijiyey.</h2></div><div className="stats-grid"><StatCounter value={5000} suffix="+" label="Dukumentiyo la xaqiijiyey" /><StatCounter value={1500} suffix="+" label="Macaamiil qanacsan" /><StatCounter value={15} suffix="+" label="Adeegyo xirfadeed" /><StatCounter value={99} suffix="%" label="Qanacsanaanta macaamiishta" /></div></section>

      <section className="section choose-section"><SectionHeading eyebrow="MAXAA MARWAAZ LOO DOORTAA?" title="Heer Sare Oo Adeeg Sharci Iyo Nootaayo Ah" copy="Kalsoonida sharciga ah waxay ka dhalataa habraac nidaamsan, xaqiijin sugan iyo ixtiraam sare oo macmiil kasta loo hayo." align="left" index="04" /><div className="reason-grid">{reasons.map((reason, index) => { const Icon = reason.icon; return <motion.article key={reason.title} className="reason-card" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.07 }}><span><Icon size={21} /></span><div><h3>{reason.title}</h3><p>{reason.description}</p></div></motion.article>; })}</div></section>

      <section id="verify" className="section verification-section">
        <div className="verification-copy"><span className="eyebrow light"><span />MARDHOW • COMING SOON</span><h2>Xaqiijinta Dukumentiyada Onlaynka Ah (Mardhow)</h2><p>Nidaamka casriga ah ee lagu xaqiijinayo dukumentiyada rasmiga ah ee Marwaaz wuxuu ku jiraa habayn ama diyaarinta u dambaysa (Mardhow ayaa si toos ah loo furi doonaa).</p><ul><li><CheckCircle2 size={18} />Nidaam casri ah oo QR leh</li><li><CheckCircle2 size={18} />Diiwaangelin sugan oo toos ah</li><li><CheckCircle2 size={18} />Xaqiijinta tixraaca rasmiga ah</li></ul></div>
        <div className="verification-console glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div className="status-badge closed" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <span className="status-dot" style={{ background: '#f59e0b' }} />
            <strong>MARDHOW (COMING SOON)</strong>
          </div>
          <ScanLine size={48} style={{ margin: '0 auto 1.25rem', color: '#eab308' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem' }}>Adeegga Xaqiijinta Onlaynka Ah Wuu Soo Socdaa</h3>
          <p style={{ opacity: 0.85, fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            Kooxdayada IT-ga waxay ku guda jirtaa dhismaha nidaamka xaqiijinta Koodhka QR-ka iyo tixraaca rasmiga ah. Mardhow ayaad si toos ah ugu hubin kartaa dukumentiyadaada halkan.
          </p>
        </div>
      </section>

      <section id="nala-xiriir" className="section appointment-section">
        <div className="appointment-intro"><span className="eyebrow"><span />XIRIIR DEGDEG AH</span><h2>Ogow goorta uu xafiisku furan yahay, oo si toos ah nala soo xiriir.</h2><p>Xaaladda xafiisku waa mid toos ah (Live). Wac ama noo dir fariin WhatsApp ah wakhti kasta — kooxdayada ayaa si degdeg ah kuugu jawaabi doonta.</p><div className="contact-mini"><div><Phone size={19} /><span><small>Nala Soo Hadal</small><a href="tel:+252617414141">+252 617 414141</a> / <a href="tel:+252613536363">+252 613 536 363</a></span></div><div><Clock3 size={19} /><span><small>Furan: Sabti – Khamiis</small><strong>7:30 subaxnimo – 7:30 fiidnimo</strong></span></div></div></div>
        <div className="booking-card status-card">
          {officeStatus && <>
            <div className={`status-badge ${officeStatus.open ? "open" : "closed"}`}><span className="status-dot" /><strong>{officeStatus.open ? "FURAN HADDA" : "XIRAN HADDA"}</strong></div>
            <p className="status-time">Waqtiga Hadda ee Baydhabo: <strong>{officeStatus.time}</strong></p>
            {!officeStatus.open && <p className="status-time">Xafiisku wuxuu furan yahay Sabti illaa Khamiis, 7:30 subaxnimo illaa 7:30 fiidnimo.</p>}
          </>}
          <div className="status-actions">
            <a className="button button-navy" href="tel:+252617414141"><Phone size={18} />Wac Hadda</a>
            <a className="button button-gold" href="https://wa.me/252613536363" target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a>
            <a className="button button-ghost" href="mailto:marwaaznotary@gmail.com"><Mail size={18} />Iimayl</a>
          </div>
          <p className="status-note"><LockKeyhole size={13} />Xogtaada si sugan oo qarsoodi ah ayaan u xafidnaa.</p>
        </div>
      </section>

      <section className="section section-tint testimonials-section"><SectionHeading eyebrow="WAAYO-ARAGNIMADA MACAAMIISHA" title="Kalsoonida ay macaamiisheenu ka warramayaan" index="05" /><div className="testimonial-shell"><button className="carousel-button" onClick={() => setTestimonial((testimonial - 1 + testimonials.length) % testimonials.length)} aria-label="Faalladii hore"><ChevronLeft /></button><AnimatePresence mode="wait"><motion.article key={activeTestimonial.name} className="testimonial-card" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.35 }}><div className="quote-mark">“</div><div className="stars" aria-label="5 xiddigood">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div><blockquote>{activeTestimonial.review}</blockquote><div className="client"><span className="avatar-fallback">{initials(activeTestimonial.name)}</span><div><strong>{activeTestimonial.name}</strong><span>{activeTestimonial.role}</span></div></div></motion.article></AnimatePresence><button className="carousel-button" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Faallada xigta"><ChevronRight /></button></div><div className="carousel-dots" role="tablist" aria-label="Dooro faallo">{testimonials.map((item, i) => <button key={item.name} className={i === testimonial ? "active" : ""} onClick={() => setTestimonial(i)} aria-label={`Muuji faallada ${i + 1}`} />)}</div></section>

      <section className="section faq-section"><SectionHeading eyebrow="SU'AALAHA UGU BADAN EE LA ISWEYDIIYO" title="Jawaabo cad oo ku saabsan adeegyadayada" copy="Haddii aad qabto su'aal gaar ah oo aan halkan ku qornayn, nala soo xiriir; kooxdayada ayaa si degdeg ah kuugu jawaabi doonta." index="06" /><div className="faq-list">{faqs.map(([question, answer], index) => <motion.details key={question} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<ChevronDown size={19} /></summary><p>{answer}</p></motion.details>)}</div></section>

      <section id="team" className="section team-section"><SectionHeading eyebrow="KOOXDA XIRFADLAYAASHA" title="Khibrad, mas'uuliyad iyo adeeg kuu gaar ah" copy="Kooxdayadu waxay isku dartaa go'aan taxaddar leh, habraac nidaamsan iyo ixtiraam macmiil kasta." index="07" /><div className="team-grid">{team.map((person) => <motion.article className="team-card" key={person.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}><div className="team-image"><span className="avatar-fallback">{initials(person.name)}</span><span className="team-badge">{person.role}</span></div><div className="team-info"><h3>{person.name}</h3><strong>{person.role}</strong><p>{person.experience}</p><a href="#contact"><Mail size={15} />La xiriir</a></div></motion.article>)}</div></section>

      <section className="cta-banner">
        <div className="cta-pattern" aria-hidden="true" />
        <motion.div className="cta-content" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
          <span className="eyebrow light"><span />DIYAAR MA U TAHAY?</span>
          <h2>Dukumentigaaga maanta u keen Nootaayada Marwaaz.</h2>
          <p>Kooxdayadu waxay diyaar u tahay inay kaa caawiso tallaabo kasta — booqasho, ballan ama xaqiijinta dukumentiga.</p>
          <div className="cta-actions"><a className="button button-gold" href="#nala-xiriir"><Phone size={18} />Nala Soo Xiriir</a><a className="button button-ghost" href="https://wa.me/252613536363" target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a></div>
        </motion.div>
      </section>

      <section id="contact" className="contact-section"><div className="contact-map"><iframe title="Khariidadda Xafiiska Marwaaz Public Notary, Baydhabo" src="https://www.google.com/maps?q=Marwaaz+Public+Notary%2C+Baidoa%2C+Somalia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><div className="contact-panel"><span className="eyebrow light"><span />BOOQASHADA XAFIISKA</span><h2>Booqashada Xafiiska Nootaayada Marwaaz Ee Magaalada Baydhabo</h2><div className="contact-list"><div><MapPin /><span><small>Goobta Xafiiska</small><strong>Marwaaz Public Notary</strong><p>Nawaaxiga Ex-Dahabshiil, ka soo horjeedka Huteel Baydhabo, Baydhabo, Soomaaliya</p></span></div><div><Phone /><span><small>Telefoonka Xafiiska</small><a href="tel:+252617414141">+252 617 414141</a> / <a href="tel:+252613536363">+252 613 536 363</a></span></div><div><Mail /><span><small>Iimaylka Rasmiga Ah</small><a href="mailto:marwaaznotary@gmail.com">marwaaznotary@gmail.com</a></span></div><div><Clock3 /><span><small>Saacadaha Shaqada</small><strong>Sabti – Khamiis</strong><p>7:30 subaxnimo – 7:30 fiidnimo</p></span></div></div><div className="contact-actions"><a className="button button-gold" href="tel:+252617414141"><Phone size={18} />Wac Hadda</a><a className="button button-ghost" href="https://wa.me/252613536363" target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a><a className="button button-ghost" href="https://maps.app.goo.gl/omXFTvfkovNYNtdn8" target="_blank" rel="noreferrer"><Navigation size={18} />Jihada Khariidadda</a></div></div></section>

      <footer><div className="footer-main"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><img src="/logo.png" alt="" /></span><span><strong>MARWAAZ</strong><small>PUBLIC NOTARY</small></span></a><p>Adeeg sharci oo rasmi ah, lagu kalsoonaan karo, oo loogu talagalay shaqsiyaadka, ganacsiyada iyo hay'adaha ku sugan Baydhabo.</p><div className="social-links"><a href="https://www.facebook.com/share/1DdrxRCNqt/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="LinkedIn">in</a></div></div><div><h3>Xiriirinta Degdega Ah</h3><a href="#about">Nagu Saabsan</a><a href="#services">Adeegyada</a><a href="#team">Kooxda</a><a href="#contact">Xiriir</a></div><div><h3>Adeegyada Macmiilka</h3><a href="#appointment">Ballamaha</a><a href="#verify">Xaqiijinta Dukumentiga</a><a href="#services">Nuqullo La Xaqiijiyey</a><a href="#services">La-talin Sharci</a></div><div><h3>Xiriir</h3><span>Baydhabo, Soomaaliya</span><a href="tel:+252617414141">+252 617 414141</a> · <a href="tel:+252613536363">+252 613 536 363</a><a href="mailto:marwaaznotary@gmail.com">marwaaznotary@gmail.com</a><span>Sabti – Khamiis, 7:30 subaxnimo – 7:30 fiidnimo</span></div></div><div className="footer-bottom"><span>© 2026 Marwaaz Public Notary. Dhammaan Xuquuqda Way Dhowran Yihiin.</span><div><a href="#">Siyaasadda Sirta</a><a href="#">Shuruudaha Adeegga</a></div></div></footer>
    </main>
  );
}
