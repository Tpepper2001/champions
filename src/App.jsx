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
    text-decoration: none;
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
    transition: color 0.3s; position: relative; cursor: pointer;
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

  /* Events */
  .events-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 3rem; }
  .event-card {
    background: white; border-radius: 20px; overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.3s;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .event-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .event-date-badge {
    background: #0A1128; color: #F4D03F; padding: 0.5rem 1.2rem;
    font-weight: 700; font-size: 0.9rem; display: inline-block;
    border-bottom-right-radius: 15px;
  }
  .event-content { padding: 2rem; }
  .event-card-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; margin-bottom: 1rem; color: #0A1128; }
  .event-info-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.8rem; color: rgba(0,0,0,0.6); font-size: 0.95rem; }

  /* Contact Form */
  .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; margin-top: 3rem; }
  .contact-input {
    width: 100%; padding: 1.2rem; background: #f9f9f9; border: 1px solid #eee;
    border-radius: 12px; margin-bottom: 1.2rem; font-family: inherit; font-size: 1rem;
  }
  .contact-input:focus { outline: none; border-color: #F4D03F; background: white; }
  .contact-textarea { height: 150px; resize: none; }

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

  /* Vision Mission Cards */
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

  /* Values */
  .values-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin-top: 3rem; }
  .value-card {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(244,208,63,0.25);
    border-radius: 16px; padding: 2.5rem 2rem; text-align: center;
    flex: 1; min-width: 180px; max-width: 200px; transition: all 0.3s;
  }
  .value-card:hover { background: rgba(244,208,63,0.12); transform: translateY(-6px); }
  .value-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .value-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: white; }

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
  }
  .blog-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .blog-card:hover .blog-image img { transform: scale(1.1); }
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

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hero-title { font-size: 3rem; }
    .pillars-grid, .blog-grid, .team-grid, .footer-grid, .about-grid, .vm-grid, .events-grid, .contact-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 2rem; }
    .contact-grid { gap: 2rem; }
  }
`;

const teamMembers = [
  {
    name: "James Oluwapelumi Olatunbosun",
    designation: "Program Director",
    bio: "James is a science communicator and Engineering Physics student at Obafemi Awolowo University. He is committed to seeing young people thrive in career and character, inspiring his audience to achieve their greatest potential.",
    linkedin: "https://www.linkedin.com/in/james-olatunbosun",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg",
    initial: "J",
    avatarBg: "linear-gradient(135deg, #F4D03F, #fce181)",
  },
  {
    name: "Ogbaudu Oghenefegor Believe",
    designation: "Corp Member",
    bio: "A faith-based writer, published author of two books, page poet, and founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.",
    linkedin: null,
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg",
    initial: "O",
    avatarBg: "linear-gradient(135deg, #C8B8DB, #ddd0ea)",
  },
  {
    name: "Oluwatoyin Oluwabukola Yakubu",
    designation: "Head, Content",
    bio: "Oluwatoyin is passionate about helping people find healing from trauma, low self-esteem, and depression. She loves honest conversations on controversial topics.",
    linkedin: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg",
    initial: "T",
    avatarBg: "linear-gradient(135deg, #A8DADC, #c9e9eb)",
  },
  {
    name: "Joseph Temitope Deborah",
    designation: "Community Manager",
    bio: "A communication advocate and leadership enthusiast. With a background in Linguistics, Deborah is passionate about purpose discovery and building impactful leaders.",
    linkedin: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg",
    initial: "D",
    avatarBg: "linear-gradient(135deg, #f9c784, #f7b16e)",
  },
  {
    name: "Promise Nseobong",
    designation: "Human Resource",
    bio: "An accounting student with a vision for excellence in finance. Promise is a creative voice — running a YouTube channel on motivation and writing spoken-word poetry.",
    linkedin: "https://www.linkedin.com/in/nseobong-promise-02498a338",
    photo: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg",
    initial: "P",
    avatarBg: "linear-gradient(135deg, #C86B56, #e8876d)",
    initialColor: "white",
  },
  {
    name: "Grace Temitope Babatunde",
    designation: "Admin",
    bio: "A communication specialist focusing on Human Resources Management and leadership advocacy — combining mastery of language with a passion for people-management.",
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
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    date: "Last Week • Feb 2, 2026",
    title: "Building Trust in Uncertain Times",
    excerpt: "Trust is the currency of leadership. Learn the essential practices that create unshakeable trust with your team...",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
  },
  {
    date: "Jan 26, 2026",
    title: "From Vision to Action",
    excerpt: "Every great transformation begins with vision, but execution makes it real. Here's how to bridge that gap...",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
  },
];

const upcomingEvents = [
  {
    date: "APR 15, 2026",
    title: "Champions Leadership Bootcamp",
    time: "10:00 AM - 4:00 PM",
    location: "Main Auditorium, OAU, Ile-Ife",
    desc: "An intensive day of training for aspiring leaders, focusing on competence, character, and communication skills.",
    link: "#contact"
  },
  {
    date: "MAY 22, 2026",
    title: "Purpose Discovery Webinar",
    time: "6:00 PM GMT",
    location: "Online (Zoom/YouTube)",
    desc: "A global virtual session designed to help young professionals align their career paths with their God-given purpose.",
    link: "#contact"
  }
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
          <a href="#home" className="logo" onClick={e => { e.preventDefault(); scrollTo("home"); }}>
            {!logoError ? (
              <img
                src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png"
                alt="CLG Logo"
                style={{ width: 45, height: 45, borderRadius: "50%", objectFit: "contain", background: 'white' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="logo-icon">C</div>
            )}
            <span>Champions Leadership Global</span>
          </a>
          <ul className="nav-links">
            {["home","about","events","team","blog","contact"].map(id => (
              <li key={id}>
                <a onClick={() => scrollTo(id)}>
                  {id === "blog" ? "Leadership Blog" : id.charAt(0).toUpperCase() + id.slice(1)}
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
          <button className="cta-btn" onClick={() => scrollTo("about")}>Get Started</button>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
          <div className="about-grid">
            <div>
              <div className="section-label">Who We Are</div>
              <h2 className="section-title" style={{ textAlign: "left" }}>About Us</h2>
              <div className="about-body">
                <p>Champions' Leadership Global is a brand deeply committed to the themes of <strong>purpose, leadership, and personal development</strong>. We believe that everyone has the potential and responsibility to live out their purpose.</p>
                <p>Our mandate cuts across hosting conferences, seminars, workshops, and our <strong>Champions Leadership Academy</strong>, where we equip leaders with everything needed to rise to a position of influence.</p>
              </div>
              <div className="vm-grid">
                <div className="vm-card" style={{ background: colors.navy, color: "white" }}>
                  <div className="vm-label" style={{ color: colors.gold }}>Vision</div>
                  <p>To raise transformational leaders who lead with dignity, diligence, and discipline.</p>
                </div>
                <div className="vm-card" style={{ background: colors.gold, color: colors.navy }}>
                  <div className="vm-label">Mission</div>
                  <p>To equip leaders with knowledge and skills to rise to levels of competence and influence.</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" alt="Leadership" style={{ borderRadius: '20px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Mark Your Calendar</div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-desc">Join us for our upcoming workshops and seminars designed to catalyze your growth.</p>
          </div>
          <div className="events-grid">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="event-card">
                <div className="event-date-badge">{event.date}</div>
                <div className="event-content">
                  <h3 className="event-card-title">{event.title}</h3>
                  <div className="event-info-row">🕒 {event.time}</div>
                  <div className="event-info-row">📍 {event.location}</div>
                  <p style={{ margin: '1rem 0', color: 'rgba(0,0,0,0.7)' }}>{event.desc}</p>
                  <button className="pillar-link" onClick={() => scrollTo("contact")}>Register Now →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Expertise</div>
            <h2 className="section-title">Our Team</h2>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <TeamCard key={i} {...member} delay={`${i * 0.1}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" style={{ padding: "8rem 2rem", background: colors.navy, color: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label" style={{ color: colors.gold }}>Insights</div>
            <h2 className="section-title" style={{ color: "white" }}>Leadership Blog</h2>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <div key={i} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog-content">
                  <div className="blog-date">{post.date}</div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <button className="read-more">Read Full Article →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="contact-grid">
            <div>
              <div className="section-label">Connect</div>
              <h2 className="section-title" style={{ textAlign: "left" }}>Get In Touch</h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'rgba(0,0,0,0.6)' }}>
                Have questions about our programs or want to partner with us? We're here to help you on your leadership journey.
              </p>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>📞 Call Us</div>
                  <a href="tel:+2349064144546" style={{ textDecoration: 'none', color: colors.terracotta, fontWeight: 600 }}>+234 906 414 4546</a>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>✉️ Email</div>
                  <a href="mailto:info@cleadglobal.com" style={{ textDecoration: 'none', color: colors.terracotta, fontWeight: 600 }}>info@cleadglobal.com</a>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={e => e.preventDefault()}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" placeholder="Full Name" className="contact-input" />
                  <input type="email" placeholder="Email Address" className="contact-input" />
                </div>
                <input type="text" placeholder="Subject" className="contact-input" />
                <textarea placeholder="Your Message" className="contact-input contact-textarea"></textarea>
                <button className="cta-btn-dark" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3 style={{ fontFamily: 'Playfair Display', color: colors.gold, marginBottom: '1.5rem' }}>CLG</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Raising transformational leaders through purpose, leadership, and personal development.</p>
          </div>
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><a onClick={() => scrollTo("home")}>Home</a></li>
              <li><a onClick={() => scrollTo("about")}>About</a></li>
              <li><a onClick={() => scrollTo("events")}>Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Social</h4>
            <ul className="footer-links">
              <li><a href="https://youtube.com/@cleadglobal" target="_blank">YouTube</a></li>
              <li><a href="https://www.facebook.com/share/1Ks3M8DqJs/" target="_blank">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Champions Leadership Global. All rights reserved.</p>
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
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noreferrer" className="team-linkedin">LinkedIn</a>
      )}
    </div>
  );
}
