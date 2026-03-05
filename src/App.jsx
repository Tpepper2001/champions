import { useEffect, useState } from "react";

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
    background: #FFF8F0;
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
    33%      { transform: translate(30px,-30px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.95); }
  }

  .navbar {
    position: fixed; top: 0; width: 100%;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    animation: slideDown 0.6s ease-out;
  }
  .nav-container {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 2rem;
  }
  .logo {
    display: flex; align-items: center; gap: 0.8rem;
    font-weight: 700; font-size: 1.1rem; color: #0A1128;
    text-decoration: none; cursor: pointer;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    text-decoration: none; color: #1A1A1A; font-weight: 500;
    transition: color 0.3s; position: relative; cursor: pointer;
    font-size: 0.95rem;
  }
  .nav-links a.active { color: #C86B56; font-weight: 700; }
  .nav-links a:hover { color: #C86B56; }

  /* Hero */
  .hero {
    position: relative; height: 85vh;
    display: flex; align-items: center; overflow: hidden;
    background: #0A1128;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(10, 17, 40, 0.7), rgba(10, 17, 40, 0.7)), 
                      url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center;
    opacity: 0.4;
    animation: float 20s ease-in-out infinite;
  }
  .hero-content {
    position: relative; max-width: 1400px; margin: 0 auto;
    padding: 0 2rem; z-index: 2;
    animation: fadeInUp 1s ease-out 0.3s both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 4.5rem; font-weight: 900; color: white;
    line-height: 1.1; margin-bottom: 1.5rem; max-width: 900px;
  }

  /* Sections */
  .page-padding { padding: 8rem 2rem 5rem 2rem; min-height: 80vh; }
  .home-section { padding: 6rem 2rem; }
  .section-container { max-width: 1400px; margin: 0 auto; position: relative; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #C86B56; font-weight: 600; margin-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900; color: #0A1128; margin-bottom: 1rem; }

  .team-grid, .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .team-card { background: white; border-radius: 20px; padding: 2.5rem 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
  .team-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; }
  
  .blog-card { border-radius: 20px; overflow: hidden; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  .blog-img { width: 100%; height: 220px; object-fit: cover; }

  .video-container {
    max-width: 1000px; margin: 0 auto; border-radius: 24px; overflow: hidden;
    aspect-ratio: 16/9; background: linear-gradient(135deg, #0A1128, #1a2847);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.2);
  }

  .contact-input { width: 100%; padding: 1.2rem; background: #fff; border: 1px solid #ddd; border-radius: 12px; margin-bottom: 1.2rem; font-family: inherit; }

  @media (max-width: 992px) { .team-grid, .blog-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 768px) {
    .navbar { position: sticky; }
    .nav-container { flex-direction: column; gap: 1rem; padding: 1rem; }
    .nav-links { gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .team-grid, .blog-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 2.8rem; }
  }
`;

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/></svg>
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
  { title: "Intentional Leadership", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", date: "Feb 9, 2026" },
  { title: "Building Trust", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", date: "Feb 2, 2026" },
  { title: "Vision to Action", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", date: "Jan 26, 2026" },
];

export default function App() {
  const [view, setView] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navigate = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("home")}>
            <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 40, height: 40, borderRadius: "50%", background: 'white' }} />
            <span>Champions Leadership Global</span>
          </div>
          <ul className="nav-links">
            <li><a href="#!" className={view === "home" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("home"); }}>Home</a></li>
            <li><a href="#!" className={view === "events" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("events"); }}>Events</a></li>
            <li><a href="#!" className={view === "team" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("team"); }}>Team</a></li>
            <li><a href="#!" className={view === "blog" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("blog"); }}>Blog</a></li>
          </ul>
        </div>
      </nav>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-content">
              <div style={{ color: colors.gold, letterSpacing: '3px', fontWeight: 600, marginBottom: '1.5rem' }}>WELCOME TO A WORLD OF CHAMPIONS</div>
              <h1 className="hero-title">Raising <span style={{ color: colors.gold }}>Transformational</span> Leaders</h1>
              <p style={{ color: 'white', opacity: 0.9, fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>Empowering individuals to discover their purpose and lead with lasting impact.</p>
              <button style={{ background: colors.gold, color: colors.navy, padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, border: 'none', cursor: 'pointer' }} onClick={() => {
                const el = document.getElementById('about-us');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}>Get Started</button>
            </div>
          </section>

          <section id="about-us" className="home-section" style={{ background: 'white' }}>
            <div className="section-container">
              <div className="section-label">Our Story</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>About Us</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
                <div style={{ fontSize: '1.1rem', color: '#444' }}>
                  <p style={{ marginBottom: '1.5rem' }}>Champions' Leadership Global is a brand deeply committed to the themes of purpose, leadership, and personal development.</p>
                  <p style={{ marginBottom: '1.5rem' }}>We believe that everyone has the potential and responsibility to live out their purpose, and we aim to inspire and enlighten individuals on this journey. Our passion for leadership stems from its critical role in shaping society, nations, and the world, which is why we are dedicated to nurturing purposeful leaders.</p>
                  <p style={{ marginBottom: '1.5rem' }}>We are driven to help people become the best versions of themselves, offering content and programs designed for holistic transformation. We believe that the world needs more leaders who lead from the angle of purpose and transformation in view.</p>
                  <p style={{ fontWeight: 600, color: colors.navy }}>Transforming people is the best way to transform the world, because the world is first a people, which eventually makes the place.</p>
                </div>
                <div style={{ fontSize: '1rem', background: colors.cream, padding: '2.5rem', borderRadius: '25px' }}>
                  <p style={{ marginBottom: '1.5rem' }}>Our mandates cuts across hosting conferences, seminars, workshops, bootcamp, and other innovative educational platforms for raising the leaders of this generation and the next.</p>
                  <p>We also have our leadership academy <strong>(Champions Leadership Academy)</strong>, where we are focused on equipping would-be leaders with everything needed to rise to a position of influence.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="home-section" style={{ background: colors.navy, color: 'white' }}>
            <div className="section-container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '20px', border: `1px solid ${colors.gold}44` }}>
                  <h3 style={{ color: colors.gold, marginBottom: '1rem', fontFamily: 'Playfair Display', fontSize: '2rem' }}>Vision</h3>
                  <p>To raise transformational leaders who lead with dignity and diligence globally.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '20px', border: `1px solid ${colors.gold}44` }}>
                  <h3 style={{ color: colors.gold, marginBottom: '1rem', fontFamily: 'Playfair Display', fontSize: '2rem' }}>Mission</h3>
                  <p>Equipping leaders with skills to rise to positions of competence and influence.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="home-section">
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Meet Our Founder</div>
                <h2 className="section-title">A Message from Our CEO</h2>
              </div>
              <div className="video-container">
                <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '1.5rem' }}>Connect with Us</h3>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="https://youtube.com/@cleadglobal" target="_blank" rel="noreferrer" style={{ background: '#FF0000', color: 'white', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 700 }}>YouTube Channel</a>
                    <a href="https://www.facebook.com/share/1Ks3M8DqJs/" target="_blank" rel="noreferrer" style={{ background: '#1877F2', color: 'white', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 700 }}>Facebook Page</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="home-section" style={{ background: 'white' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-label">Connect</div>
                <h2 className="section-title">Contact Us</h2>
              </div>
              <div style={{ maxWidth: '800px', margin: '0 auto', background: colors.cream, padding: '3rem', borderRadius: '30px' }}>
                <form onSubmit={e => e.preventDefault()}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input type="text" placeholder="Full Name" className="contact-input" />
                    <input type="email" placeholder="Email Address" className="contact-input" />
                  </div>
                  <textarea placeholder="Message" className="contact-input" style={{ height: '150px', resize: 'none' }}></textarea>
                  <button style={{ width: '100%', background: colors.navy, color: 'white', padding: '1.2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Send Message</button>
                </form>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <p><strong>Email:</strong> info@cleadglobal.com</p>
                  <p><strong>Phone:</strong> +234 906 414 4546</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {view === "events" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Programs</div>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <div className="team-grid">
              {[
                { date: "APR 15, 2026", title: "Leadership Bootcamp", loc: "OAU Auditorium" },
                { date: "MAY 22, 2026", title: "Purpose Webinar", loc: "Online (Zoom)" }
              ].map((e, i) => (
                <div key={i} style={{ padding: '2.5rem', background: 'white', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ color: colors.terracotta, fontWeight: 700, marginBottom: '0.5rem' }}>{e.date}</div>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>{e.title}</h3>
                  <p style={{ opacity: 0.7 }}>{e.loc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {view === "team" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Leadership</div>
              <h2 className="section-title">Meet Our Team</h2>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, i) => (
                <div key={i} className="team-card">
                  <img src={member.photo} alt={member.name} className="team-avatar" />
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', marginBottom: '0.5rem' }}>{member.name}</h3>
                  <div style={{ color: colors.terracotta, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>{member.designation}</div>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8, flexGrow: 1 }}>{member.bio}</p>
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="logo" style={{ marginTop: '1rem', fontSize: '0.8rem' }}><LinkedInIcon /> LinkedIn</a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {view === "blog" && (
        <section className="page-padding">
          <div className="section-container">
            <div className="section-header">
              <div className="section-label">Insights</div>
              <h2 className="section-title">Leadership Blog</h2>
            </div>
            <div className="blog-grid">
              {blogPosts.map((post, i) => (
                <div key={i} className="blog-card">
                  <img src={post.img} alt={post.title} className="blog-img" />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ color: colors.terracotta, fontSize: '0.8rem', fontWeight: 700 }}>{post.date}</div>
                    <h3 style={{ fontFamily: 'Playfair Display', margin: '0.5rem 0' }}>{post.title}</h3>
                    <a href="#!" onClick={e => e.preventDefault()} style={{ color: colors.navy, fontWeight: 700, textDecoration: 'none' }}>Read Article →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer style={{ padding: "4rem 2rem", background: "#050a18", color: 'white', textAlign: 'center' }}>
        <img src="https://ijsr.org.ng/wp-content/uploads/2026/03/CLG2.png" alt="CLG Logo" style={{ width: 50, borderRadius: '50%', background: 'white', marginBottom: '1.5rem' }} />
        <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '1rem' }}>Champions Leadership Global</div>
        <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>© 2026 Champions Leadership Global. All rights reserved.</p>
      </footer>
    </div>
  );
}