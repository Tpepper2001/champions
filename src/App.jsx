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
  body { font-family: 'DM Sans', sans-serif; color: #1A1A1A; line-height: 1.6; background: #fff; }

  /* Navigation */
  .navbar { position: fixed; top: 0; width: 100%; background: white; z-index: 1000; border-bottom: 1px solid #eee; }
  .nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 2rem; }
  .logo-link { display: flex; align-items: center; gap: 1rem; text-decoration: none; cursor: pointer; }
  .logo-link img { width: 95px; height: 95px; border-radius: 50%; object-fit: contain; border: 2px solid ${colors.gold}; background: white; }
  
  .nav-links { display: flex; gap: 1.5rem; list-style: none; }
  .nav-links a { text-decoration: none; color: ${colors.navy}; font-weight: 700; font-size: 0.85rem; transition: 0.3s; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
  .nav-links a:hover { color: ${colors.terracotta}; }

  /* Mobile Nav */
  @media (max-width: 1024px) {
    .nav-links { display: none; }
    .hero-title { font-size: 3.5rem !important; }
  }

  /* Hero */
  .hero { position: relative; height: 100vh; display: flex; align-items: center; background: ${colors.navy}; overflow: hidden; }
  .hero-bg { 
    position: absolute; inset: 0; 
    background-image: linear-gradient(to right, rgba(10, 17, 40, 0.85), rgba(10, 17, 40, 0.4)), 
                      url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
  }
  .hero-content { position: relative; z-index: 2; max-width: 1400px; margin: 0 auto; padding: 0 2rem; width: 100%; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: 6.5rem; font-weight: 900; color: white; line-height: 1; }
  .hero-title span { display: block; }
  .hero-title .highlight { color: ${colors.gold}; }

  /* Layout Sections */
  .section { padding: 8rem 2rem; }
  .container { max-width: 1200px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label { font-size: 0.85rem; letter-spacing: 3px; color: ${colors.terracotta}; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); color: ${colors.navy}; line-height: 1.2; }

  /* Cards & Grids */
  .grid { display: grid; gap: 2.5rem; }
  .pillar-card { background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; border: 1px solid #f0f0f0; }
  .value-card { background: ${colors.navy}; color: white; padding: 2rem; border-radius: 15px; text-align: center; border: 1px solid ${colors.gold}; font-weight: 700; }
  
  /* Team Grid */
  .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  .team-card { background: white; padding: 2.5rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: left; }
  .team-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 2px solid ${colors.gold}; }
  .team-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: ${colors.navy}; margin-bottom: 0.5rem; }
  .team-role { color: ${colors.terracotta}; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
  .team-bio { font-size: 0.95rem; color: #666; margin-bottom: 1.5rem; }
  .linkedin-link { color: ${colors.navy}; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }

  /* Forms */
  .form-container { background: white; padding: 3rem; border-radius: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
  .input-field { width: 100%; padding: 1rem; margin-bottom: 1.5rem; border: 1px solid #ddd; border-radius: 10px; font-family: inherit; font-size: 1rem; }
  .btn-submit { background: ${colors.navy}; color: white; padding: 1.2rem 2.5rem; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: 0.3s; font-size: 1rem; }
  .btn-submit:hover { background: ${colors.terracotta}; }

  /* CEO Layout */
  .ceo-hero { background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&q=80&w=1500'); background-size: cover; padding: 10rem 2rem 5rem; color: white; text-align: center; }
  .ceo-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: start; margin-top: -5rem; background: white; padding: 4rem; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
  .ceo-img { width: 100%; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .ceo-text p { margin-bottom: 1.5rem; font-size: 1.1rem; color: #444; text-align: justify; }

  .footer { padding: 4rem 2rem; background: #050a18; color: white; text-align: center; }
`;

const teamMembers = [
  { name: "James Oluwapelumi Olatunbosun", role: "Program Director", bio: "James is a science communicator and Engineering Physics student at Obafemi Awolowo University. He is committed to seeing young people thrive in career and character.", link: "https://www.linkedin.com/in/james-olatunbosun", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0000.jpg" },
  { name: "Ogbaudu Oghenefegor Believe", role: "Corp Member", bio: "A faith-based writer and published author. Founder of GAP INITIATIVE — an NGO empowering youth to discover their gifts and purpose.", link: null, img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0001.jpg" },
  { name: "Oluwatoyin Oluwabukola Yakubu", role: "Head, Content", bio: "Oluwatoyin is passionate about helping people find healing from trauma, low self-esteem, and depression through honest conversations.", link: "https://www.linkedin.com/in/oluwatoyin-yakubu-a2b1b6258", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0005.jpg" },
  { name: "Joseph Temitope Deborah", role: "Community Manager", bio: "A communication advocate and leadership enthusiast. Deborah is passionate about purpose discovery and building impactful leaders.", link: "https://www.linkedin.com/in/temitope-deborah-joseph-b24580227", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0015.jpg" },
  { name: "Promise Nseobong", role: "Human Resource", bio: "An accounting student and creative voice running a YouTube channel on motivation and spoken-word poetry.", link: "https://www.linkedin.com/in/nseobong-promise-02498a338", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260221-WA0006.jpg" },
  { name: "Grace Temitope Babatunde", role: "Admin", bio: "A communication specialist focusing on Human Resources Management and leadership advocacy.", link: "https://www.linkedin.com/in/gracetemibabatunde", img: "https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260304-WA0014.jpg" }
];

export default function App() {
  const [view, setView] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navLinks = [
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
          <p style={{ color: 'white', marginTop: '2rem', fontSize: '1.4rem', maxWidth: '600px', opacity: 0.9 }}>
            Empowering individuals to discover, develop, and deliver their unique purpose.
          </p>
        </div>
      </section>

      {/* Brief About Us */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label">Our Passion</div>
          <h2 className="section-title">Champions' Leadership Global</h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '850px', margin: '2rem auto', color: '#555' }}>
            We are a leadership brand dedicated to purpose discovery, development, and delivery. Our mission is to inspire individuals to live out their potential and responsibility to transform the world.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="section" style={{ background: colors.cream }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Experience Transformation</h2>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '30px', background: '#000', padding: '5rem', textAlign: 'center', color: 'white', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '2rem' }}>Welcome Video</h3>
            <a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>Watch on YouTube</a>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" style={{ background: colors.navy, color: 'white' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="value-card" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', padding: '3rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display', color: colors.gold, fontSize: '2rem', marginBottom: '1.5rem' }}>Our Vision</h3>
              <p>To raise transformational leaders who lead with dignity, diligence, and discipline in every sphere of life, raising others who will transform their world.</p>
            </div>
            <div className="value-card" style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', padding: '3rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display', color: colors.gold, fontSize: '2rem', marginBottom: '1.5rem' }}>Our Mission</h3>
              <p>To equip leaders with every knowledge and skill needed to rise to a level of competence and influence that affects their world positively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Pillars */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Foundation</div>
            <h2 className="section-title">The Champions' Framework</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[
              { t: "Purpose", i: "🎯", d: "Purpose is the essence of living and a driving force behind every decision, action, and goal." },
              { t: "Leadership", i: "👑", d: "The ability to influence and inspire others toward a common goal through vision and trust." },
              { t: "Personal Development", i: "🌱", d: "The process of growing individually, developing skills, and cultivating a growth mindset." }
            ].map(p => (
              <div key={p.t} className="pillar-card">
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{p.i}</div>
                <h3 className="team-name">{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ background: colors.cream }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Values</div>
            <h2 className="section-title">What Drives Us</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {["Purpose", "Transformation", "Leadership", "Influence", "Impact"].map(v => (
              <div key={v} className="value-card">{v}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Journal</div>
            <h2 className="section-title">Latest Leadership Post</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: 'white', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Blog" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            <div style={{ padding: '4rem' }}>
              <h3 className="team-name" style={{ fontSize: '2rem' }}>Leading with Purpose</h3>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Jerry Oyedele shares deep insights into how self-awareness and intentionality are the bedrock of modern leadership impact.</p>
              <button className="btn-submit" style={{ width: 'auto' }} onClick={() => setView("blog")}>Read Blog</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section" style={{ background: colors.navy }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" style={{ color: 'white' }}>Contact Us</h2>
          </div>
          <div className="form-container">
            <form action="https://formspree.io/f/mqeykgyy" method="POST">
              <input type="text" name="name" className="input-field" placeholder="Full Name" required />
              <input type="email" name="email" className="input-field" placeholder="Email Address" required />
              <textarea name="message" className="input-field" placeholder="Your Message" rows="5" required></textarea>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );

  const TeamView = () => (
    <section className="section" style={{ paddingTop: '10rem' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Our Impact Team</div>
          <h2 className="section-title">Meet the Experts</h2>
        </div>
        <div className="team-grid">
          {teamMembers.map(m => (
            <div key={m.name} className="team-card">
              <img src={m.img} alt={m.name} className="team-img" />
              <div className="team-role">{m.role}</div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-bio">{m.bio}</p>
              {m.link ? (
                <a href={m.link} target="_blank" rel="noreferrer" className="linkedin-link">LinkedIn →</a>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#ccc' }}>LinkedIn coming soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const CEOView = () => (
    <>
      <div className="ceo-hero">
        <div className="container">
          <h1 className="hero-title">Meet Jerry Oyedele</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="ceo-layout">
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/IMG-20260306-WA0029.jpg" alt="CEO" className="ceo-img" />
            <div className="ceo-text">
              <p><strong>Jerry Oyedele</strong> is a sought-after public speaker with over a decade of experience, a musicologist with over 300 music compositions, and a mentor to many. He is the founder of Champions' Leadership Global, a leadership brand that focuses on purpose discovery, development, and delivery. He is currently a post-graduate student of the department of music, Obafemi Awolowo University, Ile-Ife, Osun state.</p>
              <p>His journey into purpose started when he had to take a bold step by leaving engineering at 500level to study music from 100level. This story was the start of the fresh journey which opened him up to an understanding of purpose, self awareness, and leadership.</p>
              <p>As a musicologist, Jerry has over two decades of experience in the field of music, and is a seasoned music composer with over 300 works in the last seven years. In a bid to further ground himself in his music profession, Jerry has gone ahead to obtain certificate courses from various institutions which includes University of Edinburgh, National University of Singapore, University of Michigan, Yale University, amongst others.</p>
              <p>Jerry Oyedele is also a committed worker in the vineyard of God as a choir leader in his denomination. He is also a gifted teacher of the word.</p>
            </div>
          </div>

          <div style={{ marginTop: '8rem' }}>
            <div className="section-header">
              <h2 className="section-title">Book an Invitation</h2>
              <p style={{ marginTop: '1rem' }}>Invite CEO Jerry Oyedele for a conference or session.</p>
            </div>
            <div className="form-container">
              <form action="https://formspree.io/f/mqeykgyy" method="POST">
                <input type="hidden" name="form_type" value="CEO Conference Invitation" />
                <input type="text" name="conf_name" className="input-field" placeholder="Name of Conference" required />
                <select name="type" className="input-field">
                  <option value="Physical">Physical</option>
                  <option value="Virtual">Virtual</option>
                </select>
                <input type="text" name="location" className="input-field" placeholder="Physical Location (If physical)" />
                <input type="text" name="theme" className="input-field" placeholder="Theme" required />
                <input type="text" name="audience" className="input-field" placeholder="Target Audience" required />
                <input type="email" name="contact" className="input-field" placeholder="Your Email for Feedback" required />
                <button type="submit" className="btn-submit">Send Invitation</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const SessionView = () => (
    <section className="section" style={{ paddingTop: '10rem', background: colors.cream, minHeight: '100vh' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Grow with us</div>
          <h2 className="section-title">Book a Session</h2>
        </div>
        <div className="form-container">
          <form action="https://formspree.io/f/mqeykgyy" method="POST">
            <input type="hidden" name="form_type" value="Booking Request" />
            <input type="text" name="name" className="input-field" placeholder="Full Name" required />
            <input type="email" name="email" className="input-field" placeholder="Email Address" required />
            <select name="category" className="input-field" required>
              <option value="">Select a Category...</option>
              <option>Purpose discovery</option>
              <option>Identity crisis</option>
              <option>Personal development and transformation</option>
              <option>Personal Leadership coaching</option>
              <option>Organizational Leadership coaching</option>
              <option>Others</option>
            </select>
            <textarea name="extra" className="input-field" placeholder="Additional details for feedback" rows="4"></textarea>
            <button type="submit" className="btn-submit">Book Now</button>
          </form>
        </div>
      </div>
    </section>
  );

  const GenericView = ({ title }) => (
    <section className="section" style={{ paddingTop: '12rem', textAlign: 'center', minHeight: '80vh' }}>
      <div className="container">
        <h2 className="section-title">{title} Content Coming Soon</h2>
      </div>
    </section>
  );

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#/" className="logo-link" onClick={(e) => { e.preventDefault(); setView("home"); window.scrollTo(0,0); }}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 900, color: colors.navy, fontSize: '1.2rem' }}>Champions'</span>
              <span style={{ color: colors.terracotta, fontSize: '0.8rem', fontWeight: 700 }}>Leadership Global</span>
            </div>
          </a>
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.v}><a href="#/" onClick={(e) => { e.preventDefault(); setView(l.v); window.scrollTo(0,0); }}>{l.n}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      {view === "home" && <HomeView />}
      {view === "team" && <TeamView />}
      {view === "ceo" && <CEOView />}
      {view === "session" && <SessionView />}
      {view === "about" && <GenericView title="About Us" />}
      {view === "blog" && <GenericView title="Leadership Blog" />}
      {view === "events" && <GenericView title="Events" />}

      <footer className="footer">
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="Logo" style={{ width: '60px', borderRadius: '50%', background: 'white', marginBottom: '2rem' }} />
        <p style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Champions' Leadership Global</p>
        <p style={{ opacity: 0.5 }}>Raising Transformational Leaders • © 2026</p>
      </footer>
    </div>
  );
}