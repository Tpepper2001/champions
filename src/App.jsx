import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --gold: #F4D03F;
    --navy: #0A1128;
    --terracotta: #C86B56;
    --cream: #FFF8F0;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #1A1A1A;
    line-height: 1.6;
    overflow-x: hidden;
    background: #FFF8F0;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-30px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.95); }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    animation: slideDown 0.6s ease-out;
    transition: box-shadow 0.3s;
  }
  .navbar.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.4rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 0.8rem;
    font-weight: 700; font-size: 1.05rem; color: #0A1128;
    text-decoration: none; cursor: pointer; transition: opacity 0.2s;
  }
  .logo:hover { opacity: 0.85; }
  .logo-img {
    width: 72px; height: 72px; border-radius: 50%;
    background: white; padding: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    transition: transform 0.3s;
  }
  .logo:hover .logo-img { transform: rotate(-5deg) scale(1.05); }

  .nav-links { display: flex; gap: 1.4rem; list-style: none; align-items: center; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.2s; cursor: pointer; font-size: 0.88rem;
    padding: 0.3rem 0; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 2px; background: #C86B56;
    transition: width 0.3s ease;
  }
  .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
  .nav-links a.active { color: #C86B56; font-weight: 700; }
  .nav-links a:hover { color: #C86B56; }
  .nav-book-btn {
    background: linear-gradient(135deg, #C86B56, #a8553f) !important;
    color: white !important; padding: 0.6rem 1.3rem !important;
    border-radius: 50px !important; font-weight: 700 !important;
    box-shadow: 0 4px 15px rgba(200,107,86,0.35) !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
  }
  .nav-book-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(200,107,86,0.5) !important; }
  .nav-book-btn::after { display: none !important; }

  .hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    padding: 8px; background: none; border: none; z-index: 1100;
  }
  .hamburger span {
    display: block; width: 24px; height: 2px;
    background: #0A1128; border-radius: 2px; transition: all 0.3s ease;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(10,17,40,0.98); z-index: 999;
    flex-direction: column; align-items: center; justify-content: center;
    gap: 2.5rem; animation: fadeIn 0.25s ease;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    color: white; text-decoration: none; font-size: 1.6rem;
    font-family: 'Playfair Display', serif; font-weight: 700;
    transition: color 0.2s; cursor: pointer;
  }
  .mobile-menu a:hover, .mobile-menu a.active { color: #F4D03F; }
  .mobile-book-btn {
    background: linear-gradient(135deg, #C86B56, #a8553f) !important;
    padding: 0.8rem 2rem !important; border-radius: 50px !important;
    font-size: 1rem !important; font-family: 'DM Sans', sans-serif !important;
  }

  .hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center; overflow: hidden;
    background: #0A1128;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(135deg, rgba(10,17,40,0.88) 0%, rgba(10,17,40,0.6) 60%, rgba(200,107,86,0.3) 100%),
      url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
    animation: float 30s ease-in-out infinite;
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 1400px; margin: 0 auto;
    padding: 100px 2rem 0; width: 100%;
    animation: fadeInUp 1s ease 0.2s both;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.8rem;
    color: var(--gold); letter-spacing: 3px; font-weight: 600;
    font-size: 0.8rem; margin-bottom: 1.8rem; text-transform: uppercase;
  }
  .hero-eyebrow::before { content: ''; width: 32px; height: 2px; background: var(--gold); }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 6vw, 6rem); font-weight: 900; color: white;
    line-height: 1.08; margin-bottom: 1.8rem; max-width: 820px;
  }
  .hero-title em {
    font-style: italic;
    background: linear-gradient(135deg, #F4D03F, #f0b429);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    color: rgba(255,255,255,0.85); font-size: 1.15rem;
    max-width: 540px; margin-bottom: 1rem; font-weight: 300; line-height: 1.7;
  }
  .hero-quote {
    color: rgba(255,255,255,0.6); font-size: 0.98rem;
    font-style: italic; font-family: 'Playfair Display', serif;
    max-width: 540px; margin-bottom: 3rem; line-height: 1.6;
  }
  .hero-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-primary {
    background: linear-gradient(135deg, var(--gold), #e8c020);
    color: var(--navy); padding: 1rem 2.5rem; border-radius: 50px;
    font-weight: 800; border: none; cursor: pointer; font-size: 1rem;
    box-shadow: 0 8px 25px rgba(244,208,63,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(244,208,63,0.5); }
  .btn-outline {
    background: transparent; color: white;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-weight: 600; border: 2px solid rgba(255,255,255,0.4); cursor: pointer;
    font-size: 1rem; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.08); }

  .hero-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: rgba(255,255,255,0.5); font-size: 0.75rem; letter-spacing: 2px;
    text-transform: uppercase; animation: fadeIn 1s 1.5s both;
  }
  .scroll-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.5);
    animation: fadeInUp 1.5s 1.5s infinite;
  }

  .marquee-strip { background: var(--navy); padding: 1rem 0; overflow: hidden; }
  .marquee-inner {
    display: flex; gap: 4rem; white-space: nowrap;
    animation: marquee 20s linear infinite; width: max-content;
  }
  .marquee-item {
    color: rgba(255,255,255,0.5); font-size: 0.8rem;
    letter-spacing: 2px; text-transform: uppercase; font-weight: 600;
  }
  .marquee-dot { color: var(--gold); }

  .page-padding { padding: 10rem 2rem 5rem 2rem; min-height: 80vh; }
  .home-section { padding: 7rem 2rem; }
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label {
    font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase;
    color: #C86B56; font-weight: 700; margin-bottom: 1rem;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .section-label::before, .section-label::after {
    content: ''; width: 20px; height: 1px; background: #C86B56;
  }
  .section-title {
    font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900; color: #0A1128; margin-bottom: 1rem; line-height: 1.1;
  }

  .about-quote {
    border-left: 4px solid var(--gold); padding-left: 1.5rem;
    font-family: 'Playfair Display', serif; font-size: 1.25rem;
    font-style: italic; color: var(--navy); line-height: 1.6; margin: 2rem 0;
  }

  .value-card {
    background: white; border-radius: 16px; padding: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    display: flex; align-items: flex-start; gap: 1rem;
    transition: transform 0.3s;
  }
  .value-card:hover { transform: translateY(-3px); }
  .value-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--navy), #1a2a5e);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
  }

  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .team-card {
    background: white; border-radius: 24px; padding: 2.5rem 2rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06); display: flex; flex-direction: column;
    transition: transform 0.3s, box-shadow 0.3s; border: 1px solid rgba(0,0,0,0.04);
  }
  .team-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }
  .team-avatar-wrap { position: relative; width: 90px; height: 90px; margin-bottom: 1.5rem; }
  .team-avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(200,107,86,0.2); }
  .team-avatar-ring {
    position: absolute; inset: -6px; border-radius: 50%;
    border: 2px dashed rgba(200,107,86,0.3);
    animation: float 8s ease-in-out infinite;
  }

  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .blog-card {
    border-radius: 24px; overflow: hidden; background: white;
    box-shadow: 0 8px 30px rgba(0,0,0,0.06); transition: transform 0.3s, box-shadow 0.3s;
    display: flex; flex-direction: column;
  }
  .blog-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; transition: transform 0.4s; }
  .blog-card:hover .blog-img { transform: scale(1.04); }
  .blog-img-wrap { overflow: hidden; }

  .video-wrapper {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: #000;
    box-shadow: 0 40px 80px rgba(0,0,0,0.3); position: relative;
  }

  .contact-input {
    width: 100%; padding: 1.1rem 1.3rem; background: #fff;
    border: 1.5px solid #e8e8e8; border-radius: 12px; margin-bottom: 1rem;
    font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s, box-shadow 0.2s;
    color: #1A1A1A;
  }
  .contact-input:focus { border-color: #C86B56; outline: none; box-shadow: 0 0 0 3px rgba(200,107,86,0.1); }
  .contact-input::placeholder { color: #aaa; }
  .form-feedback-text {
    font-size: 0.82rem; opacity: 0.6; text-align: center; margin-top: 1rem;
    display: block; color: #444;
  }
  .btn-submit {
    width: 100%; padding: 1.1rem; border-radius: 12px; border: none;
    font-weight: 700; cursor: pointer; font-size: 1rem; font-family: inherit;
    transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.5px;
  }
  .btn-submit:hover { transform: translateY(-2px); }
  .btn-submit-navy {
    background: linear-gradient(135deg, #0A1128, #1a2a5e);
    color: white; box-shadow: 0 4px 20px rgba(10,17,40,0.3);
  }
  .btn-submit-navy:hover { box-shadow: 0 8px 30px rgba(10,17,40,0.4); }
  .btn-submit-terracotta {
    background: linear-gradient(135deg, #C86B56, #a8553f);
    color: white; box-shadow: 0 4px 20px rgba(200,107,86,0.35);
  }
  .btn-submit-terracotta:hover { box-shadow: 0 8px 30px rgba(200,107,86,0.5); }

  .event-card {
    background: white; border-radius: 24px; overflow: hidden;
    box-shadow: 0 5px 20px rgba(0,0,0,0.06);
    transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column;
  }
  .event-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
  .event-date-badge {
    background: linear-gradient(135deg, var(--navy), #1a2a5e);
    color: white; padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1rem;
  }
  .event-day { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; line-height: 1; }
  .event-month-year { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
  .event-body { padding: 2rem; flex: 1; }
  .event-register-btn {
    margin: 0 2rem 2rem; padding: 0.8rem; border-radius: 10px;
    background: var(--cream); border: 2px solid var(--navy); color: var(--navy);
    font-weight: 700; cursor: pointer; font-family: inherit; font-size: 0.9rem;
    transition: all 0.2s;
  }
  .event-register-btn:hover { background: var(--navy); color: white; }

  .ceo-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 5rem;
    align-items: start;
  }

  .article-content { font-size: 1.1rem; line-height: 1.9; color: #333; }
  .article-content p { margin-bottom: 1.5rem; }
  .article-content h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--navy); margin: 2.5rem 0 1rem; }
  .article-content blockquote {
    border-left: 4px solid var(--gold); padding: 1rem 1.5rem;
    background: var(--cream); border-radius: 0 12px 12px 0;
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 1.2rem; margin: 2rem 0;
  }

  .footer { background: #050a18; color: white; padding: 5rem 2rem 3rem; position: relative; overflow: hidden; }
  .footer::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--terracotta), transparent);
  }
  .footer-grid {
    max-width: 1400px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 4rem;
  }
  .footer-bottom {
    max-width: 1400px; margin: 0 auto;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 2rem; text-align: center;
  }

  @media (max-width: 992px) {
    .team-grid, .blog-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .hero-title { font-size: 3rem; }
    .ceo-grid { grid-template-columns: 1fr; gap: 3rem; }
  }
  @media (max-width: 768px) {
    .navbar { position: sticky; top: 0; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .team-grid, .blog-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 2.2rem; }
    .page-padding { padding: 5rem 1.2rem 3rem; }
    .home-section { padding: 4rem 1.2rem; }
    .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
    .hero-cta-row { flex-direction: column; }
    .hero-cta-row button { width: 100%; }
    .nav-container { padding: 0.5rem 1.2rem; }
    .ceo-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  }
`;

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/>
  </svg>
);

const teamMembers = [
  { name: "James Oluwapelumi Olatunbosun", designation: "Program Director", bio: "James is a science communicator and Engineering Physics student at OAU. He is committed to seeing young people thrive in career and character.", linkedin: "https://www.linkedin.com/in/james-olatunbosun", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg" },
  { name: "Ogbaudu Oghenefegor Believe", designation: "Corp Member", bio: "A faith-based writer and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.", linkedin: null, photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg" },
  { name: "Oluwatoyin Oluwabukola Yakubu", designation: "Head, Content", bio: "Oluwatoyin is passionate about helping people find healing from trauma and depression through honest conversations.", linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg" },
  { name: "Joseph Temitope Deborah", designation: "Community Manager", bio: "A communication advocate and leadership enthusiast passionate about purpose discovery and building impactful leaders.", linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg" },
  { name: "Promise Nseobong", designation: "Human Resource", bio: "An accounting student and creative voice running a YouTube channel on motivation and spoken-word poetry.", linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg" },
  { name: "Grace Temitope Babatunde", designation: "Admin", bio: "A communication specialist combining mastery of language with a passion for people-management and HR.", linkedin: "https://www.linkedin.com/in/gracetemibabatunde", photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg" },
];

const blogPosts = [
  {
    title: "Intentional Leadership",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    date: "Feb 9, 2026",
    category: "Leadership",
    excerpt: "Leadership is more than just a position; it is a conscious decision to influence and guide others towards a shared vision.",
    readTime: "5 min read",
    fullContent: "Leadership is more than just a position; it is a conscious decision to influence and guide others towards a shared vision. In a world full of noise and distraction, the most impactful leaders are those who lead with intentionality.\n\nTrue leadership begins from within. Before you can lead others, you must first learn to lead yourself. This means understanding your values, your purpose, and your non-negotiables. It means having the discipline to do what is right even when no one is watching.\n\nIntentional leaders don't just react to circumstances — they create them. They set the tone for their teams and organizations by modeling the behavior they wish to see. They invest in people not because it's convenient, but because they genuinely believe in the potential of every individual they encounter.\n\nOne of the greatest hallmarks of intentional leadership is the capacity to listen. Not just to respond, but to truly hear. The world is full of leaders who love to talk, but champions are those who understand that wisdom often comes from the voices around them.\n\nAs you step into your leadership journey today, ask yourself: Am I leading on purpose? Am I adding value to those around me? Am I building people, or simply using them? The answers to these questions will define the kind of leader you become — and the kind of legacy you leave behind.\n\nChampions' Leadership Global exists to raise exactly this kind of leader: intentional, impactful, and enduring. The world doesn't need more bosses. It needs more champions."
  },
];

const coreValues = [
  { icon: "\uD83C\uDFAF", title: "Purpose", desc: "We believe every individual carries a God-given assignment. Our work begins where purpose is discovered — and we will not rest until every person we serve finds theirs." },
  { icon: "\uD83D\uDD04", title: "Personal Transformation", desc: "We are committed to the inside-out work of change. Real transformation is not cosmetic — it reshapes thinking, behaviour, and character from the core." },
  { icon: "\uD83D\uDC51", title: "Leadership", desc: "We raise leaders defined by character, not title. Every programme we run is ultimately a leadership development encounter." },
  { icon: "\uD83C\uDF1F", title: "Influence", desc: "We equip people to carry weight in their spheres — family, career, community, and beyond. Influence is the currency of true leadership." },
  { icon: "\uD83C\uDF0D", title: "Global Impact", desc: "Our vision does not stop at borders. We are raising a generation of champions whose impact will be felt across nations and generations." },
  { icon: "\uD83C\uDFDB", title: "Legacy", desc: "We build for the long term. Everything we do is designed to outlast us — raising leaders whose lives, decisions, and values echo into the next generation." },
];

const degrees = [
  { degree: "B.A. Music \u2014 Second Class Upper", school: "Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria", status: "Completed" },
  { degree: "M.A. Music", school: "Obafemi Awolowo University, Ile-Ife, Osun State, Nigeria", status: "Ongoing" },
];

const certifications = [
  { cert: "Write Like Mozart: An Introduction to Classical Music Composition", school: "National University of Singapore" },
  { cert: "Introduction to Classical Music", school: "Yale University" },
  { cert: "Fundamentals of Music Theory", school: "The University of Edinburgh" },
  { cert: "Introduction to Psychology", school: "Yale University" },
  { cert: "Songwriting: Writing the Lyrics", school: "Berklee College of Music" },
  { cert: "Exploring Piano Literature: The Piano Sonata", school: "University of Michigan" },
];

const events = [
  { day: "15", month: "APR", year: "2026", title: "Leadership Bootcamp", loc: "OAU Auditorium, Ile-Ife", desc: "An intensive two-day bootcamp on purpose-driven leadership for students and young professionals.", tag: "Physical" },
  { day: "22", month: "MAY", year: "2026", title: "Purpose Webinar", loc: "Online (Zoom)", desc: "A powerful online seminar exploring identity, purpose, and how to align your life with your calling.", tag: "Virtual" },
  { day: "14", month: "JUN", year: "2026", title: "Champions Conference", loc: "TBD \u2014 Lagos", desc: "Our flagship annual conference bringing together leaders, thinkers, and change-makers from across Nigeria.", tag: "Physical" },
];

const statItems = [
  { num: "2", suffix: "+", label: "Years of Impact", desc: "Years of raising transformational leaders", icon: "\uD83D\uDCC5" },
  { num: "1K", suffix: "+", label: "Lives Transformed", desc: "Individuals impacted through our programmes", icon: "\uD83C\uDF31" },
  { num: "6", suffix: "", label: "Core Team Members", desc: "Dedicated champions driving the vision", icon: "\uD83E\uDD1D" },
  { num: "6", suffix: "", label: "Core Values", desc: "Principles guiding everything we do", icon: "\uD83E\uDDED" },
];

export default function App() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const formAction = "https://formspree.io/f/mqeykgyy";
  const contactInfoText = "championscorner27@gmail.com \u00B7 +234 906 414 4546";

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.head.removeChild(style);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = (v) => {
    setView(v);
    setMenuOpen(false);
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { label: "Home", key: "home" },
    { label: "Meet the CEO", key: "ceo" },
    { label: "Events", key: "events" },
    { label: "Team", key: "team" },
    { label: "Blog", key: "blog" },
  ];

  return (
    <div>
      {/* NAVBAR */}
      <nav className={"navbar" + (scrolled ? " scrolled" : "")}>
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("home")}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" className="logo-img" />
            <span>Champions&apos; Leadership Global</span>
          </div>
          <ul className="nav-links">
            {navItems.map(function(item) {
              return (
                <li key={item.key}>
                  <a href="#!" className={view === item.key ? "active" : ""} onClick={function(e) { e.preventDefault(); navigate(item.key); }}>{item.label}</a>
                </li>
              );
            })}
            <li>
              <a href="#!" className={"nav-book-btn" + (view === "booking" ? " active" : "")} onClick={function(e) { e.preventDefault(); navigate("booking"); }}>Book a Session</a>
            </li>
          </ul>
          <button className={"hamburger" + (menuOpen ? " open" : "")} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={"mobile-menu" + (menuOpen ? " open" : "")}>
        {navItems.map(function(item) {
          return (
            <a key={item.key} href="#!" className={view === item.key ? "active" : ""} onClick={function(e) { e.preventDefault(); navigate(item.key); }}>{item.label}</a>
          );
        })}
        <a href="#!" className="mobile-book-btn" onClick={function(e) { e.preventDefault(); navigate("booking"); }}>Book a Session</a>
      </div>

      {/* HOME */}
      {view === "home" && (
        <div>
          {/* HERO */}
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-content">
              <div className="hero-eyebrow">Welcome to a World of Champions</div>
              <h1 className="hero-title">
                Raising<br />
                <em>Transformational</em><br />
                Leaders
              </h1>
              <p className="hero-sub">Empowering individuals to discover their purpose and lead with lasting, generational impact.</p>
              <p className="hero-quote">&ldquo;You can choose your actions; not consequences&rdquo; &mdash; Jerry Oyedele</p>
              <div className="hero-cta-row">
                <button className="btn-primary" onClick={function() { var el = document.getElementById("about-us"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>
                  Explore Our Mission
                </button>
                <button className="btn-outline" onClick={() => navigate("booking")}>
                  Book a Session &rarr;
                </button>
              </div>
            </div>
            <div className="hero-scroll-hint">
              <span>Scroll</span>
              <div className="scroll-dot" />
            </div>
          </section>

          {/* MARQUEE */}
          <div className="marquee-strip">
            <div className="marquee-inner">
              {["Purpose Discovery", "Leadership Development", "Intentional Living", "Character Formation", "Champions Conference", "Personal Transformation",
                "Purpose Discovery", "Leadership Development", "Intentional Living", "Character Formation", "Champions Conference", "Personal Transformation"].map(function(t, i) {
                return <span key={i} className="marquee-item">{t} <span className="marquee-dot">&bull;</span> </span>;
              })}
            </div>
          </div>

          {/* STATS */}
          <section style={{ background: "#0A1128", padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-80px", left: "-80px", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,208,63,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,107,86,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <div className="section-label" style={{ color: "#F4D03F", justifyContent: "center", marginBottom: "0.8rem" }}>Our Impact So Far</div>
                <h2 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1 }}>
                  Every Number Tells <em style={{ fontStyle: "italic", color: "#F4D03F" }}>a Story</em>
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                {statItems.map(function(s, i) {
                  return (
                    <div key={i}
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "2.5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden", transition: "transform 0.3s, background 0.3s", cursor: "default" }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 48, height: 3, background: i % 2 === 0 ? "linear-gradient(90deg, #F4D03F, #e8c020)" : "linear-gradient(90deg, #C86B56, #a8553f)", borderRadius: "0 0 4px 4px" }} />
                      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{s.icon}</div>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(3rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1, marginBottom: "0.4rem" }}>
                        <span style={{ color: "white" }}>{s.num}</span>
                        <span style={{ color: i % 2 === 0 ? "#F4D03F" : "#C86B56" }}>{s.suffix}</span>
                      </div>
                      <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.6rem", letterSpacing: "0.5px" }}>{s.label}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: "4rem", padding: "2.5rem 3rem", background: "rgba(244,208,63,0.06)", border: "1px solid rgba(244,208,63,0.15)", borderRadius: 20, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.3rem" }}>Ready to become part of the story?</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Join thousands of champions already on the journey.</p>
                </div>
                <button onClick={() => navigate("booking")} className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                  Book a Session &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* ABOUT US */}
          <section id="about-us" className="home-section" style={{ background: "white" }}>
            <div className="section-container">
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <div className="section-label">Our Story</div>
                <h2 className="section-title">About Champions&apos; Leadership Global</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.9 }}>
                  <p style={{ marginBottom: "1.5rem" }}>Champions&apos; Leadership Global is a brand deeply committed to the themes of purpose, leadership, and personal development. We exist to raise a generation of individuals who are not merely successful in the world&apos;s eyes but are truly fulfilled in their God-given assignment.</p>
                  <p style={{ marginBottom: "1.5rem" }}>We believe that everyone has the potential and responsibility to live out their purpose, and we aim to inspire and enlighten individuals on this journey. Our work is rooted in the conviction that the world&apos;s greatest problems are not structural — they are leadership problems, and leadership problems are ultimately people problems.</p>
                  <p style={{ marginBottom: "1.5rem" }}>Founded out of a personal experience of purpose discovery, Champions&apos; Leadership Global was born to serve as a catalyst — a space where people encounter the truth about themselves, are equipped for their life&apos;s work, and are connected to a community of like-minded champions.</p>
                  <blockquote className="about-quote">
                    Transforming people is the best way to transform the world, because the world is first a people, which eventually makes the place.
                  </blockquote>
                </div>
                <div>
                  <div style={{ background: "linear-gradient(135deg, #0A1128, #1a2a5e)", color: "white", padding: "3rem", borderRadius: 28, marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>\uD83C\uDF0D</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", marginBottom: "1rem", color: "#F4D03F" }}>Our Vision</h3>
                    <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontSize: "1.05rem" }}>A world where every individual walks in the full expression of their God-given purpose — leading families, organisations, communities, and nations with wisdom, integrity, and lasting impact.</p>
                  </div>
                  <div style={{ background: "#FFF8F0", padding: "2.5rem", borderRadius: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>\uD83C\uDFAF</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", marginBottom: "1rem", color: "#0A1128" }}>Our Mission</h3>
                    <p style={{ color: "#555", lineHeight: 1.8, fontSize: "1.05rem" }}>To discover, develop, and deploy transformational leaders through intentional programmes, platforms, and partnerships that foster purpose, character, and excellence in every sphere of life.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CORE VALUES */}
          <section className="home-section" style={{ background: "#FFF8F0" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">What We Stand For</div>
                <h2 className="section-title">Our Core Values</h2>
                <p style={{ maxWidth: 560, margin: "0 auto", color: "#666", lineHeight: 1.7 }}>These values are not aspirations — they are the daily operating system of everyone who bears the Champions&apos; Leadership Global name.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {coreValues.map(function(v, i) {
                  return (
                    <div key={i} className="value-card">
                      <div className="value-icon">{v.icon}</div>
                      <div>
                        <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#0A1128", marginBottom: "0.4rem" }}>{v.title}</h4>
                        <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.7 }}>{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CEO VIDEO */}
          <section className="home-section" style={{ background: "#0A1128" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label" style={{ color: "#F4D03F" }}>A Personal Note</div>
                <h2 className="section-title" style={{ color: "white" }}>Our CEO says Welcome</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>Hear directly from Jerry Oyedele, founder of Champions&apos; Leadership Global</p>
              </div>
              <div className="video-wrapper">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/S_8q0h4-QNo" title="CEO Welcome Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button onClick={() => navigate("ceo")} style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "white", padding: "0.9rem 2rem", borderRadius: 50, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem" }}>
                  Read Full Bio &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* BLOG PREVIEW */}
          <section className="home-section" style={{ background: "white" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Latest Insight</div>
                <h2 className="section-title">From the Blog</h2>
              </div>
              <div style={{ maxWidth: 950, margin: "0 auto" }}>
                <div className="blog-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", borderRadius: 24 }}>
                  <div className="blog-img-wrap">
                    <img src={blogPosts[0].img} alt="Latest post" style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem", alignItems: "center" }}>
                      <span style={{ background: "#FFF8F0", color: "#C86B56", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{blogPosts[0].category}</span>
                      <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{blogPosts[0].readTime}</span>
                    </div>
                    <div style={{ color: "#C86B56", fontWeight: 700, fontSize: "0.85rem" }}>{blogPosts[0].date}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", margin: "0.8rem 0", color: "#0A1128" }}>{blogPosts[0].title}</h3>
                    <p style={{ opacity: 0.75, marginBottom: "1.8rem", lineHeight: 1.7 }}>{blogPosts[0].excerpt}</p>
                    <button onClick={function() { setSelectedPost(blogPosts[0]); navigate("blog"); }}
                      style={{ background: "#0A1128", color: "white", padding: "0.9rem 1.8rem", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", fontFamily: "inherit" }}>
                      Read Full Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="home-section" style={{ background: "#FFF8F0" }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Connect</div>
                <h2 className="section-title">Contact Us</h2>
                <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>Have a question, collaboration idea, or just want to reach out? We would love to hear from you.</p>
              </div>
              <div style={{ maxWidth: 800, margin: "0 auto", background: "white", padding: "3.5rem", borderRadius: 30, boxShadow: "0 10px 50px rgba(0,0,0,0.07)" }}>
                <form action={formAction} method="POST">
                  <input type="hidden" name="_subject" value="New Website Message" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <input type="text" name="Name" placeholder="Full Name" className="contact-input" required />
                    <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                  </div>
                  <textarea name="Message" placeholder="Your Message" className="contact-input" style={{ height: 150, resize: "none" }} required />
                  <button type="submit" className="btn-submit btn-submit-navy">Send Message</button>
                  <span className="form-feedback-text">{contactInfoText}</span>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* CEO */}
      {view === "ceo" && (
        <div>
          <div style={{ background: "#0A1128", padding: "120px 2rem 4rem", textAlign: "center" }}>
            <div className="section-label" style={{ justifyContent: "center", color: "#F4D03F", marginBottom: "1rem" }}>Visioneer &amp; Founder</div>
            <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}>
              Meet <em style={{ fontStyle: "italic", color: "#F4D03F" }}>Jerry Oyedele</em>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "1rem", fontSize: "1.05rem" }}>Leading with Purpose and Passion</p>
          </div>

          <section className="page-padding" style={{ background: "white", marginTop: "-40px" }}>
            <div className="section-container">
              <div className="ceo-grid">

                {/* SIDEBAR */}
                <div>
                  <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.12)" }}>
                    <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="Jerry Oyedele" style={{ width: "100%", display: "block" }} />
                  </div>
                  <div style={{ marginTop: "1.5rem", padding: "2rem", background: "#0A1128", color: "white", borderRadius: 20 }}>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginBottom: "0.3rem" }}>Jerry Oyedele</h3>
                    <p style={{ color: "#F4D03F", fontWeight: 600, marginBottom: "1.2rem" }}>Founder &amp; CEO, Champions&apos; Leadership Global</p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {["Public Speaker", "Musicologist", "Mentor", "Choir Leader", "Educator"].map(function(tag) {
                        return <span key={tag} style={{ background: "rgba(255,255,255,0.1)", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600 }}>{tag}</span>;
                      })}
                    </div>
                  </div>
                  <div style={{ marginTop: "1.5rem", padding: "2rem", background: "#FFF8F0", borderRadius: 20 }}>
                    <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#0A1128", marginBottom: "1.5rem" }}>Academic Qualifications</h4>
                    {degrees.map(function(d, i) {
                      return (
                        <div key={i} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: i < degrees.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0A1128", marginBottom: "0.2rem" }}>{d.degree}</div>
                          <div style={{ fontSize: "0.82rem", color: "#666", marginBottom: "0.4rem" }}>{d.school}</div>
                          <span style={{ background: d.status === "Ongoing" ? "rgba(200,107,86,0.12)" : "rgba(10,17,40,0.08)", color: d.status === "Ongoing" ? "#C86B56" : "#0A1128", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 20 }}>{d.status}</span>
                        </div>
                      );
                    })}
                    <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#0A1128", margin: "1.5rem 0 1rem" }}>Certifications</h4>
                    {certifications.map(function(c, i) {
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.9rem" }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#C86B56", flexShrink: 0, marginTop: "0.35rem" }} />
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333", lineHeight: 1.4, marginBottom: "0.15rem" }}>{c.cert}</div>
                            <div style={{ fontSize: "0.78rem", color: "#888" }}>{c.school}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BIO */}
                <div>
                  <div className="section-label" style={{ marginBottom: "0.5rem", justifyContent: "flex-start" }}>Biography</div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", color: "#0A1128", marginBottom: "2rem", lineHeight: 1.2 }}>A Life Defined<br />by Purpose</h2>
                  <div style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.9 }}>
                    <p style={{ marginBottom: "1.5rem" }}>Jerry Oyedele is a sought-after public speaker, musicologist, and mentor whose life is a living testimony of what it means to step into one&apos;s God-given purpose against all odds. He is the founder of <strong style={{ color: "#0A1128" }}>Champions&apos; Leadership Global</strong>, a leadership brand dedicated to purpose discovery, personal development, and leadership excellence — and the founder of <strong style={{ color: "#0A1128" }}>Jebion Music</strong>, a gospel music brand committed to releasing the sound of the Kingdom.</p>
                    <p style={{ marginBottom: "1.5rem" }}>He holds a Bachelor of Arts in Music (Second Class Upper) from Obafemi Awolowo University, Ile-Ife, and is currently pursuing a Master of Arts in Music at the same institution, where he continues to deepen his academic and creative formation.</p>
                    <blockquote className="about-quote" style={{ margin: "2rem 0" }}>
                      &ldquo;I had to make the hardest decision of my life: leave engineering at 500 level and start music all over again from 100 level. That decision became the doorway to my purpose.&rdquo;
                    </blockquote>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#0A1128", margin: "2.5rem 0 1rem" }}>The Journey to Purpose</h3>
                    <p style={{ marginBottom: "1.5rem" }}>Jerry&apos;s story is not a conventional one. After years in the Engineering faculty at OAU, he felt a deep, undeniable pull toward music — a field he had loved all his life but never considered a &ldquo;serious&rdquo; path. The decision to leave and start over from 100 level was met with questions, doubts, and social pressure. But that radical act of obedience became the seed of everything he now leads.</p>
                    <p style={{ marginBottom: "1.5rem" }}>From that moment of surrender, Jerry began to understand purpose not as a destination but as a daily commitment to becoming who you were made to be. His personal journey gave him language for what millions experience: the tension between the life others expect and the life your soul craves. Champions&apos; Leadership Global was born out of that tension.</p>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#0A1128", margin: "2.5rem 0 1rem" }}>The Musicologist</h3>
                    <p style={{ marginBottom: "1.5rem" }}>As a musicologist, Jerry brings over two decades of lived experience in music to his academic and creative pursuits. He is a prolific composer with over 300 original works produced in the last seven years alone — spanning choral, contemporary gospel, and orchestral forms. His compositions are not merely artistic expressions; they are spiritual declarations crafted to minister to the heart and glorify God.</p>
                    <p style={{ marginBottom: "1.5rem" }}>Through <strong style={{ color: "#0A1128" }}>Jebion Music</strong>, Jerry is building a legacy of sacred music that bridges the gap between excellence and anointing. To ground his practice further, he has pursued certificate courses from world-class institutions including the National University of Singapore, Yale University, the University of Edinburgh, Berklee College of Music, and the University of Michigan.</p>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#0A1128", margin: "2.5rem 0 1rem" }}>The Speaker &amp; Mentor</h3>
                    <p style={{ marginBottom: "1.5rem" }}>With over a decade on the public speaking circuit, Jerry has addressed students, professionals, church congregations, and corporate audiences across Nigeria. His messages are characterised by clarity, depth, and a rare ability to make abstract ideas about purpose feel immediately personal and actionable.</p>
                    <p style={{ marginBottom: "1.5rem" }}>As a mentor, Jerry works one-on-one and in group settings with young people navigating identity crises, career transitions, and leadership challenges. His approach is not merely motivational — it is transformational, drawing from Scripture, personal experience, and a rich understanding of human development.</p>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#0A1128", margin: "2.5rem 0 1rem" }}>Faith &amp; Church Life</h3>
                    <p style={{ marginBottom: "1.5rem" }}>Jerry Oyedele is a committed worker in the vineyard of God. He serves as a choir leader in his local church denomination, using music as a vehicle for worship and intercession. He is also recognised as a gifted teacher of the Word, with a burden to see the body of Christ walk in maturity, purpose, and power.</p>
                    <p style={{ marginBottom: "1.5rem" }}>For Jerry, there is no separation between ministry and mission — every platform he occupies, whether a university auditorium, a conference hall, or a Sunday choir rehearsal, is an altar where lives can be shaped for eternity.</p>
                  </div>
                  <div style={{ marginTop: "3.5rem", padding: "3rem", background: "#FFF8F0", borderRadius: 28, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <div className="section-label" style={{ justifyContent: "flex-start", marginBottom: "0.5rem" }}>Invitations</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", marginBottom: "0.5rem", color: "#0A1128" }}>Invite Jerry to Speak</h3>
                    <p style={{ color: "#777", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.7 }}>Jerry is available for conferences, summits, university programmes, church events, and corporate leadership sessions. Fill the form below and our team will be in touch within 48 hours.</p>
                    <form action={formAction} method="POST">
                      <input type="hidden" name="_subject" value="CEO Conference Invitation" />
                      <input type="text" name="Conference_Name" placeholder="Name of Conference / Event" className="contact-input" required />
                      <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.88rem", color: "#555" }}>Event Type</label>
                      <select name="Event_Type" className="contact-input" required>
                        <option value="Physical">Physical</option>
                        <option value="Virtual">Virtual</option>
                      </select>
                      <input type="text" name="Location" placeholder="Location (if Physical)" className="contact-input" />
                      <input type="text" name="Theme" placeholder="Theme of the Event" className="contact-input" required />
                      <input type="text" name="Target_Audience" placeholder="Target Audience" className="contact-input" required />
                      <input type="email" name="Contact_Email" placeholder="Your Email Address" className="contact-input" required />
                      <button type="submit" className="btn-submit btn-submit-navy">Submit Invitation</button>
                      <span className="form-feedback-text">{contactInfoText}</span>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      )}

      {/* BOOKING */}
      {view === "booking" && (
        <section className="page-padding" style={{ background: "#FFF8F0" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Begin Your Journey</div>
              <h2 className="section-title">Book a Session</h2>
              <p style={{ maxWidth: 560, margin: "0 auto", color: "#666", lineHeight: 1.7 }}>Step into a collaborative environment designed to help you discover purpose, resolve identity questions, and refine your leadership edge.</p>
            </div>
            <div style={{ maxWidth: 580, margin: "0 auto", background: "white", padding: "3.5rem", borderRadius: 28, boxShadow: "0 30px 80px rgba(0,0,0,0.1)" }}>
              <form action={formAction} method="POST">
                <input type="hidden" name="_subject" value="New Coaching Request" />
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.88rem", color: "#555" }}>Type of Session</label>
                <select name="SessionType" className="contact-input" required>
                  <option>Purpose discovery</option>
                  <option>Identity crisis</option>
                  <option>Personal development and transformation</option>
                  <option>Personal Leadership coaching</option>
                  <option>Organizational Leadership coaching</option>
                  <option>Others</option>
                </select>
                <input type="text" name="FullName" placeholder="Full Name" className="contact-input" required />
                <input type="email" name="Email" placeholder="Email Address" className="contact-input" required />
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.88rem", color: "#555" }}>Preferred Date</label>
                <input type="date" name="RequestedDate" className="contact-input" required />
                <button type="submit" className="btn-submit btn-submit-terracotta">Schedule My Session</button>
                <span className="form-feedback-text">{contactInfoText}</span>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* EVENTS */}
      {view === "events" && (
        <section className="page-padding" style={{ background: "#FFF8F0" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Programs &amp; Conferences</div>
              <h2 className="section-title">Upcoming Events</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>Join us at our upcoming programmes and be part of a movement raising the next generation of champions.</p>
            </div>
            <div className="team-grid">
              {events.map(function(e, i) {
                return (
                  <div key={i} className="event-card">
                    <div className="event-date-badge">
                      <div>
                        <div className="event-day">{e.day}</div>
                        <div className="event-month-year">{e.month} {e.year}</div>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <span style={{ background: e.tag === "Virtual" ? "rgba(168,218,220,0.3)" : "rgba(244,208,63,0.25)", color: e.tag === "Virtual" ? "#A8DADC" : "#F4D03F", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{e.tag}</span>
                      </div>
                    </div>
                    <div className="event-body">
                      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", marginBottom: "0.5rem", color: "#0A1128" }}>{e.title}</h3>
                      <p style={{ color: "#C86B56", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>&#128205; {e.loc}</p>
                      <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.7 }}>{e.desc}</p>
                    </div>
                    <button className="event-register-btn" onClick={() => navigate("booking")}>Register Interest</button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TEAM */}
      {view === "team" && (
        <section className="page-padding" style={{ background: "white" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">The Champions</div>
              <h2 className="section-title">Meet Our Team</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>A passionate, purpose-driven team committed to raising transformational leaders.</p>
            </div>
            <div className="team-grid">
              {teamMembers.map(function(member, i) {
                return (
                  <div key={i} className="team-card">
                    <div className="team-avatar-wrap">
                      <img src={member.photo} alt={member.name} className="team-avatar" />
                      <div className="team-avatar-ring" />
                    </div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", marginBottom: "0.4rem", color: "#0A1128" }}>{member.name}</h3>
                    <div style={{ color: "#C86B56", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>{member.designation}</div>
                    <p style={{ fontSize: "0.93rem", color: "#666", flexGrow: 1, lineHeight: 1.7 }}>{member.bio}</p>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" style={{ marginTop: "1.2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#0A1128", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", padding: "0.5rem 1rem", background: "#FFF8F0", borderRadius: 20 }}>
                        <LinkedInIcon /> Connect on LinkedIn
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BLOG LIST */}
      {view === "blog" && !selectedPost && (
        <section className="page-padding" style={{ background: "#FFF8F0" }}>
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Insights &amp; Wisdom</div>
              <h2 className="section-title">Leadership Blog</h2>
              <p style={{ maxWidth: 500, margin: "0 auto", color: "#666" }}>Practical wisdom, purpose-driven insights, and leadership truths for the champion in you.</p>
            </div>
            <div className="blog-grid">
              {blogPosts.map(function(post, i) {
                return (
                  <div key={i} className="blog-card" style={{ cursor: "pointer" }} onClick={() => setSelectedPost(post)}>
                    <div className="blog-img-wrap">
                      <img src={post.img} alt={post.title} className="blog-img" />
                    </div>
                    <div style={{ padding: "1.8rem" }}>
                      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.8rem" }}>
                        <span style={{ background: "#FFF8F0", color: "#C86B56", padding: "0.2rem 0.7rem", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>{post.category}</span>
                        <span style={{ color: "#aaa", fontSize: "0.78rem" }}>{post.readTime}</span>
                      </div>
                      <div style={{ color: "#C86B56", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.5rem" }}>{post.date}</div>
                      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.35rem", marginBottom: "0.8rem", color: "#0A1128" }}>{post.title}</h3>
                      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.2rem", lineHeight: 1.7 }}>{post.excerpt}</p>
                      <span style={{ color: "#0A1128", fontWeight: 800, fontSize: "0.88rem" }}>Read Article &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BLOG ARTICLE */}
      {view === "blog" && selectedPost && (
        <section className="page-padding" style={{ background: "white" }}>
          <div className="section-container">
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <button onClick={() => setSelectedPost(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C86B56", fontWeight: 700, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "inherit", fontSize: "0.9rem", padding: 0 }}>
                &larr; Back to Blog
              </button>
              <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem", alignItems: "center" }}>
                <span style={{ background: "#FFF8F0", color: "#C86B56", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{selectedPost.category}</span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{selectedPost.readTime}</span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>&middot; {selectedPost.date}</span>
              </div>
              <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#0A1128", lineHeight: 1.1, marginBottom: "2rem" }}>{selectedPost.title}</h1>
              <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: "3rem", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                <img src={selectedPost.img} alt={selectedPost.title} style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
              </div>
              <div className="article-content">
                {selectedPost.fullContent.trim().split("\n\n").map(function(para, i) {
                  return <p key={i}>{para.trim()}</p>;
                })}
              </div>
              <div style={{ marginTop: "4rem", padding: "2.5rem", background: "#FFF8F0", borderRadius: 20, textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "#0A1128", marginBottom: "1rem" }}>Ready to start your leadership journey?</p>
                <button onClick={() => navigate("booking")} className="btn-primary">Book a Session</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 60, height: 60, borderRadius: "50%", background: "white", padding: 4 }} />
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}>Champions&apos; Leadership Global</span>
            </div>
            <p style={{ opacity: 0.55, fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 340 }}>Empowering individuals to discover their purpose and lead with lasting, generational impact.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase", color: "#F4D03F" }}>Navigation</h4>
            {[["Home","home"],["Meet the CEO","ceo"],["Events","events"],["Team","team"],["Blog","blog"],["Book a Session","booking"]].map(function(item) {
              return (
                <div key={item[1]} style={{ marginBottom: "0.8rem" }}>
                  <a href="#!" onClick={function(e) { e.preventDefault(); navigate(item[1]); }} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", cursor: "pointer" }}>{item[0]}</a>
                </div>
              );
            })}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase", color: "#F4D03F" }}>Contact</h4>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>&#128231; championscorner27@gmail.com</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "2rem" }}>&#128222; +234 906 414 4546</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ opacity: 0.35, fontSize: "0.85rem" }}>&copy; 2026 Champions&apos; Leadership Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
