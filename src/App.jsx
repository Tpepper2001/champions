import { useState, useEffect } from "react";

const colors = {
  gold: "#F4D03F",
  navy: "#0A1128",
  lavender: "#C8B8DB",
  lightBlue: "#A8DADC",
  terracotta: "#C86B56",
  cream: "#FFF8F0",
  darkText: "#1A1A1A",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    color: #1A1A1A;
    line-height: 1.6;
    overflow-x: hidden;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-30px) scale(1.1); }
    66%      { transform: translate(-20px,20px) scale(0.9); }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    animation: slideDown 0.6s ease-out;
  }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.2rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 0.8rem;
    font-weight: 700; font-size: 1.1rem; color: #0A1128;
  }
  .logo-icon {
    width: 45px; height: 45px;
    background: linear-gradient(135deg, #F4D03F, #C86B56);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; color: white; font-size: 1.5rem;
  }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.3s; position: relative;
  }
  .nav-links a:hover { color: #C86B56; }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -5px; left: 0;
    width: 0; height: 2px; background: #C86B56; transition: width 0.3s;
  }
  .nav-links a:hover::after { width: 100%; }

  /* Hero */
  .hero {
    position: relative; height: 100vh;
    display: flex; align-items: center; overflow: hidden;
    background: linear-gradient(135deg, #0A1128 0%, #1a2847 100%);
  }
  .hero-bg {
    position: absolute; inset: 0; opacity: 0.15;
    background-image:
      radial-gradient(circle at 20% 50%, #F4D03F 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, #C8B8DB 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, #A8DADC 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }
  .hero-content {
    position: relative; max-width: 1400px; margin: 0 auto;
    padding: 0 2rem; z-index: 2;
    animation: fadeInUp 1s ease-out 0.3s both;
  }
  .hero-tagline {
    font-size: 1rem; letter-spacing: 3px; text-transform: uppercase;
    color: #F4D03F; margin-bottom: 1.5rem; font-weight: 600;
    animation: fadeInUp 1s ease-out 0.5s both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 5rem; font-weight: 900; color: white;
    line-height: 1.1; margin-bottom: 1.5rem; max-width: 900px;
    animation: fadeInUp 1s ease-out 0.7s both;
  }
  .hero-title .highlight { color: #F4D03F; display: inline-block; }
  .hero-subtitle {
    font-size: 1.3rem; color: rgba(255,255,255,0.85);
    margin-bottom: 2.5rem; max-width: 650px; line-height: 1.8;
    animation: fadeInUp 1s ease-out 0.9s both;
  }
  .hero-quote {
    font-style: italic; font-size: 1.2rem; color: rgba(255,255,255,0.7);
    margin-bottom: 3rem; padding-left: 2rem;
    border-left: 3px solid #C86B56; max-width: 600px;
    animation: fadeInUp 1s ease-out 1.1s both;
  }
  .hero-quote .author {
    display: block; margin-top: 0.5rem; font-style: normal;
    font-weight: 600; color: #F4D03F; font-size: 0.95rem;
  }
  .cta-btn {
    display: inline-block; padding: 1rem 2.5rem;
    background: #F4D03F; color: #0A1128; text-decoration: none;
    font-weight: 700; border-radius: 50px; border: none; cursor: pointer;
    transition: all 0.3s; box-shadow: 0 10px 30px rgba(244,208,63,0.3);
    animation: fadeInUp 1s ease-out 1.3s both; font-size: 1rem;
  }
  .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(244,208,63,0.4); }

  /* Shared section */
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; z-index: 2; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label {
    font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase;
    color: #C86B56; margin-bottom: 1rem; font-weight: 600;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 3rem; font-weight: 900; color: #0A1128; margin-bottom: 1rem;
  }
  .section-desc { font-size: 1.2rem; color: rgba(0,0,0,0.6); max-width: 700px; margin: 0 auto; }

  /* About */
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
  }
  .about-body { font-size: 1.05rem; color: rgba(0,0,0,0.68); line-height: 1.95; }
  .about-body p { margin-bottom: 1.3rem; }

  /* Vision Mission */
  .vm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-top: 3rem; }
  .vm-card { border-radius: 20px; padding: 3rem; position: relative; overflow: hidden; }
  .vm-label { font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; margin-bottom: 1rem; }
  .vm-icon { font-size: 2rem; margin-bottom: 1.2rem; }
  .vm-text { font-size: 1.05rem; line-height: 1.9; }

  /* Pillars */
  .pillars-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2.5rem; margin-top: 4rem; }
  .pillar-card {
    padding: 3rem 2rem; border-radius: 15px;
    transition: all 0.4s; position: relative; overflow: hidden;
    animation: fadeInUp 0.8s ease-out both;
  }
  .pillar-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
  .pillar-icon { font-size: 3rem; margin-bottom: 1.5rem; }
  .pillar-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: #0A1128; }
  .pillar-text { font-size: 1.05rem; line-height: 1.8; color: rgba(0,0,0,0.75); }
  .pillar-link {
    display: inline-block; margin-top: 1.5rem; color: #0A1128;
    font-weight: 600; text-decoration: none; transition: transform 0.3s;
    background: none; border: none; cursor: pointer; padding: 0; font-size: inherit; font-family: inherit;
  }
  .pillar-link:hover { transform: translateX(5px); }

  /* Core Values */
  .values-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin-top: 3rem; }
  .value-card {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(244,208,63,0.25);
    border-radius: 16px; padding: 2.5rem 2rem; text-align: center;
    flex: 1; min-width: 180px; max-width: 200px; transition: all 0.3s;
  }
  .value-card:hover { background: rgba(244,208,63,0.12); transform: translateY(-6px); }
  .value-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .value-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: white; }

  /* CEO / Social */
  .video-container {
    max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15); position: relative;
    aspect-ratio: 16/9; background: #0A1128;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  .video-inner {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 1.5rem;
    background: linear-gradient(135deg, #0A1128, #2a3f5f);
  }
  .social-btn {
    display: inline-flex; align-items: center; gap: 0.8rem;
    color: white; text-decoration: none; padding: 1rem 2rem;
    border-radius: 50px; font-weight: 700; font-size: 1rem;
    transition: all 0.3s; border: none; cursor: pointer;
  }
  .social-btn:hover { transform: translateY(-3px); }

  /* Team */
  .team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 4rem; }
  .team-card {
    background: white; border-radius: 20px; padding: 2.5rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: all 0.4s ease; position: relative; overflow: hidden;
    animation: fadeInUp 0.8s ease-out both;
  }
  .team-card::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 100%; height: 5px;
    background: linear-gradient(90deg, #F4D03F, #C86B56);
    transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
  }
  .team-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
  .team-card:hover::before { transform: scaleX(1); }
  .team-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; font-weight: 900; color: #0A1128;
    margin-bottom: 1.2rem; overflow: hidden;
  }
  .team-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .team-designation {
    font-size: 0.78rem; letter-spacing: 2px; text-transform: uppercase;
    color: #C86B56; font-weight: 700; margin-bottom: 0.4rem;
  }
  .team-name {
    font-family: 'Playfair Display', serif; font-size: 1.35rem;
    font-weight: 700; color: #0A1128; margin-bottom: 1rem; line-height: 1.3;
  }
  .team-bio { font-size: 0.95rem; color: rgba(0,0,0,0.65); line-height: 1.75; margin-bottom: 1.5rem; }
  .team-linkedin {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.85rem; font-weight: 600; color: #0A1128; text-decoration: none;
    padding: 0.45rem 1rem; background: rgba(10,17,40,0.06);
    border-radius: 30px; transition: all 0.3s;
  }
  .team-linkedin:hover { background: #0A1128; color: white; }
  .team-linkedin-na { font-size: 0.82rem; color: rgba(0,0,0,0.35); font-style: italic; }

  /* Blog */
  .blog-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2.5rem; margin-top: 4rem; }
  .blog-card {
    background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 15px;
    overflow: hidden; transition: all 0.4s;
    animation: fadeInUp 0.8s ease-out both;
  }
  .blog-card:hover { transform: translateY(-10px); background: rgba(255,255,255,0.08); border-color: #F4D03F; }
  .blog-image {
    width: 100%; height: 220px; position: relative; overflow: hidden;
    background: linear-gradient(135deg, #C86B56, #F4D03F);
  }
  .blog-image img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .blog-image::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.2); }
  .blog-content { padding: 2rem; }
  .blog-date { font-size: 0.85rem; color: #F4D03F; margin-bottom: 0.8rem; font-weight: 600; }
  .blog-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: white; }
  .blog-excerpt { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 1.5rem; }
  .read-more {
    color: #F4D03F; font-weight: 600; text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.5rem; transition: gap 0.3s;
    background: none; border: none; cursor: pointer; padding: 0; font-size: inherit; font-family: inherit;
  }
  .read-more:hover { gap: 1rem; }

  /* CTA */
  .cta-section { padding: 8rem 2rem; background: #F4D03F; text-align: center; }
  .cta-title {
    font-family: 'Playfair Display', serif; font-size: 3.5rem;
    font-weight: 900; color: #0A1128; margin-bottom: 1.5rem;
  }
  .cta-text { font-size: 1.3rem; color: #0A1128; margin-bottom: 3rem; opacity: 0.85; }
  .cta-btn-dark {
    display: inline-block; padding: 1rem 2.5rem; background: #0A1128;
    color: white; text-decoration: none; font-weight: 700;
    border-radius: 50px; transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(10,17,40,0.3); border: none; cursor: pointer; font-size: 1rem;
  }
  .cta-btn-dark:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(10,17,40,0.4); }

  /* Footer */
  .footer { background: #0A1128; color: white; padding: 4rem 2rem 2rem; }
  .footer-grid {
    max-width: 1400px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem; margin-bottom: 3rem;
  }
  .footer-title { font-weight: 700; margin-bottom: 1.5rem; color: #F4D03F; }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 0.8rem; }
  .footer-links a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.3s; }
  .footer-links a:hover { color: #F4D03F; }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;
    text-align: center; color: rgba(255,255,255,0.5);
    max-width: 1400px; margin: 0 auto;
  }
  .contact-info { display: flex; flex-direction: column; gap: 0.8rem; }
  .contact-info a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.3s; }
  .contact-info a:hover { color: #F4D03F; }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hero-title { font-size: 3rem; }
    .pillars-grid, .blog-grid, .team-grid, .footer-grid, .about-grid, .vm-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 2rem; }
  }
`;

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const teamMembers = [
  {
    name: "James Oluwapelumi Olatunbosun",
    designation: "Program Director",
    bio: "James is a science communicator and Engineering Physics student at Obafemi Awolowo University. He is committed to seeing young people thrive in career and character, inspiring his audience to achieve their greatest potential. He believes everyone has a God-given unique potential waiting to be discovered.",
    linkedin: "https://www.linkedin.com/in/james-olatunbosun",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg",
    initial: "J",
    avatarBg: "linear-gradient(135deg, #F4D03F, #fce181)",
  },
  {
    name: "Ogbaudu Oghenefegor Believe",
    designation: "Corp Member",
    bio: "A faith-based writer, published author of two books, page poet, and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose. She also founded Deo-Sterling Designs, a modest and elegant female fashion brand, and is a skilled virtual assistant.",
    linkedin: null,
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg",
    initial: "O",
    avatarBg: "linear-gradient(135deg, #C8B8DB, #ddd0ea)",
  },
  {
    name: "Oluwatoyin Oluwabukola Yakubu",
    designation: "Head, Content",
    bio: "Oluwatoyin is passionate about helping people find healing from trauma, low self-esteem, and depression. She loves honest conversations on controversial topics and is always available to help with life choices and write-ups — academic or otherwise.",
    linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg",
    initial: "T",
    avatarBg: "linear-gradient(135deg, #A8DADC, #c9e9eb)",
  },
  {
    name: "Joseph Temitope Deborah",
    designation: "Community Manager",
    bio: "A communication advocate, leadership enthusiast, and development-driven professional. With a background in Linguistics and years of experience teaching, mentoring, and driving community initiatives, Deborah is passionate about purpose discovery and building impactful leaders.",
    linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg",
    initial: "D",
    avatarBg: "linear-gradient(135deg, #f9c784, #f7b16e)",
  },
  {
    name: "Promise Nseobong",
    designation: "Human Resource",
    bio: "An accounting student with a clear vision for excellence in finance, specialising in taxation and auditing. Beyond academics, Promise is a creative voice — running a YouTube channel on motivation and writing spoken-word poetry. Purpose-oriented and driven to achieve major professional milestones early.",
    linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg",
    initial: "P",
    avatarBg: "linear-gradient(135deg, #C86B56, #e8876d)",
    initialColor: "white",
  },
  {
    name: "Grace Temitope Babatunde",
    designation: "Admin",
    bio: "A communication specialist and Business Administration postgraduate student. With a foundation in English Language, Grace has transitioned her focus to Human Resources Management and leadership advocacy — combining mastery of language with a passion for people-management to drive excellence in the corporate space.",
    linkedin: "https://www.linkedin.com/in/gracetemibabatunde",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg",
    initial: "G",
    avatarBg: "linear-gradient(135deg, #a8d8a8, #7bc47b)",
  },
];

const blogPosts = [
  {
    date: "This Week • Feb 9, 2026",
    title: "The Power of Intentional Leadership",
    excerpt: "Discover how leading with intention transforms not just outcomes, but the very fabric of organizational culture...",
    image: "BLOG_POST_IMAGE_URL",
  },
  {
    date: "Last Week • Feb 2, 2026",
    title: "Building Trust in Uncertain Times",
    excerpt: "Trust is the currency of leadership. Learn the essential practices that create unshakeable trust with your team...",
    image: "BLOG_POST_IMAGE_URL",
  },
  {
    date: "Jan 26, 2026",
    title: "From Vision to Action",
    excerpt: "Every great transformation begins with vision, but execution makes it real. Here's how to bridge that gap...",
    image: "BLOG_POST_IMAGE_URL",
  },
];

const coreValues = [
  { icon: "🎯", name: "Purpose" },
  { icon: "🌱", name: "Personal Transformation" },
  { icon: "👑", name: "Leadership" },
  { icon: "⚡", name: "Influence" },
  { icon: "🌍", name: "Global Impact" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            {!logoError ? (
              <img
                src="https://drive.google.com/uc?export=view&id=11lrkrUz3LS7TMw8_douBhbLIRPPrU71b"
                alt="Champions Leadership Global Logo"
                style={{ width: 45, height: 45, borderRadius: "50%", objectFit: "cover" }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="logo-icon">C</div>
            )}
            <span>Champions Leadership Global</span>
          </div>
          <ul className="nav-links">
            {["home","about","team","blog","events","contact"].map(id => (
              <li key={id}>
                <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>
                  {id === "blog" ? "Leadership Blog" : id.charAt(0).toUpperCase() + id.slice(1).replace("about","About Us")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-tagline">Welcome to a World of Champions</div>
          <h1 className="hero-title">
            Raising <span className="highlight">Transformational Leaders</span>
          </h1>
          <p className="hero-subtitle">
            We empower individuals and organizations to discover their purpose, develop authentic leadership, and achieve lasting personal transformation.
          </p>
          <blockquote className="hero-quote">
            "You can make decisions, not consequences"
            <span className="author">— J.A. Oyedele</span>
          </blockquote>
          <button className="cta-btn" onClick={() => scrollTo("about")}>Learn More About Us</button>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "8rem 2rem", background: colors.cream, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, background: `radial-gradient(circle, ${colors.gold}, transparent 70%)`, opacity: 0.08, borderRadius: "50%" }} />
        <div className="section-container">
          <div className="about-grid">
            <div>
              <div className="section-label">Who We Are</div>
              <h2 className="section-title" style={{ textAlign: "left", fontSize: "2.8rem", marginBottom: "2rem" }}>
                About Champions Leadership Global
              </h2>
              <div className="about-body">
                <p>Champions' Leadership Global is a brand deeply committed to the themes of <strong>purpose, leadership, and personal development</strong>. We believe that everyone has the potential and responsibility to live out their purpose, and we aim to inspire and enlighten individuals on this journey.</p>
                <p>Our passion for leadership stems from its critical role in shaping society, nations, and the world — which is why we are dedicated to nurturing purposeful leaders. We are driven to help people become the best versions of themselves, offering content and programs designed for holistic transformation.</p>
                <p>We believe that the world needs more leaders who lead from the angle of purpose and transformation in view. <strong>Transforming people is the best way to transform the world</strong>, because the world is first a people, which eventually makes the place.</p>
                <p>Our mandate cuts across hosting conferences, seminars, workshops, bootcamps, and other innovative educational platforms for raising the leaders of this generation and the next. We also have our <strong>Champions Leadership Academy</strong>, where we equip would-be leaders with everything needed to rise to a position of influence.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { bg: colors.navy, icon: "🏛️", title: "Champions Leadership Academy", desc: "Equipping would-be leaders with every knowledge and skill needed to rise to a position of competence and influence.", titleColor: colors.gold, descColor: "rgba(255,255,255,0.78)" },
                { bg: "white", border: "2px solid rgba(0,0,0,0.06)", icon: "🎤", title: "Events & Programs", desc: "Conferences, seminars, workshops, and bootcamps — innovative educational platforms raising leaders for this generation and the next.", titleColor: colors.navy, descColor: "rgba(0,0,0,0.6)" },
                { bg: `linear-gradient(135deg, ${colors.gold}, #f7c948)`, icon: "🌍", title: "Global Reach", desc: "Inspiring and enlightening individuals across the world to discover their purpose and lead with lasting impact.", titleColor: colors.navy, descColor: "rgba(10,17,40,0.75)" },
              ].map(({ bg, border, icon, title, desc, titleColor, descColor }) => (
                <div key={title} style={{ background: bg, border, borderRadius: 16, padding: "2rem 2.2rem", display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
                  <div style={{ fontSize: "2rem", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: titleColor, marginBottom: "0.4rem", fontSize: "1rem" }}>{title}</div>
                    <div style={{ color: descColor, fontSize: "0.95rem", lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section style={{ padding: "6rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Our Direction</div>
            <h2 className="section-title">Vision &amp; Mission</h2>
          </div>
          <div className="vm-grid">
            <div className="vm-card" style={{ background: `linear-gradient(135deg, ${colors.navy}, #1a2847)` }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: colors.gold, opacity: 0.07, borderRadius: "50%" }} />
              <div className="vm-label" style={{ color: colors.gold }}>Our Vision</div>
              <div className="vm-icon">🔭</div>
              <p className="vm-text" style={{ color: "rgba(255,255,255,0.88)" }}>
                To raise transformational leaders who will lead in every sphere of life with{" "}
                <strong style={{ color: colors.gold }}>dignity, diligence, discipline, and dogged determination</strong>{" "}
                to raise others who will in turn transform their world.
              </p>
            </div>
            <div className="vm-card" style={{ background: `linear-gradient(135deg, ${colors.gold}, #f7c948)` }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "white", opacity: 0.15, borderRadius: "50%" }} />
              <div className="vm-label" style={{ color: colors.navy, opacity: 0.7 }}>Our Mission</div>
              <div className="vm-icon">🚀</div>
              <p className="vm-text" style={{ color: colors.navy }}>
                To equip would-be leaders with every knowledge and skill needed to rise to a level of{" "}
                <strong>competence and influence</strong>, which will in turn affect their world positively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Champions Framework */}
      <section style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Our Foundation</div>
            <h2 className="section-title">The Champions' Framework</h2>
            <p className="section-desc">Champions Leadership Global is built on three fundamental principles that guide everything we do.</p>
          </div>
          <div className="pillars-grid">
            {[
              { icon: "🎯", title: "Purpose", text: "Purpose is the essence of living and a driving force behind every decision, action, and goal. It gives life meaning and helps individuals prioritize their time, energy, and resources.", link: "Discover Your Purpose", bg: `linear-gradient(135deg, ${colors.gold}, #fce181)` },
              { icon: "👑", title: "Leadership", text: "Leadership is the ability to influence and inspire others to work towards a common goal. It involves developing a clear vision, building trust, and empowering others to take action.", link: "Develop Leadership", bg: `linear-gradient(135deg, ${colors.lavender}, #ddd0ea)` },
              { icon: "🌱", title: "Personal Development", text: "Personal development is the process of growing and evolving as an individual. It involves developing new skills, building confidence, and cultivating a growth mindset.", link: "Start Growing", bg: `linear-gradient(135deg, ${colors.lightBlue}, #c9e9eb)` },
            ].map(({ icon, title, text, link, bg }, i) => (
              <div key={title} className="pillar-card" style={{ background: bg, animationDelay: `${(i + 1) * 0.1}s` }}>
                <div className="pillar-icon">{icon}</div>
                <h3 className="pillar-title">{title}</h3>
                <p className="pillar-text">{text}</p>
                <button className="pillar-link" onClick={() => scrollTo("about")}>{link} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: "6rem 2rem", background: `linear-gradient(135deg, ${colors.navy} 0%, #1a2847 100%)` }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label" style={{ color: colors.gold }}>What Drives Us</div>
            <h2 className="section-title" style={{ color: "white" }}>Our Core Values</h2>
            <p className="section-desc" style={{ color: "rgba(255,255,255,0.7)" }}>Five values that define who we are and anchor everything we do.</p>
          </div>
          <div className="values-row">
            {coreValues.map(({ icon, name }) => (
              <div key={name} className="value-card">
                <div className="value-icon">{icon}</div>
                <div className="value-name">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO / Social */}
      <section style={{ padding: "8rem 2rem", background: colors.cream, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: -200, width: 600, height: 600, background: `radial-gradient(circle, ${colors.lavender} 0%, transparent 70%)`, opacity: 0.2, borderRadius: "50%" }} />
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Meet Our Founder</div>
            <h2 className="section-title">A Message from Our CEO</h2>
            <p className="section-desc">Discover the vision behind Champions Leadership Global and our commitment to raising transformational leaders worldwide.</p>
          </div>
          <div className="video-container">
            <div className="video-inner">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>Watch our latest content on</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", fontWeight: 700, marginBottom: "1.5rem" }}>Champions Leadership Global</div>
              </div>
              <a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer"
                className="social-btn" style={{ background: "#FF0000", boxShadow: "0 10px 30px rgba(255,0,0,0.4)" }}>
                <YouTubeIcon /> Visit Our YouTube Channel
              </a>
              <a href="https://www.facebook.com/share/1Ks3M8DqJs/" target="_blank" rel="noreferrer"
                className="social-btn" style={{ background: "#1877F2", padding: "0.75rem 1.8rem", fontSize: "0.95rem" }}>
                <FacebookIcon /> Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section" id="team" style={{ padding: "8rem 2rem", background: colors.cream, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 500, height: 500, background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)`, opacity: 0.1, borderRadius: "50%" }} />
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">The People Behind the Mission</div>
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-desc">A passionate group of purpose-driven individuals committed to raising transformational leaders across the globe.</p>
          </div>
          <div className="team-grid">
            {teamMembers.map(({ name, designation, bio, linkedin, photo, initial, avatarBg, initialColor }, i) => (
              <TeamCard key={name} name={name} designation={designation} bio={bio} linkedin={linkedin}
                photo={photo} initial={initial} avatarBg={avatarBg} initialColor={initialColor} delay={`${(i + 1) * 0.05}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="blog-section" id="blog" style={{ padding: "8rem 2rem", background: `linear-gradient(180deg, ${colors.navy} 0%, #1a2847 100%)`, color: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label" style={{ color: colors.gold }}>Weekly Insights</div>
            <h2 className="section-title" style={{ color: "white" }}>Leadership Blog &amp; Discussions</h2>
            <p className="section-desc" style={{ color: "rgba(255,255,255,0.7)" }}>Join our weekly conversations on leadership, transformation, and personal growth. Fresh perspectives every week.</p>
          </div>
          <div className="blog-grid">
            {blogPosts.map(({ date, title, excerpt, image }, i) => (
              <div key={title} className="blog-card" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                <div className="blog-image">
                  <img src={image} alt={title} onError={e => { e.target.style.display = "none"; }} />
                </div>
                <div className="blog-content">
                  <div className="blog-date">{date}</div>
                  <h3 className="blog-title">{title}</h3>
                  <p className="blog-excerpt">{excerpt}</p>
                  <button className="read-more" onClick={() => {}}>Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="cta-title">Ready to Begin Your Transformation?</h2>
          <p className="cta-text">Join thousands of leaders who have discovered their purpose and transformed their impact. Your journey starts here.</p>
          <button className="cta-btn-dark" onClick={() => scrollTo("contact")}>Get Started Today</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "1rem" }}>Champions Leadership Global</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              We believe that everyone has the potential and responsibility to live out their purpose. Our mandate cuts across conferences, seminars, workshops, bootcamps, and our Champions Leadership Academy — equipping leaders for lasting impact.
            </p>
            <div className="contact-info">
              <a href="tel:+2349064144546">📞 +234 906 414 4546</a>
              <a href="mailto:info@cleadglobal.com">✉️ info@cleadglobal.com</a>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              {[["home","Home"],["about","About Us"],["team","Team Members"],["events","Events"]].map(([id, label]) => (
                <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              {[["blog","Leadership Blog"],["#","Services"],["#","Programs"],["#","Resources"]].map(([href, label]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Connect</h4>
            <ul className="footer-links">
              <li><a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer">YouTube</a></li>
              <li><a href="https://www.facebook.com/share/1Ks3M8DqJs/" target="_blank" rel="noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Champions Leadership Global. All rights reserved. Raising Transformational Leaders.</p>
        </div>
      </footer>
    </div>
  );
}

function TeamCard({ name, designation, bio, linkedin, photo, initial, avatarBg, initialColor, delay }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="team-card" style={{ animationDelay: delay }}>
      <div className="team-avatar" style={{ background: avatarBg, color: initialColor || "#0A1128" }}>
        {!imgError ? (
          <img src={photo} alt={name} onError={() => setImgError(true)} />
        ) : initial}
      </div>
      <div className="team-designation">{designation}</div>
      <h3 className="team-name">{name}</h3>
      <p className="team-bio">{bio}</p>
      {linkedin ? (
        <a href={linkedin} target="_blank" rel="noreferrer" className="team-linkedin">
          <LinkedInIcon /> LinkedIn
        </a>
      ) : (
        <span className="team-linkedin-na">LinkedIn coming soon</span>
      )}
    </div>
  );
}
