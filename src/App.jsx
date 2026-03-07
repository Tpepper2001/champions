import { useState, useEffect } from "react";

const colors = {
  gold: "#F4D03F",
  navy: "#0A1128",
  terracotta: "#C86B56",
  cream: "#FFF8F0",
  white: "#FFFFFF"
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; color: #1A1A1A; line-height: 1.6; background: #fff; overflow-x: hidden; }

  /* Navigation */
  .navbar { position: fixed; top: 0; width: 100%; background: white; z-index: 1000; border-bottom: 1px solid #eee; height: 90px; display: flex; align-items: center; }
  .nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; width: 100%; }
  .logo-link { display: flex; align-items: center; gap: 0.8rem; text-decoration: none; cursor: pointer; }
  .logo-link img { width: 70px; height: 70px; border-radius: 50%; object-fit: contain; border: 2px solid ${colors.gold}; background: white; }
  
  .nav-links { display: flex; gap: 1.2rem; list-style: none; align-items: center; }
  .nav-links a { text-decoration: none; color: ${colors.navy}; font-weight: 700; font-size: 0.8rem; transition: 0.3s; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; }
  .nav-links a:hover { color: ${colors.terracotta}; }

  /* Mobile Menu Toggle */
  .menu-toggle { display: none; font-size: 1.5rem; background: none; border: none; cursor: pointer; color: ${colors.navy}; }

  /* Hero */
  .hero { position: relative; height: 90vh; display: flex; align-items: center; background: ${colors.navy}; overflow: hidden; }
  .hero-bg { 
    position: absolute; inset: 0; 
    background-image: linear-gradient(to right, rgba(10, 17, 40, 0.8), rgba(10, 17, 40, 0.3)), 
                      url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
  }
  .hero-content { position: relative; z-index: 2; max-width: 1400px; margin: 0 auto; padding: 0 2rem; width: 100%; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(3rem, 10vw, 6rem); font-weight: 900; color: white; line-height: 0.95; }
  .hero-title span { display: block; }
  .hero-title .highlight { color: ${colors.gold}; }

  /* Sections - Adjusted Spacing */
  .section { padding: 4.5rem 2rem; }
  .container { max-width: 1200px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 2.5rem; }
  .section-label { font-size: 0.8rem; letter-spacing: 2px; color: ${colors.terracotta}; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 2.8rem; color: ${colors.navy}; line-height: 1.2; }

  /* Cards & Grids */
  .grid { display: grid; gap: 1.5rem; }
  .pillar-card { background: white; padding: 2.5rem; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.03); text-align: center; border: 1px solid #f5f5f5; }
  .value-card { background: ${colors.navy}; color: white; padding: 1.5rem; border-radius: 10px; text-align: center; border: 1px solid ${colors.gold}; font-weight: 700; font-size: 0.9rem; }
  
  .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .team-card { background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .team-img { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 2px solid ${colors.gold}; }
  .team-role { color: ${colors.terracotta}; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; }
  .team-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: ${colors.navy}; margin-bottom: 0.5rem; }
  .team-bio { font-size: 0.9rem; color: #666; }

  /* CEO Page */
  .ceo-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: start; }
  .ceo-img { width: 100%; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
  .ceo-text p { margin-bottom: 1.2rem; font-size: 1.05rem; color: #333; }

  /* Forms */
  .form-container { background: white; padding: 2.5rem; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.08); max-width: 750px; margin: 0 auto; }
  .input-field { width: 100%; padding: 0.9rem; margin-bottom: 1.2rem; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; }
  .btn-submit { background: ${colors.navy}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; }
  .btn-submit:hover { background: ${colors.terracotta}; }

  /* Mobile Navigation Styles */
  @media (max-width: 1024px) {
    .nav-links { 
      position: absolute; top: 90px; left: 0; width: 100%; background: white; 
      flex-direction: column; padding: 2rem; gap: 1.5rem; border-top: 1px solid #eee;
      display: none; box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    }
    .nav-links.active { display: flex; }
    .menu-toggle { display: block; }
    .ceo-layout { grid-template-columns: 1fr; }
    .hero-title { font-size: 4rem; }
  }
`;

const teamMembers = [
  { name: "James Oluwapelumi Olatunbosun", role: "Program Director", bio: "Science communicator and Engineering Physics student at OAU. Committed to career and character growth.", link: "https://www.linkedin.com/in/james-olatunbosun", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg" },
  { name: "Ogbaudu Oghenefegor Believe", role: "Corp Member", bio: "Faith-based writer and published author. Founder of GAP INITIATIVE empowering youth to discover purpose.", link: null, img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg" },
  { name: "Oluwatoyin Oluwabukola Yakubu", role: "Head, Content", bio: "Dedicated to helping people find healing from trauma and depression through meaningful content.", link: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg" },
  { name: "Joseph Temitope Deborah", role: "Community Manager", bio: "Leadership enthusiast and communication advocate passionate about building impactful leaders.", link: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg" },
  { name: "Promise Nseobong", role: "Human Resource", bio: "Accounting student and motivational speaker driving professional and personal excellence.", link: "https://www.linkedin.com/in/nseobong-promise-02498a338", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg" },
  { name: "Grace Temitope Babatunde", role: "Admin", bio: "Communication specialist focusing on HR management and leadership advocacy.", link: "https://www.linkedin.com/in/gracetemibabatunde", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg" }
];

export default function App() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navigate = (v) => {
    setView(v);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { n: "Home", v: "home" },
    { n: "About Us", v: "about" },
    { n: "Our Team", v: "team" },
    { n: "Meet the CEO", v: "ceo" },
    { n: "Book a Session", v: "session" },
    { n: "Blog", v: "blog" },
    { n: "Events", v: "events" }
  ];

  const HomeView = () => (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1 className="hero-title">
            <span>Raising</span>
            <span className="highlight">Transformational</span>
            <span>Leaders</span>
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label">Brief About Us</div>
          <h2 className="section-title">A Brand Driven by Purpose</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '1.5rem auto', color: '#444' }}>
            Champions' Leadership Global focuses on purpose discovery, development, and delivery. We nurture leaders who lead with character and competence across all spheres of influence.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: colors.cream }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Welcome Video</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#000', borderRadius: '20px', padding: '4rem', textAlign: 'center', color: 'white' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Playfair Display' }}>Experience Our Vision</h3>
            <a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer" className="btn-submit" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>Watch on YouTube</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="pillar-card" style={{ textAlign: 'left', background: colors.navy, color: 'white' }}>
              <h3 style={{ color: colors.gold, fontFamily: 'Playfair Display', fontSize: '1.8rem', marginBottom: '1rem' }}>Our Vision</h3>
              <p>To raise transformational leaders who will lead in every sphere of life with dignity, diligence, and discipline.</p>
            </div>
            <div className="pillar-card" style={{ textAlign: 'left', background: colors.gold }}>
              <h3 style={{ color: colors.navy, fontFamily: 'Playfair Display', fontSize: '1.8rem', marginBottom: '1rem' }}>Our Mission</h3>
              <p>To equip leaders with every knowledge and skill needed to rise to a level of competence and influence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header"><div className="section-label">Framework</div><h2 className="section-title">The Champions' Pillars</h2></div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { t: "Purpose", i: "🎯", d: "The driving force behind every decision and goal." },
              { t: "Leadership", i: "👑", d: "Inspiring others toward a common goal through vision." },
              { t: "Personal Development", i: "🌱", d: "The process of growing individually and mindset cultivation." }
            ].map(p => (
              <div key={p.t} className="pillar-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{p.i}</div>
                <h4 className="team-name">{p.t}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: colors.cream }}>
        <div className="container">
          <div className="section-header"><div className="section-label">Values</div><h2 className="section-title">Our Core Anchors</h2></div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {["Purpose", "Transformation", "Leadership", "Influence", "Global Impact"].map(v => (
              <div key={v} className="value-card">{v}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header"><div className="section-label">Leadership Blog</div><h2 className="section-title">Latest Insight</h2></div>
          <div style={{ border: '1px solid #eee', borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Blog" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ padding: '2.5rem' }}>
              <h3 className="team-name">Purpose and Identity</h3>
              <p style={{ margin: '1rem 0', color: '#666' }}>Learn how Jerry Oyedele's transition from Engineering to Music shaped the foundation of Champions' Leadership Global...</p>
              <button className="btn-submit" style={{ width: 'auto' }} onClick={() => navigate("blog")}>Read Full Post</button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-us" className="section" style={{ background: colors.navy }}>
        <div className="container">
          <div className="section-header"><h2 className="section-title" style={{ color: 'white' }}>Contact Us</h2></div>
          <div className="form-container">
            <form action="https://formspree.io/f/mqeykgyy" method="POST">
              <input type="text" name="name" className="input-field" placeholder="Full Name" required />
              <input type="email" name="email" className="input-field" placeholder="Email Address" required />
              <textarea name="message" className="input-field" placeholder="Message" rows="4" required></textarea>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );

  const CEOView = () => (
    <section className="section" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <div className="ceo-layout">
          <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="Jerry Oyedele" className="ceo-img" />
          <div className="ceo-text">
            <div className="section-label">Founder</div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Jerry Oyedele</h2>
            <p><strong>Jerry Oyedele</strong> is a sought-after public speaker with over a decade of experience, a musicologist with over 300 music compositions, and a mentor to many. He is the founder of Champions' Leadership Global.</p>
            <p>His journey into purpose started when he left engineering at 500level to study music from 100level. This bold step opened him up to an understanding of purpose, self awareness, and leadership.</p>
            <p>A seasoned music composer with certificate courses from institutions including University of Edinburgh and Yale University, Jerry also founded Jebion Music.</p>
          </div>
        </div>
        <div style={{ marginTop: '4rem' }}>
          <div className="section-header"><div className="section-label">Invitation</div><h2 className="section-title">Book an Invitation</h2></div>
          <div className="form-container">
            <form action="https://formspree.io/f/mqeykgyy" method="POST">
              <input type="hidden" name="_subject" value="CEO Conference Invitation" />
              <input type="text" name="conference_name" className="input-field" placeholder="Name of Conference" required />
              <select name="type" className="input-field"><option value="Physical">Physical</option><option value="Virtual">Virtual</option></select>
              <input type="text" name="location" className="input-field" placeholder="Physical Location (If applicable)" />
              <input type="text" name="theme" className="input-field" placeholder="Theme" required />
              <input type="text" name="audience" className="input-field" placeholder="Target Audience" required />
              <input type="email" name="reply_to" className="input-field" placeholder="Your Email for Feedback" required />
              <button type="submit" className="btn-submit">Send Invitation</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  const SessionView = () => (
    <section className="section" style={{ paddingTop: '8rem', background: colors.cream, minHeight: '100vh' }}>
      <div className="container">
        <div className="section-header"><div className="section-label">Coaching</div><h2 className="section-title">Book a Session</h2></div>
        <div className="form-container">
          <form action="https://formspree.io/f/mqeykgyy" method="POST">
            <input type="text" name="name" className="input-field" placeholder="Full Name" required />
            <input type="email" name="email" className="input-field" placeholder="Email Address" required />
            <select name="category" className="input-field" required>
              <option value="">Select Category...</option>
              <option>Purpose discovery</option><option>Identity crisis</option><option>Personal transformation</option>
              <option>Personal Leadership coaching</option><option>Organizational Leadership coaching</option><option>Others</option>
            </select>
            <textarea name="notes" className="input-field" placeholder="How can we help?" rows="4"></textarea>
            <button type="submit" className="btn-submit">Book My Session</button>
          </form>
        </div>
      </div>
    </section>
  );

  const TeamView = () => (
    <section className="section" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <div className="section-header"><div className="section-label">People</div><h2 className="section-title">Our Team</h2></div>
        <div className="team-grid">
          {teamMembers.map(m => (
            <div key={m.name} className="team-card">
              <img src={m.img} alt={m.name} className="team-img" />
              <div className="team-role">{m.role}</div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-bio">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#/" className="logo-link" onClick={(e) => { e.preventDefault(); navigate("home"); }}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 900, color: colors.navy, fontSize: '1.2rem' }}>Champions'</span>
              <span style={{ color: colors.terracotta, fontSize: '0.8rem', fontWeight: 700 }}>Leadership Global</span>
            </div>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            {navItems.map(l => (
              <li key={l.v}><a href="#/" onClick={(e) => { e.preventDefault(); navigate(l.v); }}>{l.n}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      {view === "home" && <HomeView />}
      {view === "ceo" && <CEOView />}
      {view === "session" && <SessionView />}
      {view === "team" && <TeamView />}
      {view === "about" && <div className="section" style={{ paddingTop: '10rem', textAlign: 'center' }}><h2 className="section-title">About Content</h2></div>}
      {view === "blog" && <div className="section" style={{ paddingTop: '10rem', textAlign: 'center' }}><h2 className="section-title">Leadership Blog</h2></div>}
      {view === "events" && <div className="section" style={{ paddingTop: '10rem', textAlign: 'center' }}><h2 className="section-title">Events</h2></div>}

      <footer className="footer">
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="Logo" style={{ width: '50px', borderRadius: '50%', background: 'white', marginBottom: '1.5rem' }} />
        <p style={{ fontWeight: 900 }}>Champions' Leadership Global</p>
        <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Raising Transformational Leaders • © 2026</p>
      </footer>
    </div>
  );
}