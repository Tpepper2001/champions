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
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.3s; position: relative; cursor: pointer;
  }
  .nav-links a:hover { color: #C86B56; }

  /* Hero */
  .hero {
    position: relative; height: 100vh;
    display: flex; align-items: center; overflow: hidden;
    background: linear-gradient(135deg, #0A1128 0%, #1a2847 100%);
  }
  .hero-content {
    position: relative; max-width: 1400px; margin: 0 auto;
    padding: 0 2rem; z-index: 2;
    animation: fadeInUp 1s ease-out 0.3s both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 5rem; font-weight: 900; color: white;
    line-height: 1.1; margin-bottom: 1.5rem; max-width: 900px;
  }
  .hero-title .highlight { color: #F4D03F; }

  /* Section Styling */
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; z-index: 2; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #C86B56; font-weight: 600; margin-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; color: #0A1128; margin-bottom: 1rem; }
  .section-desc { font-size: 1.2rem; color: rgba(0,0,0,0.6); max-width: 700px; margin: 0 auto; }

  /* Pillars Framework */
  .pillars-grid { display: grid; gap: 2.5rem; margin-top: 4rem; }
  .pillar-card {
    padding: 3.5rem 2.5rem; border-radius: 20px; background: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s;
    border: 1px solid rgba(0,0,0,0.03);
  }
  .pillar-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
  .pillar-icon { font-size: 3rem; margin-bottom: 1.5rem; }
  .pillar-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: #0A1128; }
  .pillar-text { font-size: 1.05rem; line-height: 1.8; color: rgba(0,0,0,0.7); margin-bottom: 1.5rem; }
  .pillar-link { color: #C86B56; font-weight: 700; text-decoration: none; display: inline-block; transition: gap 0.3s; }
  .pillar-link:hover { text-decoration: underline; }

  /* Core Values */
  .value-card {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(244,208,63,0.25);
    border-radius: 16px; padding: 2.5rem 2rem; text-align: center;
    flex: 1; min-width: 180px; max-width: 200px; transition: all 0.3s;
  }
  .value-card:hover { background: rgba(244,208,63,0.12); transform: translateY(-6px); }

  /* CEO Video Placeholder */
  .video-container {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: linear-gradient(135deg, #0A1128, #1a2847);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.2);
  }
  .video-inner { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 2rem; }

  /* CTA Button */
  .cta-btn-dark {
    display: inline-block; padding: 1rem 2.5rem; background: #0A1128;
    color: white; text-decoration: none; font-weight: 700;
    border-radius: 50px; transition: all 0.3s; cursor: pointer; border: none;
  }
  .cta-btn-dark:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

  /* Contact Input */
  .contact-input {
    width: 100%; padding: 1.2rem; background: #f9f9f9; border: 1px solid #eee;
    border-radius: 12px; margin-bottom: 1.2rem; font-family: inherit;
  }

  @media (max-width: 768px) {
    .hero-title { font-size: 3rem; }
    .nav-links { display: none; }
    .pillars-grid { grid-template-columns: 1fr !important; }
    .section-title { font-size: 2.2rem; }
  }
`;

const teamMembers = [
    {
      name: "James Oluwapelumi Olatunbosun",
      designation: "Program Director",
      bio: "James is a science communicator and Engineering Physics student at Obafemi Awolowo University. He is committed to seeing young people thrive in career and character.",
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
              <div style={{ width: 45, height: 45, background: colors.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
            )}
            <span>Champions Leadership Global</span>
          </a>
          <ul className="nav-links">
            {["home","about","events","team","blog","contact"].map(id => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div style={{ color: colors.gold, letterSpacing: '3px', fontWeight: 600, marginBottom: '1.5rem' }}>WELCOME TO A WORLD OF CHAMPIONS</div>
          <h1 className="hero-title">
            Raising <span className="highlight">Transformational Leaders</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.3rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
            Discover your purpose, develop authentic leadership, and achieve lasting personal transformation.
          </p>
          <button className="cta-btn-dark" style={{ background: colors.gold, color: colors.navy }} onClick={() => scrollTo("about")}>Learn More</button>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div>
                    <div className="section-label">Who We Are</div>
                    <h2 className="section-title" style={{ textAlign: "left" }}>About Champions Leadership Global</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(0,0,0,0.7)', marginBottom: '1.5rem' }}>
                        We are a brand deeply committed to the themes of purpose, leadership, and personal development. We believe that everyone has the potential and responsibility to live out their purpose, and we aim to inspire individuals on this journey.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ padding: '2rem', background: 'white', borderRadius: '15px' }}>
                            <div style={{ fontWeight: 700, color: colors.navy, marginBottom: '0.5rem' }}>Vision</div>
                            <p style={{ fontSize: '0.95rem' }}>To raise transformational leaders who lead in every sphere of life with dignity and diligence.</p>
                        </div>
                        <div style={{ padding: '2rem', background: colors.gold, borderRadius: '15px' }}>
                            <div style={{ fontWeight: 700, color: colors.navy, marginBottom: '0.5rem' }}>Mission</div>
                            <p style={{ fontSize: '0.95rem' }}>To equip would-be leaders with knowledge and skills to rise to positions of influence.</p>
                        </div>
                    </div>
                </div>
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" alt="Leadership" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
      </section>

      {/* The Champions' Framework (Three Pillars) */}
      <section style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
            <div className="section-header">
                <div className="section-label">Our Foundation</div>
                <h2 className="section-title">The Champions' Framework</h2>
                <p className="section-desc">Champions Leadership Global is built on three fundamental principles that guide everything we do.</p>
            </div>
            <div className="pillars-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                    { icon: "🎯", title: "Purpose", text: "Purpose is the essence of living and a driving force behind every decision, action, and goal. It gives life meaning and helps individuals prioritize resources.", linkText: "Discover Your Purpose" },
                    { icon: "👑", title: "Leadership", text: "Leadership is the ability to influence and inspire others to work towards a common goal. It involves developing a clear vision and building trust.", linkText: "Develop Leadership" },
                    { icon: "🌱", title: "Personal Development", text: "Personal development is the process of growing as an individual. It involves developing new skills, building confidence, and cultivating a growth mindset.", linkText: "Start Growing" }
                ].map((p, i) => (
                    <div key={i} className="pillar-card">
                        <div className="pillar-icon">{p.icon}</div>
                        <h3 className="pillar-title">{p.title}</h3>
                        <p className="pillar-text">{p.text}</p>
                        <a href="#about" className="pillar-link" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>{p.linkText} →</a>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section style={{ padding: "8rem 2rem", background: 'linear-gradient(135deg, #0A1128 0%, #1a2847 100%)' }}>
        <div className="section-container">
            <div className="section-header">
                <div className="section-label" style={{ color: colors.gold }}>What Drives Us</div>
                <h2 className="section-title" style={{ color: "white" }}>Our Core Values</h2>
                <p className="section-desc" style={{ color: "rgba(255,255,255,0.7)" }}>Five values that define who we are and anchor everything we do.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", marginTop: "3rem" }}>
                {[
                    { icon: "🎯", label: "Purpose" },
                    { icon: "🌱", label: "Personal Transformation" },
                    { icon: "👑", label: "Leadership" },
                    { icon: "⚡", label: "Influence" },
                    { icon: "🌍", label: "Global Impact" }
                ].map((v, i) => (
                    <div key={i} className="value-card">
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{v.icon}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "white" }}>{v.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CEO Video Section */}
      <section style={{ padding: "8rem 2rem", background: colors.cream }}>
        <div className="section-container">
            <div className="section-header">
                <div className="section-label">Meet Our Founder</div>
                <h2 className="section-title">A Message from Our CEO</h2>
                <p className="section-desc">Discover the vision behind Champions Leadership Global and our commitment to raising transformational leaders worldwide.</p>
            </div>
            <div className="video-container">
                <div className="video-inner">
                    <div style={{ textAllign: "center", color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: "1.1rem", opacity: 0.7, marginBottom: "0.5rem" }}>Watch our latest content on</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Champions Leadership Global</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", background: "#FF0000", color: "white", textDecoration: "none", padding: "1rem 2rem", borderRadius: "50px", fontWeight: 700 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                            YouTube Channel
                        </a>
                        <a href="https://www.facebook.com/share/1Ks3M8DqJs/" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", background: "#1877F2", color: "white", textDecoration: "none", padding: "1rem 2rem", borderRadius: "50px", fontWeight: 700 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" style={{ padding: "8rem 2rem", background: "white" }}>
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">The People Behind the Mission</div>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {teamMembers.map((member, i) => (
                <div key={i} style={{ padding: '2.5rem', borderRadius: '20px', background: colors.cream }}>
                    <img src={member.photo} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1.5rem' }} />
                    <div style={{ color: colors.terracotta, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{member.designation}</div>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: '1rem' }}>{member.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.6)', lineHeight: 1.7 }}>{member.bio}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: "8rem 2rem", background: colors.navy, color: 'white' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <h2 className="section-title" style={{ color: 'white', textAlign: 'left' }}>Ready to Begin Your Journey?</h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2.5rem' }}>Get in touch with us to learn more about our workshops, academy, and leadership programs.</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: colors.gold }}>Phone</div>
                <a href="tel:+2349064144546" style={{ color: 'white', textDecoration: 'none' }}>+234 906 414 4546</a>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: colors.gold }}>Email</div>
                <a href="mailto:info@cleadglobal.com" style={{ color: 'white', textDecoration: 'none' }}>info@cleadglobal.com</a>
              </div>
            </div>
            <form style={{ background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '20px' }}>
                <input type="text" placeholder="Full Name" className="contact-input" />
                <input type="email" placeholder="Email Address" className="contact-input" />
                <textarea placeholder="Your Message" className="contact-input" style={{ height: '150px', resize: 'none' }}></textarea>
                <button className="cta-btn-dark" style={{ width: '100%', background: colors.gold, color: colors.navy }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "4rem 2rem", background: "#050a18", borderTop: '1px solid rgba(255,255,255,0.05)', color: 'white', textAlign: 'center' }}>
        <div className="section-container">
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="Logo" style={{ width: '50px', marginBottom: '1.5rem', background: 'white', borderRadius: '50%' }} />
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Champions Leadership Global</div>
            <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>© 2026 Champions Leadership Global. Raising Transformational Leaders.</p>
        </div>
      </footer>
    </div>
  );
}
