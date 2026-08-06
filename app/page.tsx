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

type Lang = "so" | "en";

const services: { title: { so: string; en: string }; description: { so: string; en: string }; icon: LucideIcon }[] = [
  {
    title: { so: "Kala Wareejinta Guryaha iyo Beeraha", en: "Transfer of Houses & Farmland" },
    description: { so: "Waxaan si sharci ah kuu diyaarinaa dukumentiyada kala wareejinta guryaha iyo beeraha.", en: "We legally prepare house and farmland ownership transfer documents." },
    icon: Building2,
  },
  {
    title: { so: "Kala Wareejinta Baabuurta iyo Dhulka", en: "Transfer of Vehicles & Land" },
    description: { so: "Waxaan kuu diyaarinaa heshiisyada iyo caddaynaha lahaanshaha gaadiidka iyo dhulka.", en: "We prepare agreements and proof of ownership for vehicles and land." },
    icon: Landmark,
  },
  {
    title: { so: "Kala Wareejinta Hantida Guurtada iyo Maguurtada", en: "Movable & Immovable Property Transfers" },
    description: { so: "Waxaan si sharci ah u samaynaa habraaca kala wareejinta hantida guurtada iyo maguurtada ah.", en: "We handle legal transfer procedures for movable and immovable property." },
    icon: BriefcaseBusiness,
  },
  {
    title: { so: "Sharciyeynta iyo Diiwaangelinta Hantida", en: "Property Legalization & Registration" },
    description: { so: "Waxaan diiwaangelinnaa oo xaqiijinnaa hantida sharciyeysan si rasmi ah.", en: "We officially register and verify legalized property assets." },
    icon: ShieldCheck,
  },
  {
    title: { so: "Kala Wareejinta Saamiyada Shirkadaha", en: "Company Stock & Share Transfers" },
    description: { so: "Waxaan kuu diyaarinaa dukumentiyada rasmiga ah ee wareejinta saamiyada shirkadaha.", en: "We prepare official documentation for corporate share transfers." },
    icon: UsersRound,
  },
  {
    title: { so: "Qorista Codsiyada iyo Araajida Dacwadaha", en: "Legal Petitions & Case Drafting" },
    description: { so: "Waxaan kuu qornaa araajida dacwadaha si sax ah oo sharciga waafaqsan.", en: "We draft legal petitions and court filings accurately according to law." },
    icon: ScrollText,
  },
  {
    title: { so: "Qorista Mucaamalaadka Rasmiga Ah", en: "Official Business & Legal Documents" },
    description: { so: "Waxaan qornaa oo habaynaa mucaamalaadka sharciga ah ee ganacsiga iyo shaqsiyaadka.", en: "We draft and structure legal transactions for businesses and individuals." },
    icon: FileSignature,
  },
  {
    title: { so: "Diyaarinta Heshiisyada Sharciga Ah", en: "Legal Contract Preparation" },
    description: { so: "Waxaan kuu qornaa heshiisyo cadcad oo si sugan u ilaalinaya xuquuqdaada.", en: "We draft clear contracts that securely protect your legal rights." },
    icon: Handshake,
  },
  {
    title: { so: "Caddaynta Lahaanshaha", en: "Proof of Ownership Certification" },
    description: { so: "Waxaan kuu caddaynaa lahaanshaha hantida ama iskaashiga ganacsiga.", en: "We certify property ownership deeds and business partnerships." },
    icon: Files,
  },
  {
    title: { so: "Damaanadaha Sharciga Ah", en: "Official Legal Guarantees" },
    description: { so: "Waxaan qornaa oo xaqiijinnaa damaanadaha leh awoodda rasmiga ah ee sharciga.", en: "We issue and authenticate guarantees with full legal standing." },
    icon: BadgeCheck,
  },
  {
    title: { so: "Cabbiraadda Dhulka iyo Xogta GPS-ka", en: "Land Survey & GPS Coordinate Mapping" },
    description: { so: "Ka hor kala wareejinta dhulka, waxaan booqannaa oo cabbirnaa dhulka, waxaanay qaadannaa xogta GPS-ka.", en: "Before land transfers, we visit the site, survey boundaries, and log GPS data." },
    icon: MapPin,
  },
];

const requirements: { title: { so: string; en: string }; icon: LucideIcon; items: { so: string; en: string }[] }[] = [
  {
    title: { so: "Kala Wareejinta Dhulka", en: "Land Transfer Requirements" },
    icon: Landmark,
    items: [
      { so: "Warqad sharci ah oo caddeynaysa lahaanshaha dhulka (Sabarloog ka soo baxay Dowladda Hoose)", en: "Official land title / deed issued by the Local Government (Sabarloog)" },
      { so: "Ama warqad Nootaayo oo hore loo sharciyeeyay", en: "Or a previously notarized legal document" },
      { so: "Haddii aan la haysan warqad rasmi ah, waxaa la sameeyaa Warqad Sugitaan Lahaansho oo Nootaayadu soo saarto", en: "If official papers are missing, an Ownership Verification Document is issued by the Notary" },
    ],
  },
  {
    title: { so: "Kala Wareejinta Baabuurta", en: "Vehicle Transfer Requirements" },
    icon: KeyRound,
    items: [
      { so: "Buugga lahaanshaha rasmiga ah ee baabuurka", en: "Official vehicle logbook / registration book" },
      { so: "Ama warqad Nootaayo oo hore loo sharciyeeyay", en: "Or a previously notarized legal document" },
    ],
  },
];

const reasons: { title: { so: string; en: string }; description: { so: string; en: string }; icon: LucideIcon }[] = [
  { title: { so: "Adeeg Sharci oo Lagu Kalsoon Yahay", en: "Trusted Legal Service" }, description: { so: "Adeeg kasta oo aan bixinno wuxuu ku dhisnaan yahay mas'uuliyad iyo sharci-fulin toos ah.", en: "Every service we provide is grounded in responsibility and strict legal compliance." }, icon: ShieldCheck },
  { title: { so: "Dhammaystir Degdeg Ah", en: "Fast Execution" }, description: { so: "Waan dhowrnaa waqtigaaga macnaha leh, tayada adeeggana kama tanaasulno.", en: "We respect your valuable time without compromising on legal quality." }, icon: Clock3 },
  { title: { so: "Xafidaad iyo Dhowrid Sugan", en: "Secure Archive & Protection" }, description: { so: "Dukumentiyadaada iyo warqadahaaga rasmiga ah waxaan u xafidnaa si sugan.", en: "Your official documents and legal records are safely archived." }, icon: LockKeyhole },
  { title: { so: "Koox Sharci oo Khibrad Leh", en: "Experienced Legal Team" }, description: { so: "Waxaad ka helaysaa la-talin sharci, hagid toos ah iyo ixtiraam sare.", en: "Get expert legal consultation, direct guidance, and utmost professional respect." }, icon: UserRoundCheck },
  { title: { so: "Xaqiijinta Nidaamka Casriga Ah", en: "Modern System Verification" }, description: { so: "Dukumenti kasta waxaad ku xaqiijin kartaa lambarkiisa tixraaca ama Koodhka QR-ka.", en: "Verify any document instantly using its reference number or QR code." }, icon: ScanLine },
  { title: { so: "Habraac Sharci oo Rasmi Ah", en: "Official Legal Procedure" }, description: { so: "Dhawrida heshiisyada iyo mucaamalaadka oo dhan waxaa loo fuliyaa si sharciga waafaqsan.", en: "All contracts and transactions strictly follow legal requirements." }, icon: Landmark },
  { title: { so: "Ilaalinta iyo Dhowrida Sirta", en: "Confidentiality & Privacy" }, description: { so: "Xogtaada iyo dukumentiyadaada waxaan u xafidnaa si qarsoodi ah oo ammaan ah.", en: "Your personal data and documents are treated with utmost privacy." }, icon: Shield },
  { title: { so: "Garab-staag iyo Taageero Joogto Ah", en: "Continuous Client Support" }, description: { so: "Waan ku garab taagannahay ka hor, inta lagu jiro iyo ka dib dhammaystirka adeegga.", en: "We support you before, during, and after service completion." }, icon: Headphones },
];

const steps: { title: { so: string; en: string }; description: { so: string; en: string }; icon: LucideIcon }[] = [
  { title: { so: "1. Keenida Dukumentiga iyo Aqoonsiga", en: "1. Document & ID Submission" }, description: { so: "Keen dukumentiga asalka ah, aqoonsiga sawirka leh ama sugiyaasha (markhaatiyada) xafiiskayaga Baydhabo ku yaal ama ballan ku qabso.", en: "Bring original documents, photo IDs, or witnesses to our Baidoa office or schedule an appointment." }, icon: FileCheck2 },
  { title: { so: "2. Booqashada Goobta iyo GPS-ka", en: "2. Site Inspection & GPS Mapping" }, description: { so: "Haddii adeeggu yahay dhul ama hanti maguurto ah, kooxdayadu waxay booqataa goobta si loo cabbiro oo loo qaado xogta GPS-ka.", en: "For land and real estate, our team inspects the plot to survey boundaries and log GPS coordinates." }, icon: MapPin },
  { title: { so: "3. Diyaarinta, Qorista iyo Hubinta Sharciga", en: "3. Legal Drafting & Verification" }, description: { so: "Nootaayadu waxay qortaa oo diyaarisaa dukumentiga sharciga ah, iyadoo si taxaddar leh u hubisa milkiyadda, aqoonsiyada iyo saxiixyada dhinacyada.", en: "The Notary drafts official legal documents while meticulously verifying ownership, IDs, and signatures." }, icon: FileSignature },
  { title: { so: "4. Shaabadaynta, Diiwaanka iyo QR-ka", en: "4. Official Seal & QR Archiving" }, description: { so: "Dukumentiga waxaa la saaraa shaabadda rasmiga ah, la diiwaangeliyaa, waxaana la siiyaa lambar tixraac iyo Koodhka QR-ka ee xaqiijinta.", en: "The document receives the official seal, is registered in archives, and assigned a QR code & reference number." }, icon: Stamp },
];

const faqs = [
  {
    q: { so: "Sidee dhulkayga oo aan sharciyaysnayn la iigu sharciyeeyaa?", en: "How can I legalize my unnotarized land?" },
    a: { so: "Waxaad Nootaayada horkeenaysaa sugiyaal dhulkaas milkiyaddiisa xaqiijin kara, ka dib Nootaayadu waxay ka qoraysaa warqad sugitaan ah oo tilmaamaysa lahaanshaaga.", en: "You present verifiable witnesses to the Notary who confirm ownership, after which the Notary issues an official Ownership Verification Document." }
  },
  {
    q: { so: "Sidee dhulkayga ugu samaysan karaa Sabarloog ka soo baxda Dowladda Hoose?", en: "How do I get a Municipal Title Deed (Sabarloog)?" },
    a: { so: "Si dhulkaaga laguugu sameeyo Sabarloog, Nootaayo Marwaaz ayaa kuu qoraysa warqad lagu sugayo dhulka haddii aadan haysan warqad sharci ah oo nootaayeysan, ka dibna Dowladda Hoose kaaga dalbaysa Sabarloogga.", en: "Marwaaz Notary drafts a legal land verification deed if you lack prior notary papers, then submits an application to the Municipality for your Sabarloog." }
  },
  {
    q: { so: "Intee muddo ah ayay qaadataa dhammaystirka adeegyada Nootaayada?", en: "How long does it take to complete notary services?" },
    a: { so: "Waqtiga ay qaadanayso waxay ku xiran tahay nooca adeegga.", en: "Processing time depends on the specific nature and type of legal service required." }
  },
  {
    q: { so: "Xaggee ayay ku taallaa Nootaayadu?", en: "Where is the Notary office located?" },
    a: { so: "Nootaayadu waxay ku taallaa nawaaxiga Ex-Dahabshiil, ka soo horjeedka Huteel Baydhabo.", en: "The office is located near Ex-Dahabshiil, opposite Hotel Baidoa, Baidoa, Somalia." }
  },
  {
    q: { so: "Nootaayo Marwaaz ma leedahay aqoonsi iyo leysan sharci ah?", en: "Is Marwaaz Notary officially licensed?" },
    a: { so: "Haa. Nootaayo Marwaaz waxay ka diiwaangashan tahay Wasaaradda Caddaaladda iyo Arrimaha Dastuurka ee Dowladda Federaalka Soomaaliya, iyo Wasaaradda Caddaaladda ee Dowladda Koonfur Galbeed Soomaaliya. Xafiisku wuxuu si rasmi ah u shaqaynayay tan iyo sannadkii 2022.", en: "Yes. Marwaaz Notary is officially registered with the Ministry of Justice & Constitutional Affairs of the Federal Government of Somalia, and the Ministry of Justice of Southwest State of Somalia. Operating since 2022." }
  },
];

const testimonials = [
  { name: "Aamina Xasan", role: { so: "Ganacsato", en: "Business Owner" }, review: { so: "Tallaabo kasta si cad ayaa naloo sharxay, dukumentiyadii nala sameeyayna si degdeg ah oo xirfad leh ayaa loo dhammeeyey.", en: "Every step was explained clearly to us, and our legal documents were completed rapidly and professionally." } },
  { name: "Cabdullaahi Nuur", role: { so: "Macmiil Hanti", en: "Real Estate Client" }, review: { so: "Waxaan aad uga helay hubinta taxaddarka leh iyo sida sirta loo ilaaliyay. Adeeggu wuxuu ahaa mid lagu kalsoonaan karo.", en: "I greatly appreciated the meticulous review and strict confidentiality. The service was completely trustworthy." } },
  { name: "Hodan Cali", role: { so: "Macmiil Hay'adeed", en: "Corporate Client" }, review: { so: "Marwaaz wuxuu isku daraa soo-dhaweyn hufan, nidaam sharci iyo heerka laga filayo xafiis nootaayo oo casri ah.", en: "Marwaaz combines welcoming service, legal precision, and the high standards expected of a modern notary office." } },
];

const team = [
  { name: "Dr. Cabdirisaaq Yacquub Xasan", role: { so: "Maamulaha Guud", en: "General Manager" }, experience: { so: "Hogaaminta iyo Maamulka Guud ee Nootaayada", en: "Overall Leadership & Management of the Notary Office" } },
  { name: "Cabdisalaan Xasan Bilow", role: { so: "Maamule Ku-xigeen", en: "Deputy Manager" }, experience: { so: "Maamulka Adeegyada iyo Hagida Sharciyeed", en: "Service Administration & Legal Guidance" } },
  { name: "Saalax Cali Maxamed", role: { so: "Hawl-wadeen", en: "Notary Officer" }, experience: { so: "Shaqaalaha Adeegyada iyo Diiwaangelinta", en: "Client Services & Document Registration" } },
  { name: "Xasan Cali Mursal", role: { so: "Hawl-wadeen", en: "Notary Officer" }, experience: { so: "Shaqaalaha Adeegyada iyo Diiwaangelinta", en: "Client Services & Document Registration" } },
  { name: "Maxamed Cali Xuseen", role: { so: "Hawl-wadeen", en: "Notary Officer" }, experience: { so: "Shaqaalaha Adeegyada iyo Diiwaangelinta", en: "Client Services & Document Registration" } },
  { name: "Haaruun Maxamed Xasan", role: { so: "Hawl-wadeen", en: "Notary Officer" }, experience: { so: "Shaqaalaha Adeegyada iyo Diiwaangelinta", en: "Client Services & Document Registration" } },
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
  const [lang, setLang] = useState<Lang>("so");
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
    const savedLang = window.localStorage.getItem("marwaaz-lang") as Lang;
    if (savedLang === "so" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    window.localStorage.setItem("marwaaz-lang", newLang);
  };

  const t = (so: string, en: string) => (lang === "so" ? so : en);

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
    name: "Nootaayo Marwaaz Baydhabo",
    alternateName: ["Marwaaz Public Notary", "Nootaayo Marwaaz", "Nootaayada Marwaaz", "Nootaayada Ugu Fiican Baydhabo", "Marwaaz Notary"],
    url: "https://marwaazpn.com",
    logo: "https://marwaazpn.com/logo.png",
    image: "https://marwaazpn.com/og.png",
    description: "Nootaayo Marwaaz waa nootaayada ugu fiican Baydhabo. Waxaan bixinnaa adeegyada rasmiga ah ee nootaayada, kala wareejinta hantida, dhulka, baabuurta iyo heshiisyada sharciga ah ee Baydhabo, Soomaaliya.",
    telephone: "+252617414141",
    email: "Info@marwaazpn.com",
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
          {[
            [t("Nagu Saabsan", "About Us"), "about"],
            [t("Adeegyada", "Services"), "services"],
            [t("Xaqiijin", "Verify"), "verify"],
            [t("Kooxda", "Team"), "team"],
            [t("Xiriir", "Contact"), "contact"],
          ].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-appointment" href="#nala-xiriir" onClick={() => setMenuOpen(false)}>{t("Nala Soo Xiriir", "Contact Us")}</a>
        </nav>
        <div className="header-actions">
          <div className="lang-picker" aria-label="Language selector">
            <Languages size={15} />
            <button className={`lang-option ${lang === "so" ? "active" : ""}`} onClick={() => changeLang("so")} aria-label="Soomaali">SO</button>
            <span className="lang-divider">|</span>
            <button className={`lang-option ${lang === "en" ? "active" : ""}`} onClick={() => changeLang("en")} aria-label="English">ENG</button>
          </div>
          <button className="icon-button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div className="trust-chip" variants={fadeUp}><BadgeCheck size={17} /> {t("Rasmi • Sugan • Lagu Kalsoonaan Karo", "Official • Secure • Trusted")}</motion.div>
          <motion.p className="hero-kicker" variants={fadeUp}>{t("Nootaayada Dadweynaha · Baydhabo, Soomaaliya · Tan iyo 2022", "Public Notary · Baidoa, Somalia · Since 2022")}</motion.p>
          <motion.h1 variants={fadeUp}>{t("Nootaayo Marwaaz.", "Marwaaz Notary.")}<br /><em>{t("Xuquuqdaada. Kalsoonidaada.", "Your Rights. Your Trust.")}</em></motion.h1>
          <motion.p className="hero-copy" variants={fadeUp}>{t("Waxaan si sharci waafaqsan u diyaarinaa, u xaqiijinnaa una sugnaa heshiisyada, kala wareejinta hantida iyo mucaamalaadka muhiimka ah.", "We legally prepare, verify, and secure agreements, property transfers, and official legal transactions.")}</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}><a className="button button-gold" href="#nala-xiriir"><Phone size={19} />{t("Nala Soo Xiriir", "Contact Us")}</a><a className="button button-ghost" href="#verify"><QrCode size={19} />{t("Xaqiiji Dukumenti", "Verify Document")}</a></motion.div>
        </motion.div>
        <motion.aside className="hero-assurance glass-card" initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
          <div className="assurance-seal"><span className="seal-ring"><ShieldCheck size={37} /></span><span>MARWAAZ<small>{t("RASMI AHAAN LOO AQOONSAN YAHAY", "OFFICIALLY RECOGNIZED")}</small></span></div>
          <div className="rating-badge"><span className="stars-row">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</span><span>{t("4.9/5 · 500+ qiimeyn caddayn ah", "4.9/5 · 500+ verified reviews")}</span></div>
          <div><span className="live-dot" />{t("Nidaamka xaqiijinta dukumentiyada waa diyaar", "Document verification system ready")}</div>
          <p>{t("Dukumenti kasta oo diiwaangashan waxaa lagu hubin karaa lambarkiisa gaarka ah.", "Every registered document can be verified using its unique reference number.")}</p>
          <a href="#verify">{t("Hubi tixraaca", "Check reference")} <ArrowRight size={15} /></a>
        </motion.aside>
        <a href="#about" className="scroll-cue" aria-label="Hoos ugu gudub"><span>{t("Sii eeg", "Explore")}</span><ChevronDown size={19} /></a>
        <svg className="hero-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0,28 C240,68 480,68 720,40 C960,12 1200,12 1440,40 L1440,70 L0,70 Z" /></svg>
      </section>

      <section className="motto-ribbon" aria-label="Halkudhayga Marwaaz">
        <Quote size={26} />
        <p>&ldquo;Mé Guurtéda Murung Ay Koo Galne Marwaaz Marag Ku Abtugoy&rdquo;</p>
        <span>— MARWAAZ PUBLIC NOTARY</span>
      </section>

      <div className="credibility-strip">
        <span><ShieldCheck size={18} />{t("Ilaalinta Sirta", "Confidentiality")}</span>
        <span><BadgeCheck size={18} />{t("Dukumenti La Xaqiijiyey", "Verified Documents")}</span>
        <span><Clock3 size={18} />{t("Adeeg Degdeg Ah", "Fast Service")}</span>
        <span><Award size={18} />{t("Heer Xirfadeed", "Professional Standard")}</span>
      </div>

      <section id="about" className="section about-section">
        <div className="about-visual"><motion.div className="about-image" initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}><img src="/image1.png" alt="Kaydka dukumentiyada Marwaaz Public Notary" /><div className="experience-card"><strong>{t("Rasmi", "Official")}</strong><span>{t("Dukumentiyo si taxaddar leh loo sugo", "Carefully secured documents")}</span></div></motion.div></div>
        <motion.div className="about-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span className="eyebrow" variants={fadeUp}><span />{t("NAGU SAABSAN", "ABOUT US")}</motion.span>
          <motion.h2 variants={fadeUp}>{t("Saxiix kasta waa saxnaan.", "Every signature is precision.")}<br />{t("Dukumenti kasta waa kalsooni.", "Every document is confidence.")}</motion.h2>
          <motion.p variants={fadeUp}>{t("Marwaaz Public Notary waxay adeegyo nootaayo oo rasmi ah siisaa shaqsiyaadka, ganacsiyada, hay'adaha iyo ururrada. Ujeedkeennu waa in dukumenti kasta loo diyaariyo loona xaqiijiyo si sax ah, sugan oo sharciga waafaqsan.", "Marwaaz Public Notary delivers official legal notary services to individuals, enterprises, and institutions. Our goal is to draft, verify, and secure every legal document with precision and strict legal compliance.")}</motion.p>
          <motion.div className="authority-strip" variants={fadeUp}><Scale size={20} /><p>{t("Nootaayo Marwaaz waxay oggolaansho rasmi ah ka haysaa Wasaaradda Caddaaladda iyo Arrimaha Dastuurka ee Dowladda Federaalka Soomaaliya, iyo Wasaaradda Caddaaladda iyo Arrimaha Garsoorka ee Dowladda Koonfur Galbeed Soomaaliya. Xafiisku wuxuu furan yahay tan iyo sannadkii 2022.", "Marwaaz Notary holds official licensing from the Ministry of Justice & Constitutional Affairs of the Federal Government of Somalia, and the Ministry of Justice of Southwest State of Somalia. Operating officially since 2022.")}</p></motion.div>
          <motion.div className="values" variants={fadeUp}>{(lang === "so" ? ["Daacadnimo", "Xirfad", "Ilaalinta Sirta", "Saxnaan", "Daahfurnaan", "Qanacsanaanta Macmiilka"] : ["Integrity", "Professionalism", "Confidentiality", "Accuracy", "Transparency", "Client Satisfaction"]).map((value) => <span key={value}><Check size={14} />{value}</span>)}</motion.div>
          <motion.a className="text-link" href="#services" variants={fadeUp}>{t("Eeg adeegyadayada", "View our services")} <ArrowRight size={16} /></motion.a>
        </motion.div>
      </section>

      <section id="services" className="section section-tint">
        <SectionHeading
          eyebrow={t("ADEEGYADA NOOTAAYADA", "NOTARY SERVICES")}
          title={t("Adeegyo sharciyeed oo lagu kalsoonaan karo", "Trusted & Reliable Legal Services")}
          copy={t("Waxaan si xirfad, hufnaan iyo mas'uuliyad leh u diyaarinaa una sugnaa mucaamalaadka, heshiisyada iyo kala wareejinta hantida.", "We professionally and transparently prepare and secure transactions, contracts, and property ownership transfers.")}
          index="01"
        />
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article className="service-card" key={service.title.so} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: (index % 4) * 0.06, duration: 0.45 }} whileHover={{ y: -7 }}>
                <div className="service-icon"><Icon size={24} /></div>
                <h3>{service.title[lang]}</h3>
                <p>{service.description[lang]}</p>
                <a href="#nala-xiriir">{t("Faahfaahin", "Learn More")} <ArrowRight size={14} /></a>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section process-section">
        <SectionHeading
          eyebrow={t("HABRAACA ADEEGGA", "WORKFLOW PROCESS")}
          title={t("Afar Tallaabo oo Fudud oo Nootaayadu Qaaddo", "4 Simple Steps Completed By The Notary")}
          copy={t("Habraaca shaqo ee Nootaayo Marwaaz wuxuu u dhisan yahay si hufan oo aad tallaabo kasta ugu kalsoonaato.", "Marwaaz Notary's workflow is structured transparently so you feel completely confident at every stage.")}
          index="02"
        />
        <div className="process-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div className="process-step" key={step.title.so} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.1, duration: 0.45 }}>
                <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="process-icon"><Icon size={22} /></span>
                <h3>{step.title[lang]}</h3>
                <p>{step.description[lang]}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="section requirements-section">
        <SectionHeading
          eyebrow={t("SHURUUDAHA LOO BAAHAN YAHAY", "DOCUMENT REQUIREMENTS")}
          title={t("Waa maxay dukumentiyada loo baahan yahay?", "What documents are required?")}
          copy={t("Si si degdeg ah oo hufan loogu adeego, hubi inaad sidato dukumentiyada saxda ah ee loo baahan yahay nooc kasta oo kala wareejin ah.", "For efficient service, ensure you bring the accurate required documentation for each specific transfer type.")}
          index="03"
        />
        <div className="requirements-grid">
          {requirements.map((req) => {
            const Icon = req.icon;
            return (
              <motion.div className="requirement-card" key={req.title.so} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }}>
                <span className="requirement-icon"><Icon size={22} /></span>
                <h3>{req.title[lang]}</h3>
                <ul>{req.items.map((item) => <li key={item.so}><Check size={14} />{item[lang]}</li>)}</ul>
              </motion.div>
            );
          })}
        </div>
        <div className="requirement-notes">
          <div className="requirement-note"><span><UsersRound size={18} /></span><div><strong>{t("Haddii Iibiyuhu Maqan Yahay?", "What If The Seller Is Absent?")}</strong><p>{t("Haddii qofka dhulka iibinaya uu ka maqan yahay dalka ama magaalada, waxaa loo baahan yahay Warqad Wakaalad ah oo ka soo baxday Nootaayo ama Safaarad dowladeed.", "If the property seller is outside the city or country, a Power of Attorney (Wakaalad) issued by a Notary or Embassy is required.")}</p></div></div>
          <div className="requirement-note"><span><MapPin size={18} /></span><div><strong>{t("Cabbiraadda Dhulka iyo GPS-ka", "Plot Survey & GPS Coordinate Mapping")}</strong><p>{t("Ka hor kala wareejinta dhul kasta, waxaan booqannaa goobta, cabbirnaa dhulka waxaanay diiwaangelinnaa xogta GPS-ka si loo xaqiijiyo.", "Prior to land transfer, we inspect the plot, measure boundaries, and log GPS data to verify ownership accuracy.")}</p></div></div>
        </div>
      </section>

      <section className="stats-section" aria-label="Tirakoobka Marwaaz">
        <div className="stats-copy">
          <span className="eyebrow light"><span />{t("ADEEG LA AQOONSAN YAHAY", "RECOGNIZED SERVICE")}</span>
          <h2>{t("Kalsooni lagu dhisay kumanaan dukumenti oo la xaqiijiyey.", "Trust established over thousands of verified legal documents.")}</h2>
        </div>
        <div className="stats-grid">
          <StatCounter value={5000} suffix="+" label={t("Dukumentiyo la xaqiijiyey", "Verified Documents")} />
          <StatCounter value={1500} suffix="+" label={t("Macaamiil qanacsan", "Satisfied Clients")} />
          <StatCounter value={15} suffix="+" label={t("Adeegyo xirfadeed", "Professional Services")} />
          <StatCounter value={99} suffix="%" label={t("Qanacsanaanta macaamiishta", "Client Satisfaction Rate")} />
        </div>
      </section>

      <section className="section choose-section">
        <SectionHeading
          eyebrow={t("MAXAA MARWAAZ LOO DOORTAA?", "WHY CHOOSE MARWAAZ?")}
          title={t("Heer Sare Oo Adeeg Sharci Iyo Nootaayo Ah", "Excellence In Legal & Notary Services")}
          copy={t("Kalsoonida sharciga ah waxay ka dhalataa habraac nidaamsan, xaqiijin sugan iyo ixtiraam sare oo macmiil kasta loo hayo.", "Legal confidence stems from systematic procedure, secure verification, and high respect for every client.")}
          align="left"
          index="04"
        />
        <div className="reason-grid">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.article key={reason.title.so} className="reason-card" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.07 }}>
                <span><Icon size={21} /></span>
                <div><h3>{reason.title[lang]}</h3><p>{reason.description[lang]}</p></div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="verify" className="section verification-section">
        <div className="verification-copy">
          <span className="eyebrow light"><span />{t("MARDHOW • COMING SOON", "COMING SOON")}</span>
          <h2>{t("Xaqiijinta Dukumentiyada Onlaynka Ah (Mardhow)", "Online Document Verification Portal (Coming Soon)")}</h2>
          <p>{t("Nidaamka casriga ah ee lagu xaqiijinayo dukumentiyada rasmiga ah ee Marwaaz wuxuu ku jiraa habayn ama diyaarinta u dambaysa (Mardhow ayaa si toos ah loo furi doonaa).", "The modern online document verification portal of Marwaaz is undergoing final development and will be launched soon.")}</p>
          <ul>
            <li><CheckCircle2 size={18} />{t("Nidaam casri ah oo QR leh", "Modern QR code lookup system")}</li>
            <li><CheckCircle2 size={18} />{t("Diiwaangelin sugan oo toos ah", "Secure database logging")}</li>
            <li><CheckCircle2 size={18} />{t("Xaqiijinta tixraaca rasmiga ah", "Instant reference ID verification")}</li>
          </ul>
        </div>
        <div className="verification-console glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div className="status-badge closed" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <span className="status-dot" style={{ background: '#f59e0b' }} />
            <strong>{t("MARDHOW (COMING SOON)", "COMING SOON")}</strong>
          </div>
          <ScanLine size={48} style={{ margin: '0 auto 1.25rem', color: '#eab308' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem' }}>{t("Adeegga Xaqiijinta Onlaynka Ah Wuu Soo Socdaa", "Online Document Verification Service Coming Soon")}</h3>
          <p style={{ opacity: 0.85, fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            {t("Kooxdayada IT-ga waxay ku guda jirtaa dhismaha nidaamka xaqiijinta Koodhka QR-ka iyo tixraaca rasmiga ah. Mardhow ayaad si toos ah ugu hubin kartaa dukumentiyadaada halkan.", "Our IT team is currently building the QR code verification portal. Soon you will be able to verify your documents directly here.")}
          </p>
        </div>
      </section>

      <section id="nala-xiriir" className="section appointment-section">
        <div className="appointment-intro">
          <span className="eyebrow"><span />{t("XIRIIR DEGDEG AH", "QUICK CONTACT")}</span>
          <h2>{t("Ogow goorta uu xafiisku furan yahay, oo si toos ah nala soo xiriir.", "Check our live office hours and reach out directly.")}</h2>
          <p>{t("Xaaladda xafiisku waa mid toos ah (Live). Wac ama noo dir fariin WhatsApp ah wakhti kasta — kooxdayada ayaa si degdeg ah kuugu jawaabi doonta.", "Our office status is updated live. Call or send us a WhatsApp message anytime — our team will assist you promptly.")}</p>
          <div className="contact-mini">
            <div><Phone size={19} /><span><small>{t("Nala Soo Hadal", "Call Us")}</small><a href="tel:+252617414141">+252 617 414141</a><a href="tel:+252613536363">+252 613 536 363</a></span></div>
            <div><Clock3 size={19} /><span><small>{t("Furan: Sabti – Khamiis", "Open: Sat – Thu")}</small><strong>{t("7:30 subaxnimo – 7:30 fiidnimo", "7:30 AM – 7:30 PM")}</strong></span></div>
          </div>
        </div>
        <div className="booking-card status-card">
          {officeStatus && <>
            <div className={`status-badge ${officeStatus.open ? "open" : "closed"}`}>
              <span className="status-dot" />
              <strong>{officeStatus.open ? t("FURAN HADDA", "OPEN NOW") : t("XIRAN HADDA", "CLOSED NOW")}</strong>
            </div>
            <p className="status-time">{t("Waqtiga Hadda ee Baydhabo:", "Current Time in Baidoa:")} <strong>{officeStatus.time}</strong></p>
            {!officeStatus.open && <p className="status-time">{t("Xafiisku wuxuu furan yahay Sabti illaa Khamiis, 7:30 subaxnimo illaa 7:30 fiidnimo.", "The office is open Saturday through Thursday, 7:30 AM to 7:30 PM.")}</p>}
          </>}
          <div className="status-actions">
            <a className="button button-navy" href="tel:+252617414141"><Phone size={18} />{t("Wac Hadda", "Call Now")}</a>
            <a className="button button-gold" href="https://wa.me/252613536363" target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a>
            <a className="button button-ghost" href="mailto:Info@marwaazpn.com"><Mail size={18} />{t("Iimayl", "Email")}</a>
          </div>
          <p className="status-note"><LockKeyhole size={13} />{t("Xogtaada si sugan oo qarsoodi ah ayaan u xafidnaa.", "Your data is handled with complete confidentiality.")}</p>
        </div>
      </section>

      <section className="section section-tint testimonials-section">
        <SectionHeading
          eyebrow={t("WAAYO-ARAGNIMADA MACAAMIISHA", "CLIENT TESTIMONIALS")}
          title={t("Kalsoonida ay macaamiisheenu ka warramayaan", "What our clients say about us")}
          index="05"
        />
        <div className="testimonial-shell">
          <button className="carousel-button" onClick={() => setTestimonial((testimonial - 1 + testimonials.length) % testimonials.length)} aria-label={t("Faalladii hore", "Previous review")}><ChevronLeft /></button>
          <AnimatePresence mode="wait">
            <motion.article key={activeTestimonial.name} className="testimonial-card" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: 0.35 }}>
              <div className="quote-mark">“</div>
              <div className="stars" aria-label="5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div>
              <blockquote>{activeTestimonial.review[lang]}</blockquote>
              <div className="client">
                <span className="avatar-fallback">{initials(activeTestimonial.name)}</span>
                <div><strong>{activeTestimonial.name}</strong><span>{activeTestimonial.role[lang]}</span></div>
              </div>
            </motion.article>
          </AnimatePresence>
          <button className="carousel-button" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label={t("Faallada xigta", "Next review")}><ChevronRight /></button>
        </div>
        <div className="carousel-dots" role="tablist" aria-label="Review selector">
          {testimonials.map((item, i) => <button key={item.name} className={i === testimonial ? "active" : ""} onClick={() => setTestimonial(i)} aria-label={`Review ${i + 1}`} />)}
        </div>
      </section>

      <section className="section faq-section">
        <SectionHeading
          eyebrow={t("SU'AALAHA UGU BADAN EE LA ISWEYDIIYO", "FREQUENTLY ASKED QUESTIONS")}
          title={t("Jawaabo cad oo ku saabsan adeegyadayada", "Clear answers to your legal queries")}
          copy={t("Haddii aad qabto su'aal gaar ah oo aan halkan ku qornayn, nala soo xiriir; kooxdayada ayaa si degdeg ah kuugu jawaabi doonta.", "If you have a specific query not covered here, feel free to contact us; our team will gladly assist you.")}
          index="06"
        />
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.details key={faq.q.so} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.q[lang]}<ChevronDown size={19} /></summary>
              <p>{faq.a[lang]}</p>
            </motion.details>
          ))}
        </div>
      </section>

      <section id="team" className="section team-section">
        <SectionHeading
          eyebrow={t("KOOXDA XIRFADLAYAASHA", "OUR LEGAL TEAM")}
          title={t("Khibrad, mas'uuliyad iyo adeeg kuu gaar ah", "Experience, integrity, and dedicated service")}
          copy={t("Kooxdayadu waxay isku dartaa go'aan taxaddar leh, habraac nidaamsan iyo ixtiraam macmiil kasta.", "Our team combines careful legal judgement, structured workflow, and respect for every client.")}
          index="07"
        />
        <div className="team-grid">
          {team.map((person) => (
            <motion.article className="team-card" key={person.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="team-image"><span className="avatar-fallback">{initials(person.name)}</span><span className="team-badge">{person.role[lang]}</span></div>
              <div className="team-info"><h3>{person.name}</h3><strong>{person.role[lang]}</strong><p>{person.experience[lang]}</p><a href="#contact"><Mail size={15} />{t("La xiriir", "Contact")}</a></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-pattern" aria-hidden="true" />
        <motion.div className="cta-content" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
          <span className="eyebrow light"><span />{t("DIYAAR MA U TAHAY?", "READY TO START?")}</span>
          <h2>{t("Dukumentigaaga maanta u keen Nootaayo Marwaaz.", "Bring your documents to Marwaaz Notary today.")}</h2>
          <p>{t("Kooxdayadu waxay diyaar u tahay inay kaa caawiso tallaabo kasta — booqasho, ballan ama xaqiijinta dukumentiga.", "Our legal team is ready to guide you at every step — visit, appointment, or verification.")}</p>
          <div className="cta-actions"><a className="button button-gold" href="#nala-xiriir"><Phone size={18} />{t("Nala Soo Xiriir", "Contact Us")}</a><a className="button button-ghost" href="https://wa.me/252613536363" target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a></div>
        </motion.div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-map"><iframe title="Khariidadda Xafiiska Marwaaz Public Notary, Baydhabo" src="https://www.google.com/maps?q=Marwaaz+Public+Notary%2C+Baidoa%2C+Somalia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        <div className="contact-panel">
          <span className="eyebrow light"><span />{t("BOOQASHADA XAFIISKA", "VISIT OUR OFFICE")}</span>
          <h2>{t("Booqashada Xafiiska Nootaayo Marwaaz Ee Magaalada Baydhabo", "Visit Marwaaz Notary Office In Baidoa City")}</h2>
          <div className="contact-list">
            <div><MapPin /><span><small>{t("Goobta Xafiiska", "Office Location")}</small><strong>Marwaaz Public Notary</strong><p>{t("Nawaaxiga Ex-Dahabshiil, ka soo horjeedka Huteel Baydhabo, Baydhabo, Soomaaliya", "Near Ex-Dahabshiil, opposite Hotel Baidoa, Baidoa, Somalia")}</p></span></div>
            <div><Phone /><span><small>{t("Telefoonka Xafiiska", "Office Telephones")}</small><a href="tel:+252617414141">+252 617 414141</a><a href="tel:+252613536363">+252 613 536 363</a></span></div>
            <div><Mail /><span><small>{t("Iimaylka Rasmiga Ah", "Official Email")}</small><a href="mailto:Info@marwaazpn.com">Info@marwaazpn.com</a><a href="mailto:marwaaznotary@gmail.com">marwaaznotary@gmail.com</a></span></div>
            <div><Clock3 /><span><small>{t("Saacadaha Shaqada", "Working Hours")}</small><strong>{t("Sabti – Khamiis", "Saturday – Thursday")}</strong><p>{t("7:30 subaxnimo – 7:30 fiidnimo", "7:30 AM – 7:30 PM")}</p></span></div>
          </div>
          <div className="contact-actions"><a className="button button-gold" href="tel:+252617414141"><Phone size={18} />{t("Wac Hadda", "Call Now")}</a><a className="button button-ghost" href="https://wa.me/252613536363" target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a><a className="button button-ghost" href="https://maps.app.goo.gl/omXFTvfkovNYNtdn8" target="_blank" rel="noreferrer"><Navigation size={18} />{t("Jihada Khariidadda", "Map Directions")}</a></div>
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#top"><span className="brand-mark"><img src="/logo.png" alt="" /></span><span><strong>MARWAAZ</strong><small>PUBLIC NOTARY</small></span></a>
            <p>{t("Adeeg sharci oo rasmi ah, lagu kalsoonaan karo, oo loogu talagalay shaqsiyaadka, ganacsiyada iyo hay'adaha ku sugan Baydhabo.", "Official, reliable legal notary services for individuals, businesses, and institutions in Baidoa.")}</p>
            <div className="social-links"><a href="https://www.facebook.com/share/1DdrxRCNqt/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="LinkedIn">in</a></div>
          </div>
          <div>
            <h3>{t("Xiriirinta Degdega Ah", "Quick Links")}</h3>
            <a href="#about">{t("Nagu Saabsan", "About Us")}</a>
            <a href="#services">{t("Adeegyada", "Services")}</a>
            <a href="#team">{t("Kooxda", "Team")}</a>
            <a href="#contact">{t("Xiriir", "Contact")}</a>
          </div>
          <div>
            <h3>{t("Adeegyada Macmiilka", "Client Services")}</h3>
            <a href="#appointment">{t("Ballamaha", "Appointments")}</a>
            <a href="#verify">{t("Xaqiijinta Dukumentiga", "Document Verification")}</a>
            <a href="#services">{t("Nuqullo La Xaqiijiyey", "Certified Copies")}</a>
            <a href="#services">{t("La-talin Sharci", "Legal Advice")}</a>
          </div>
          <div>
            <h3>{t("Xiriir", "Contact")}</h3>
            <span>{t("Baydhabo, Soomaaliya", "Baidoa, Somalia")}</span>
            <a href="tel:+252617414141">+252 617 414141</a> · <a href="tel:+252613536363">+252 613 536 363</a>
            <a href="mailto:Info@marwaazpn.com">Info@marwaazpn.com</a>
            <a href="mailto:marwaaznotary@gmail.com">marwaaznotary@gmail.com</a>
            <span>{t("Sabti – Khamiis, 7:30 subaxnimo – 7:30 fiidnimo", "Saturday – Thursday, 7:30 AM – 7:30 PM")}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("© 2026 Marwaaz Public Notary. Dhammaan Xuquuqda Way Dhowran Yihiin. • Waxaa dhisay", "© 2026 Marwaaz Public Notary. All Rights Reserved. • Developed by")} <a href="https://samanor.dev" target="_blank" rel="noreferrer" className="developer-link">samanor.dev</a></span>
          <div><a href="#">{t("Siyaasadda Sirta", "Privacy Policy")}</a><a href="#">{t("Shuruudaha Adeegga", "Terms of Service")}</a></div>
        </div>
      </footer>
    </main>
  );
}
